import type { Metadata } from 'next';
import Link from 'next/link';
import PaginaUtil from '@/components/conteudo/PaginaUtil';
import BlocoTexto from '@/components/conteudo/BlocoTexto';
import CalculadoraMetroQuadrado from '@/components/dados/CalculadoraMetroQuadrado';

export const metadata: Metadata = {
  title: 'Valor do Metro Quadrado: calculadora e como avaliar | ARC LAR',
  description:
    'Calcule o valor do metro quadrado de um imóvel e estime o valor total pela área. Entenda os fatores que influenciam o preço por m².',
  alternates: {
    canonical: 'https://arclar.com.br/dados-e-indices/valor-metro-quadrado',
  },
  openGraph: {
    title: 'Valor do Metro Quadrado | ARC LAR',
    description: 'Calculadora de valor por m² e estimativa de valor total do imóvel.',
    url: 'https://arclar.com.br/dados-e-indices/valor-metro-quadrado',
    images: [{ url: '/logo.png', width: 600, height: 200, alt: 'ARC LAR' }],
  },
};

export default function ValorMetroQuadradoPage() {
  return (
    <PaginaUtil
      icone="📐"
      titulo="Valor do Metro Quadrado"
      subtitulo="Calcule o preço por metro quadrado de um imóvel e use a área para estimar o valor total com base na região."
      breadcrumb={[
        { label: 'Dados e Índices', href: '/dados-e-indices' },
        { label: 'Valor metro quadrado' },
      ]}
    >
      <CalculadoraMetroQuadrado />

      <BlocoTexto titulo="Como o valor do m² é calculado" icone="🧮">
        <p style={{ marginTop: 0, marginBottom: 0 }}>
          O valor por metro quadrado é obtido dividindo o valor total do imóvel pela área considerada:{' '}
          <strong>valor por m² = valor total ÷ área</strong>. Para estimar o valor total, faça o caminho
          inverso: <strong>valor total = área × valor por m²</strong>. O resultado é uma referência e não
          substitui uma avaliação profissional.
        </p>
      </BlocoTexto>

      <BlocoTexto titulo="Fatores que influenciam o preço por m²" icone="📍">
        <ul style={{ margin: 0, paddingLeft: 22 }}>
          <li style={{ marginBottom: 6 }}>Localização, bairro, infraestrutura e proximidade de serviços.</li>
          <li style={{ marginBottom: 6 }}>Estado de conservação, idade do imóvel e padrão de acabamento.</li>
          <li style={{ marginBottom: 6 }}>Área útil, área total, quantidade de vagas e lazer.</li>
          <li style={{ marginBottom: 6 }}>Segurança, mobilidade, escolas e transporte público.</li>
          <li>Oferta e demanda na região e momento do mercado imobiliário.</li>
        </ul>
      </BlocoTexto>

      <BlocoTexto titulo="Onde pesquisar valores de referência" icone="🔎">
        <ul style={{ margin: 0, paddingLeft: 22 }}>
          <li style={{ marginBottom: 6 }}>
            Anúncios de imóveis semelhantes na mesma região, como os do{' '}
            <Link href="/imoveis" style={{ color: '#102B50', fontWeight: 700 }}>
              portal ARC LAR
            </Link>
            .
          </li>
          <li style={{ marginBottom: 6 }}>
            Índices de mercado, como o FipeZap, para acompanhar a variação média por cidade.
          </li>
          <li style={{ marginBottom: 6 }}>Dados do IBGE e da prefeitura sobre o bairro e a região.</li>
          <li>Avaliação de um corretor ou engenheiro habilitado para casos específicos.</li>
        </ul>
      </BlocoTexto>

      <BlocoTexto titulo="Área útil x área total" icone="📏">
        <p style={{ marginTop: 0, marginBottom: 0 }}>
          A área útil considera o espaço interno utilizável; a área total pode incluir paredes, varandas,
          garagem e áreas comuns. O mesmo imóvel pode ter valores por m² diferentes conforme a área usada no
          cálculo. Na comparação com outros imóveis, use sempre a mesma base para evitar distorções.
        </p>
      </BlocoTexto>

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
          <div style={{ color: '#F5A900', fontSize: 17, fontWeight: 800 }}>Compare imóveis na sua região</div>
          <div style={{ marginTop: 4, color: '#cbd5e1', fontSize: 14 }}>
            Veja anúncios com área, preço e localização para encontrar o melhor valor por m².
          </div>
        </div>
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
      </div>

      <p style={{ margin: '20px 0 0', color: '#94a3b8', fontSize: 12, lineHeight: 1.6 }}>
        Os cálculos são estimativas. Para laudos, financiamentos e decisões de compra e venda, consulte um
        avaliador ou corretor habilitado.
      </p>
    </PaginaUtil>
  );
}
