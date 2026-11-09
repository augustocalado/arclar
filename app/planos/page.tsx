import type { Metadata } from 'next';
import Link from 'next/link';
import { listarPlanos } from '@/lib/supabase/planos';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Planos e Preços – Anuncie seus imóveis no ARC LAR',
  description: 'Escolha o plano ideal para anunciar seus imóveis no ARC LAR. Do plano gratuito ao plano imobiliária completo.',
};

const CORES_PLANOS: Record<string, string> = {
  gratuito: '#6B7280',
  basico: '#102B50',
  profissional: '#F5A900',
  imobiliaria: '#102B50',
};

const planosFallback = [
  {
    id: 'gratuito',
    nome: 'Gratuito',
    preco: 0,
    desc: 'Para quem quer começar sem investimento',
    cor: '#6B7280',
    destaque: false,
    features: [
      'Até 3 imóveis anunciados',
      'Página básica do anunciante',
      'Recebimento de contatos',
      'Fotos nos anúncios',
      'Suporte por e-mail',
    ],
    nao_incluso: ['Destaques', 'Estatísticas', 'CRM', 'Múltiplos usuários'],
  },
  {
    id: 'basico',
    nome: 'Básico',
    preco: 89,
    desc: 'Para corretores autônomos e proprietários',
    cor: '#102B50',
    destaque: false,
    features: [
      'Até 20 imóveis anunciados',
      'Painel de desempenho',
      'Gestão de contatos/leads',
      'Fotos e vídeos nos anúncios',
      '1 destaque por mês',
      'Suporte prioritário',
    ],
    nao_incluso: ['CRM avançado', 'Múltiplos usuários', 'Relatórios avançados'],
  },
  {
    id: 'profissional',
    nome: 'Profissional',
    preco: 249,
    desc: 'Para corretores e pequenas imobiliárias',
    cor: '#F5A900',
    destaque: true,
    features: [
      'Até 100 imóveis anunciados',
      'CRM de leads integrado',
      'Estatísticas avançadas',
      '5 destaques por mês',
      'Importação XML',
      'Relatórios de desempenho',
      'Suporte VIP',
      'Perfil destaque no portal',
    ],
    nao_incluso: ['Múltiplos usuários', 'Gestão de equipe'],
  },
  {
    id: 'imobiliaria',
    nome: 'Imobiliária',
    preco: 549,
    desc: 'Para imobiliárias e redes de corretores',
    cor: '#102B50',
    destaque: false,
    features: [
      'Carteira ilimitada de imóveis',
      'Múltiplos usuários (até 20)',
      'Gestão completa de equipe',
      'CRM avançado com histórico',
      'Relatórios e analytics',
      'Destaques ilimitados',
      'Importação XML automática',
      'Integração com portais',
      'Gerente de conta dedicado',
      'Treinamento da equipe',
    ],
    nao_incluso: [],
  },
];

async function montarPlanos() {
  const planosDb = (await listarPlanos()).filter((plano) => plano.ativo);

  if (planosDb.length === 0) {
    return planosFallback;
  }

  return planosDb.map((plano) => ({
    id: plano.id,
    nome: plano.nome,
    preco: plano.preco_mensal,
    desc: plano.descricao,
    cor: CORES_PLANOS[plano.id] || '#102B50',
    destaque: plano.id === 'profissional',
    features: plano.features,
    nao_incluso: [
      plano.destaque_incluso === 0 ? 'Destaques' : null,
      !plano.crm ? 'CRM' : null,
      !plano.importacao_xml ? 'Importação XML' : null,
      !plano.relatorios ? 'Relatórios avançados' : null,
      !plano.multi_usuarios ? 'Múltiplos usuários' : null,
    ].filter((item): item is string => Boolean(item)),
  }));
}

