/**
 * Camada de acesso aos imóveis no Supabase.
 *
 * Todas as leituras possuem fallback para os dados mockados enquanto o Supabase
 * não estiver configurado, garantindo que o portal continue funcionando durante
 * o desenvolvimento.
 */

import { IMOVEIS_MOCK, gerarSlug } from '@/lib/utils';
import type {
  FiltrosBusca,
  Imovel,
  PerfilUsuario,
  StatusImovel,
  TipoImovel,
  TipoNegocio,
} from '@/types';
import { isSupabaseConfigured } from './config';
import { createSupabaseReadClient } from './server';

const SELECT_IMOVEL = `
  *,
  profiles (
    nome,
    nome_comercial,
    whatsapp,
    telefone,
    logo_url,
    creci,
    perfil
  )
`;

interface ImovelRow {
  id: string;
  codigo_ref: string | null;
  user_id: string | null;
  slug: string;
  titulo: string;
  descricao: string | null;
  tipo: TipoImovel;
  negocio: TipoNegocio;
  status: StatusImovel;
  nivel_destaque: Imovel['nivel_destaque'] | null;
  destaque_expira_em: string | null;
  preco: number | string;
  preco_condominio: number | string | null;
  preco_iptu: number | string | null;
  area_total: number | string | null;
  area_construida: number | string | null;
  quartos: number | null;
  suites: number | null;
  banheiros: number | null;
  vagas: number | null;
  foto_principal: string | null;
  fotos: unknown;
  video_url: string | null;
  cep: string | null;
  logradouro: string | null;
  numero: string | null;
  complemento: string | null;
  bairro: string;
  cidade: string;
  estado: string;
  estado_sigla: string;
  latitude: number | string | null;
  longitude: number | string | null;
  total_visualizacoes: number | null;
  total_cliques_whatsapp: number | null;
  total_leads: number | null;
  criado_em: string | null;
  atualizado_em: string | null;
  anunciante_nome?: string | null;
  anunciante_whatsapp?: string | null;
  anunciante_telefone?: string | null;
  anunciante_perfil?: string | null;
  profiles?: {
    nome?: string | null;
    nome_comercial?: string | null;
    whatsapp?: string | null;
    telefone?: string | null;
    logo_url?: string | null;
    creci?: string | null;
    perfil?: string | null;
  } | null;
}

function numero(valor: unknown): number | undefined {
  if (valor === null || valor === undefined || valor === '') return undefined;
  const convertido = Number(valor);
  return Number.isFinite(convertido) ? convertido : undefined;
}

export function isUuid(valor: unknown): valor is string {
  return (
    typeof valor === 'string' &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(valor)
  );
}

function normalizarFotos(valor: unknown): string[] {
  if (Array.isArray(valor)) {
    return valor.filter((item): item is string => typeof item === 'string');
  }
  return [];
}

function mapAnunciante(row: ImovelRow): Imovel['anunciante'] {
  const perfil = row.profiles;
  const nome = perfil?.nome_comercial || perfil?.nome || row.anunciante_nome;
  const whatsapp = perfil?.whatsapp || perfil?.telefone || row.anunciante_whatsapp || row.anunciante_telefone;

  if (!nome && !whatsapp) return undefined;

  return {
    id: row.user_id || `anon_${row.id}`,
    nome: nome || 'Anunciante ARC LAR',
    nome_comercial: perfil?.nome_comercial || undefined,
    logo_url: perfil?.logo_url || undefined,
    creci: perfil?.creci || undefined,
    telefone: perfil?.telefone || row.anunciante_telefone || undefined,
    whatsapp: whatsapp || undefined,
    perfil: (perfil?.perfil as PerfilUsuario) || (row.anunciante_perfil as PerfilUsuario) || 'proprietario',
  };
}

