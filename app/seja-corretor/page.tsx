import type { Metadata } from 'next';
import Link from 'next/link';
import PaginaUtil from '@/components/conteudo/PaginaUtil';
import BlocoTexto from '@/components/conteudo/BlocoTexto';

export const metadata: Metadata = {
  title: 'Seja Corretor Parceiro | Anuncie Imóveis no ARC LAR',
  description:
    'Corretores e imobiliárias: anunciem imóveis no ARC LAR, recebam contatos de interessados e gerenciem seus anúncios em um só painel.',
  alternates: {
    canonical: 'https://arclar.com.br/seja-corretor',
  },
  openGraph: {
    title: 'Seja Corretor Parceiro | ARC LAR',
    description: 'Condições e benefícios para corretores e imobiliárias parceiras.',
    url: 'https://arclar.com.br/seja-corretor',
    images: [{ url: '/logo.png', width: 600, height: 200, alt: 'ARC LAR' }],
  },
};

const beneficios = [
  {
    emoji: '🌎',
    titulo: 'Vitrine nacional',
    descricao: 'Seus imóveis ficam disponíveis para quem busca comprar ou alugar em todo o Brasil.',
  },
  {
    emoji: '📲',
    titulo: 'Contatos de interessados',
    descricao: 'Receba leads pelo formulário e pelos botões de WhatsApp dos anúncios.',
  },
  {
    emoji: '📊',
    titulo: 'Painel de gestão',
    descricao: 'Cadastre, edite e acompanhe seus anúncios em um painel simples e responsivo.',
  },
  {
    emoji: '💼',
    titulo: 'Planos acessíveis',
    descricao: 'Escolha o plano que faz sentido para o seu volume de imóveis e sua rotina.',
  },
  {
    emoji: '🤝',
    titulo: 'Suporte e parceria',
    descricao: 'Conte com canais diretos de atendimento para tirar dúvidas e evoluir suas vendas.',
  },
  {
    emoji: '🔗',
    titulo: 'Divulgação integrada',
    descricao: 'Use os links oficiais e materiais de divulgação do ARC LAR com seus clientes.',
  },
];

const passos = [
  {
    numero: '1',
    titulo: 'Crie sua conta',
    descricao: 'Cadastre seus dados profissionais e comece o processo de verificação.',
  },
  {
    numero: '2',
    titulo: 'Escolha um plano',
    descricao: 'Compare os planos e selecione aquele que atende ao seu volume de anúncios.',
  },
  {
    numero: '3',
    titulo: 'Publique seus imóveis',
    descricao: 'Adicione fotos, valores, localização e detalhes para atrair os interessados.',
  },
  {
    numero: '4',
    titulo: 'Atenda e negocie',
    descricao: 'Responda aos contatos, agende visitas e acompanhe o desempenho dos anúncios.',
  },
];

