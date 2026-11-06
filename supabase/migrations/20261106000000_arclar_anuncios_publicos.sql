-- ============================================================
-- ARC LAR - Suporte a anúncios sem usuário autenticado
-- ============================================================
-- Permite que o cadastro gratuito do portal publique imóveis mesmo quando
-- o anunciante ainda não criou uma conta (user_id nulo). As informações
-- básicas do anunciante ficam gravadas no próprio imóvel.
-- Também permite leads de imóveis sem anunciante vinculado (anunciante_id nulo).
-- ============================================================

ALTER TABLE public.imoveis ALTER COLUMN user_id DROP NOT NULL;

ALTER TABLE public.imoveis ADD COLUMN IF NOT EXISTS anunciante_nome VARCHAR(255);
ALTER TABLE public.imoveis ADD COLUMN IF NOT EXISTS anunciante_whatsapp VARCHAR(50);
ALTER TABLE public.imoveis ADD COLUMN IF NOT EXISTS anunciante_telefone VARCHAR(50);
ALTER TABLE public.imoveis ADD COLUMN IF NOT EXISTS anunciante_perfil VARCHAR(50) DEFAULT 'proprietario';

ALTER TABLE public.leads ALTER COLUMN anunciante_id DROP NOT NULL;

CREATE INDEX IF NOT EXISTS idx_imoveis_external_id ON public.imoveis(external_id);
CREATE INDEX IF NOT EXISTS idx_imoveis_codigo_ref ON public.imoveis(codigo_ref);
