import type { NivelHierarquico, PerfilUsuario, UsuarioAutenticado } from '@/types';

// Usuários pré-configurados de exemplo para demonstração e testes rápidos dos 3 níveis
export const USUARIOS_EXEMPLO: Record<NivelHierarquico, UsuarioAutenticado> = {
  admin_master: {
    id: 'user-admin-master',
    nome: 'Administrador Master',
    email: 'admin@arclar.com.br',
    nivel: 'admin_master',
    perfil: 'admin_master',
    nome_comercial: 'ARC LAR Matriz',
    telefone: '(11) 3456-7890',
    whatsapp: '11999998888',
    creci: 'MASTER-01',
    ativo: true,
  },
  corretor: {
    id: 'user-corretor-1',
    nome: 'Carlos Eduardo Corretor',
    email: 'carlos@corretor.com.br',
    nivel: 'corretor',
    perfil: 'corretor',
    nome_comercial: 'Carlos Corretor & Associados',
    telefone: '(11) 98888-7777',
    whatsapp: '11988887777',
    creci: '98765-F',
    ativo: true,
  },
  cliente: {
    id: 'user-cliente-1',
    nome: 'Mariana Ferreira',
    email: 'mariana.cliente@email.com',
    nivel: 'cliente',
    perfil: 'cliente',
    nome_comercial: 'Mariana Ferreira',
    telefone: '(11) 97777-1111',
    whatsapp: '11977771111',
    ativo: true,
  },
};

/**
 * Converte um perfil de banco para o nível hierárquico formal do sistema
 */
export function converterParaNivelHierarquico(perfil: PerfilUsuario | string | undefined | null): NivelHierarquico {
  if (!perfil) return 'cliente';
  const normalizado = String(perfil).toLowerCase();
  if (normalizado === 'admin_master' || normalizado === 'admin' || normalizado === 'adm') {
    return 'admin_master';
  }
  if (normalizado === 'corretor' || normalizado === 'imobiliaria') {
    return 'corretor';
  }
  return 'cliente';
}

/**
 * Valida se o nível tem permissão para a rota solicitada
 */
export function podeAcessarAdmin(nivel: NivelHierarquico | string | undefined | null): boolean {
  return converterParaNivelHierarquico(nivel) === 'admin_master';
}

export function podeAcessarPainelCorretor(nivel: NivelHierarquico | string | undefined | null): boolean {
  const n = converterParaNivelHierarquico(nivel);
  return n === 'admin_master' || n === 'corretor';
}

export function podeAcessarAreaCliente(nivel: NivelHierarquico | string | undefined | null): boolean {
  return !!nivel;
}

export const DESCRICAO_NIVEIS: Record<NivelHierarquico, { titulo: string; badge: string; cor: string; bg: string; descricao: string }> = {
  admin_master: {
    titulo: 'Administrador Master',
    badge: '👑 Admin Master',
    cor: '#7C3AED',
    bg: '#F5F3FF',
    descricao: 'Acesso total: moderação geral, controle de corretores, financeiro e configurações do portal.',
  },
  corretor: {
    titulo: 'Corretor / Imobiliária',
    badge: '👔 Corretor Credenciado',
    cor: '#102B50',
    bg: '#EFF6FF',
    descricao: 'Acesso ao painel do anunciante: gestão dos seus próprios imóveis, leads e integração XML.',
  },
  cliente: {
    titulo: 'Cliente / Comprador',
    badge: '👤 Cliente Final',
    cor: '#059669',
    bg: '#ECFDF5',
    descricao: 'Acesso à área do cliente: imóveis favoritos, contatos enviados e propostas.',
  },
};

