import type { Metadata } from 'next';
import Link from 'next/link';
import PaginaUtil from '@/components/conteudo/PaginaUtil';
import RedesSociais from '@/components/layout/RedesSociais';
import { obterConfiguracoes } from '@/lib/supabase/configuracoes';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Contato | Atendimento ARC LAR',
  description:
    'Fale com o ARC LAR. Atendimento humano de segunda a sexta, das 8h às 18h, e atendimento virtual 24 horas.',
  alternates: {
    canonical: 'https://arclar.com.br/contato',
  },
  openGraph: {
    title: 'Contato | ARC LAR',
    description: 'Atendimento humano seg a sex, das 8h às 18h. Atendimento virtual 24h.',
    url: 'https://arclar.com.br/contato',
    images: [{ url: '/logo.png', width: 600, height: 200, alt: 'ARC LAR' }],
  },
};

const NUMERO_WHATSAPP = (process.env.NEXT_PUBLIC_APP_WHATSAPP || '5511999999999').replace(/\D/g, '');
const WHATSAPP_CONTATO = `https://wa.me/${NUMERO_WHATSAPP}?text=Ol%C3%A1!%20Preciso%20de%20atendimento%20do%20ARC%20LAR.`;
const EMAIL_CONTATO = process.env.PARCEIROS_EMAIL || 'contato@arclar.com.br';

export default async function ContatoPage() {
  const configuracoes = await obterConfiguracoes();

  return (
    <PaginaUtil
      icone="📞"
      titulo="Fale com o ARC LAR"
      subtitulo="Tire dúvidas, receba ajuda com seu anúncio ou fale com nossa equipe. Confira abaixo os canais e horários de atendimento."
      breadcrumb={[{ label: 'Contato' }]}
      mostrarLinksUteis={false}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 18,
          marginBottom: 22,
        }}
      >
        <section
          style={{
            padding: '24px clamp(18px, 3vw, 28px)',
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: 16,
            boxShadow: '0 4px 16px rgba(15, 23, 42, 0.05)',
          }}
        >
          <div aria-hidden="true" style={{ marginBottom: 10, fontSize: 34 }}>
            👨‍💼
          </div>
          <h2 style={{ margin: '0 0 6px', color: '#102B50', fontSize: 22, fontWeight: 800 }}>
            Atendimento humano
          </h2>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              marginBottom: 12,
              padding: '5px 10px',
              borderRadius: 20,
              background: '#ECFDF5',
              color: '#065F46',
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            🕒 {configuracoes.atendimento_humano}
          </div>
          <p style={{ margin: '0 0 18px', color: '#475569', fontSize: 14, lineHeight: 1.7 }}>
            Nossa equipe atende de segunda a sexta, das 8h às 18h. Para agilizar, informe o código do
            imóvel ou descreva sua dúvida na primeira mensagem.
          </p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <a
              href={WHATSAPP_CONTATO}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '11px 18px',
                borderRadius: 8,
                background: '#102B50',
                color: '#FFFFFF',
                fontSize: 14,
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              💬 WhatsApp
            </a>
            <a
              href={`mailto:${EMAIL_CONTATO}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '11px 18px',
                borderRadius: 8,
                border: '1px solid #102B50',
                color: '#102B50',
                fontSize: 14,
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              ✉️ E-mail
            </a>
          </div>
        </section>

        <section
          style={{
            padding: '24px clamp(18px, 3vw, 28px)',
            background: '#102B50',
            borderRadius: 16,
            boxShadow: '0 4px 16px rgba(15, 23, 42, 0.08)',
          }}
        >
          <div aria-hidden="true" style={{ marginBottom: 10, fontSize: 34 }}>
            🤖
          </div>
          <h2 style={{ margin: '0 0 6px', color: '#FFFFFF', fontSize: 22, fontWeight: 800 }}>
            Atendimento virtual
          </h2>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              marginBottom: 12,
              padding: '5px 10px',
              borderRadius: 20,
              background: 'rgba(245, 169, 0, 0.16)',
              color: '#F5A900',
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            🌐 {configuracoes.atendimento_virtual}
          </div>
          <p style={{ margin: '0 0 18px', color: '#cbd5e1', fontSize: 14, lineHeight: 1.7 }}>
            Nosso site, guias, calculadoras e a busca de imóveis ficam disponíveis 24 horas por dia. Você
            pode pesquisar, simular valores e encontrar o imóvel ideal a qualquer momento.
          </p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <Link
              href="/imoveis"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '11px 18px',
                borderRadius: 8,
                background: '#F5A900',
                color: '#102B50',
                fontSize: 14,
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              🏠 Buscar imóveis
            </Link>
            <Link
              href="/links-uteis"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '11px 18px',
                borderRadius: 8,
                border: '1px solid #F5A900',
                color: '#F5A900',
                fontSize: 14,
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              📚 Links úteis
            </Link>
          </div>
        </section>
      </div>

      <section
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          flexWrap: 'wrap',
          padding: '20px clamp(18px, 3vw, 28px)',
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: 16,
        }}
      >
        <div>
          <h2 style={{ margin: '0 0 4px', color: '#102B50', fontSize: 18, fontWeight: 800 }}>
            Acompanhe o ARC LAR
          </h2>
          <p style={{ margin: 0, color: '#64748b', fontSize: 14 }}>
            Novidades, dicas e imóveis nas nossas redes sociais.
          </p>
        </div>
        <RedesSociais configuracoes={configuracoes} tamanho={22} cor="#102B50" />
      </section>

      <section
        style={{
          marginTop: 22,
          padding: '22px clamp(18px, 3vw, 28px)',
          background: '#F8FAFC',
          border: '1px solid #E2E8F0',
          borderRadius: 16,
        }}
      >
        <h2 style={{ margin: '0 0 10px', color: '#102B50', fontSize: 18, fontWeight: 800 }}>
          Antes de falar com a equipe
        </h2>
        <ul style={{ margin: 0, paddingLeft: 22, color: '#334155', fontSize: 14, lineHeight: 1.9 }}>
          <li>
            Consulte os <Link href="/links-uteis" style={{ color: '#102B50', fontWeight: 700 }}>links úteis</Link>{' '}
            com guias, calculadoras e índices.
          </li>
          <li>
            Para parcerias e anúncios profissionais, use a página de{' '}
            <Link href="/parceiros" style={{ color: '#102B50', fontWeight: 700 }}>parceiros</Link>.
          </li>
          <li>
            Para anunciar um imóvel, acesse{' '}
            <Link href="/anunciar" style={{ color: '#102B50', fontWeight: 700 }}>Anunciar imóvel</Link>.
          </li>
        </ul>
      </section>

      <p style={{ margin: '20px 0 0', color: '#94a3b8', fontSize: 12, lineHeight: 1.6 }}>
        Os horários podem ser ajustados pela administração do portal. Fora do horário de atendimento
        humano, deixe sua mensagem e responderemos no próximo dia útil.
      </p>
    </PaginaUtil>
  );
}
