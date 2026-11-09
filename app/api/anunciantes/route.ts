import { NextResponse } from 'next/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { createSupabaseServiceClient } from '@/lib/supabase/server';
import type { NivelHierarquico } from '@/types';
import { converterParaNivelHierarquico } from '@/lib/auth/permissoes';

export interface AnuncianteItem {
  id: string;
  nome: string;
  nome_comercial: string;
  email: string;
  telefone?: string;
  whatsapp?: string;
  creci?: string;
  nivel: NivelHierarquico;
  perfil: 'imobiliaria' | 'corretor' | 'proprietario' | 'admin_master' | 'cliente';
  plano: string;
  plano_status: 'ativo' | 'pendente' | 'cancelado';
  plano_desde?: string;
  status: 'Ativo' | 'Pendente' | 'Bloqueado';
  total_imoveis: number;
  criado_em: string;
}

type PerfilAnunciante = AnuncianteItem['perfil'];
type StatusAnunciante = AnuncianteItem['status'];
type PlanoStatusAnunciante = AnuncianteItem['plano_status'];

const NOMES_PLANOS: Record<string, string> = {
  gratuito: 'Gratuito',
  basico: 'Básico',
  profissional: 'Profissional',
  imobiliaria: 'Imobiliária',
};

// Lista padrão em memória para desenvolvimento/fallback com os 3 níveis hierárquicos
let anunciantesMemoria: AnuncianteItem[] = [
  {
    id: 'anunc-master',
    nome: 'Administrador Master',
    nome_comercial: 'ARC LAR Matriz Admin',
    email: 'admin@arclar.com.br',
    telefone: '(11) 3456-7890',
    whatsapp: '11999998888',
    creci: 'MASTER-01',
    nivel: 'admin_master',
    perfil: 'admin_master',
    plano: 'Corporativo',
    plano_status: 'ativo',
    status: 'Ativo',
    total_imoveis: 0,
    criado_em: '2026-01-01T08:00:00Z',
  },
  {
    id: 'anunc-1',
    nome: 'Prime Imóveis LTDA',
    nome_comercial: 'Prime Imóveis',
    email: 'contato@primeimoveis.com.br',
    telefone: '(11) 3456-7890',
    whatsapp: '11999998888',
    creci: '12345-J',
    nivel: 'corretor',
    perfil: 'imobiliaria',
    plano: 'Imobiliária',
    plano_status: 'ativo',
    status: 'Ativo',
    total_imoveis: 45,
    criado_em: '2026-01-15T10:00:00Z',
  },
  {
    id: 'anunc-2',
    nome: 'Carlos Eduardo Corretor',
    nome_comercial: 'Carlos Corretor',
    email: 'carlos@corretor.com.br',
    telefone: '(11) 98888-7777',
    whatsapp: '11988887777',
    creci: '98765-F',
    nivel: 'corretor',
    perfil: 'corretor',
    plano: 'Profissional',
    plano_status: 'ativo',
    status: 'Ativo',
    total_imoveis: 18,
    criado_em: '2026-02-10T14:30:00Z',
  },
  {
    id: 'anunc-3',
    nome: 'Litoral Imóveis Praia Grande',
    nome_comercial: 'Litoral Imóveis',
    email: 'atendimento@litoralimoveis.com.br',
    telefone: '(13) 3499-1122',
    whatsapp: '13988887777',
    creci: '54321-J',
    nivel: 'corretor',
    perfil: 'imobiliaria',
    plano: 'Profissional',
    plano_status: 'pendente',
    status: 'Ativo',
    total_imoveis: 32,
    criado_em: '2026-02-28T09:15:00Z',
  },
  {
    id: 'anunc-4',
    nome: 'Roberto Silveira',
    nome_comercial: 'Roberto Silveira (Proprietário)',
    email: 'roberto.silveira@email.com',
    telefone: '(11) 97777-6666',
    whatsapp: '11977776666',
    creci: '',
    nivel: 'cliente',
    perfil: 'proprietario',
    plano: 'Gratuito',
    plano_status: 'ativo',
    status: 'Ativo',
    total_imoveis: 2,
    criado_em: '2026-03-01T16:20:00Z',
  },
];

