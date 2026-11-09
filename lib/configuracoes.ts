export interface ConfiguracoesSite {
  instagram: string;
  facebook: string;
  tiktok: string;
  google: string;
  horario_atendimento: string;
  atendimento_humano: string;
  atendimento_virtual: string;
}

export const CONFIGURACOES_SITE_PADRAO: ConfiguracoesSite = {
  instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || 'https://www.instagram.com/',
  facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL || 'https://www.facebook.com/',
  tiktok: process.env.NEXT_PUBLIC_TIKTOK_URL || 'https://www.tiktok.com/',
  google: process.env.NEXT_PUBLIC_GOOGLE_URL || 'https://www.google.com/',
  horario_atendimento: 'Atendimento: seg a sex, das 8h às 18h',
  atendimento_humano: 'Seg a sex, das 8h às 18h',
  atendimento_virtual: 'Atendimento virtual 24h',
};

export const CAMPOS_CONFIGURACOES = [
  'instagram',
  'facebook',
  'tiktok',
  'google',
  'horario_atendimento',
  'atendimento_humano',
  'atendimento_virtual',
] as const;

export type CampoConfiguracao = (typeof CAMPOS_CONFIGURACOES)[number];
