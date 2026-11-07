import type { Metadata } from 'next';
import Link from 'next/link';
import PaginaUtil from '@/components/conteudo/PaginaUtil';
import BlocoTexto from '@/components/conteudo/BlocoTexto';
import TabelaIndices from '@/components/dados/TabelaIndices';

export const metadata: Metadata = {
  title: 'Índices de Reajuste de Aluguel | IGP-M, IPCA e INCC | ARC LAR',
  description:
    'Compare os principais índices de reajuste de aluguel: IGP-M, IPCA, INCC, IVAR e IGP-DI. Veja o que cada um mede e onde consultar.',
  alternates: {
    canonical: 'https://arclar.com.br/dados-e-indices/indices-reajuste-aluguel',
  },
  openGraph: {
    title: 'Índices de Reajuste de Aluguel | ARC LAR',
    description: 'Entenda e compare os índices usados em contratos de locação.',
    url: 'https://arclar.com.br/dados-e-indices/indices-reajuste-aluguel',
    images: [{ url: '/logo.png', width: 600, height: 200, alt: 'ARC LAR' }],
  },
};

const indices = [
  {
    nome: 'IGP-M',
    mede: 'Preços ao atacado, ao consumidor e da construção civil.',
    uso: 'Muito usado em contratos de aluguel residencial e comercial.',
    fonte: 'FGV',
  },
  {
    nome: 'IPCA',
    mede: 'Inflação oficial ao consumidor, com base em uma cesta de produtos e serviços.',
    uso: 'Usado em contratos de aluguel e em diversos reajustes.',
    fonte: 'IBGE',
  },
  {
    nome: 'INCC',
    mede: 'Custos de materiais, mão de obra e serviços da construção civil.',
    uso: 'Comum em contratos de obra, incorporação e compra na planta.',
    fonte: 'FGV',
  },
  {
    nome: 'IVAR',
    mede: 'Variação dos aluguéis residenciais em algumas capitais.',
    uso: 'Usado por alguns contratos e para acompanhar o mercado de locação.',
    fonte: 'FGV',
  },
  {
    nome: 'IGP-DI',
    mede: 'Preços amplos, com abrangência nacional e foco no atacado.',
    uso: 'Contratos diversos, inclusive locações comerciais.',
    fonte: 'FGV',
  },
];

export default function IndicesReajustePage() {
  return (
    <PaginaUtil
      icone="📈"
      titulo="Índices de Reajuste de Aluguel"
      subtitulo="Entenda o que cada índice mede, onde ele é mais usado e como conferir a variação acumulada antes de aplicar um reajuste."
      breadcrumb={[
        { label: 'Dados e Índices', href: '/dados-e-indices' },
        { label: 'Índices de reajuste de aluguel' },
      ]}
    >
      <section style={{ marginBottom: 28 }}>
        <TabelaIndices />
      </section>

      <BlocoTexto titulo="Principais índices" icone="📋">
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14, minWidth: 640 }}>
            <thead>
              <tr style={{ background: '#F1F5F9', textAlign: 'left' }}>
                <th style={{ padding: '12px 14px', color: '#102B50', borderBottom: '1px solid #E2E8F0' }}>
                  Índice
                </th>
                <th style={{ padding: '12px 14px', color: '#102B50', borderBottom: '1px solid #E2E8F0' }}>
                  O que mede
                </th>
                <th style={{ padding: '12px 14px', color: '#102B50', borderBottom: '1px solid #E2E8F0' }}>
                  Uso comum
                </th>
                <th style={{ padding: '12px 14px', color: '#102B50', borderBottom: '1px solid #E2E8F0' }}>
                  Fonte
                </th>
              </tr>
            </thead>
            <tbody>
              {indices.map((indice) => (
                <tr key={indice.nome}>
                  <td style={{ padding: '12px 14px', color: '#102B50', fontWeight: 700, borderBottom: '1px solid #F1F5F9' }}>
                    {indice.nome}
                  </td>
                  <td style={{ padding: '12px 14px', color: '#334155', borderBottom: '1px solid #F1F5F9' }}>
                    {indice.mede}
                  </td>
                  <td style={{ padding: '12px 14px', color: '#334155', borderBottom: '1px solid #F1F5F9' }}>
                    {indice.uso}
                  </td>
                  <td style={{ padding: '12px 14px', color: '#475569', borderBottom: '1px solid #F1F5F9' }}>
                    {indice.fonte}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </BlocoTexto>

      <BlocoTexto titulo="Como escolher o índice do contrato" icone="🧭">
        <ul style={{ margin: 0, paddingLeft: 22 }}>
          <li style={{ marginBottom: 6 }}>
            O índice deve estar previsto expressamente no contrato, com o período de reajuste.
          </li>
          <li style={{ marginBottom: 6 }}>
            Compare o histórico e a volatilidade de cada índice antes de fechar a locação.
          </li>
          <li style={{ marginBottom: 6 }}>
            Para aluguel residencial, IGP-M e IPCA são os mais comuns; contratos comerciais podem usar
            outros índices.
          </li>
          <li>
            Na falta de índice pactuado, a negociação entre as partes e a legislação aplicável definem o
            reajuste.
          </li>
        </ul>
      </BlocoTexto>

      <BlocoTexto titulo="Cuidados na hora de reajustar" icone="⚠️">
        <ul style={{ margin: 0, paddingLeft: 22 }}>
          <li style={{ marginBottom: 6 }}>
            Respeite o intervalo mínimo de 12 meses, salvo previsão legal ou contratual específica.
          </li>
          <li style={{ marginBottom: 6 }}>
            Use o acumulado do período de aniversário do contrato, não apenas os últimos 12 meses
            divulgados.
          </li>
          <li style={{ marginBottom: 6 }}>Documente o cálculo e comunique o locatário por escrito.</li>
          <li>
            Em contratos comerciais e casos de renovação, verifique regras próprias antes de aplicar o
            índice.
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
          <div style={{ color: '#F5A900', fontSize: 17, fontWeight: 800 }}>Calcule o reajuste agora</div>
          <div style={{ marginTop: 4, color: '#cbd5e1', fontSize: 14 }}>
            Use a calculadora para simular o novo valor do aluguel com o percentual escolhido.
          </div>
        </div>
        <Link
          href="/dados-e-indices/calculadora-igpm"
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
          Abrir calculadora
        </Link>
      </div>

      <p style={{ margin: '20px 0 0', color: '#94a3b8', fontSize: 12, lineHeight: 1.6 }}>
        Dados de IGP-M e IPCA consultados no Banco Central do Brasil. Os demais índices podem ser
        consultados diretamente nos sites da FGV e do IBGE. Este conteúdo é informativo e não substitui
        orientação jurídica.
      </p>
    </PaginaUtil>
  );
}
