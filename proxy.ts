import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const COOKIE_SESSAO = 'arclar_sessao_usuario';

type Nivel = 'admin_master' | 'corretor' | 'cliente';

interface SessaoCookie {
  nivel: Nivel;
  ativo: boolean;
}

function normalizarNivel(valor: unknown): Nivel {
  const normalizado = String(valor ?? '').toLowerCase();
  if (normalizado === 'admin_master' || normalizado === 'admin' || normalizado === 'adm') {
    return 'admin_master';
  }
  if (normalizado === 'corretor' || normalizado === 'imobiliaria') {
    return 'corretor';
  }
  return 'cliente';
}

function lerSessao(request: NextRequest): SessaoCookie | null {
  const bruto = request.cookies.get(COOKIE_SESSAO)?.value;
  if (!bruto) return null;

  let dados: Record<string, unknown> | null = null;
  try {
    dados = JSON.parse(bruto);
  } catch {
    try {
      dados = JSON.parse(decodeURIComponent(bruto));
    } catch {
      return null;
    }
  }

  if (!dados) return null;

  return {
    nivel: normalizarNivel(dados.nivel ?? dados.perfil),
    ativo: dados.ativo !== false,
  };
}

function redirecionar(request: NextRequest, destino: string, aviso: string) {
  const url = request.nextUrl.clone();
  url.pathname = destino;
  url.search = '';
  url.searchParams.set('aviso', aviso);
  return NextResponse.redirect(url);
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessao = lerSessao(request);

  if (pathname.startsWith('/admin')) {
    if (!sessao) {
      return redirecionar(request, '/login', 'login_necessario');
    }
    if (sessao.nivel !== 'admin_master') {
      return sessao.nivel === 'corretor'
        ? redirecionar(request, '/painel', 'acesso_negado_admin')
        : redirecionar(request, '/imoveis', 'acesso_negado_admin');
    }
    return NextResponse.next();
  }

  if (pathname.startsWith('/painel')) {
    if (!sessao) {
      return redirecionar(request, '/login', 'login_necessario');
    }
    if (sessao.nivel === 'cliente') {
      return redirecionar(request, '/imoveis', 'acesso_negado_painel');
    }
    if (sessao.nivel === 'corretor' && !sessao.ativo) {
      return redirecionar(request, '/login', 'corretor_pendente');
    }
    return NextResponse.next();
  }

  if (pathname.startsWith('/cliente')) {
    if (!sessao) {
      return redirecionar(request, '/login', 'login_necessario');
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/painel/:path*', '/cliente/:path*'],
};
