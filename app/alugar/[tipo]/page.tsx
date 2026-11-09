import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { listarImoveis } from '@/lib/supabase/imoveis';
import CardImovel from '@/components/imoveis/CardImovel';
import BuscaCompacta from '@/components/busca/BuscaCompacta';
import { formatarTipoImovel } from '@/lib/utils';
import type { TipoImovel } from '@/types';

export const dynamic = 'force-dynamic';

const TIPOS_VALIDOS: Record<string, TipoImovel> = {
  casa: 'casa',
  casas: 'casa',
  apartamento: 'apartamento',
  apartamentos: 'apartamento',
  chacara: 'chacara',
  chacaras: 'chacara',
  sitio: 'sitio',
  sitios: 'sitio',
  fazenda: 'fazenda',
  fazendas: 'fazenda',
  terreno: 'terreno',
  terrenos: 'terreno',
  comercial: 'comercial',
  cobertura: 'cobertura',
  coberturas: 'cobertura',
  studio: 'studio',
  studios: 'studio',
  flat: 'flat',
  flats: 'flat',
  sala: 'sala',
  salas: 'sala',
  galpao: 'galpao',
  galpoes: 'galpao',
};

interface Props {
  params: Promise<{ tipo: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tipo: rawTipo } = await params;
  const tipoNormalizado = TIPOS_VALIDOS[rawTipo.toLowerCase()];
  if (!tipoNormalizado) {
    return { title: 'Imóveis para Alugar | ARC LAR' };
  }
  const nome = formatarTipoImovel(tipoNormalizado);
  return {
    title: `${nome}s para Alugar | Locação de ${nome} no Brasil | ARC LAR`,
    description: `Encontre as melhores opções de ${nome.toLowerCase()}s para alugar em todo o Brasil. Alugue com segurança, fotos reais e contato direto com anunciantes no ARC LAR.`,
    alternates: {
      canonical: `https://arclar.com.br/alugar/${rawTipo.toLowerCase()}`,
    },
  };
}

export default async function AlugarPorTipoPage({ params }: Props) {
  const { tipo: rawTipo } = await params;
  const tipoNormalizado = TIPOS_VALIDOS[rawTipo.toLowerCase()];

  if (!tipoNormalizado) {
    notFound();
  }

  const nomeTipo = formatarTipoImovel(tipoNormalizado);
  // Filtro rigoroso: SOMENTE ALUGUEL e SOMENTE ESTE TIPO (sem misturar com compra)
  const imoveis = await listarImoveis({
    negocio: 'aluguel',
    tipo: tipoNormalizado,
  });

  return (
    <div style={{ background: '#F5F7FA', minHeight: '100vh' }}>
      <div style={{ background: 'linear-gradient(135deg, #102B50, #1a3f70)', padding: '48px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <nav style={{ marginBottom: 12 }}>
            <Link href="/" style={{ color: '#94a3b8', fontSize: 13, textDecoration: 'none' }}>Início</Link>
            <span style={{ color: '#475569', margin: '0 8px' }}>›</span>
            <Link href="/alugar" style={{ color: '#94a3b8', fontSize: 13, textDecoration: 'none' }}>Alugar</Link>
            <span style={{ color: '#475569', margin: '0 8px' }}>›</span>
            <span style={{ color: '#F5A900', fontSize: 13, fontWeight: 700 }}>{nomeTipo}s</span>
          </nav>
          <h1 style={{ color: 'white', fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: 900, marginBottom: 10 }}>
            {nomeTipo}s para Alugar
          </h1>
          <p style={{ color: '#94a3b8', fontSize: 16 }}>
            {imoveis.length} {imoveis.length === 1 ? `${nomeTipo.toLowerCase()} disponível` : `${nomeTipo.toLowerCase()}s disponíveis`} para locação
          </p>
          <BuscaCompacta negocioInicial="aluguel" />
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 24px' }}>
        {imoveis.length === 0 ? (
          <div style={{ background: 'white', borderRadius: 16, padding: '48px 24px', textAlign: 'center', border: '1px solid #E5E7EB' }}>
            <div style={{ fontSize: 44, marginBottom: 14 }}>🔑</div>
            <h2 style={{ color: '#102B50', fontSize: 20, fontWeight: 800, marginBottom: 8 }}>
              Nenhum(a) {nomeTipo.toLowerCase()} para alugar no momento
            </h2>
            <p style={{ color: '#64748b', fontSize: 14, marginBottom: 20 }}>
              Você pode conferir todos os imóveis para alugar ou buscar por outra categoria.
            </p>
            <Link
              href="/alugar"
              style={{
                display: 'inline-block',
                background: '#102B50',
                color: 'white',
                padding: '12px 24px',
                borderRadius: 8,
                textDecoration: 'none',
                fontWeight: 700,
                fontSize: 14,
              }}
            >
              Ver todos os imóveis para alugar →
            </Link>
          </div>
        ) : (
          <div className="grid-imoveis" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
            {imoveis.map(imovel => <CardImovel key={imovel.id} imovel={imovel} />)}
          </div>
        )}
      </div>
    </div>
  );
}

