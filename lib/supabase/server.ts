/**
 * Clientes Supabase para uso exclusivo no servidor (Server Components e API Routes).
 *
 * - Cliente padrão (anon): respeita as políticas de RLS.
 * - Cliente admin (service role): ignora RLS e deve ser usado apenas no servidor
 *   para operações de escrita/importação.
 */

import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { getSupabaseEnv } from './config';

let anonClient: SupabaseClient | null = null;
let adminClient: SupabaseClient | null = null;

export function createSupabaseAnonClient(): SupabaseClient | null {
  if (anonClient) return anonClient;

  const env = getSupabaseEnv();
  if (!env) return null;

  anonClient = createClient(env.url, env.anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  return anonClient;
}

export function createSupabaseAdminClient(): SupabaseClient | null {
  if (adminClient) return adminClient;

  const env = getSupabaseEnv();
  if (!env || !env.serviceRoleKey) return null;

  adminClient = createClient(env.url, env.serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  return adminClient;
}

/**
 * Cliente usado para leitura de dados públicos.
 * Prefere o service role (quando disponível) para não depender das políticas de RLS
 * e retorna o anon como alternativa.
 */
export function createSupabaseReadClient(): SupabaseClient | null {
  return createSupabaseAdminClient() ?? createSupabaseAnonClient();
}
