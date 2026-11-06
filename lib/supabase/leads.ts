/**
 * Camada de acesso ao CRM de leads no Supabase.
 */

import type { Lead, StatusLead } from '@/types';
import { isSupabaseConfigured } from './config';
import { isUuid } from './imoveis';
import { createSupabaseReadClient } from './server';

interface LeadRow {
  id: string;
  imovel_id: string;
  anunciante_id: string | null;
  nome: string;
  email: string;
  telefone: string | null;
  mensagem: string | null;
  status: StatusLead;
  origem: string | null;
  notas_internas: string | null;
  criado_em: string | null;
}

export interface NovoLeadInput {
  imovelId: string;
  anuncianteId?: string;
  nome: string;
  email: string;
  telefone?: string;
  mensagem?: string;
  origem?: string;
}

function mapLead(row: LeadRow): Lead {
  return {
    id: row.id,
    imovel_id: row.imovel_id,
    anunciante_id: row.anunciante_id || '',
    nome: row.nome,
    email: row.email,
    telefone: row.telefone || '',
    mensagem: row.mensagem || undefined,
    status: row.status,
    origem: row.origem || 'portal_arclar',
    notas_internas: row.notas_internas || undefined,
    criado_em: row.criado_em || undefined,
  };
}

function leadSimulado(input: NovoLeadInput): Lead {
  return {
    id: `lead_${Date.now()}`,
    imovel_id: input.imovelId,
    anunciante_id: input.anuncianteId || '',
    nome: input.nome,
    email: input.email,
    telefone: input.telefone || '',
    mensagem: input.mensagem || undefined,
    status: 'novo',
    origem: input.origem || 'formulario_imovel',
    criado_em: new Date().toISOString(),
  };
}

export async function criarLead(input: NovoLeadInput): Promise<Lead> {
  const client = createSupabaseReadClient();

  if (!client || !isSupabaseConfigured() || !isUuid(input.imovelId)) {
    console.warn('[SUPABASE] Lead registrado apenas em memória (Supabase não configurado ou imóvel simulado).');
    return leadSimulado(input);
  }

  const { data, error } = await client
    .from('leads')
    .insert({
      imovel_id: input.imovelId,
      anunciante_id: isUuid(input.anuncianteId) ? input.anuncianteId : null,
      nome: input.nome,
      email: input.email,
      telefone: input.telefone || null,
      mensagem: input.mensagem || null,
      status: 'novo',
      origem: input.origem || 'formulario_imovel',
    })
    .select('*')
    .single();

  if (error) {
    throw new Error(`Erro ao salvar lead no Supabase: ${error.message}`);
  }

  return mapLead(data as LeadRow);
}

export async function listarLeads(anuncianteId?: string): Promise<Lead[]> {
  const client = createSupabaseReadClient();

  if (!client || !isSupabaseConfigured()) {
    return [];
  }

  let query = client.from('leads').select('*');

  if (isUuid(anuncianteId)) {
    query = query.eq('anunciante_id', anuncianteId);
  }

  const { data, error } = await query.order('criado_em', { ascending: false }).limit(100);

  if (error) {
    console.warn('[SUPABASE] Falha ao listar leads:', error.message);
    return [];
  }

  return (data as LeadRow[]).map(mapLead);
}
