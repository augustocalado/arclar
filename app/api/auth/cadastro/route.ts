import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { createSupabaseServiceClient } from '@/lib/supabase/server';
import { converterParaNivelHierarquico } from '@/lib/auth/permissoes';
import {
  adicionarAnuncianteMemoria,
  listarAnunciantesMemoria,
  type AnuncianteItem,
} from '@/lib/anunciantes-store';
import type { NivelHierarquico, PerfilUsuario, UsuarioAutenticado } from '@/types';

const COOKIE_NOME = 'arclar_sessao_usuario';

const PERFIS_VALIDOS: PerfilUsuario[] = [
  'proprietario',
  'comprador',
  'locatario',
  'corretor',
  'imobiliaria',
  'interessado',
  'cliente',
];

function normalizarPerfil(valor: unknown): PerfilUsuario {
  const perfil = String(valor ?? '').toLowerCase() as PerfilUsuario;
  return PERFIS_VALIDOS.includes(perfil) ? perfil : 'proprietario';
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const nome = String(body.nome || '').trim();
    const sobrenome = String(body.sobrenome || '').trim();
    const email = String(body.email || '').trim().toLowerCase();
    const telefone = String(body.telefone || '').trim();
    const senha = String(body.senha || '');
    const perfil = normalizarPerfil(body.perfil);

    if (!nome || !email || senha.length < 8) {
      return NextResponse.json(
        { error: 'Nome, e-mail e senha (mínimo 8 caracteres) são obrigatórios.' },
        { status: 400 }
      );
    }

    const nivel: NivelHierarquico = converterParaNivelHierarquico(perfil);
    const ehProfissional = nivel === 'corretor';
    const ativo = !ehProfissional;
    const status = ehProfissional ? 'Pendente' : 'Ativo';

    let id = globalThis.crypto?.randomUUID?.() ?? `user-${Date.now()}`;

    if (isSupabaseConfigured()) {
      try {
        const supabase = createSupabaseServiceClient();
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          email,
          password: senha,
          email_confirm: true,
          user_metadata: { nome, sobrenome, perfil },
        });

        if (!authError && authData.user) {
          id = authData.user.id;
          await supabase.from('profiles').insert({
            id,
            nome,
            sobrenome,
            email,
            telefone,
            perfil,
            nome_comercial: ehProfissional ? nome : undefined,
            ativo,
          });
        }
      } catch {
        // Mantém o cadastro em modo demonstração quando o Supabase não estiver disponível.
      }
    }

    const nomeCompleto = [nome, sobrenome].filter(Boolean).join(' ') || nome;
    const perfilAnunciante: AnuncianteItem['perfil'] =
      perfil === 'imobiliaria'
        ? 'imobiliaria'
        : perfil === 'corretor'
          ? 'corretor'
          : perfil === 'proprietario'
            ? 'proprietario'
            : 'cliente';

    const usuario: UsuarioAutenticado = {
      id,
      nome: nomeCompleto,
      email,
      nivel,
      perfil,
      telefone,
      ativo,
    };

    const jaCadastrado = listarAnunciantesMemoria().some((item) => item.email === email);
    if (!jaCadastrado) {
      adicionarAnuncianteMemoria({
        id,
        nome: nomeCompleto,
        nome_comercial: nomeCompleto,
        email,
        telefone,
        whatsapp: telefone,
        creci: '',
        nivel,
        perfil: perfilAnunciante,
        plano: 'Gratuito',
        plano_status: 'ativo',
        status,
        total_imoveis: 0,
        criado_em: new Date().toISOString(),
      });
    }

    if (ativo) {
      const cookieStore = await cookies();
      cookieStore.set(COOKIE_NOME, JSON.stringify(usuario), {
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
        httpOnly: true,
        sameSite: 'lax',
      });
    }

    return NextResponse.json(
      {
        success: true,
        nivel,
        perfil,
        status,
        sessaoAtiva: ativo,
        usuario,
        mensagem: ehProfissional
          ? 'Cadastro enviado. Seu perfil de corretor aguarda aprovação do Admin Master.'
          : 'Conta criada com sucesso.',
      },

      { status: 201 }
    );
  } catch (err) {
    const mensagem = err instanceof Error ? err.message : 'Erro ao criar conta.';
    return NextResponse.json({ error: mensagem }, { status: 500 });
  }
}
