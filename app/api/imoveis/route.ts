import { NextResponse } from 'next/server';
import { IMOVEIS_MOCK } from '@/lib/utils';
import { Imovel } from '@/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const negocio = searchParams.get('negocio');
  const tipo = searchParams.get('tipo');
  const local = searchParams.get('local');
  const destaque = searchParams.get('destaque');

  let filtrados: Imovel[] = [...IMOVEIS_MOCK];

  if (negocio && negocio !== 'todos') {
    filtrados = filtrados.filter(i => i.negocio === negocio);
  }
  if (tipo) {
    filtrados = filtrados.filter(i => i.tipo === tipo);
  }
  if (destaque === 'true') {
    filtrados = filtrados.filter(i => i.destaque);
  }
  if (local) {
    const l = local.toLowerCase();
    filtrados = filtrados.filter(i =>
      i.endereco.cidade.toLowerCase().includes(l) ||
      i.endereco.bairro.toLowerCase().includes(l)
    );
  }

  // Ordenação com Super Destaque e Destaque no topo
  filtrados.sort((a, b) => {
    const pesoA = a.nivel_destaque === 'super_destaque' ? 3 : a.destaque ? 2 : 1;
    const pesoB = b.nivel_destaque === 'super_destaque' ? 3 : b.destaque ? 2 : 1;
    return pesoB - pesoA;
  });

  return NextResponse.json({ total: filtrados.length, imoveis: filtrados });
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    if (!data.titulo || !data.tipo || !data.negocio || !data.preco) {
      return NextResponse.json({ error: 'Dados obrigatórios incompletos' }, { status: 400 });
    }

    const slugGerado = `${data.tipo}-${data.negocio}-${(data.endereco?.cidade || 'brasil').toLowerCase().replace(/\s+/g, '-')}-${Date.now().toString().slice(-4)}`;

    const novoImovel: Imovel = {
      id: `imv_${Date.now()}`,
      slug: slugGerado,
      titulo: data.titulo,
      descricao: data.descricao || '',
      tipo: data.tipo,
      negocio: data.negocio,
      status: 'ativo',
      nivel_destaque: data.nivel_destaque || 'normal',
      destaque: data.nivel_destaque === 'destaque' || data.nivel_destaque === 'super_destaque',
      preco: Number(data.preco),
      preco_condominio: data.preco_condominio ? Number(data.preco_condominio) : 0,
      preco_iptu: data.preco_iptu ? Number(data.preco_iptu) : 0,
      area_construida: data.area_construida ? Number(data.area_construida) : undefined,
      area_total: data.area_total ? Number(data.area_total) : undefined,
      quartos: data.quartos ? Number(data.quartos) : 0,
      suites: data.suites ? Number(data.suites) : 0,
      banheiros: data.banheiros ? Number(data.banheiros) : 0,
      vagas: data.vagas ? Number(data.vagas) : 0,
      foto_principal: data.foto_principal || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
      fotos: data.fotos || [],
      endereco: {
        bairro: data.endereco?.bairro || 'Centro',
        cidade: data.endereco?.cidade || 'São Paulo',
        estado: data.endereco?.estado || 'São Paulo',
        estado_sigla: data.endereco?.estado_sigla || 'SP',
        cep: data.endereco?.cep || '',
      },
      anunciante: {
        id: data.anunciante?.id || 'anunciante_1',
        nome: data.anunciante?.nome || 'Anunciante ARC LAR',
        telefone: data.anunciante?.telefone || '11999999999',
        whatsapp: data.anunciante?.whatsapp || '11999999999',
        perfil: data.anunciante?.perfil || 'proprietario',
      },
      total_visualizacoes: 1,
      total_cliques_whatsapp: 0,
      total_leads: 0,
      criado_em: new Date().toISOString(),
    };

    console.log('[IMOVEIS] Novo imóvel cadastrado com sucesso:', novoImovel.id, novoImovel.titulo);

    return NextResponse.json({ success: true, imovel: novoImovel }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Erro ao cadastrar imóvel' }, { status: 500 });
  }
}

