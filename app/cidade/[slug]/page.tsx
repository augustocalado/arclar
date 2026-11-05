import type { Metadata } from 'next';
import Link from 'next/link';
import CardImovel from '@/components/imoveis/CardImovel';
import { IMOVEIS_MOCK, CIDADES_DESTAQUE } from '@/lib/utils';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const cidade = CIDADES_DESTAQUE.find(c => c.slug === slug);
  const nome = cidade?.nome || slug.replace(/-[a-z]{2}$/, '').replace(/-/g, ' ');
  return {
    title: `Imóveis em ${nome} – Comprar e Alugar`,
    description: `Encontre imóveis à venda e para alugar em ${nome}. Apartamentos, casas, terrenos e mais no ARC LAR.`,
  };
}

export default async function CidadePage({ params }: PageProps) {
  const { slug } = await params;
  const cidade = CIDADES_DESTAQUE.find(c => c.slug === slug);
  const nomeCidade = cidade?.nome || slug.replace(/-[a-z]{2}$/, '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  const siglaEstado = slug.split('-').pop()?.toUpperCase() || '';

  const imoveis = IMOVEIS_MOCK.filter(i =>
    i.endereco.cidade.toLowerCase().includes(nomeCidade.toLowerCase()) ||
    i.endereco.estado_sigla.toLowerCase() === siglaEstado.toLowerCase()
  );

  return (
    <div style={{ background: '#F5F7FA', minHeight: '100vh' }}>
      {/* Header da cidade */}
      <div style={{ background: 'linear-gradient(135deg, #102B50, #1a3f70)', padding: '48px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <nav style={{ marginBottom: 16 }}>
            <Link href="/" style={{ color: '#94a3b8', fontSize: 13, textDecoration: 'none' }}>Início</Link>
            <span style={{ color: '#475569', margin: '0 8px' }}>›</span>
            <span style={{ color: '#F5A900', fontSize: 13 }}>{nomeCidade}</span>
          </nav>
          <h1 style={{ color: 'white', fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: 900, marginBottom: 12 }}>
            Imóveis em {nomeCidade}
          </h1>
          <p style={{ color: '#94a3b8', fontSize: 16 }}>
            {imoveis.length} {imoveis.length === 1 ? 'imóvel disponível' : 'imóveis disponíveis'} em {nomeCidade}, {siglaEstado}
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 24, flexWrap: 'wrap' }}>
            <Link href={`/imoveis?negocio=venda&local=${nomeCidade}`} style={{ background: '#F5A900', color: '#102B50', textDecoration: 'none', padding: '10px 24px', borderRadius: 8, fontWeight: 700, fontSize: 14 }}>
              🏠 Comprar em {nomeCidade}
            </Link>
            <Link href={`/imoveis?negocio=aluguel&local=${nomeCidade}`} style={{ background: 'rgba(255,255,255,0.1)', color: 'white', textDecoration: 'none', padding: '10px 24px', borderRadius: 8, fontWeight: 700, fontSize: 14, border: '1px solid rgba(255,255,255,0.3)' }}>
              🔑 Alugar em {nomeCidade}
            </Link>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 24px' }}>
        {imoveis.length === 0 ? (
          <div style={{ background: 'white', borderRadius: 16, padding: 48, textAlign: 'center', border: '1px solid #E5E7EB' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
            <h2 style={{ color: '#374151', fontSize: 22, fontWeight: 700, marginBottom: 8 }}>
              Ainda não há imóveis cadastrados em {nomeCidade}
            </h2>
            <p style={{ color: '#6B7280', marginBottom: 24 }}>
              Em breve teremos anúncios nessa cidade. Enquanto isso, confira todas as opções disponíveis.
            </p>
            <Link href="/imoveis" style={{ background: '#102B50', color: 'white', textDecoration: 'none', padding: '12px 28px', borderRadius: 8, fontWeight: 700 }}>
              Ver todos os imóveis
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
            {imoveis.map(imovel => (
              <CardImovel key={imovel.id} imovel={imovel as any} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

