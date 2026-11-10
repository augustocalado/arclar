/**
 * Camada de acesso aos contatos enviados pelo formulário de parcerias.
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import { isSupabaseConfigured } from './config';
import { createSupabaseAdminClient, createSupabaseAnonClient } from './server';

export type TipoParceria = 'imobiliaria' | 'corretor' | 'portal' | 'outro';
export type StatusParceiroLead = 'novo' | 'atendimento' | 'fechado' | 'perdido';

export interface NovoParceiroLeadInput {
  nome: string;
  email: string;
  telefone: string;
  empresa?: string;
  cidade?: string;
  tipoParceria?: TipoParceria;
  mensagem?: string;
}

export interface AtualizarParceiroLeadInput {
  nome?: string;
  email?: string;
  telefone?: string;
  empresa?: string;
  cidade?: string;
  tipo_parceria?: TipoParceria;
  mensagem?: string;
  status?: StatusParceiroLead;
}

export interface ParceiroLead {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  empresa?: string;
  cidade?: string;
  tipo_parceria: TipoParceria;
  mensagem?: string;
  status: StatusParceiroLead;
  criado_em?: string;
}

interface ParceiroLeadRow {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  empresa: string | null;
  cidade: string | null;
  tipo_parceria: TipoParceria;
  mensagem: string | null;
  status: StatusParceiroLead;
  criado_em: string | null;
}

function mapParceiroLead(row: ParceiroLeadRow): ParceiroLead {
  return {
    id: row.id,
    nome: row.nome,
    email: row.email,
    telefone: row.telefone,
    empresa: row.empresa || undefined,
    cidade: row.cidade || undefined,
    tipo_parceria: row.tipo_parceria,
    mensagem: row.mensagem || undefined,
    status: row.status,
    criado_em: row.criado_em || undefined,
  };
}

let parceirosEmMemoria: ParceiroLead[] = [
  {
    id: 'parceiro-demo-1',
    nome: 'Ana Paula Mendes',
    email: 'ana.paula@imobiliariaorla.com.br',
    telefone: '(13) 99876-5432',
    empresa: 'Imobiliária Orla',
    cidade: 'Santos / SP',
    tipo_parceria: 'imobiliaria',
    mensagem:
      'Temos cerca de 40 imóveis na Baixada Santista e queremos anunciar no ARC LAR com condições de parceria.',
    status: 'novo',
    criado_em: '2026-11-08T14:30:00Z',
  },
];

function parceiroLeadSimulado(input: NovoParceiroLeadInput): ParceiroLead {
  return {
    id: `parceiro_${Date.now()}`,
    nome: input.nome,
    email: input.email,
    telefone: input.telefone,
    empresa: input.empresa || undefined,
    cidade: input.cidade || undefined,
    tipo_parceria: input.tipoParceria || 'imobiliaria',
    mensagem: input.mensagem || undefined,
    status: 'novo',
    criado_em: new Date().toISOString(),
  };
}

function montarPayload(input: NovoParceiroLeadInput) {
  return {
    nome: input.nome,
    email: input.email,
    telefone: input.telefone,
    empresa: input.empresa || null,
    cidade: input.cidade || null,
    tipo_parceria: input.tipoParceria || 'imobiliaria',
    mensagem: input.mensagem || null,
    status: 'novo' as const,
  };
}

async function inserirComRetorno(client: SupabaseClient, input: NovoParceiroLeadInput): Promise<ParceiroLead> {
  const { data, error } = await client
    .from('parceiros_leads')
    .insert(montarPayload(input))
    .select('*')
    .single();

  if (error) {
    throw new Error(`Erro ao salvar contato de parceria: ${error.message}`);
  }

  return mapParceiroLead(data as ParceiroLeadRow);
}

async function inserirSemRetorno(client: SupabaseClient, input: NovoParceiroLeadInput): Promise<ParceiroLead> {
  const { error } = await client.from('parceiros_leads').insert(montarPayload(input));

  if (error) {
    throw new Error(`Erro ao salvar contato de parceria: ${error.message}`);
  }

  return parceiroLeadSimulado(input);
}

export async function criarParceiroLead(
  input: NovoParceiroLeadInput
): Promise<{ lead: ParceiroLead; persistido: boolean }> {
  if (!isSupabaseConfigured()) {
    console.warn('[SUPABASE] Supabase não configurado. Contato de parceria salvo em memória.');
    const lead = parceiroLeadSimulado(input);
    parceirosEmMemoria = [lead, ...parceirosEmMemoria];
    return { lead, persistido: true };
  }

  const admin = createSupabaseAdminClient();

  if (admin) {
    return { lead: await inserirComRetorno(admin, input), persistido: true };
  }

  const anon = createSupabaseAnonClient();

  if (anon) {
    return { lead: await inserirSemRetorno(anon, input), persistido: true };
  }

  return { lead: parceiroLeadSimulado(input), persistido: false };
}

function montarPayloadAtualizacao(input: AtualizarParceiroLeadInput) {
  const payload: Record<string, unknown> = {};

  if (input.nome !== undefined) payload.nome = input.nome;
  if (input.email !== undefined) payload.email = input.email;
  if (input.telefone !== undefined) payload.telefone = input.telefone;
  if (input.empresa !== undefined) payload.empresa = input.empresa || null;
  if (input.cidade !== undefined) payload.cidade = input.cidade || null;
  if (input.tipo_parceria !== undefined) payload.tipo_parceria = input.tipo_parceria;
  if (input.mensagem !== undefined) payload.mensagem = input.mensagem || null;
  if (input.status !== undefined) payload.status = input.status;

  return payload;
}

export async function atualizarParceiroLead(
  id: string,
  input: AtualizarParceiroLeadInput
): Promise<ParceiroLead | null> {
  if (isSupabaseConfigured()) {
    const client = createSupabaseAdminClient() ?? createSupabaseAnonClient();

    if (client) {
      const { data, error } = await client
        .from('parceiros_leads')
        .update(montarPayloadAtualizacao(input))
        .eq('id', id)
        .select('*')
        .maybeSingle();

      if (error) {
        throw new Error(`Erro ao atualizar contato de parceria: ${error.message}`);
      }

      if (data) {
        return mapParceiroLead(data as ParceiroLeadRow);
      }
    }
  }

  const indice = parceirosEmMemoria.findIndex((item) => item.id === id);

  if (indice === -1) {
    return null;
  }

  const definidos = Object.fromEntries(
    Object.entries(input).filter(([, valor]) => valor !== undefined)
  ) as AtualizarParceiroLeadInput;

  parceirosEmMemoria[indice] = { ...parceirosEmMemoria[indice], ...definidos };
  return parceirosEmMemoria[indice];
}

export async function excluirParceiroLead(id: string): Promise<boolean> {
  let removido = false;
  const indice = parceirosEmMemoria.findIndex((item) => item.id === id);

  if (indice !== -1) {
    parceirosEmMemoria.splice(indice, 1);
    removido = true;
  }

  if (isSupabaseConfigured()) {
    const client = createSupabaseAdminClient() ?? createSupabaseAnonClient();

    if (client) {
      const { error } = await client.from('parceiros_leads').delete().eq('id', id);

      if (error) {
        throw new Error(`Erro ao excluir contato de parceria: ${error.message}`);
      }

      removido = true;
    }
  }

  return removido;
}

export async function listarParceirosLeads(): Promise<ParceiroLead[]> {
  const client = createSupabaseAdminClient() ?? createSupabaseAnonClient();

  if (!client || !isSupabaseConfigured()) {
    return parceirosEmMemoria;
  }

  const { data, error } = await client
    .from('parceiros_leads')
    .select('*')
    .order('criado_em', { ascending: false })
    .limit(200);

  if (error) {
    console.warn('[SUPABASE] Falha ao listar contatos de parceria:', error.message);
    return [];
  }

  return (data as ParceiroLeadRow[]).map(mapParceiroLead);
}
