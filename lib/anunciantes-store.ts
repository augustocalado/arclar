import type { NivelHierarquico } from '@/types';

export interface AnuncianteItem {
  id: string;
  nome: string;
  nome_comercial: string;
  email: string;
  telefone?: string;
  whatsapp?: string;
  creci?: string;
  nivel: NivelHierarquico;
  perfil: 'imobiliaria' | 'corretor' | 'proprietario' | 'admin_master' | 'cliente';
  plano: string;
  plano_status: 'ativo' | 'pendente' | 'cancelado';
  plano_desde?: string;
  status: 'Ativo' | 'Pendente' | 'Bloqueado';
  total_imoveis: number;
  criado_em: string;
}

const SEED: AnuncianteItem[] = [
  {
    id: 'anunc-master',
    nome: 'Administrador Master',
    nome_comercial: 'ARC LAR Matriz Admin',
    email: 'admin@arclar.com.br',
    telefone: '(11) 3456-7890',
    whatsapp: '11999998888',
    creci: 'MASTER-01',
    nivel: 'admin_master',
    perfil: 'admin_master',
    plano: 'Corporativo',
    plano_status: 'ativo',
    status: 'Ativo',
    total_imoveis: 0,
    criado_em: '2026-01-01T08:00:00Z',
  },
  {
    id: 'anunc-1',
    nome: 'Prime Imóveis LTDA',
    nome_comercial: 'Prime Imóveis',
    email: 'contato@primeimoveis.com.br',
    telefone: '(11) 3456-7890',
    whatsapp: '11999998888',
    creci: '12345-J',
    nivel: 'corretor',
    perfil: 'imobiliaria',
    plano: 'Imobiliária',
    plano_status: 'ativo',
    status: 'Ativo',
    total_imoveis: 45,
    criado_em: '2026-01-15T10:00:00Z',
  },
  {
    id: 'anunc-2',
    nome: 'Carlos Eduardo Corretor',
    nome_comercial: 'Carlos Corretor',
    email: 'carlos@corretor.com.br',
    telefone: '(11) 98888-7777',
    whatsapp: '11988887777',
    creci: '98765-F',
    nivel: 'corretor',
    perfil: 'corretor',
    plano: 'Profissional',
    plano_status: 'ativo',
    status: 'Ativo',
    total_imoveis: 18,
    criado_em: '2026-02-10T14:30:00Z',
  },
  {
    id: 'anunc-3',
    nome: 'Litoral Imóveis Praia Grande',
    nome_comercial: 'Litoral Imóveis',
    email: 'atendimento@litoralimoveis.com.br',
    telefone: '(13) 3499-1122',
    whatsapp: '13988887777',
    creci: '54321-J',
    nivel: 'corretor',
    perfil: 'imobiliaria',
    plano: 'Profissional',
    plano_status: 'pendente',
    status: 'Ativo',
    total_imoveis: 32,
    criado_em: '2026-02-28T09:15:00Z',
  },
  {
    id: 'anunc-4',
    nome: 'Roberto Silveira',
    nome_comercial: 'Roberto Silveira (Proprietário)',
    email: 'roberto.silveira@email.com',
    telefone: '(11) 97777-6666',
    whatsapp: '11977776666',
    creci: '',
    nivel: 'cliente',
    perfil: 'proprietario',
    plano: 'Gratuito',
    plano_status: 'ativo',
    status: 'Ativo',
    total_imoveis: 2,
    criado_em: '2026-03-01T16:20:00Z',
  },
  {
    id: 'anunc-5',
    nome: 'Mariana Ferreira',
    nome_comercial: 'Mariana Ferreira',
    email: 'mariana.cliente@email.com',
    telefone: '(11) 97777-1111',
    whatsapp: '11977771111',
    creci: '',
    nivel: 'cliente',
    perfil: 'cliente',
    plano: 'Gratuito',
    plano_status: 'ativo',
    status: 'Ativo',
    total_imoveis: 0,
    criado_em: '2026-03-05T11:45:00Z',
  },
];

const CHAVE_GLOBAL = '__arclarAnunciantesMemoria';

type GlobalComStore = typeof globalThis & {
  [CHAVE_GLOBAL]?: AnuncianteItem[];
};

function obterStore(): AnuncianteItem[] {
  const global = globalThis as GlobalComStore;
  if (!global[CHAVE_GLOBAL]) {
    global[CHAVE_GLOBAL] = SEED.map((item) => ({ ...item }));
  }
  return global[CHAVE_GLOBAL];
}

export function listarAnunciantesMemoria(): AnuncianteItem[] {
  return obterStore();
}

export function adicionarAnuncianteMemoria(item: AnuncianteItem): AnuncianteItem {
  const store = obterStore();
  store.unshift(item);
  return item;
}

export function atualizarAnuncianteMemoria(
  id: string,
  atualizacao: Partial<AnuncianteItem>
): AnuncianteItem | null {
  const store = obterStore();
  const indice = store.findIndex((item) => item.id === id);

  if (indice === -1) {
    return null;
  }

  store[indice] = { ...store[indice], ...atualizacao };
  return store[indice];
}

export function excluirAnuncianteMemoria(id: string): boolean {
  const store = obterStore();
  const indice = store.findIndex((item) => item.id === id);

  if (indice === -1) {
    return false;
  }

  store.splice(indice, 1);
  return true;
}
