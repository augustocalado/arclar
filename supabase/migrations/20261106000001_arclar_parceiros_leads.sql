-- ============================================================
-- ARC LAR - Leads da área de parcerias
-- ============================================================

CREATE TABLE IF NOT EXISTS public.parceiros_leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  telefone VARCHAR(50) NOT NULL,
  empresa VARCHAR(255),
  cidade VARCHAR(255),
  tipo_parceria VARCHAR(50) NOT NULL DEFAULT 'imobiliaria'
    CHECK (tipo_parceria IN ('imobiliaria', 'corretor', 'portal', 'outro')),
  mensagem TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'novo'
    CHECK (status IN ('novo', 'atendimento', 'fechado', 'perdido')),
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_parceiros_leads_criado_em
  ON public.parceiros_leads(criado_em DESC);

ALTER TABLE public.parceiros_leads ENABLE ROW LEVEL SECURITY;

-- O público pode enviar o formulário, mas não pode ler os contatos.
CREATE POLICY "Publico insere leads de parceiros"
  ON public.parceiros_leads FOR INSERT WITH CHECK (true);