export function mapRowImovel(row: ImovelRow): Imovel {
  return {
    id: row.id,
    codigo_ref: row.codigo_ref || undefined,
    slug: row.slug,
    titulo: row.titulo,
    descricao: row.descricao || undefined,
    tipo: row.tipo,
    negocio: row.negocio,
    status: row.status,
    nivel_destaque: row.nivel_destaque || 'normal',
    destaque: row.nivel_destaque === 'destaque' || row.nivel_destaque === 'super_destaque',
    destaque_expira_em: row.destaque_expira_em || undefined,
    preco: numero(row.preco) ?? 0,
    preco_condominio: numero(row.preco_condominio),
    preco_iptu: numero(row.preco_iptu),
    area_total: numero(row.area_total),
    area_construida: numero(row.area_construida),
    quartos: row.quartos ?? 0,
    suites: row.suites ?? 0,
    banheiros: row.banheiros ?? 0,
    vagas: row.vagas ?? 0,
    foto_principal: row.foto_principal || undefined,
    fotos: normalizarFotos(row.fotos),
    video_url: row.video_url || undefined,
    endereco: {
      cep: row.cep || undefined,
      logradouro: row.logradouro || undefined,
      numero: row.numero || undefined,
      complemento: row.complemento || undefined,
      bairro: row.bairro,
      cidade: row.cidade,
      estado: row.estado,
      estado_sigla: row.estado_sigla,
      latitude: numero(row.latitude),
      longitude: numero(row.longitude),
    },
    anunciante: mapAnunciante(row),
    total_visualizacoes: row.total_visualizacoes ?? 0,
    total_cliques_whatsapp: row.total_cliques_whatsapp ?? 0,
    total_leads: row.total_leads ?? 0,
    visualizacoes: row.total_visualizacoes ?? 0,
    criado_em: row.criado_em || undefined,
    atualizado_em: row.atualizado_em || undefined,
  };
}

function ordenarPorDestaque(imoveis: Imovel[]): Imovel[] {
  const peso = (imovel: Imovel) =>
    imovel.nivel_destaque === 'super_destaque' ? 3 : imovel.destaque ? 2 : 1;

  return [...imoveis].sort((a, b) => peso(b) - peso(a));
}

function filtrarMock(filtros: FiltrosBusca = {}): Imovel[] {
  let imoveis = [...IMOVEIS_MOCK];

  if (filtros.negocio && filtros.negocio !== 'todos') {
    imoveis = imoveis.filter((imovel) => imovel.negocio === filtros.negocio);
  }
  if (filtros.tipo) {
    imoveis = imoveis.filter((imovel) => imovel.tipo === filtros.tipo);
  }
  if (filtros.destaque) {
    imoveis = imoveis.filter((imovel) => imovel.destaque);
  }
  if (filtros.preco_min && filtros.preco_min > 0) {
    imoveis = imoveis.filter((imovel) => imovel.preco >= filtros.preco_min!);
  }
  if (filtros.preco_max && filtros.preco_max > 0) {
    imoveis = imoveis.filter((imovel) => imovel.preco <= filtros.preco_max!);
  }
  if (filtros.quartos && filtros.quartos > 0) {
    imoveis = imoveis.filter((imovel) => (imovel.quartos || 0) >= filtros.quartos!);
  }
  if (filtros.local) {
    const local = filtros.local.toLowerCase();
    imoveis = imoveis.filter(
      (imovel) =>
        imovel.endereco.cidade.toLowerCase().includes(local) ||
        imovel.endereco.bairro.toLowerCase().includes(local) ||
        imovel.endereco.estado.toLowerCase().includes(local)
    );
  }

  return ordenarPorDestaque(imoveis);
}

function sanearFiltroTexto(valor: string): string {
  return valor.replace(/[,()%]/g, ' ').trim();
}

