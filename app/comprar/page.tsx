import type { Metadata } from 'next';
import Link from 'next/link';
import { IMOVEIS_MOCK } from '@/lib/utils';
import CardImovel from '@/components/imoveis/CardImovel';

export const metadata: Metadata = {
  title: 'Comprar Imóvel – Casas e Apartamentos à Venda',
  description: 'Encontre casas, apartamentos, terrenos e imóveis comerciais à venda em todo o Brasil no ARC LAR.',
};

export default function ComprarPage() {
  const imoveis = IMOVEIS_MOCK.filter(i => i.negocio === 'venda');
  return (
    <div style={{ background: '#F5F7FA', minHeight: '100vh' }}>
      <div style={{ background: 'linear-gradient(135deg, #102B50, #1a3f70)', padding: '48px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <nav style={{ marginBottom: 12 }}>
            <Link href="/" style={{ color: '#94a3b8', fontSize: 13, textDecoration: 'none' }}>Início</Link>
            <span style={{ color: '#475569', margin: '0 8px' }}>›</span>
            <span style={{ color: '#F5A900', fontSize: 13 }}>Comprar</span>
          </nav>
          <h1 style={{ color: 'white', fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: 900, marginBottom: 10 }}>
            Imóveis à Venda
          </h1>
          <p style={{ color: '#94a3b8', fontSize: 16 }}>{imoveis.length} imóveis disponíveis para compra em todo o Brasil</p>
        </div>
      </div>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
          {imoveis.map(imovel => <CardImovel key={imovel.id} imovel={imovel as any} />)}
        </div>
      </div>
    </div>
  );
}

