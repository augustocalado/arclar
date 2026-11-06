import { NextResponse } from 'next/server';
import { criarImovel, listarImoveis } from '@/lib/supabase/imoveis';
import type { TipoImovel, TipoNegocio } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const imoveis = await listarImoveis({
    negocio: (searchParams.get('negocio') as TipoNegocio | 'todos') || undefined,
    tipo: (searchParams.get('tipo') as TipoImovel) || undefined,
    local: searchParams.get('local') || undefined,
    destaque: searchParams.get('destaque') === 'true',
    preco_min: searchParams.get('preco_min') ? Number(searchParams.get('preco_min')) : undefined,
    preco_max: searchParams.get('preco_max') ? Number(searchParams.get('preco_max')) : undefined,
    quartos: searchParams.get('quartos') ? Number(searchParams.get('quartos')) : undefined,
  });

  return NextResponse.json({ total: imoveis.length, imoveis });
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    if (!data.titulo || !data.tipo || !data.negocio || !data.preco) {
      return NextResponse.json({ error: 'Dados obrigatórios incompletos' }, { status: 400 });
    }

    const fotos: string[] = Array.isArray(data.fotos) ? data.fotos : [];

    const imovel = await criarImovel({
      titulo: data.titulo,
      descricao: data.descricao || '',
      tipo: data.tipo as TipoImovel,
      negocio: data.negocio as TipoNegocio,
      preco: Number(data.preco) || 0,
      preco_condominio: data.preco_condominio ? Number(data.preco_condominio) : undefined,
      preco_iptu: data.preco_iptu ? Number(data.preco_iptu) : undefined,
      area_construida: data.area_construida ? Number(data.area_construida) : undefined,
      area_total: data.area_total ? Number(data.area_total) : undefined,
      quartos: data.quartos ? Number(data.quartos) : undefined,
      suites: data.suites ? Number(data.suites) : undefined,
      banheiros: data.banheiros ? Number(data.banheiros) : undefined,
      vagas: data.vagas ? Number(data.vagas) : undefined,
      foto_principal: data.foto_principal || fotos[0],
      fotos,
      endereco: {
        bairro: data.endereco?.bairro || 'Centro',
        cidade: data.endereco?.cidade || 'São Paulo',
        estado: data.endereco?.estado || 'São Paulo',
        estado_sigla: data.endereco?.estado_sigla || 'SP',
        cep: data.endereco?.cep || '',
        logradouro: data.endereco?.logradouro || '',
        numero: data.endereco?.numero || '',
        complemento: data.endereco?.complemento || '',
      },
      anunciante: data.anunciante,
    });

    console.log('[IMOVEIS] Novo imóvel cadastrado:', imovel.id, imovel.titulo);

    return NextResponse.json({ success: true, imovel }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erro ao cadastrar imóvel';
    console.error('[IMOVEIS] Erro ao cadastrar:', err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
