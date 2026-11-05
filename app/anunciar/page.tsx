import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Anunciar Imóvel – Comece a vender e alugar hoje',
  description: 'Anuncie seu imóvel no ARC LAR e alcance milhares de compradores e locatários em todo o Brasil. Plano gratuito disponível.',
};

export default function AnunciarPage() {
  return (
    <div style={{ background: '#F5F7FA', minHeight: '100vh' }}>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #102B50, #1a3f70)', padding: '72px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <h1 style={{ color: 'white', fontSize: 'clamp(28px, 5vw, 52px)', fontWeight: 900, marginBottom: 16, lineHeight: 1.2 }}>
            Anuncie seu imóvel e<br />
            <span style={{ color: '#F5A900' }}>alcance todo o Brasil</span>
          </h1>
          <p style={{ color: '#94a3b8', fontSize: 18, lineHeight: 1.7, marginBottom: 36 }}>
            Mais de 500.000 buscas mensais de pessoas querendo comprar ou alugar.<br />
            Comece grátis agora mesmo.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/cadastro?plano=gratuito" style={{ background: '#F5A900', color: '#102B50', textDecoration: 'none', fontWeight: 800, fontSize: 16, padding: '16px 36px', borderRadius: 10 }}>
              🏠 Anunciar gratuitamente
            </Link>
            <Link href="/planos" style={{ background: 'transparent', color: '#F5A900', textDecoration: 'none', fontWeight: 700, fontSize: 16, padding: '16px 36px', borderRadius: 10, border: '2px solid #F5A900' }}>
              Ver todos os planos
            </Link>
          </div>
        </div>
      </div>

      {/* Como funciona */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '72px 24px' }}>
        <h2 style={{ color: '#102B50', fontSize: 'clamp(22px, 3vw, 36px)', fontWeight: 800, textAlign: 'center', marginBottom: 48 }}>
          Como anunciar no ARC LAR
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 32, textAlign: 'center' }}>
          {[
            { num: '01', emoji: '👤', titulo: 'Crie sua conta', desc: 'Cadastre-se gratuitamente como proprietário, corretor ou imobiliária em menos de 2 minutos.' },
            { num: '02', emoji: '🏠', titulo: 'Cadastre o imóvel', desc: 'Preencha as informações, adicione fotos e defina o preço. Fácil e rápido.' },
            { num: '03', emoji: '🌎', titulo: 'Publique e apareça', desc: 'Seu imóvel fica visível para milhares de interessados em todo o Brasil.' },
            { num: '04', emoji: '📩', titulo: 'Receba contatos', desc: 'Leads chegam direto no seu painel e pelo WhatsApp. É só atender!' },
          ].map(item => (
            <div key={item.num} style={{ position: 'relative' }}>
              <div style={{ width: 72, height: 72, background: 'linear-gradient(135deg, #102B50, #1a3f70)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 32 }}>
                {item.emoji}
              </div>
              <div style={{ position: 'absolute', top: -8, right: 'calc(50% - 48px)', background: '#F5A900', color: '#102B50', fontSize: 11, fontWeight: 900, padding: '2px 8px', borderRadius: 20 }}>{item.num}</div>
              <h3 style={{ color: '#102B50', fontSize: 18, fontWeight: 700, marginBottom: 10 }}>{item.titulo}</h3>
              <p style={{ color: '#6B7280', fontSize: 14, lineHeight: 1.6 }}>{item.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', marginTop: 56 }}>
          <Link href="/cadastro" style={{ background: '#102B50', color: 'white', textDecoration: 'none', fontWeight: 800, fontSize: 16, padding: '16px 48px', borderRadius: 10 }}>
            Começar agora →
          </Link>
        </div>
      </div>
    </div>
  );
}

