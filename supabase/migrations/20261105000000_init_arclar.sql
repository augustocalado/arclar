-- ============================================================
-- ARC LAR - MIGRATION COMPLETA E INCREMENTAL (SUPABASE POSTGRESQL)
-- ============================================================

-- 1. Habilitar extensões
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Tabela de Perfis de Usuários
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome VARCHAR(255) NOT NULL,
  sobrenome VARCHAR(255),
  email VARCHAR(255) UNIQUE NOT NULL,
  telefone VARCHAR(50),
  whatsapp VARCHAR(50),
  perfil VARCHAR(50) NOT NULL DEFAULT 'proprietario' CHECK (perfil IN ('admin', 'imobiliaria', 'corretor', 'proprietario', 'interessado')),
  cpf_cnpj VARCHAR(50),
  creci VARCHAR(50),
  nome_comercial VARCHAR(255),
  logo_url TEXT,
  ativo BOOLEAN DEFAULT TRUE,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Tabela de Planos
CREATE TABLE IF NOT EXISTS public.planos (
  id VARCHAR(50) PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  descricao TEXT,
  preco_mensal NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  preco_anual NUMERIC(10,2) DEFAULT 0.00,
  limite_imoveis INTEGER NOT NULL DEFAULT 3,
  destaque_incluso INTEGER NOT NULL DEFAULT 0,
  super_destaque_incluso INTEGER NOT NULL DEFAULT 0,
  multi_usuarios BOOLEAN DEFAULT FALSE,
  crm BOOLEAN DEFAULT FALSE,
  importacao_xml BOOLEAN DEFAULT FALSE,
  relatorios BOOLEAN DEFAULT FALSE,
  ativo BOOLEAN DEFAULT TRUE,
  features JSONB DEFAULT '[]'::jsonb,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Inserir planos padrão caso não existam
INSERT INTO public.planos (id, nome, descricao, preco_mensal, limite_imoveis, destaque_incluso, super_destaque_incluso, crm, importacao_xml, relatorios, features)
VALUES 
  ('gratuito', 'Gratuito', 'Para quem quer começar sem investimento', 0.00, 3, 0, 0, false, false, false, '["Até 3 imóveis anunciados", "Página básica do anunciante", "Recebimento de contatos WhatsApp", "Suporte padrão"]'::jsonb),
  ('basico', 'Básico', 'Para corretores autônomos e proprietários', 89.00, 20, 1, 0, false, false, true, '["Até 20 imóveis", "Painel de desempenho", "Gestão de contatos", "1 Destaque por mês", "Suporte prioritário"]'::jsonb),
  ('profissional', 'Profissional', 'Para corretores ativos e pequenas imobiliárias', 249.00, 100, 5, 1, true, true, true, '["Até 100 imóveis", "CRM completo de Leads", "5 Destaques + 1 Super Destaque", "Importação XML", "Estatísticas avançadas"]'::jsonb),
  ('imobiliaria', 'Imobiliária', 'Para imobiliárias e redes de corretores', 549.00, 9999, 20, 5, true, true, true, '["Carteira ilimitada de imóveis", "Múltiplos usuários", "CRM avançado", "20 Destaques + 5 Super Destaques", "Sincronização XML automática"]'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- 4. Tabela de Assinaturas de Anunciantes
CREATE TABLE IF NOT EXISTS public.assinaturas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  plano_id VARCHAR(50) NOT NULL REFERENCES public.planos(id),
  status VARCHAR(50) NOT NULL DEFAULT 'ativa' CHECK (status IN ('ativa', 'cancelada', 'pendente', 'expirada')),
  gateway VARCHAR(50) DEFAULT 'mercadopago',
  gateway_subscription_id VARCHAR(255),
  data_inicio TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  data_fim TIMESTAMP WITH TIME ZONE,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Tabela de Imóveis
CREATE TABLE IF NOT EXISTS public.imoveis (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  codigo_ref VARCHAR(100),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  slug VARCHAR(255) UNIQUE NOT NULL,
  titulo VARCHAR(255) NOT NULL,
  descricao TEXT,
  tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('apartamento', 'casa', 'terreno', 'comercial', 'cobertura', 'studio', 'flat', 'sala', 'galpao', 'chacara')),
  negocio VARCHAR(50) NOT NULL CHECK (negocio IN ('venda', 'aluguel')),
  status VARCHAR(50) NOT NULL DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo', 'vendido', 'alugado', 'pendente')),
  nivel_destaque VARCHAR(50) NOT NULL DEFAULT 'normal' CHECK (nivel_destaque IN ('normal', 'destaque', 'super_destaque')),
  destaque_expira_em TIMESTAMP WITH TIME ZONE,
  preco NUMERIC(12,2) NOT NULL,
  preco_condominio NUMERIC(10,2) DEFAULT 0.00,
  preco_iptu NUMERIC(10,2) DEFAULT 0.00,
  area_total NUMERIC(10,2),
  area_construida NUMERIC(10,2),
  quartos INTEGER DEFAULT 0,
  suites INTEGER DEFAULT 0,
  banheiros INTEGER DEFAULT 0,
  vagas INTEGER DEFAULT 0,
  foto_principal TEXT,
  fotos JSONB DEFAULT '[]'::jsonb,
  video_url TEXT,
  
  -- Endereço
  cep VARCHAR(20),
  logradouro VARCHAR(255),
  numero VARCHAR(50),
  complemento VARCHAR(100),
  bairro VARCHAR(100) NOT NULL,
  cidade VARCHAR(100) NOT NULL,
  estado VARCHAR(100) NOT NULL,
  estado_sigla VARCHAR(5) NOT NULL,
  latitude NUMERIC(10,7),
  longitude NUMERIC(10,7),

  -- Importação
  origem_xml_id UUID,
  external_id VARCHAR(255),
  
  -- Analytics agregados rápidos
  total_visualizacoes INTEGER DEFAULT 0,
  total_cliques_whatsapp INTEGER DEFAULT 0,
  total_leads INTEGER DEFAULT 0,

  criado_em TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_imoveis_cidade ON public.imoveis(cidade);
CREATE INDEX IF NOT EXISTS idx_imoveis_tipo_negocio ON public.imoveis(tipo, negocio);
CREATE INDEX IF NOT EXISTS idx_imoveis_destaque ON public.imoveis(nivel_destaque);

-- 6. Tabela de Estatísticas Detalhadas / Eventos
CREATE TABLE IF NOT EXISTS public.imovel_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  imovel_id UUID NOT NULL REFERENCES public.imoveis(id) ON DELETE CASCADE,
  tipo_evento VARCHAR(50) NOT NULL CHECK (tipo_evento IN ('view', 'whatsapp_click', 'lead_form', 'share')),
  ip_address VARCHAR(100),
  user_agent TEXT,
  origem VARCHAR(255),
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Tabela de Leads (CRM)
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  imovel_id UUID NOT NULL REFERENCES public.imoveis(id) ON DELETE CASCADE,
  anunciante_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  telefone VARCHAR(50),
  mensagem TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'novo' CHECK (status IN ('novo', 'atendimento', 'visita_agendada', 'proposta', 'negociacao', 'vendido', 'perdido')),
  origem VARCHAR(100) DEFAULT 'portal_arclar',
  notas_internas TEXT,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. Tabela de Feeds / Integração XML
CREATE TABLE IF NOT EXISTS public.xml_feeds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  url_feed TEXT NOT NULL,
  nome_feed VARCHAR(255) NOT NULL,
  padrao VARCHAR(50) DEFAULT 'vivareal' CHECK (padrao IN ('vivareal', 'zap', 'arclar', 'generic')),
  ativo BOOLEAN DEFAULT TRUE,
  frequencia_horas INTEGER DEFAULT 24,
  ultima_sincronizacao TIMESTAMP WITH TIME ZONE,
  status_ultima_sync VARCHAR(50) DEFAULT 'nunca_executado',
  total_processados INTEGER DEFAULT 0,
  total_inseridos INTEGER DEFAULT 0,
  total_atualizados INTEGER DEFAULT 0,
  total_removidos INTEGER DEFAULT 0,
  erros_log JSONB DEFAULT '[]'::jsonb,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. Tabela de Pagamentos / Mercado Pago
CREATE TABLE IF NOT EXISTS public.pagamentos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  gateway VARCHAR(50) DEFAULT 'mercadopago',
  payment_id VARCHAR(255) UNIQUE,
  tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('assinatura_plano', 'destaque_avulso', 'super_destaque')),
  valor NUMERIC(10,2) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'refunded', 'cancelled')),
  metodo_pagamento VARCHAR(50), -- pix, credit_card, ticket
  payload JSONB,
  imovel_id UUID REFERENCES public.imoveis(id) ON DELETE SET NULL,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 10. Funções RPC de Incremento Rápido
