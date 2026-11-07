import { NextResponse } from 'next/server';

const SERIES = [
  { chave: 'igpm', nome: 'IGP-M', serie: 189 },
  { chave: 'ipca', nome: 'IPCA', serie: 433 },
] as const;

interface PontoBCB {
  data: string;
  valor: string;
}

interface ResultadoIndice {
  nome: string;
  serie: number;
  acumulado12m: number;
  inicio: string;
  fim: string;
  variacoes: { data: string; valor: number }[];
}

async function buscarSerie(serie: number, nome: string): Promise<ResultadoIndice | null> {
  try {
    const resposta = await fetch(
      `https://api.bcb.gov.br/dados/serie/bcdata.sgs.${serie}/dados/ultimos/12?formato=json`,
      {
        headers: { Accept: 'application/json' },
        next: { revalidate: 3600 },
      }
    );

    if (!resposta.ok) {
      return null;
    }

    const dados = (await resposta.json()) as PontoBCB[];

    if (!Array.isArray(dados) || dados.length === 0) {
      return null;
    }

    const variacoes = dados
      .map((ponto) => ({
        data: ponto.data,
        valor: Number(String(ponto.valor).replace(',', '.')),
      }))
      .filter((ponto) => Number.isFinite(ponto.valor));

    if (variacoes.length === 0) {
      return null;
    }

    const acumulado = variacoes.reduce((total, ponto) => total * (1 + ponto.valor / 100), 1);

    return {
      nome,
      serie,
      acumulado12m: Number(((acumulado - 1) * 100).toFixed(2)),
      inicio: variacoes[0].data,
      fim: variacoes[variacoes.length - 1].data,
      variacoes,
    };
  } catch {
    return null;
  }
}

export const revalidate = 3600;

export async function GET() {
  const resultados = await Promise.all(
    SERIES.map(async (item) => ({
      ...item,
      resultado: await buscarSerie(item.serie, item.nome),
    }))
  );

  const payload: Record<string, unknown> = {
    atualizadoEm: new Date().toISOString(),
    fonte: 'Banco Central do Brasil (SGS)',
  };

  for (const item of resultados) {
    payload[item.chave] = item.resultado;
  }

  return NextResponse.json(payload, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