export async function listarImoveis(filtros: FiltrosBusca = {}): Promise<Imovel[]> {
  const client = createSupabaseReadClient();

  if (!client) {
    return filtrarMock(filtros);
  }

  let query = client.from('imoveis').select(SELECT_IMOVEL).eq('status', 'ativo');

  if (filtros.negocio && filtros.negocio !== 'todos') {
    query = query.eq('negocio', filtros.negocio);
  }
  if (filtros.tipo) {
    query = query.eq('tipo', filtros.tipo);
  }
  if (filtros.preco_min && filtros.preco_min > 0) {
    query = query.gte('preco', filtros.preco_min);
  }
  if (filtros.preco_max && filtros.preco_max > 0) {
    query = query.lte('preco', filtros.preco_max);
  }
  if (filtros.quartos && filtros.quartos > 0) {
    query = query.gte('quartos', filtros.quartos);
  }
  if (filtros.destaque) {
    query = query.neq('nivel_destaque', 'normal');
  }
  if (filtros.local) {
    const local = sanearFiltroTexto(filtros.local);
    if (local) {
      query = query.or(`cidade.ilike.%${local}%,bairro.ilike.%${local}%,estado.ilike.%${local}%`);
    }
  }

  const { data, error } = await query.order('criado_em', { ascending: false }).limit(200);

  if (error) {
    console.warn('[SUPABASE] Falha ao listar imóveis, usando dados mockados:', error.message);
    return filtrarMock(filtros);
  }

  const imoveis = (data as unknown as ImovelRow[]).map(mapRowImovel);
  return ordenarPorDestaque(imoveis);
}

export async function buscarImovelPorSlug(slug: string): Promise<Imovel | null> {
  const client = createSupabaseReadClient();

  if (!client) {
    return IMOVEIS_MOCK.find((imovel) => imovel.slug === slug) ?? null;
  }

  const { data, error } = await client
    .from('imoveis')
    .select(SELECT_IMOVEL)
    .eq('slug', slug)
    .maybeSingle();

  if (error) {
    console.warn('[SUPABASE] Falha ao buscar imóvel, usando dados mockados:', error.message);
    return IMOVEIS_MOCK.find((imovel) => imovel.slug === slug) ?? null;
  }

  return data ? mapRowImovel(data as unknown as ImovelRow) : null;
}

export async function listarImoveisSemelhantes(imovel: Imovel, limite = 3): Promise<Imovel[]> {
  const client = createSupabaseReadClient();

  if (!client) {
    return IMOVEIS_MOCK.filter(
      (item) => item.id !== imovel.id && item.tipo === imovel.tipo
    ).slice(0, limite);
  }

  const { data, error } = await client
    .from('imoveis')
    .select(SELECT_IMOVEL)
    .eq('status', 'ativo')
    .eq('tipo', imovel.tipo)
    .neq('id', imovel.id)
    .limit(limite);

  if (error) {
    console.warn('[SUPABASE] Falha ao buscar imóveis semelhantes:', error.message);
    return IMOVEIS_MOCK.filter(
      (item) => item.id !== imovel.id && item.tipo === imovel.tipo
    ).slice(0, limite);
  }

  return (data as unknown as ImovelRow[]).map(mapRowImovel);
}

export interface NovoImovelInput {
  titulo: string;
  descricao?: string;
  tipo: TipoImovel;
  negocio: TipoNegocio;
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
  endereco: {
    cep?: string;
    logradouro?: string;
    numero?: string;
    complemento?: string;
    bairro?: string;
    cidade?: string;
    estado?: string;
    estado_sigla?: string;
  };
  anunciante?: {
    nome?: string;
    telefone?: string;
    whatsapp?: string;
    perfil?: string;
  };
}

interface ImovelInsert {
  user_id: string | null;
  slug: string;
  titulo: string;
  descricao?: string;
  tipo: TipoImovel;
  negocio: TipoNegocio;
  status: StatusImovel;
  nivel_destaque: string;
  preco: number;
  preco_condominio: number;
  preco_iptu: number;
  area_total?: number;
  area_construida?: number;
  quartos: number;
  suites: number;
  banheiros: number;
  vagas: number;
  foto_principal?: string;
  fotos: string[];
  bairro: string;
  cidade: string;
  estado: string;
  estado_sigla: string;
  cep?: string;
  logradouro?: string;
  numero?: string;
  complemento?: string;
  anunciante_nome?: string;
  anunciante_telefone?: string;
  anunciante_whatsapp?: string;
  anunciante_perfil?: string;
}

