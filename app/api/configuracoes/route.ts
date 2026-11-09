import { NextResponse } from 'next/server';
import {
  CAMPOS_CONFIGURACOES,
  type CampoConfiguracao,
  type ConfiguracoesSite,
} from '@/lib/configuracoes';
import { obterConfiguracoes, salvarConfiguracoes } from '@/lib/supabase/configuracoes';

export const dynamic = 'force-dynamic';

const CAMPOS_URL: CampoConfiguracao[] = ['instagram', 'facebook', 'tiktok', 'google'];

function textoValido(valor: unknown): valor is string {
  return typeof valor === 'string' && valor.trim().length <= 500;
}

export async function GET() {
  const configuracoes = await obterConfiguracoes();
  return NextResponse.json({ configuracoes });
}

export async function PUT(request: Request) {
  let corpo: Record<string, unknown>;

  try {
    corpo = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: 'JSON inválido.' }, { status: 400 });
  }

  const dados: Partial<ConfiguracoesSite> = {};

  for (const campo of CAMPOS_CONFIGURACOES) {
    const valor = corpo[campo];

    if (valor === undefined) {
      continue;
    }

    if (!textoValido(valor)) {
      return NextResponse.json(
        { error: `O campo ${campo} deve ser um texto com até 500 caracteres.` },
        { status: 400 }
      );
    }

    dados[campo] = valor.trim();
  }

  for (const campo of CAMPOS_URL) {
    const valor = dados[campo];

    if (valor && !/^https?:\/\//i.test(valor)) {
      return NextResponse.json(
        { error: `O link de ${campo} deve começar com http:// ou https://.` },
        { status: 400 }
      );
    }
  }

  const resultado = await salvarConfiguracoes(dados);
  return NextResponse.json(resultado);
}
