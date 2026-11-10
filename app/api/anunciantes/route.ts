import { NextResponse } from 'next/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { createSupabaseServiceClient } from '@/lib/supabase/server';
import type { NivelHierarquico } from '@/types';
import { converterParaNivelHierarquico } from '@/lib/auth/permissoes';
import {
  adicionarAnuncianteMemoria,
  atualizarAnuncianteMemoria,
  excluirAnuncianteMemoria,
  listarAnunciantesMemoria,
  type AnuncianteItem,
} from '@/lib/anunciantes-store';

export type { AnuncianteItem } from '@/lib/anunciantes-store';

type PerfilAnunciante = AnuncianteItem['perfil'];
type StatusAnunciante = AnuncianteItem['status'];
type PlanoStatusAnunciante = AnuncianteItem['plano_status'];

const NOMES_PLANOS: Record<string, string> = {
  gratuito: 'Gratuito',
  basico: 'Básico',
  profissional: 'Profissional',
  imobiliaria: 'Imobiliária',
};

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

  return NextResponse.json({ anunciantes: listarAnunciantesMemoria() });
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

    adicionarAnuncianteMemoria(novoAnunciante);

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

    const atual = listarAnunciantesMemoria().find((a) => a.id === id);
    const atualizado = atual
      ? atualizarAnuncianteMemoria(id, {
          nome: nome ? String(nome).trim() : atual.nome,
          nome_comercial: nome_comercial ? String(nome_comercial).trim() : atual.nome_comercial,
          email: email ? String(email).trim().toLowerCase() : atual.email,
          telefone: telefone !== undefined ? String(telefone).trim() : atual.telefone,
          whatsapp: whatsapp !== undefined ? String(whatsapp).trim() : atual.whatsapp,
          creci: creci !== undefined ? String(creci).trim() : atual.creci,
          nivel: nivel || (perfil ? converterParaNivelHierarquico(perfil) : atual.nivel),
          perfil: perfil || atual.perfil,
          plano: plano || atual.plano,
          plano_status: (plano_status as PlanoStatusAnunciante) || atual.plano_status,
          plano_desde:
            plano_status === 'ativo' && !atual.plano_desde
              ? new Date().toISOString()
              : atual.plano_desde,
          status: status || atual.status,
        })
      : null;

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
      anunciante: atualizado ?? body,
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

    excluirAnuncianteMemoria(id);

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