function montarInsert(input: NovoImovelInput): ImovelInsert {
  const bairro = input.endereco.bairro || 'Centro';
  const cidade = input.endereco.cidade || 'São Paulo';
  const estado = input.endereco.estado || 'São Paulo';
  const estadoSigla = input.endereco.estado_sigla || 'SP';

  const slugBase = gerarSlug(`${input.titulo}-${cidade}-${bairro}`) || 'imovel';
  const slug = `${slugBase}`.slice(0, 220) + `-${Date.now().toString(36).slice(-6)}`;

  return {
    user_id: null,
    slug,
    titulo: input.titulo,
    descricao: input.descricao,
    tipo: input.tipo,
    negocio: input.negocio,
    status: 'ativo',
    nivel_destaque: 'normal',
    preco: input.preco,
    preco_condominio: input.preco_condominio ?? 0,
    preco_iptu: input.preco_iptu ?? 0,
    area_total: input.area_total,
    area_construida: input.area_construida,
    quartos: input.quartos ?? 0,
    suites: input.suites ?? 0,
    banheiros: input.banheiros ?? 0,
    vagas: input.vagas ?? 0,
    foto_principal: input.foto_principal || input.fotos?.[0],
    fotos: input.fotos ?? [],
    bairro,
    cidade,
    estado,
    estado_sigla: estadoSigla,
    cep: input.endereco.cep,
    logradouro: input.endereco.logradouro,
    numero: input.endereco.numero,
    complemento: input.endereco.complemento,
    anunciante_nome: input.anunciante?.nome,
    anunciante_telefone: input.anunciante?.telefone,
    anunciante_whatsapp: input.anunciante?.whatsapp,
    anunciante_perfil: input.anunciante?.perfil,
  };
}

function montarImovelSimulado(input: NovoImovelInput): Imovel {
  const insert = montarInsert(input);
  const id = `imv_${Date.now()}`;

  return {
    id,
    slug: insert.slug,
    titulo: insert.titulo,
    descricao: insert.descricao,
    tipo: insert.tipo,
    negocio: insert.negocio,
    status: 'ativo',
    nivel_destaque: 'normal',
    destaque: false,
    preco: insert.preco,
    preco_condominio: insert.preco_condominio,
    preco_iptu: insert.preco_iptu,
    area_total: insert.area_total,
    area_construida: insert.area_construida,
    quartos: insert.quartos,
    suites: insert.suites,
    banheiros: insert.banheiros,
    vagas: insert.vagas,
    foto_principal: insert.foto_principal,
    fotos: insert.fotos,
    endereco: {
      cep: insert.cep,
      logradouro: insert.logradouro,
      numero: insert.numero,
      complemento: insert.complemento,
      bairro: insert.bairro,
      cidade: insert.cidade,
      estado: insert.estado,
      estado_sigla: insert.estado_sigla,
    },
    anunciante: input.anunciante?.nome
      ? {
          id: `anon_${id}`,
          nome: input.anunciante.nome,
          telefone: input.anunciante.telefone,
          whatsapp: input.anunciante.whatsapp,
          perfil: (input.anunciante.perfil as PerfilUsuario) || 'proprietario',
        }
      : undefined,
    total_visualizacoes: 0,
    total_cliques_whatsapp: 0,
    total_leads: 0,
    visualizacoes: 0,
    criado_em: new Date().toISOString(),
  };
}

/**
 * Cria um imóvel. Sem Supabase configurado retorna o objeto simulando a criação
 * (mesmo comportamento anterior) para não quebrar o fluxo de desenvolvimento.
 */
