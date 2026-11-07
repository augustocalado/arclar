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
    console.warn('[SUPABASE] Contato de parceria não persistido (Supabase não configurado).');
    return { lead: parceiroLeadSimulado(input), persistido: false };
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

export async function listarParceirosLeads(): Promise<ParceiroLead[]> {
  const client = createSupabaseAdminClient() ?? createSupabaseAnonClient();

  if (!client || !isSupabaseConfigured()) {
    return [];
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
