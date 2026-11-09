import { NextResponse } from 'next/server';
import {
  atualizarImovel,
  criarImovel,
  excluirImovel,
  listarImoveis,
} from '@/lib/supabase/imoveis';
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

export async function PUT(request: Request) {
  try {
    const data = await request.json();

    if (!data.id) {
      return NextResponse.json({ error: 'ID do imóvel é obrigatório.' }, { status: 400 });
    }

    const imovel = await atualizarImovel(String(data.id), {
      titulo: data.titulo,
      descricao: data.descricao,
      tipo: data.tipo as TipoImovel | undefined,
      negocio: data.negocio as TipoNegocio | undefined,
      preco: data.preco !== undefined ? Number(data.preco) : undefined,
      quartos: data.quartos !== undefined ? Number(data.quartos) : undefined,
      suites: data.suites !== undefined ? Number(data.suites) : undefined,
      banheiros: data.banheiros !== undefined ? Number(data.banheiros) : undefined,
      vagas: data.vagas !== undefined ? Number(data.vagas) : undefined,
      foto_principal: data.foto_principal,
      fotos: Array.isArray(data.fotos) ? data.fotos : undefined,
      endereco: data.endereco,
    });

    if (!imovel) {
      return NextResponse.json({ error: 'Imóvel não encontrado.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, imovel });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erro ao atualizar imóvel';
    console.error('[IMOVEIS] Erro ao atualizar:', err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID do imóvel é obrigatório.' }, { status: 400 });
    }

    const removido = await excluirImovel(id);

    if (!removido) {
      return NextResponse.json({ error: 'Imóvel não encontrado.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, id });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erro ao excluir imóvel';
    console.error('[IMOVEIS] Erro ao excluir:', err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