export async function criarImovel(input: NovoImovelInput): Promise<Imovel> {
  const admin = createSupabaseReadClient();

  if (!admin || !isSupabaseConfigured()) {
    console.warn('[SUPABASE] Não configurado. Imóvel será retornado apenas em memória.');
    return montarImovelSimulado(input);
  }

  const insert = montarInsert(input);
  const { data, error } = await admin.from('imoveis').insert(insert).select(SELECT_IMOVEL).single();

  if (error) {
    throw new Error(`Erro ao salvar imóvel no Supabase: ${error.message}`);
  }

  return mapRowImovel(data as unknown as ImovelRow);
}

export interface ResultadoImportacao {
  inseridos: number;
  atualizados: number;
  erros: number;
}

/**
 * Importa imóveis vindos de um feed XML. Usa o external_id/codigo_ref para
 * atualizar registros já existentes.
 */
export async function importarImoveisXML(parciais: Partial<Imovel>[]): Promise<ResultadoImportacao> {
  const admin = createSupabaseReadClient();
  const resultado: ResultadoImportacao = { inseridos: 0, atualizados: 0, erros: 0 };

  if (!admin || !isSupabaseConfigured()) {
    return { ...resultado, inseridos: parciais.length };
  }

  for (const parcial of parciais) {
    try {
      const titulo = parcial.titulo || 'Imóvel importado';
      const tipo = (parcial.tipo || 'apartamento') as TipoImovel;
      const negocio = (parcial.negocio || 'venda') as TipoNegocio;

      const input: NovoImovelInput = {
        titulo,
        descricao: parcial.descricao,
        tipo,
        negocio,
        preco: parcial.preco ?? 0,
        area_total: parcial.area_total,
        area_construida: parcial.area_construida,
        quartos: parcial.quartos,
        suites: parcial.suites,
        banheiros: parcial.banheiros,
        vagas: parcial.vagas,
        foto_principal: parcial.foto_principal,
        fotos: parcial.fotos,
        endereco: {
          bairro: parcial.endereco?.bairro,
          cidade: parcial.endereco?.cidade,
          estado: parcial.endereco?.estado,
          estado_sigla: parcial.endereco?.estado_sigla,
          cep: parcial.endereco?.cep,
          logradouro: parcial.endereco?.logradouro,
          numero: parcial.endereco?.numero,
        },
        anunciante: parcial.anunciante
          ? {
              nome: parcial.anunciante.nome,
              telefone: parcial.anunciante.telefone,
              whatsapp: parcial.anunciante.whatsapp,
              perfil: parcial.anunciante.perfil,
            }
          : undefined,
      };

      const insert = montarInsert(input);
      const codigoRef = parcial.codigo_ref;

      if (codigoRef) {
        const { data: existentes } = await admin
          .from('imoveis')
          .select('id')
          .eq('codigo_ref', codigoRef)
          .limit(1);

        const existente = existentes?.[0];

        if (existente?.id) {
          const { error } = await admin
            .from('imoveis')
            .update({
              titulo: insert.titulo,
              descricao: insert.descricao,
              preco: insert.preco,
              fotos: insert.fotos,
              foto_principal: insert.foto_principal,
              quartos: insert.quartos,
              banheiros: insert.banheiros,
              vagas: insert.vagas,
              area_total: insert.area_total,
              area_construida: insert.area_construida,
              atualizado_em: new Date().toISOString(),
            })
            .eq('id', existente.id);

          if (error) {
            resultado.erros += 1;
          } else {
            resultado.atualizados += 1;
          }
          continue;
        }
      }

      const { error } = await admin.from('imoveis').insert({
        ...insert,
        codigo_ref: codigoRef ?? null,
        external_id: parcial.codigo_ref ?? null,
      });

      if (error) {
        resultado.erros += 1;
      } else {
        resultado.inseridos += 1;
      }
    } catch (erro) {
      console.warn('[SUPABASE] Erro ao importar imóvel do XML:', erro);
      resultado.erros += 1;
    }
  }

  return resultado;
}