CREATE OR REPLACE FUNCTION public.increment_imovel_views(p_imovel_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.imoveis
  SET total_visualizacoes = COALESCE(total_visualizacoes, 0) + 1
  WHERE id = p_imovel_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.increment_whatsapp_clicks(p_imovel_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.imoveis
  SET total_cliques_whatsapp = COALESCE(total_cliques_whatsapp, 0) + 1
  WHERE id = p_imovel_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 11. Políticas Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.imoveis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.xml_feeds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pagamentos ENABLE ROW LEVEL SECURITY;

-- Regras Profiles
CREATE POLICY "Perfis visiveis publicamente" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Usuario edita seu proprio perfil" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Regras Imóveis
CREATE POLICY "Imoveis ativos visiveis publicamente" ON public.imoveis FOR SELECT USING (status = 'ativo' OR auth.uid() = user_id);
CREATE POLICY "Anunciante gerencia seus proprios imoveis" ON public.imoveis FOR ALL USING (auth.uid() = user_id);

-- Regras Leads
CREATE POLICY "Anunciante gerencia seus leads" ON public.leads FOR ALL USING (auth.uid() = anunciante_id);
CREATE POLICY "Publico insere novos leads" ON public.leads FOR INSERT WITH CHECK (true);

-- Regras Feeds XML
CREATE POLICY "Anunciante gerencia seus feeds" ON public.xml_feeds FOR ALL USING (auth.uid() = user_id);

