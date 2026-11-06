/**
 * Configuração central do Supabase.
 * Detecta se as variáveis de ambiente estão realmente preenchidas,
 * evitando tentativas de conexão com os valores de exemplo do .env.example.
 */

const MARCADORES_INVALIDOS = ['placeholder', 'seu_projeto', 'sua_', 'seu-', 'exemplo'];

function valorValido(valor: string | undefined): valor is string {
  if (!valor) return false;
  const normalizado = valor.toLowerCase();
  if (MARCADORES_INVALIDOS.some((marcador) => normalizado.includes(marcador))) {
    return false;
  }
  return valor.trim().length > 20;
}

export interface SupabaseEnv {
  url: string;
  anonKey: string;
  serviceRoleKey?: string;
}

export function getSupabaseEnv(): SupabaseEnv | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!valorValido(url) || !valorValido(anonKey)) {
    return null;
  }

  if (!url.startsWith('https://') || !url.includes('.supabase.')) {
    return null;
  }

  return {
    url: url.replace(/\/$/, ''),
    anonKey,
    serviceRoleKey: valorValido(serviceRoleKey) ? serviceRoleKey : undefined,
  };
}

export function isSupabaseConfigured(): boolean {
  return getSupabaseEnv() !== null;
}
