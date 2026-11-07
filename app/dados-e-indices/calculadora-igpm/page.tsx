import type { Metadata } from 'next';
import Link from 'next/link';
import PaginaUtil from '@/components/conteudo/PaginaUtil';
import BlocoTexto from '@/components/conteudo/BlocoTexto';
import CalculadoraIgpm from '@/components/dados/CalculadoraIgpm';

export const metadata: Metadata = {
  title: 'Calculadora IGP-M: reajuste de aluguel | ARC LAR',
  description:
    'Calcule o reajuste do aluguel pelo IGP-M. Informe o valor atual e o percentual acumulado para ver o novo valor e o aumento.',
  alternates: {
    canonical: 'https://arclar.com.br/dados-e-indices/calculadora-igpm',
  },
  openGraph: {
    title: 'Calculadora IGP-M | ARC LAR',
    description: 'Simule o reajuste do aluguel pelo IGP-M de forma simples.',
    url: 'https://arclar.com.br/dados-e-indices/calculadora-igpm',
    images: [{ url: '/logo.png', width: 600, height: 200, alt: 'ARC LAR' }],
  },
};

export default function CalculadoraIgpmPage() {
  return (
    <PaginaUtil
      icone="🧮"
      titulo="Calculadora IGP-M"
      subtitulo="Simule o novo valor do aluguel a partir do percentual de reajuste acumulado no período de aniversário do contrato."
      breadcrumb={[{ label: 'Dados e Índices', href: '/dados-e-indices' }, { label: 'Calculadora IGP-M' }]}
    >
      <CalculadoraIgpm />

      <BlocoTexto titulo="Como o cálculo funciona" icone="📐">
        <p style={{ marginTop: 0, marginBottom: 0 }}>
          O cálculo aplica o percentual de reajuste sobre o valor atual do aluguel:{' '}
          <strong>novo valor = valor atual × (1 + percentual ÷ 100)</strong>. Se o índice acumulado for
          negativo, o novo valor pode ficar abaixo do atual. O botão “Usar este índice” preenche o campo com
          a variação acumulada dos últimos 12 meses divulgada pelo Banco Central, mas o período correto é o
          do aniversário do seu contrato.
        </p>
      </BlocoTexto>

      <BlocoTexto titulo="O que é o IGP-M" icone="📈">
        <p style={{ marginTop: 0, marginBottom: 0 }}>
          O Índice Geral de Preços – Mercado (IGP-M) é calculado pela Fundação Getulio Vargas (FGV) e
          costuma ser usado em contratos de aluguel. Ele mede a variação de preços no atacado, no varejo e
          no setor de construção. Por ser um índice de mercado, pode apresentar oscilações maiores do que o
          IPCA.
        </p>
      </BlocoTexto>

      <BlocoTexto titulo="Antes de aplicar o reajuste" icone="⚠️">
        <ul style={{ margin: 0, paddingLeft: 22 }}>
          <li style={{ marginBottom: 6 }}>Confira o índice e o período definidos no contrato.</li>
          <li style={{ marginBottom: 6 }}>
            Verifique se já passaram 12 meses desde o último reajuste ou desde o início da locação.
          </li>
          <li style={{ marginBottom: 6 }}>
            Comunique o locatário por escrito, com o cálculo e o índice utilizado.
          </li>
          <li>
            Em caso de dúvida sobre a validade da cláusula, procure orientação jurídica antes de cobrar o
            novo valor.
          </li>
        </ul>
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
          <div style={{ color: '#F5A900', fontSize: 17, fontWeight: 800 }}>Compare com outros índices</div>
          <div style={{ marginTop: 4, color: '#cbd5e1', fontSize: 14 }}>
            Veja IGP-M, IPCA e outros índices usados em contratos de locação.
          </div>
        </div>
        <Link
          href="/dados-e-indices/indices-reajuste-aluguel"
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
          Ver índices de reajuste
        </Link>
      </div>

      <p style={{ margin: '20px 0 0', color: '#94a3b8', fontSize: 12, lineHeight: 1.6 }}>
        Ferramenta informativa. O ARC LAR não se responsabiliza por decisões tomadas com base apenas nos
        valores simulados. Confirme o índice e o período no contrato e consulte um profissional habilitado
        quando necessário.
      </p>
    </PaginaUtil>
  );
}
