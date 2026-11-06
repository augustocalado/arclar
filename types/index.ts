export type TipoImovel = 'apartamento' | 'casa' | 'terreno' | 'comercial' | 'cobertura' | 'studio' | 'flat' | 'sala' | 'galpao' | 'chacara';
export type TipoNegocio = 'venda' | 'aluguel';
export type StatusImovel = 'ativo' | 'inativo' | 'vendido' | 'alugado' | 'pendente';
export type NivelDestaque = 'normal' | 'destaque' | 'super_destaque';
export type PerfilUsuario = 'admin' | 'imobiliaria' | 'corretor' | 'proprietario' | 'interessado';
export type StatusLead = 'novo' | 'atendimento' | 'visita_agendada' | 'proposta' | 'negociacao' | 'vendido' | 'perdido';

export interface Endereco {
  id?: string;
  cep?: string;
  logradouro?: string;
  numero?: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  estado_sigla: string;
  latitude?: number;
  longitude?: number;
}

export interface Anunciante {
  id: string;
  nome: string;
  nome_comercial?: string;
  logo_url?: string;
  telefone?: string;
  whatsapp?: string;
  email?: string;
  creci?: string;
  perfil: PerfilUsuario;
}

export interface Imovel {
  id: string;
  codigo_ref?: string;
  slug: string;
  titulo: string;
  descricao?: string;
  tipo: TipoImovel;
  negocio: TipoNegocio;
  status: StatusImovel;
  nivel_destaque?: NivelDestaque;
  destaque: boolean;
  destaque_expira_em?: string;
  preco: number;
  preco_condominio?: number;
  preco_iptu?: number;
  area_total?: number;
  area_construida?: number;
  quartos?: number;
  suites?: number;
  banheiros?: number;
  vagas?: number;
  foto_principal?: string;
  fotos?: string[];
  video_url?: string;
  endereco: Endereco;
  anunciante?: Anunciante;
  total_visualizacoes?: number;
  total_cliques_whatsapp?: number;
  total_leads?: number;
  visualizacoes?: number;
  criado_em?: string;
  atualizado_em?: string;
}

export interface FiltrosBusca {
  negocio?: TipoNegocio | 'todos';
  tipo?: TipoImovel | '';
  cidade?: string;
  estado?: string;
  bairro?: string;
  preco_min?: number;
  preco_max?: number;
  quartos?: number;
  nivel_destaque?: NivelDestaque;
  page?: number;
}

export interface Lead {
  id?: string;
  nome: string;
  email: string;
  telefone: string;
  mensagem?: string;
  imovel_id: string;
  anunciante_id: string;
  status: StatusLead;
  origem: string;
  notas_internas?: string;
  criado_em?: string;
}

export interface Plano {
  id: string;
  nome: string;
  descricao: string;
  preco_mensal: number;
  preco_anual?: number;
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

export interface XMLFeed {
  id: string;
  user_id: string;
  url_feed: string;
  nome_feed: string;
  padrao: 'vivareal' | 'zap' | 'arclar' | 'generic';
  ativo: boolean;
  frequencia_horas: number;
  ultima_sincronizacao?: string;
  status_ultima_sync: string;
  total_processados: number;
  total_inseridos: number;
  total_atualizados: number;
  total_removidos: number;
}
