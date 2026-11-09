import { NextResponse } from 'next/server';
import {
  CAMPOS_BOOLEANOS_PLANO,
  CAMPOS_NUMEROS_PLANO,
  type Plano,
} from '@/lib/planos';
import { listarPlanos, salvarPlano } from '@/lib/supabase/planos';

export const dynamic = 'force-dynamic';

function numeroValido(valor: unknown): valor is number {
  return typeof valor === 'number' && Number.isFinite(valor) && valor >= 0;
}

function booleanoValido(valor: unknown): valor is boolean {
  return typeof valor === 'boolean';
}

export async function GET() {
  const planos = await listarPlanos();
  return NextResponse.json({ planos });
}

export async function PUT(request: Request) {
  let corpo: Record<string, unknown>;

  try {
    corpo = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: 'JSON inválido.' }, { status: 400 });
  }

  const id = corpo.id;

  if (typeof id !== 'string' || !id.trim()) {
    return NextResponse.json({ error: 'ID do plano é obrigatório.' }, { status: 400 });
  }

  const dados: Partial<Plano> = {};

  if (corpo.nome !== undefined) {
    if (typeof corpo.nome !== 'string' || !corpo.nome.trim()) {
      return NextResponse.json({ error: 'O nome do plano é obrigatório.' }, { status: 400 });
    }
    dados.nome = corpo.nome.trim();
  }

  if (corpo.descricao !== undefined) {
    if (typeof corpo.descricao !== 'string') {
      return NextResponse.json({ error: 'A descrição deve ser um texto.' }, { status: 400 });
    }
    dados.descricao = corpo.descricao.trim();
  }

  for (const campo of CAMPOS_NUMEROS_PLANO) {
    const valor = corpo[campo];

    if (valor === undefined) {
      continue;
    }

    const numero = typeof valor === 'string' && valor.trim() !== '' ? Number(valor) : valor;

    if (!numeroValido(numero)) {
      return NextResponse.json(
        { error: `O campo ${campo} deve ser um número maior ou igual a zero.` },
        { status: 400 }
      );
    }

    dados[campo] = numero;
  }

  for (const campo of CAMPOS_BOOLEANOS_PLANO) {
    const valor = corpo[campo];

    if (valor === undefined) {
      continue;
    }

    if (!booleanoValido(valor)) {
      return NextResponse.json({ error: `O campo ${campo} deve ser booleano.` }, { status: 400 });
    }

    dados[campo] = valor;
  }

  if (corpo.features !== undefined) {
    if (
      !Array.isArray(corpo.features) ||
      !corpo.features.every((item) => typeof item === 'string')
    ) {
      return NextResponse.json({ error: 'Os itens inclusos devem ser uma lista de textos.' }, { status: 400 });
    }

    dados.features = corpo.features.map((item) => item.trim()).filter(Boolean);
  }

  const resultado = await salvarPlano(id.trim(), dados);

  if (!resultado.plano) {
    return NextResponse.json({ error: 'Plano não encontrado.' }, { status: 404 });
  }

  return NextResponse.json(resultado);
}