export default function SejaCorretorPage() {
  return (
    <PaginaUtil
      icone="💼"
      titulo="Seja Corretor Parceiro"
      subtitulo="Leve seus imóveis para o ARC LAR, receba contatos de interessados e gerencie sua carteira em um painel feito para corretores e imobiliárias."
      breadcrumb={[{ label: 'Seja corretor' }]}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
          gap: 16,
          marginBottom: 28,
        }}
      >
        {beneficios.map((beneficio) => (
          <div
            key={beneficio.titulo}
            style={{
              padding: 20,
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: 16,
              boxShadow: '0 4px 16px rgba(15, 23, 42, 0.05)',
            }}
          >
            <div aria-hidden="true" style={{ marginBottom: 10, fontSize: 28 }}>
              {beneficio.emoji}
            </div>
            <div style={{ marginBottom: 6, color: '#102B50', fontSize: 16, fontWeight: 800 }}>
              {beneficio.titulo}
            </div>
            <div style={{ color: '#475569', fontSize: 14, lineHeight: 1.65 }}>{beneficio.descricao}</div>
          </div>
        ))}
      </div>

      <BlocoTexto titulo="Como começar" icone="🪜">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 14,
          }}
        >
          {passos.map((passo) => (
            <div
              key={passo.numero}
              style={{
                padding: 16,
                background: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: 12,
              }}
            >
              <div
                style={{
                  display: 'grid',
                  placeItems: 'center',
                  width: 34,
                  height: 34,
                  marginBottom: 10,
                  borderRadius: '50%',
                  background: '#102B50',
                  color: '#F5A900',
                  fontSize: 15,
                  fontWeight: 800,
                }}
              >
                {passo.numero}
              </div>
              <div style={{ marginBottom: 4, color: '#102B50', fontSize: 15, fontWeight: 800 }}>
                {passo.titulo}
              </div>
              <div style={{ color: '#475569', fontSize: 13, lineHeight: 1.6 }}>{passo.descricao}</div>
            </div>
          ))}
        </div>
      </BlocoTexto>

      <BlocoTexto titulo="Requisitos para participar" icone="✅">
        <ul style={{ margin: 0, paddingLeft: 22 }}>
          <li style={{ marginBottom: 6 }}>
            Corretores devem ter registro ativo no CRECI da sua região.
          </li>
          <li style={{ marginBottom: 6 }}>
            Imobiliárias devem ter CNPJ ativo e responsável técnico habilitado, quando exigido.
          </li>
          <li style={{ marginBottom: 6 }}>
            As informações e fotos dos imóveis são de responsabilidade do anunciante.
          </li>
          <li>
            É necessário concordar com os termos de uso e com as regras de anúncio do ARC LAR.
          </li>
        </ul>
      </BlocoTexto>

      <BlocoTexto titulo="Dúvidas frequentes" icone="❓">
        <p style={{ marginTop: 0 }}>
          <strong>Preciso pagar para anunciar?</strong> Existem planos com condições diferentes. Consulte a{' '}
          <Link href="/planos" style={{ color: '#102B50', fontWeight: 700 }}>
            tabela de planos
          </Link>{' '}
          para ver o que está incluído em cada opção.
        </p>
        <p style={{ marginBottom: 0 }}>
          <strong>Posso divulgar meus imóveis nas redes sociais?</strong> Sim. Use os links dos seus anúncios
          e os materiais oficiais do ARC LAR para divulgar. Para condições de parceria e kit de divulgação,
          fale com a equipe em{' '}
          <Link href="/parceiros" style={{ color: '#102B50', fontWeight: 700 }}>
            Links para Parceiros
          </Link>
          .
        </p>
      </BlocoTexto>

      <div
        style={{
          padding: '24px clamp(18px, 3vw, 30px)',
          background: '#102B50',
          borderRadius: 16,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 16,
          flexWrap: 'wrap',
        }}
      >
        <div>
          <div style={{ color: '#F5A900', fontSize: 18, fontWeight: 800 }}>Pronto para começar?</div>
          <div style={{ marginTop: 4, color: '#cbd5e1', fontSize: 14 }}>
            Crie sua conta, escolha seu plano e publique seus imóveis no ARC LAR.
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Link
            href="/cadastro"
            style={{
              padding: '11px 20px',
              borderRadius: 8,
              background: '#F5A900',
              color: '#102B50',
              fontSize: 14,
              fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            Criar conta
          </Link>
          <Link
            href="/planos"
            style={{
              padding: '11px 20px',
              borderRadius: 8,
              border: '1px solid #F5A900',
              color: '#F5A900',
              fontSize: 14,
              fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            Ver planos
          </Link>
          <Link
            href="/parceiros"
            style={{
              padding: '11px 20px',
              borderRadius: 8,
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: '#FFFFFF',
              fontSize: 14,
              fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            Falar com a equipe
          </Link>
        </div>
      </div>

      <p style={{ margin: '20px 0 0', color: '#94a3b8', fontSize: 12, lineHeight: 1.6 }}>
        A parceria está sujeita à análise cadastral e às condições comerciais vigentes. O ARC LAR não
        garante volume de contatos ou vendas.
      </p>
    </PaginaUtil>
  );
}
