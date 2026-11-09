import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { USUARIOS_EXEMPLO, converterParaNivelHierarquico } from '@/lib/auth/permissoes';
import type { NivelHierarquico, UsuarioAutenticado } from '@/types';

const COOKIE_NOME = 'arclar_sessao_usuario';

export async function GET() {
  const cookieStore = await cookies();
  const sessaoCookie = cookieStore.get(COOKIE_NOME)?.value;

  if (!sessaoCookie) {
    return NextResponse.json({ autenticado: false, usuario: null, nivel: null });
  }

  let usuario: UsuarioAutenticado | null = null;

  try {
    const decodificado = JSON.parse(sessaoCookie);
    if (decodificado && decodificado.nivel) {
      usuario = decodificado as UsuarioAutenticado;
    }
  } catch {
    // Se cookie for inválido, trata como sessão inexistente
  }

  if (!usuario) {
    return NextResponse.json({ autenticado: false, usuario: null, nivel: null });
  }

  return NextResponse.json({
    autenticado: true,
    usuario,
    nivel: converterParaNivelHierarquico(usuario.nivel),
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const nivelSolicitado = body.nivel as NivelHierarquico;

    if (!nivelSolicitado || !USUARIOS_EXEMPLO[nivelSolicitado]) {
      return NextResponse.json({ error: 'Nível hierárquico inválido.' }, { status: 400 });
    }

    const usuarioEscolhido = USUARIOS_EXEMPLO[nivelSolicitado];

    const resposta = NextResponse.json({
      success: true,
      usuario: usuarioEscolhido,
      nivel: nivelSolicitado,
      mensagem: `Nível alternado com sucesso para ${nivelSolicitado}.`,
    });

    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NOME, JSON.stringify(usuarioEscolhido), {
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 dias
      httpOnly: true,
      sameSite: 'lax',
    });

    return resposta;
  } catch (err) {
    const mensagem = err instanceof Error ? err.message : 'Erro ao atualizar sessão.';
    return NextResponse.json({ error: mensagem }, { status: 500 });
  }
}