export default async function PlanosPage() {
  const planos = await montarPlanos();

  return (
    <div style={{ background: '#F5F7FA', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #102B50, #1a3f70)', padding: '64px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <span style={{ background: 'rgba(245,169,0,0.15)', color: '#F5A900', padding: '6px 18px', borderRadius: 20, fontSize: 13, fontWeight: 700, border: '1px solid rgba(245,169,0,0.3)' }}>
            💼 Planos e preços
          </span>
          <h1 style={{ color: 'white', fontSize: 'clamp(24px, 4vw, 44px)', fontWeight: 900, margin: '16px 0 12px' }}>
            Escolha o plano ideal para você
          </h1>
          <p style={{ color: '#94a3b8', fontSize: 16, lineHeight: 1.6 }}>
            Do anúncio gratuito à gestão completa da sua imobiliária. Sem taxa de adesão.
          </p>
        </div>
      </div>

      {/* Cards de planos */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px' }}>
        <div className="grid-planos" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24, alignItems: 'start' }}>
          {planos.map(plano => (
            <div
              key={plano.id}
              className="plano-card"
              style={{
                background: 'white',
                borderRadius: 16,
                padding: 28,
                border: plano.destaque ? `3px solid ${plano.cor}` : '1px solid #E5E7EB',
                position: 'relative',
                boxShadow: plano.destaque ? '0 16px 48px rgba(245,169,0,0.2)' : '0 4px 16px rgba(0,0,0,0.05)',
                transform: plano.destaque ? 'scale(1.03)' : 'scale(1)',
              }}
            >
              {plano.destaque && (
                <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: '#F5A900', color: '#102B50', padding: '4px 20px', borderRadius: 20, fontSize: 13, fontWeight: 800, whiteSpace: 'nowrap' }}>
                  ⭐ Mais popular
                </div>
              )}

              <div style={{ marginBottom: 20 }}>
                <h2 style={{ color: '#102B50', fontSize: 22, fontWeight: 800, marginBottom: 4 }}>{plano.nome}</h2>
                <p style={{ color: '#6B7280', fontSize: 14 }}>{plano.desc}</p>
              </div>

              <div style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4 }}>
                  <span style={{ color: '#374151', fontSize: 15, fontWeight: 500 }}>R$</span>
                  <span style={{ color: '#102B50', fontSize: 42, fontWeight: 900, lineHeight: 1 }}>
                    {plano.preco === 0 ? '0' : plano.preco.toLocaleString('pt-BR')}
                  </span>
                  {plano.preco > 0 && <span style={{ color: '#6B7280', fontSize: 15, marginBottom: 6 }}>/mês</span>}
                </div>
                {plano.preco === 0 && <span style={{ color: '#059669', fontWeight: 700, fontSize: 14 }}>Sempre grátis!</span>}
              </div>

              <Link
                href={`/cadastro?plano=${plano.id}`}
                style={{
                  display: 'block',
                  textAlign: 'center',
                  background: plano.destaque ? '#F5A900' : '#102B50',
                  color: plano.destaque ? '#102B50' : 'white',
                  textDecoration: 'none',
                  padding: '14px',
                  borderRadius: 10,
                  fontWeight: 800,
                  fontSize: 15,
                  marginBottom: 24,
                  transition: 'opacity 0.2s',
                }}
              >
                {plano.preco === 0 ? 'Começar grátis' : `Assinar ${plano.nome}`}
              </Link>

              <div>
                <div style={{ color: '#374151', fontSize: 13, fontWeight: 700, marginBottom: 12 }}>✅ Incluído:</div>
                {plano.features.map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 8 }}>
                    <span style={{ color: '#059669', fontSize: 14, flexShrink: 0 }}>✓</span>
                    <span style={{ color: '#374151', fontSize: 14 }}>{f}</span>
                  </div>
                ))}
                {plano.nao_incluso.length > 0 && (
                  <>
                    <div style={{ color: '#9CA3AF', fontSize: 13, fontWeight: 700, marginTop: 12, marginBottom: 8 }}>❌ Não incluído:</div>
                    {plano.nao_incluso.map(f => (
                      <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 6 }}>
                        <span style={{ color: '#D1D5DB', fontSize: 14, flexShrink: 0 }}>✗</span>
                        <span style={{ color: '#9CA3AF', fontSize: 14 }}>{f}</span>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div style={{ marginTop: 64, background: 'white', borderRadius: 16, padding: 40, border: '1px solid #E5E7EB' }}>
          <h2 style={{ color: '#102B50', fontSize: 24, fontWeight: 800, marginBottom: 32, textAlign: 'center' }}>
            Perguntas frequentes
          </h2>
          <div className="grid-faq" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
            {[
              { p: 'Posso cancelar a qualquer momento?', r: 'Sim! Sem fidelidade. Você pode cancelar ou mudar de plano a qualquer momento, diretamente no seu painel.' },
              { p: 'Como funciona o pagamento?', r: 'Aceitamos cartão de crédito, boleto e PIX. O plano é renovado automaticamente a cada mês.' },
              { p: 'Quanto tempo leva para meu anúncio aparecer?', r: 'Assim que cadastrado, seu imóvel fica visível em até 1 hora. Imóveis do plano gratuito passam por revisão em até 24h.' },
              { p: 'Posso anunciar em qualquer cidade do Brasil?', r: 'Sim! O ARC LAR é nacional. Você pode anunciar imóveis em qualquer cidade brasileira.' },
              { p: 'O que é o destaque?', r: 'Imóveis em destaque aparecem no topo das buscas e na homepage do ARC LAR, aumentando muito a visibilidade.' },
              { p: 'O plano Imobiliária tem limite de usuários?', r: 'O plano Imobiliária inclui até 20 usuários. Para redes maiores, entre em contato para um plano personalizado.' },
            ].map(item => (
              <div key={item.p} style={{ background: '#F8FAFC', borderRadius: 10, padding: 20 }}>
                <div style={{ color: '#102B50', fontWeight: 700, fontSize: 15, marginBottom: 8 }}>❓ {item.p}</div>
                <div style={{ color: '#374151', fontSize: 14, lineHeight: 1.6 }}>{item.r}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA final */}
        <div style={{ marginTop: 48, textAlign: 'center' }}>
          <p style={{ color: '#6B7280', fontSize: 16, marginBottom: 20 }}>
            Dúvidas? Nossa equipe está pronta para ajudar.
          </p>
          <Link href="/contato" style={{ background: '#102B50', color: 'white', textDecoration: 'none', padding: '14px 36px', borderRadius: 10, fontWeight: 700, fontSize: 15 }}>
            Fale com nossa equipe
          </Link>
        </div>
      </div>
    </div>
  );
}

