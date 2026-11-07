import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import FormularioParceiro from '@/components/parceiros/FormularioParceiro';

export const metadata: Metadata = {
  title: 'Links para Parceiros | ARC LAR',
  description: 'Central de links para imobiliárias, corretores e parceiros do ARC LAR. Cadastre-se, conheça os planos e fale com nossa equipe.',
  alternates: {
    canonical: 'https://arclar.com.br/parceiros',
  },
  openGraph: {
    title: 'Links para Parceiros | ARC LAR',
    description: 'Condições especiais para imobiliárias e corretores parceiros.',
    url: 'https://arclar.com.br/parceiros',
    images: [{ url: '/logo.png', width: 600, height: 200, alt: 'ARC LAR' }],
  },
};

const NUMERO_WHATSAPP = (process.env.NEXT_PUBLIC_APP_WHATSAPP || '5511999999999').replace(/\D/g, '');

const WHATSAPP_PARCEIROS = `https://wa.me/${NUMERO_WHATSAPP}?text=Ol%C3%A1!%20Quero%20ser%20parceiro%20do%20ARC%20LAR.`;
const WHATSAPP_KIT = `https://wa.me/${NUMERO_WHATSAPP}?text=Ol%C3%A1!%20Quero%20o%20kit%20de%20divulga%C3%A7%C3%A3o%20do%20ARC%20LAR.`;
const WHATSAPP_SUPORTE = `https://wa.me/${NUMERO_WHATSAPP}?text=Ol%C3%A1!%20Preciso%20de%20suporte%20como%20parceiro.`;

export default function ParceirosPage() {
  const links = [
    {
      titulo: '🤝 Quero ser parceiro',
      descricao: 'Fale com nossa equipe e receba as condições de parceria',
      href: WHATSAPP_PARCEIROS,
      destaque: true,
      external: true,
    },
    {
      titulo: '🏢 Cadastrar imobiliária',
      descricao: 'Crie sua conta e comece a anunciar seus imóveis',
      href: '/cadastro',
      destaque: false,
    },
    {
      titulo: '💼 Planos para corretores e imobiliárias',
      descricao: 'Conheça os planos, limites e benefícios',
      href: '/planos',
      destaque: false,
    },
    {
      titulo: '📣 Kit de divulgação',
      descricao: 'Solicite materiais para divulgar o ARC LAR',
      href: WHATSAPP_KIT,
      destaque: false,
      external: true,
    },
    {
      titulo: '🎧 Suporte ao parceiro',
      descricao: 'Atendimento direto com a equipe de parcerias',
      href: WHATSAPP_SUPORTE,
      destaque: false,
      external: true,
    },
    {
      titulo: '🔐 Portal do parceiro',
      descricao: 'Acesse seu painel e gerencie seus anúncios',
      href: '/login',
      destaque: false,
    },
    {
      titulo: '🔗 Central de links oficial',
      descricao: 'Todos os canais e serviços do ARC LAR',
      href: '/links',
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
      <div style={{ maxWidth: 600, width: '100%', textAlign: 'center' }}>
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
          ARC LAR Parceiros
        </h1>
        <p style={{ color: '#F5A900', fontSize: 14, fontWeight: 600, margin: '0 0 10px', letterSpacing: 0.5 }}>
          Cresça junto com o portal
        </p>
        <p style={{ color: '#94a3b8', fontSize: 13, marginBottom: 24, lineHeight: 1.5 }}>
          Preencha o formulário para falar com nossa equipe ou escolha uma opção abaixo:
        </p>

        <FormularioParceiro />

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

        <div style={{ marginTop: 40, borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 20 }}>
          <p style={{ color: '#64748b', fontSize: 12, margin: 0 }}>
            © {new Date().getFullYear()} ARC LAR — Todos os direitos reservados.
          </p>
          <div style={{ marginTop: 8, display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
            <Link href="/" style={{ color: '#F5A900', fontSize: 12, textDecoration: 'none' }}>
              Página Inicial
            </Link>
            <span style={{ color: '#475569' }}>•</span>
            <Link href="/links" style={{ color: '#94a3b8', fontSize: 12, textDecoration: 'none' }}>
              Central de Links
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
