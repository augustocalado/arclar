-- ============================================================
-- ARC LAR - Configurações globais do site
-- Redes sociais e horários de atendimento
-- ============================================================

CREATE TABLE IF NOT EXISTS public.configuracoes_site (
  id TEXT PRIMARY KEY DEFAULT 'principal',
  instagram TEXT NOT NULL DEFAULT 'https://www.instagram.com/',
  facebook TEXT NOT NULL DEFAULT 'https://www.facebook.com/',
  tiktok TEXT NOT NULL DEFAULT 'https://www.tiktok.com/',
  google TEXT NOT NULL DEFAULT 'https://www.google.com/',
  horario_atendimento TEXT NOT NULL DEFAULT 'Atendimento: seg a sex, das 8h às 18h',
  atendimento_humano TEXT NOT NULL DEFAULT 'Seg a sex, das 8h às 18h',
  atendimento_virtual TEXT NOT NULL DEFAULT 'Atendimento virtual 24h',
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.configuracoes_site ENABLE ROW LEVEL SECURITY;

-- O público pode ler as configurações exibidas no site.
CREATE POLICY "Configuracoes visiveis publicamente"
  ON public.configuracoes_site FOR SELECT USING (true);
