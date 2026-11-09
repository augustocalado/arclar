import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import BuscaHero from '@/components/busca/BuscaHero';
import CardImovel from '@/components/imoveis/CardImovel';
import { CIDADES_DESTAQUE } from '@/lib/utils';
import { listarImoveis } from '@/lib/supabase/imoveis';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'ARC LAR – Seu novo endereço está aqui!',
  description: 'Encontre o imóvel ideal para comprar ou alugar em todo o Brasil. Milhares de oportunidades no ARC LAR.',
  alternates: {
    canonical: 'https://arclar.com.br',
  },
};

export default async function HomePage() {
  const [destaques, todos] = await Promise.all([
    listarImoveis({ destaque: true }),
    listarImoveis(),
  ]);

  const imoveisDestaque = destaques.slice(0, 6);
  const imoveisRecentes = todos.slice(0, 6);

  // Schema.org RealEstateAgent / WebSite para SEO e Google Search Console
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    name: 'ARC LAR',
    description: 'Portal Imobiliário Nacional. Milhares de oportunidades para comprar, vender e alugar em todo o Brasil.',
    url: 'https://arclar.com.br',
    slogan: 'Seu novo endereço está aqui!',
    logo: 'https://arclar.com.br/logo.png',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://arclar.com.br/imoveis?local={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ===== HERO / BANNER PRINCIPAL ===== */}
      <section
        style={{
          position: 'relative',
          minHeight: '580px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #102B50 0%, #1a3f70 50%, #0d2240 100%)',
        }}
      >
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <Image
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80"
            alt="Imóvel moderno ARC LAR"
            fill
            style={{ objectFit: 'cover', opacity: 0.25 }}
            priority
            sizes="100vw"
          />
        </div>

        {/* Efeito decorativo de fundo */}
        <div aria-hidden style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none', overflow: 'hidden' }}>
          <div
            className="hero-glow hero-glow-1"
            style={{
              position: 'absolute',
              top: '-12%',
              right: '-6%',
              width: 440,
              height: 440,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(245,169,0,0.16) 0%, rgba(245,169,0,0) 72%)',
            }}
          />
          <div
            className="hero-glow hero-glow-2"
            style={{
              position: 'absolute',
              bottom: '-18%',
              left: '-10%',
              width: 560,
              height: 560,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(96,165,250,0.14) 0%, rgba(96,165,250,0) 72%)',
            }}
          />
          <svg
            className="hero-onda"
            viewBox="0 0 1440 220"
            preserveAspectRatio="none"
            style={{ position: 'absolute', bottom: -1, left: 0, width: '100%', height: 120, display: 'block' }}
          >
            <path
              d="M0,120 C240,45 480,195 720,120 C960,45 1200,195 1440,120 L1440,220 L0,220 Z"
              fill="rgba(255,255,255,0.022)"
            />
            <path
              d="M0,170 C260,105 500,230 740,170 C980,105 1220,230 1440,170 L1440,220 L0,220 Z"
              fill="rgba(245,169,0,0.03)"
            />
          </svg>

          {/* Borda inferior curva */}
          <svg
            className="hero-curva"
            viewBox="0 0 1440 270"
            preserveAspectRatio="none"
            style={{ position: 'absolute', bottom: -1, left: 0, width: '100%', height: 270, display: 'block' }}
          >
            <path
              d="M0,225 C420,225 1020,270 1440,270 L1440,270 L0,270 Z"
              fill="#ffffff"
            />
          </svg>
        </div>

        <div style={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: 1280, margin: '0 auto', padding: '60px 24px 96px', textAlign: 'center' }}>
          <div style={{ marginBottom: 12 }}>
            <span style={{ background: 'rgba(245,169,0,0.15)', color: '#F5A900', padding: '6px 18px', borderRadius: 20, fontSize: 13, fontWeight: 700, border: '1px solid rgba(245,169,0,0.3)', letterSpacing: 1, textTransform: 'uppercase' }}>
              Portal Imobiliário Nacional
            </span>
          </div>
          <h1 style={{ color: 'white', fontSize: 'clamp(28px, 5vw, 52px)', fontWeight: 900, marginBottom: 16, lineHeight: 1.15, textShadow: '0 2px 20px rgba(0,0,0,0.3)' }}>
            Encontre o imóvel ideal para<br />
            <span style={{ color: '#F5A900' }}>sua próxima história.</span>
          </h1>
          <p style={{ color: '#94a3b8', fontSize: 'clamp(15px, 2.5vw, 20px)', marginBottom: 40, maxWidth: 600, margin: '0 auto 40px', lineHeight: 1.6 }}>
            Milhares de oportunidades para comprar, vender e alugar em todo o Brasil.
          </p>

          <BuscaHero />

          <div style={{ display: 'flex', gap: 40, justifyContent: 'center', marginTop: 36, flexWrap: 'wrap' }}>
            {[
              { valor: '50.000+', label: 'Imóveis anunciados' },
              { valor: '1.200+', label: 'Imobiliárias parceiras' },
              { valor: '500', label: 'Cidades atendidas' },
              { valor: '98%', label: 'Clientes satisfeitos' },
            ].map(stat => (
              <div key={stat.label} style={{ textAlign: 'center' }}>
                <div style={{ color: '#F5A900', fontSize: 'clamp(20px, 3vw, 28px)', fontWeight: 900 }}>{stat.valor}</div>
                <div style={{ color: '#94a3b8', fontSize: 13, marginTop: 2 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== IMÓVEIS EM DESTAQUE ===== */}
      <section style={{ background: 'white', padding: '64px 24px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 36, flexWrap: 'wrap', gap: 16 }}>
            <div>
              <span style={{ color: '#F5A900', fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>⭐ Em destaque</span>
              <h2 style={{ color: '#102B50', fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 800, marginTop: 6 }}>
                Imóveis em Destaque
              </h2>
              <p style={{ color: '#6B7280', fontSize: 15, marginTop: 6 }}>Selecionados especialmente para você</p>
            </div>
            <Link href="/imoveis?destaque=true" className="btn-ver-mais" style={{ color: '#102B50', fontWeight: 600, textDecoration: 'none', fontSize: 14, border: '2px solid #102B50', padding: '10px 24px', borderRadius: 8, transition: 'all 0.2s', display: 'inline-block' }}>
              Ver todos os destaques →
            </Link>
          </div>
          <div className="grid-imoveis" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
            {imoveisDestaque.map(imovel => (
              <CardImovel key={imovel.id} imovel={imovel} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== CIDADES POPULARES ===== */}
      <section style={{ background: '#F5F7FA', padding: '64px 24px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <span style={{ color: '#F5A900', fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>📍 Explore por cidade</span>
            <h2 style={{ color: '#102B50', fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 800, marginTop: 8 }}>
              Cidades com mais imóveis
            </h2>
            <p style={{ color: '#6B7280', fontSize: 15, marginTop: 8 }}>Busque oportunidades nas maiores cidades do Brasil</p>
          </div>
          <div className="grid-cidades" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20 }}>
            {CIDADES_DESTAQUE.map(cidade => (
              <Link
                key={cidade.slug}
                href={`/cidade/${cidade.slug}`}
                className="card-cidade"
                style={{ textDecoration: 'none', display: 'block', borderRadius: 12, overflow: 'hidden', position: 'relative', height: 180, boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}
              >
                <Image
                  src={cidade.foto}
                  alt={cidade.nome}
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(16,43,80,0.9) 0%, rgba(16,43,80,0.3) 60%, transparent 100%)' }} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px 14px' }}>
                  <div style={{ color: 'white', fontWeight: 800, fontSize: 16 }}>{cidade.nome}</div>
                  <div style={{ color: '#F5A900', fontSize: 13, fontWeight: 600, marginTop: 2 }}>{cidade.total.toLocaleString('pt-BR')} imóveis</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== IMÓVEIS RECENTES ===== */}
      <section style={{ background: 'white', padding: '64px 24px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 36, flexWrap: 'wrap', gap: 16 }}>
            <div>
              <span style={{ color: '#F5A900', fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>🆕 Recém chegaram</span>
              <h2 style={{ color: '#102B50', fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 800, marginTop: 6 }}>
                Lançamentos e Novidades
              </h2>
            </div>
            <Link href="/imoveis" style={{ color: '#102B50', fontWeight: 600, textDecoration: 'none', fontSize: 14 }}>
              Ver todos os imóveis →
            </Link>
          </div>
          <div className="grid-imoveis" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
            {imoveisRecentes.map(imovel => (
              <CardImovel key={imovel.id} imovel={imovel} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== SEÇÃO PARA ANUNCIANTES ===== */}
      <section style={{ background: 'linear-gradient(135deg, #102B50 0%, #1a3f70 100%)', padding: '72px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <span style={{ color: '#F5A900', fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>💼 Para anunciantes</span>
          <h2 style={{ color: 'white', fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: 900, marginTop: 12, marginBottom: 16 }}>
            Você tem imóveis para anunciar?
          </h2>
          <p style={{ color: '#94a3b8', fontSize: 'clamp(15px, 2vw, 18px)', lineHeight: 1.7, marginBottom: 36 }}>
            Encontre compradores e inquilinos para seus imóveis com o ARC LAR.<br />
            Mais de 500.000 buscas por mês de pessoas que querem comprar ou alugar.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/anunciar" className="btn-anunciar" style={{ background: '#F5A900', color: '#102B50', textDecoration: 'none', fontWeight: 800, fontSize: 16, padding: '16px 36px', borderRadius: 10, display: 'inline-block', transition: 'background 0.2s, transform 0.1s' }}>
              🏠 ANUNCIE SEU IMÓVEL
            </Link>
            <Link href="/planos" className="btn-planos" style={{ background: 'transparent', color: '#F5A900', textDecoration: 'none', fontWeight: 700, fontSize: 16, padding: '16px 36px', borderRadius: 10, border: '2px solid #F5A900', display: 'inline-block', transition: 'all 0.2s' }}>
              Ver planos e preços
            </Link>
          </div>
        </div>
      </section>

      {/* ===== BENEFÍCIOS PARA IMOBILIÁRIAS ===== */}
      <section style={{ background: '#F5F7FA', padding: '72px 24px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <span style={{ color: '#F5A900', fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>🏢 Para corretores e imobiliárias</span>
            <h2 style={{ color: '#102B50', fontSize: 'clamp(22px, 3vw, 36px)', fontWeight: 800, marginTop: 10 }}>
              Tudo que você precisa para vender mais
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
            {[
              { emoji: '📡', titulo: 'Mais visibilidade', desc: 'Seus imóveis aparecem para milhares de compradores e locatários em todo o Brasil todos os dias.' },
              { emoji: '🌎', titulo: 'Divulgação nacional', desc: 'Alcance clientes em qualquer estado do Brasil com anúncios profissionais e bem posicionados.' },
              { emoji: '📋', titulo: 'Gestão de imóveis', desc: 'Painel completo para cadastrar, editar e gerenciar toda sua carteira de imóveis com facilidade.' },
              { emoji: '📩', titulo: 'Receba contatos', desc: 'Leads qualificados direto no seu painel, com histórico, dados e origem de cada contato.' },
              { emoji: '📊', titulo: 'Estatísticas', desc: 'Veja quantas pessoas visualizaram cada anúncio e tome decisões estratégicas com dados reais.' },
              { emoji: '💻', titulo: 'Painel profissional', desc: 'Área exclusiva com CRM, relatórios, gestão de equipe e todas as ferramentas que sua imobiliária precisa.' },
            ].map(item => (
              <div
                key={item.titulo}
                className="card-beneficio"
                style={{ background: 'white', borderRadius: 12, padding: 28, border: '1px solid #E5E7EB', cursor: 'default' }}
              >
                <div style={{ fontSize: 36, marginBottom: 16 }}>{item.emoji}</div>
                <h3 style={{ color: '#102B50', fontSize: 18, fontWeight: 700, marginBottom: 10 }}>{item.titulo}</h3>
                <p style={{ color: '#6B7280', fontSize: 14, lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 36 }}>
            <Link
              href="/parceiros"
              style={{
                background: '#F5A900',
                color: '#102B50',
                textDecoration: 'none',
                fontWeight: 800,
                fontSize: 15,
                padding: '14px 32px',
                borderRadius: 10,
                display: 'inline-block',
              }}
            >
              🤝 Quero ser parceiro
            </Link>
          </div>
        </div>
      </section>

      {/* ===== TIPOS DE IMÓVEIS ===== */}
      <section style={{ background: 'white', padding: '64px 24px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2 style={{ color: '#102B50', fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 800 }}>
              Encontre por tipo de imóvel
            </h2>
          </div>
          <div className="grid-tipos" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 16 }}>
            {[
              { tipo: 'apartamento', label: 'Apartamentos', emoji: '🏢' },
              { tipo: 'casa', label: 'Casas', emoji: '🏠' },
              { tipo: 'cobertura', label: 'Coberturas', emoji: '🏙️' },
              { tipo: 'studio', label: 'Studios', emoji: '🛋️' },
              { tipo: 'terreno', label: 'Terrenos', emoji: '🌿' },
              { tipo: 'comercial', label: 'Comercial', emoji: '🏪' },
              { tipo: 'sala', label: 'Salas', emoji: '💼' },
              { tipo: 'galpao', label: 'Galpões', emoji: '🏭' },
              { tipo: 'chacara', label: 'Chácaras', emoji: '🌾' },
              { tipo: 'flat', label: 'Flats', emoji: '🏨' },
            ].map(item => (
              <Link
                key={item.tipo}
                href={`/imoveis?tipo=${item.tipo}`}
                className="card-tipo"
                style={{ background: 'white', borderRadius: 12, padding: '20px 16px', textAlign: 'center', textDecoration: 'none', border: '2px solid #E5E7EB', display: 'block' }}
              >
                <div style={{ fontSize: 32, marginBottom: 8 }}>{item.emoji}</div>
                <div style={{ color: '#102B50', fontSize: 13, fontWeight: 700 }}>{item.label}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
