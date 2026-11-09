import { PLANOS_PADRAO, type Plano } from '@/lib/planos';
import { isSupabaseConfigured } from './config';
import { createSupabaseAdminClient, createSupabaseReadClient } from './server';

interface PlanoRow {
  id: string;
  nome: string | null;
  descricao: string | null;
  preco_mensal: number | string | null;
  preco_anual: number | string | null;
  limite_imoveis: number | string | null;
  destaque_incluso: number | string | null;
  super_destaque_incluso: number | string | null;
  multi_usuarios: boolean | null;
  crm: boolean | null;
  importacao_xml: boolean | null;
  relatorios: boolean | null;
  ativo: boolean | null;
  features: unknown;
}

let planosEmMemoria: Plano[] = PLANOS_PADRAO.map((plano) => ({
  ...plano,
  features: [...plano.features],
}));

function mapearPlano(row: PlanoRow): Plano {
  return {
    id: row.id,
    nome: row.nome || '',
    descricao: row.descricao || '',
    preco_mensal: Number(row.preco_mensal ?? 0),
    preco_anual: Number(row.preco_anual ?? 0),
    limite_imoveis: Number(row.limite_imoveis ?? 0),
    destaque_incluso: Number(row.destaque_incluso ?? 0),
    super_destaque_incluso: Number(row.super_destaque_incluso ?? 0),
    multi_usuarios: Boolean(row.multi_usuarios),
    crm: Boolean(row.crm),
    importacao_xml: Boolean(row.importacao_xml),
    relatorios: Boolean(row.relatorios),
    ativo: row.ativo !== false,
    features: Array.isArray(row.features)
      ? row.features.filter((item): item is string => typeof item === 'string')
      : [],
  };
}

export async function listarPlanos(): Promise<Plano[]> {
  if (isSupabaseConfigured()) {
    const client = createSupabaseReadClient();

    if (client) {
      const { data, error } = await client
        .from('planos')
        .select('*')
        .order('preco_mensal', { ascending: true });

      if (!error && Array.isArray(data) && data.length > 0) {
        planosEmMemoria = data.map((row) => mapearPlano(row as PlanoRow));
      }
    }
  }

  return planosEmMemoria;
}

export async function salvarPlano(
  id: string,
  input: Partial<Plano>
): Promise<{ plano: Plano | null; persistido: boolean }> {
  const atual = (await listarPlanos()).find((plano) => plano.id === id);

  if (!atual) {
    return { plano: null, persistido: false };
  }

  const proximo: Plano = { ...atual, ...input, id: atual.id };
  planosEmMemoria = planosEmMemoria.map((plano) => (plano.id === id ? proximo : plano));

  if (!isSupabaseConfigured()) {
    return { plano: proximo, persistido: false };
  }

  const client = createSupabaseAdminClient();

  if (!client) {
    return { plano: proximo, persistido: false };
  }

  const { data, error } = await client
    .from('planos')
    .update({
      nome: proximo.nome,
      descricao: proximo.descricao,
      preco_mensal: proximo.preco_mensal,
      preco_anual: proximo.preco_anual,
      limite_imoveis: proximo.limite_imoveis,
      destaque_incluso: proximo.destaque_incluso,
      super_destaque_incluso: proximo.super_destaque_incluso,
      multi_usuarios: proximo.multi_usuarios,
      crm: proximo.crm,
      importacao_xml: proximo.importacao_xml,
      relatorios: proximo.relatorios,
      ativo: proximo.ativo,
      features: proximo.features,
    })
    .eq('id', id)
    .select('*')
    .single();

  if (error) {
    console.warn('[SUPABASE] Falha ao salvar plano:', error.message);
    return { plano: proximo, persistido: false };
  }

  return { plano: mapearPlano(data as PlanoRow), persistido: true };
}
