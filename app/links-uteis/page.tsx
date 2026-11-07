import type { Metadata } from 'next';
import Link from 'next/link';
import PaginaUtil from '@/components/conteudo/PaginaUtil';
import CartaoLink from '@/components/conteudo/CartaoLink';

export const metadata: Metadata = {
  title: 'Links Úteis | Guias, Calculadoras e Índices | ARC LAR',
  description:
    'Reúna guias sobre escritura e lei do inquilino, calculadoras de IGP-M e valor do metro quadrado, índices de reajuste de aluguel e valor venal.',
  alternates: {
    canonical: 'https://arclar.com.br/links-uteis',
  },
  openGraph: {
    title: 'Links Úteis | ARC LAR',
    description: 'Guias, calculadoras e índices para decisões imobiliárias mais seguras.',
    url: 'https://arclar.com.br/links-uteis',
    images: [{ url: '/logo.png', width: 600, height: 200, alt: 'ARC LAR' }],
  },
};

const grupos = [
  {
    titulo: 'Guias e documentos',
    descricao: 'Entenda as etapas, documentos e direitos envolvidos em uma negociação imobiliária.',
    itens: [
      {
        href: '/guias/escritura-do-imovel',
        titulo: 'Escritura do imóvel',
        descricao: 'O que é, documentos necessários, custos e diferença entre escritura e registro.',
        emoji: '📜',
      },
      {
        href: '/guias/lei-do-inquilino',
        titulo: 'Lei do inquilino',
        descricao: 'Direitos e deveres de locador e locatário, reajuste, rescisão e vistoria.',
        emoji: '⚖️',
      },
    ],
  },
  {
    titulo: 'Dados e índices',
    descricao: 'Ferramentas para calcular reajustes, comparar índices e avaliar valores de imóveis.',
    itens: [
      {
        href: '/dados-e-indices/calculadora-igpm',
        titulo: 'Calculadora IGP-M',
        descricao: 'Calcule o novo valor do aluguel com base no percentual acumulado do período.',
        emoji: '🧮',
      },
      {
        href: '/dados-e-indices/indices-reajuste-aluguel',
        titulo: 'Índices de reajuste de aluguel',
        descricao: 'Compare IGP-M, IPCA, INCC e outros índices usados em contratos de locação.',
        emoji: '📈',
      },
      {
        href: '/dados-e-indices/valor-metro-quadrado',
        titulo: 'Valor metro quadrado',
        descricao: 'Descubra o valor por m² ou estime o valor total de um imóvel pela área.',
        emoji: '📐',
      },
      {
        href: '/dados-e-indices/valor-venal',
        titulo: 'Valor venal',
        descricao: 'Entenda o valor venal usado no IPTU e no ITBI e como consultá-lo na prefeitura.',
        emoji: '🏛️',
      },
    ],
  },
  {
    titulo: 'Carreira e parcerias',
    descricao: 'Para corretores, imobiliárias e profissionais que querem crescer com o ARC LAR.',
    itens: [
      {
        href: '/seja-corretor',
        titulo: 'Seja corretor',
        descricao: 'Conheça os benefícios, requisitos e o passo a passo para anunciar seus imóveis.',
        emoji: '💼',
      },
      {
        href: '/parceiros',
        titulo: 'Links para parceiros',
        descricao: 'Central de contato, planos e suporte exclusivo para parceiros.',
        emoji: '🤝',
      },
    ],
  },
];

export default function LinksUteisPage() {
  return (
    <PaginaUtil
      icone="📚"
      titulo="Links Úteis"
      subtitulo="Guias práticos, calculadoras e índices oficiais para comprar, vender, alugar e administrar imóveis com mais segurança."
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 16,
          marginBottom: 32,
        }}
      >
        <CartaoLink
          href="/guias"
          titulo="Guias ARC LAR"
          descricao="Conteúdos explicativos sobre escritura, locação e documentação imobiliária."
          emoji="📖"
          destaque
        />
        <CartaoLink
          href="/dados-e-indices"
          titulo="Dados e Índices"
          descricao="Calculadoras e índices do Banco Central atualizados para reajustes e avaliações."
          emoji="📊"
        />
        <CartaoLink
          href="/seja-corretor"
          titulo="Seja corretor parceiro"
          descricao="Divulgue seus imóveis, receba leads e gerencie tudo em um só painel."
          emoji="🚀"
        />
      </div>

      {grupos.map((grupo) => (
        <section key={grupo.titulo} style={{ marginBottom: 36 }}>
          <h2 style={{ margin: '0 0 6px', color: '#102B50', fontSize: 'clamp(20px, 2.6vw, 26px)', fontWeight: 800 }}>
            {grupo.titulo}
          </h2>
          <p style={{ margin: '0 0 16px', color: '#64748b', fontSize: 14, lineHeight: 1.6 }}>{grupo.descricao}</p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: 16,
            }}
          >
            {grupo.itens.map((item) => (
              <CartaoLink key={item.href} {...item} />
            ))}
          </div>
        </section>
      ))}

      <div
        style={{
          padding: '22px clamp(18px, 3vw, 28px)',
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
          <div style={{ color: '#F5A900', fontSize: 17, fontWeight: 800 }}>Precisa de ajuda com seu imóvel?</div>
          <div style={{ marginTop: 4, color: '#cbd5e1', fontSize: 14 }}>
            Fale com um parceiro do ARC LAR ou cadastre seu anúncio gratuitamente.
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Link
            href="/imoveis"
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
            Buscar imóveis
          </Link>
          <Link
            href="/parceiros"
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
            Falar com parceiro
          </Link>
        </div>
      </div>

      <p style={{ margin: '20px 0 0', color: '#94a3b8', fontSize: 12, lineHeight: 1.6 }}>
        Os conteúdos são informativos e não substituem a análise de um advogado, contador ou corretor
        habilitado. Índices oficiais são consultados no Banco Central do Brasil.
      </p>
    </PaginaUtil>
  );
}
