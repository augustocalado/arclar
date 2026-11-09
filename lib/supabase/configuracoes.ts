import {
  CAMPOS_CONFIGURACOES,
  CONFIGURACOES_SITE_PADRAO,
  type ConfiguracoesSite,
} from '@/lib/configuracoes';
import { isSupabaseConfigured } from './config';
import { createSupabaseAdminClient, createSupabaseAnonClient, createSupabaseReadClient } from './server';

interface ConfiguracaoRow {
  id: string;
  instagram: string | null;
  facebook: string | null;
  tiktok: string | null;
  google: string | null;
  horario_atendimento: string | null;
  atendimento_humano: string | null;
  atendimento_virtual: string | null;
}

let configuracoesEmMemoria: ConfiguracoesSite | null = null;

function mapearConfiguracoes(row: ConfiguracaoRow): ConfiguracoesSite {
  return {
    instagram: row.instagram || CONFIGURACOES_SITE_PADRAO.instagram,
    facebook: row.facebook || CONFIGURACOES_SITE_PADRAO.facebook,
    tiktok: row.tiktok || CONFIGURACOES_SITE_PADRAO.tiktok,
    google: row.google || CONFIGURACOES_SITE_PADRAO.google,
    horario_atendimento: row.horario_atendimento || CONFIGURACOES_SITE_PADRAO.horario_atendimento,
    atendimento_humano: row.atendimento_humano || CONFIGURACOES_SITE_PADRAO.atendimento_humano,
    atendimento_virtual: row.atendimento_virtual || CONFIGURACOES_SITE_PADRAO.atendimento_virtual,
  };
}

export async function obterConfiguracoes(): Promise<ConfiguracoesSite> {
  if (isSupabaseConfigured()) {
    const client = createSupabaseReadClient();

    if (client) {
      const { data, error } = await client
        .from('configuracoes_site')
        .select('*')
        .eq('id', 'principal')
        .maybeSingle();

      if (!error && data) {
        return mapearConfiguracoes(data as ConfiguracaoRow);
      }
    }
  }

  return configuracoesEmMemoria ?? CONFIGURACOES_SITE_PADRAO;
}

export async function salvarConfiguracoes(
  input: Partial<ConfiguracoesSite>
): Promise<{ configuracoes: ConfiguracoesSite; persistido: boolean }> {
  const atuais = await obterConfiguracoes();
  const proximas: ConfiguracoesSite = { ...atuais };

  for (const campo of CAMPOS_CONFIGURACOES) {
    const valor = input[campo];
    if (typeof valor === 'string') {
      proximas[campo] = valor;
    }
  }

  configuracoesEmMemoria = proximas;

  if (!isSupabaseConfigured()) {
    return { configuracoes: proximas, persistido: false };
  }

  const client = createSupabaseAdminClient() ?? createSupabaseAnonClient();

  if (!client) {
    return { configuracoes: proximas, persistido: false };
  }

  const { data, error } = await client
    .from('configuracoes_site')
    .upsert({
      id: 'principal',
      ...proximas,
      atualizado_em: new Date().toISOString(),
    })
    .select('*')
    .single();

  if (error) {
    console.warn('[SUPABASE] Falha ao salvar configurações do site:', error.message);
    return { configuracoes: proximas, persistido: false };
  }

  return { configuracoes: mapearConfiguracoes(data as ConfiguracaoRow), persistido: true };
}