export async function GET() {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createSupabaseServiceClient();
      const { data, error } = await supabase
        .from('profiles')
        .select('id, nome, sobrenome, email, telefone, whatsapp, creci, perfil, nome_comercial, ativo, criado_em')
        .order('criado_em', { ascending: false });

      const { data: assinaturasData } = await supabase
        .from('assinaturas')
        .select('user_id, plano_id, status, data_inicio')
        .order('data_inicio', { ascending: false });

      const assinaturaPorUsuario = new Map<string, { plano_id: string; status: string; data_inicio?: string }>();
      for (const assinatura of assinaturasData ?? []) {
        if (assinatura?.user_id && !assinaturaPorUsuario.has(assinatura.user_id)) {
          assinaturaPorUsuario.set(assinatura.user_id, assinatura);
        }
      }

      if (!error && Array.isArray(data) && data.length > 0) {
        const formatados: AnuncianteItem[] = data.map((item) => {
          const nivelHierarquico = converterParaNivelHierarquico(item.perfil);
          const assinatura = assinaturaPorUsuario.get(item.id);
          const planoStatus: PlanoStatusAnunciante = !assinatura
            ? 'ativo'
            : assinatura.status === 'ativa'
              ? 'ativo'
              : assinatura.status === 'pendente'
                ? 'pendente'
                : 'cancelado';

          return {
            id: item.id,
            nome: [item.nome, item.sobrenome].filter(Boolean).join(' ') || item.nome_comercial || 'Anunciante',
            nome_comercial: item.nome_comercial || item.nome || 'Anunciante',
            email: item.email,
            telefone: item.telefone || '',
            whatsapp: item.whatsapp || item.telefone || '',
            creci: item.creci || '',
            nivel: nivelHierarquico,
            perfil: (item.perfil as PerfilAnunciante) || 'corretor',
            plano: assinatura ? NOMES_PLANOS[assinatura.plano_id] || assinatura.plano_id : 'Gratuito',
            plano_status: planoStatus,
            plano_desde: assinatura?.data_inicio,
            status: item.ativo ? 'Ativo' : 'Bloqueado',
            total_imoveis: 0,
            criado_em: item.criado_em || new Date().toISOString(),
          };
        });
        return NextResponse.json({ anunciantes: formatados });
      }
    } catch {
      // Fallback em memória
    }
  }

  return NextResponse.json({ anunciantes: anunciantesMemoria });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nome, nome_comercial, email, telefone, whatsapp, creci, nivel, perfil, plano, plano_status, status } = body;

    if (!nome || !email) {
      return NextResponse.json({ error: 'Nome e e-mail são obrigatórios.' }, { status: 400 });
    }

    const nivelFinal: NivelHierarquico = nivel || converterParaNivelHierarquico(perfil);

    const novoAnunciante: AnuncianteItem = {
      id: `anunc-${Date.now()}`,
      nome: String(nome).trim(),
      nome_comercial: String(nome_comercial || nome).trim(),
      email: String(email).trim().toLowerCase(),
      telefone: String(telefone || '').trim(),
      whatsapp: String(whatsapp || telefone || '').trim(),
      creci: String(creci || '').trim(),
      nivel: nivelFinal,
      perfil: (perfil as PerfilAnunciante) || (nivelFinal === 'admin_master' ? 'admin_master' : nivelFinal === 'corretor' ? 'corretor' : 'cliente'),
      plano: String(plano || 'Gratuito'),
      plano_status: (plano_status as PlanoStatusAnunciante) || 'ativo',
      plano_desde: new Date().toISOString(),
      status: (status as StatusAnunciante) || 'Ativo',
      total_imoveis: 0,
      criado_em: new Date().toISOString(),
    };

    if (isSupabaseConfigured()) {
      try {
        const supabase = createSupabaseServiceClient();
        await supabase.from('profiles').insert({
          id: novoAnunciante.id,
          nome: novoAnunciante.nome,
          nome_comercial: novoAnunciante.nome_comercial,
          email: novoAnunciante.email,
          telefone: novoAnunciante.telefone,
          whatsapp: novoAnunciante.whatsapp,
          creci: novoAnunciante.creci,
          perfil: novoAnunciante.perfil,
          ativo: novoAnunciante.status === 'Ativo',
        });
      } catch {
        // Fallback
      }
    }

    anunciantesMemoria.unshift(novoAnunciante);

    return NextResponse.json({ success: true, anunciante: novoAnunciante }, { status: 201 });
  } catch (err) {
    const mensagem = err instanceof Error ? err.message : 'Erro ao cadastrar anunciante.';
    return NextResponse.json({ error: mensagem }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, nome, nome_comercial, email, telefone, whatsapp, creci, nivel, perfil, plano, plano_status, status } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID do anunciante é obrigatório.' }, { status: 400 });
    }

    const indice = anunciantesMemoria.findIndex((a) => a.id === id);
    if (indice !== -1) {
      const nivelAtualizado = nivel || (perfil ? converterParaNivelHierarquico(perfil) : anunciantesMemoria[indice].nivel);
      anunciantesMemoria[indice] = {
        ...anunciantesMemoria[indice],
        nome: nome ? String(nome).trim() : anunciantesMemoria[indice].nome,
        nome_comercial: nome_comercial ? String(nome_comercial).trim() : anunciantesMemoria[indice].nome_comercial,
        email: email ? String(email).trim().toLowerCase() : anunciantesMemoria[indice].email,
        telefone: telefone !== undefined ? String(telefone).trim() : anunciantesMemoria[indice].telefone,
        whatsapp: whatsapp !== undefined ? String(whatsapp).trim() : anunciantesMemoria[indice].whatsapp,
        creci: creci !== undefined ? String(creci).trim() : anunciantesMemoria[indice].creci,
        nivel: nivelAtualizado,
        perfil: perfil || anunciantesMemoria[indice].perfil,
        plano: plano || anunciantesMemoria[indice].plano,
        plano_status: (plano_status as PlanoStatusAnunciante) || anunciantesMemoria[indice].plano_status,
        plano_desde:
          plano_status === 'ativo' && !anunciantesMemoria[indice].plano_desde
            ? new Date().toISOString()
            : anunciantesMemoria[indice].plano_desde,
        status: status || anunciantesMemoria[indice].status,
      };
    }

    if (isSupabaseConfigured()) {
      try {
        const supabase = createSupabaseServiceClient();
        await supabase
          .from('profiles')
          .update({
            nome,
            nome_comercial,
            email,
            telefone,
            whatsapp,
            creci,
            perfil,
            ativo: status === 'Ativo',
            atualizado_em: new Date().toISOString(),
          })
          .eq('id', id);

        if (plano_status) {
          await supabase
            .from('assinaturas')
            .update({ status: plano_status === 'ativo' ? 'ativa' : plano_status })
            .eq('user_id', id)
            .eq('status', 'pendente');
        }
      } catch {
        // Fallback
      }
    }

    return NextResponse.json({
      success: true,
      anunciante: indice !== -1 ? anunciantesMemoria[indice] : body,
    });
  } catch (err) {
    const mensagem = err instanceof Error ? err.message : 'Erro ao atualizar anunciante.';
    return NextResponse.json({ error: mensagem }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID é obrigatório.' }, { status: 400 });
    }

    anunciantesMemoria = anunciantesMemoria.filter((a) => a.id !== id);

    if (isSupabaseConfigured()) {
      try {
        const supabase = createSupabaseServiceClient();
        await supabase.from('profiles').delete().eq('id', id);
      } catch {
        // Fallback
      }
    }

    return NextResponse.json({ success: true, id });
  } catch (err) {
    const mensagem = err instanceof Error ? err.message : 'Erro ao excluir anunciante.';
    return NextResponse.json({ error: mensagem }, { status: 500 });
  }
}

