import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Central de Links Oficiais | ARC LAR',
  description: 'Acesse rapidamente todas as opções do Portal ARC LAR: imóveis à venda, aluguel, anúncio grátis, planos e canais de atendimento direto.',
  alternates: {
    canonical: 'https://arclar.com.br/links',
  },
  openGraph: {
    title: 'Central de Links | ARC LAR',
    description: 'Encontre imóveis ou anuncie com máxima visibilidade.',
    url: 'https://arclar.com.br/links',
    images: [{ url: '/logo.png', width: 600, height: 200, alt: 'ARC LAR' }],
  },
};

export default function LinksPage() {
  const links = [
    {
      titulo: '🏠 Buscar Todos os Imóveis',
      descricao: 'Encontre casas, apartamentos e terrenos no Brasil todo',
      href: '/imoveis',
      destaque: true,
    },
    {
      titulo: '💰 Imóveis à Venda',
      descricao: 'Confira as melhores ofertas para compra de imóveis',
      href: '/comprar',
      destaque: false,
    },
    {
      titulo: '🔑 Imóveis para Alugar',
      descricao: 'Apartamentos e casas prontos para morar',
      href: '/alugar',
      destaque: false,
    },
    {
      titulo: '🚀 Anuncie Seu Imóvel Grátis',
      descricao: 'Cadastre seu imóvel em menos de 3 minutos no portal',
      href: '/anunciar',
      destaque: true,
    },
    {
      titulo: '💼 Planos para Corretores & Imobiliárias',
      descricao: 'Conheça nossos planos com CRM e integração XML',
      href: '/planos',
      destaque: false,
    },
    {
      titulo: '📱 Atendimento via WhatsApp',
      descricao: 'Fale diretamente com nossa equipe de suporte e vendas',
      href: 'https://wa.me/5511999999999?text=Olá!%20Vim%20pela%20página%20de%20links%20do%20ARC%20LAR.',
      destaque: false,
      external: true,
    },
    {
      titulo: '🔐 Entrar / Painel do Anunciante',
      descricao: 'Acesse seu painel profissional e gerencie seus anúncios',
      href: '/login',
      destaque: false,
    },
  ];

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #102B50 0%, #0a1f3a 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 16px',
      }}
    >
      <div style={{ maxWidth: 520, width: '100%', textAlign: 'center' }}>
        {/* Logotipo Central */}
        <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'center' }}>
          <Link href="/">
            <Image
              src="/logo.png"
              alt="ARC LAR - Portal Imobiliário"
              width={200}
              height={65}
              style={{ objectFit: 'contain' }}
              priority
            />
          </Link>
        </div>

        <h1 style={{ color: '#FFFFFF', fontSize: 24, fontWeight: 800, margin: '0 0 6px' }}>
          ARC LAR
        </h1>
        <p style={{ color: '#F5A900', fontSize: 14, fontWeight: 600, margin: '0 0 10px', letterSpacing: 0.5 }}>
          Seu novo endereço está aqui!
        </p>
        <p style={{ color: '#94a3b8', fontSize: 13, marginBottom: 32, lineHeight: 1.5 }}>
          Acesse os principais serviços do nosso portal imobiliário nacional através dos links oficiais abaixo:
        </p>

        {/* Lista de Links */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {links.map((item, idx) => (
            <Link
              key={idx}
              href={item.href}
              target={item.external ? '_blank' : undefined}
              rel={item.external ? 'noopener noreferrer' : undefined}
              style={{
                display: 'block',
                background: item.destaque ? '#F5A900' : 'rgba(255, 255, 255, 0.08)',
                color: item.destaque ? '#102B50' : '#FFFFFF',
                borderRadius: 14,
                padding: '16px 20px',
                textDecoration: 'none',
                border: item.destaque ? '2px solid #F5A900' : '1px solid rgba(255, 255, 255, 0.15)',
                boxShadow: item.destaque ? '0 8px 24px rgba(245, 169, 0, 0.25)' : '0 4px 12px rgba(0, 0, 0, 0.2)',
                transition: 'transform 0.2s, background 0.2s',
              }}
              className="card-link-item"
            >
              <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 4 }}>
                {item.titulo}
              </div>
              <div style={{ fontSize: 12, opacity: item.destaque ? 0.9 : 0.75, fontWeight: 500 }}>
                {item.descricao}
              </div>
            </Link>
          ))}
        </div>

        {/* Footer do Link Page */}
        <div style={{ marginTop: 40, borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 20 }}>
          <p style={{ color: '#64748b', fontSize: 12, margin: 0 }}>
            © {new Date().getFullYear()} ARC LAR — Todos os direitos reservados.
          </p>
          <div style={{ marginTop: 8, display: 'flex', justifyContent: 'center', gap: 16 }}>
            <Link href="/" style={{ color: '#F5A900', fontSize: 12, textDecoration: 'none' }}>
              Página Inicial
            </Link>
            <span style={{ color: '#475569' }}>•</span>
            <Link href="/planos" style={{ color: '#94a3b8', fontSize: 12, textDecoration: 'none' }}>
              Planos
            </Link>
            <span style={{ color: '#475569' }}>•</span>
            <Link href="/imoveis" style={{ color: '#94a3b8', fontSize: 12, textDecoration: 'none' }}>
              Imóveis
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

