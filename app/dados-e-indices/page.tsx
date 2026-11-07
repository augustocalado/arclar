import type { Metadata } from 'next';
import PaginaUtil from '@/components/conteudo/PaginaUtil';
import CartaoLink from '@/components/conteudo/CartaoLink';
import TabelaIndices from '@/components/dados/TabelaIndices';

export const metadata: Metadata = {
  title: 'Dados e Índices Imobiliários | IGP-M, IPCA e m² | ARC LAR',
  description:
    'Índices de reajuste de aluguel atualizados, calculadora de IGP-M, valor do metro quadrado e valor venal do imóvel.',
  alternates: {
    canonical: 'https://arclar.com.br/dados-e-indices',
  },
  openGraph: {
    title: 'Dados e Índices | ARC LAR',
    description: 'Calculadoras e índices oficiais para reajustes e avaliações imobiliárias.',
    url: 'https://arclar.com.br/dados-e-indices',
    images: [{ url: '/logo.png', width: 600, height: 200, alt: 'ARC LAR' }],
  },
};

export default function DadosEIndicesPage() {
  return (
    <PaginaUtil
      icone="📊"
      titulo="Dados e Índices"
      subtitulo="Acompanhe os índices usados nos contratos de aluguel, calcule reajustes e entenda os valores que influenciam a avaliação de um imóvel."
    >
      <section style={{ marginBottom: 32 }}>
        <h2 style={{ margin: '0 0 6px', color: '#102B50', fontSize: 'clamp(20px, 2.6vw, 26px)', fontWeight: 800 }}>
          Índices em destaque
        </h2>
        <p style={{ margin: '0 0 16px', color: '#64748b', fontSize: 14, lineHeight: 1.6 }}>
          Variação acumulada nos últimos 12 meses, com dados oficiais do Banco Central do Brasil.
        </p>
        <TabelaIndices />
      </section>

      <section>
        <h2 style={{ margin: '0 0 6px', color: '#102B50', fontSize: 'clamp(20px, 2.6vw, 26px)', fontWeight: 800 }}>
          Ferramentas e conteúdos
        </h2>
        <p style={{ margin: '0 0 16px', color: '#64748b', fontSize: 14, lineHeight: 1.6 }}>
          Escolha uma ferramenta para simular valores ou entender cada índice.
        </p>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: 16,
          }}
        >
          <CartaoLink
            href="/dados-e-indices/calculadora-igpm"
            titulo="Calculadora IGP-M"
            descricao="Informe o valor do aluguel e o percentual para calcular o novo valor e o aumento."
            emoji="🧮"
            destaque
          />
          <CartaoLink
            href="/dados-e-indices/indices-reajuste-aluguel"
            titulo="Índices de reajuste de aluguel"
            descricao="Entenda IGP-M, IPCA, INCC, IVAR e como escolher o índice do contrato."
            emoji="📈"
          />
          <CartaoLink
            href="/dados-e-indices/valor-metro-quadrado"
            titulo="Valor metro quadrado"
            descricao="Calcule o preço por m² e estime o valor total de um imóvel pela área."
            emoji="📐"
          />
          <CartaoLink
            href="/dados-e-indices/valor-venal"
            titulo="Valor venal"
            descricao="Saiba o que é o valor venal, como ele é usado no IPTU e no ITBI e onde consultar."
            emoji="🏛️"
          />
        </div>
      </section>

      <div
        style={{
          marginTop: 28,
          padding: '18px 20px',
          background: '#FFF7E6',
          border: '1px solid #F5D08A',
          borderRadius: 14,
          color: '#7A4B00',
          fontSize: 13,
          lineHeight: 1.7,
        }}
      >
        <strong>Importante:</strong> os índices são referências. O reajuste válido é o que está previsto no
        contrato e no período de aniversário da locação. Consulte um profissional antes de aplicar
        alterações no aluguel.
      </div>
    </PaginaUtil>
  );
}
