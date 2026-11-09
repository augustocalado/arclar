export interface Plano {
  id: string;
  nome: string;
  descricao: string;
  preco_mensal: number;
  preco_anual: number;
  limite_imoveis: number;
  destaque_incluso: number;
  super_destaque_incluso: number;
  multi_usuarios: boolean;
  crm: boolean;
  importacao_xml: boolean;
  relatorios: boolean;
  ativo: boolean;
  features: string[];
}

export const PLANOS_PADRAO: Plano[] = [
  {
    id: 'gratuito',
    nome: 'Gratuito',
    descricao: 'Para quem quer começar sem investimento',
    preco_mensal: 0,
    preco_anual: 0,
    limite_imoveis: 3,
    destaque_incluso: 0,
    super_destaque_incluso: 0,
    multi_usuarios: false,
    crm: false,
    importacao_xml: false,
    relatorios: false,
    ativo: true,
    features: [
      'Até 3 imóveis anunciados',
      'Página básica do anunciante',
      'Recebimento de contatos',
      'Fotos nos anúncios',
      'Suporte por e-mail',
    ],
  },
  {
    id: 'basico',
    nome: 'Básico',
    descricao: 'Para corretores autônomos e proprietários',
    preco_mensal: 89,
    preco_anual: 890,
    limite_imoveis: 20,
    destaque_incluso: 1,
    super_destaque_incluso: 0,
    multi_usuarios: false,
    crm: false,
    importacao_xml: false,
    relatorios: true,
    ativo: true,
    features: [
      'Até 20 imóveis anunciados',
      'Painel de desempenho',
      'Gestão de contatos/leads',
      'Fotos e vídeos nos anúncios',
      '1 destaque por mês',
      'Suporte prioritário',
    ],
  },
  {
    id: 'profissional',
    nome: 'Profissional',
    descricao: 'Para corretores e pequenas imobiliárias',
    preco_mensal: 249,
    preco_anual: 2490,
    limite_imoveis: 100,
    destaque_incluso: 5,
    super_destaque_incluso: 1,
    multi_usuarios: false,
    crm: true,
    importacao_xml: true,
    relatorios: true,
    ativo: true,
    features: [
      'Até 100 imóveis anunciados',
      'CRM de leads integrado',
      'Estatísticas avançadas',
      '5 destaques por mês',
      'Importação XML',
      'Relatórios de desempenho',
      'Suporte VIP',
      'Perfil destaque no portal',
    ],
  },
  {
    id: 'imobiliaria',
    nome: 'Imobiliária',
    descricao: 'Para imobiliárias e redes de corretores',
    preco_mensal: 549,
    preco_anual: 5490,
    limite_imoveis: 9999,
    destaque_incluso: 20,
    super_destaque_incluso: 5,
    multi_usuarios: true,
    crm: true,
    importacao_xml: true,
    relatorios: true,
    ativo: true,
    features: [
      'Carteira ilimitada de imóveis',
      'Múltiplos usuários (até 20)',
      'Gestão completa de equipe',
      'CRM avançado com histórico',
      'Relatórios e analytics',
      'Destaques ilimitados',
      'Importação XML automática',
      'Integração com portais',
      'Gerente de conta dedicado',
      'Treinamento da equipe',
    ],
  },
];

export const CAMPOS_NUMEROS_PLANO = [
  'preco_mensal',
  'preco_anual',
  'limite_imoveis',
  'destaque_incluso',
  'super_destaque_incluso',
] as const;

export const CAMPOS_BOOLEANOS_PLANO = [
  'multi_usuarios',
  'crm',
  'importacao_xml',
  'relatorios',
  'ativo',
] as const;
