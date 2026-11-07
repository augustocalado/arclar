import type { Metadata } from 'next';
import Link from 'next/link';
import PaginaUtil from '@/components/conteudo/PaginaUtil';
import BlocoTexto from '@/components/conteudo/BlocoTexto';

export const metadata: Metadata = {
  title: 'Valor Venal do Imóvel: o que é e como consultar | ARC LAR',
  description:
    'Entenda o que é valor venal, como ele é calculado, a diferença para o valor de mercado e onde consultar o valor venal do seu imóvel.',
  alternates: {
    canonical: 'https://arclar.com.br/dados-e-indices/valor-venal',
  },
  openGraph: {
    title: 'Valor Venal do Imóvel | ARC LAR',
    description: 'Saiba como o valor venal é usado no IPTU e no ITBI e onde consultá-lo.',
    url: 'https://arclar.com.br/dados-e-indices/valor-venal',
    images: [{ url: '/logo.png', width: 600, height: 200, alt: 'ARC LAR' }],
  },
};

export default function ValorVenalPage() {
  return (
    <PaginaUtil
      icone="🏛️"
      titulo="Valor Venal do Imóvel"
      subtitulo="Entenda o valor venal usado pela prefeitura, a diferença em relação ao valor de mercado e como consultar a base do IPTU e do ITBI."
      breadcrumb={[{ label: 'Dados e Índices', href: '/dados-e-indices' }, { label: 'Valor venal' }]}
    >
      <BlocoTexto titulo="O que é valor venal" icone="📘">
        <p style={{ marginTop: 0, marginBottom: 0 }}>
          O valor venal é o valor atribuído ao imóvel pelo município para fins tributários. Ele serve de
          base para o cálculo do IPTU e, em muitos municípios, é usado como referência para o ITBI na
          transmissão do imóvel. É definido por lei municipal e calculado pela prefeitura com base em
          critérios como área, localização, tipo de imóvel, padrão construtivo e valorização da região.
        </p>
      </BlocoTexto>

      <BlocoTexto titulo="Valor venal x valor de mercado" icone="⚖️">
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14, minWidth: 520 }}>
            <thead>
              <tr style={{ background: '#F1F5F9', textAlign: 'left' }}>
                <th style={{ padding: '12px 14px', color: '#102B50', borderBottom: '1px solid #E2E8F0' }}>
                  Critério
                </th>
                <th style={{ padding: '12px 14px', color: '#102B50', borderBottom: '1px solid #E2E8F0' }}>
                  Valor venal
                </th>
                <th style={{ padding: '12px 14px', color: '#102B50', borderBottom: '1px solid #E2E8F0' }}>
                  Valor de mercado
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '12px 14px', color: '#102B50', fontWeight: 700, borderBottom: '1px solid #F1F5F9' }}>
                  Quem define
                </td>
                <td style={{ padding: '12px 14px', color: '#334155', borderBottom: '1px solid #F1F5F9' }}>
                  Prefeitura, por critérios legais
                </td>
                <td style={{ padding: '12px 14px', color: '#334155', borderBottom: '1px solid #F1F5F9' }}>
                  Negociação entre comprador e vendedor
                </td>
              </tr>
              <tr>
                <td style={{ padding: '12px 14px', color: '#102B50', fontWeight: 700, borderBottom: '1px solid #F1F5F9' }}>
                  Finalidade
                </td>
                <td style={{ padding: '12px 14px', color: '#334155', borderBottom: '1px solid #F1F5F9' }}>
                  Base para IPTU e, conforme o município, ITBI
                </td>
                <td style={{ padding: '12px 14px', color: '#334155', borderBottom: '1px solid #F1F5F9' }}>
                  Preço efetivo de compra e venda
                </td>
              </tr>
              <tr>
                <td style={{ padding: '12px 14px', color: '#102B50', fontWeight: 700, borderBottom: '1px solid #F1F5F9' }}>
                  Atualização
                </td>
                <td style={{ padding: '12px 14px', color: '#334155', borderBottom: '1px solid #F1F5F9' }}>
                  Periodicamente, conforme a legislação municipal
                </td>
                <td style={{ padding: '12px 14px', color: '#334155', borderBottom: '1px solid #F1F5F9' }}>
                  Varia conforme o mercado e a negociação
                </td>
              </tr>
              <tr>
                <td style={{ padding: '12px 14px', color: '#102B50', fontWeight: 700 }}>
                  Onde consultar
                </td>
                <td style={{ padding: '12px 14px', color: '#334155' }}>
                  Carnê do IPTU e portal da prefeitura
                </td>
                <td style={{ padding: '12px 14px', color: '#334155' }}>
                  Anúncios, corretores e avaliações
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </BlocoTexto>

      <BlocoTexto titulo="Como o valor venal é calculado" icone="🧮">
        <p style={{ marginTop: 0 }}>
          Cada município tem sua própria fórmula. Em geral, entram no cálculo:
        </p>
        <ul style={{ margin: 0, paddingLeft: 22 }}>
          <li style={{ marginBottom: 6 }}>Área do terreno e área construída.</li>
          <li style={{ marginBottom: 6 }}>Localização e valorização da região.</li>
          <li style={{ marginBottom: 6 }}>Tipo e padrão de construção.</li>
          <li style={{ marginBottom: 6 }}>Estado de conservação e idade do imóvel.</li>
          <li>Fatores de correção previstos na legislação municipal.</li>
        </ul>
        <p style={{ margin: '12px 0 0', color: '#64748b', fontSize: 13 }}>
          Por isso, o valor venal pode ser menor ou maior que o preço de mercado. Ele não deve ser usado
          sozinho para definir o preço de venda.
        </p>
      </BlocoTexto>

      <BlocoTexto titulo="Onde consultar o valor venal" icone="🔎">
        <ul style={{ margin: 0, paddingLeft: 22 }}>
          <li style={{ marginBottom: 6 }}>Carnê ou guia do IPTU do imóvel.</li>
          <li style={{ marginBottom: 6 }}>
            Portal da prefeitura, na área de tributação, IPTU ou avaliação de imóveis.
          </li>
          <li style={{ marginBottom: 6 }}>Central de atendimento da Secretaria de Fazenda municipal.</li>
          <li>
            No ITBI, o valor venal de referência pode aparecer na guia de recolhimento do imposto.
          </li>
        </ul>
      </BlocoTexto>

      <BlocoTexto titulo="Valor venal e a compra do imóvel" icone="🏠">
        <p style={{ marginTop: 0, marginBottom: 0 }}>
          O ITBI é calculado sobre a base definida pelo município, que pode ser o valor venal, o valor da
          transação ou o maior entre eles. Antes de fechar a compra, confira a regra da sua cidade e simule
          o imposto. Na escritura, o valor declarado e a base de cálculo precisam estar corretos para evitar
          problemas no registro.
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
          <div style={{ color: '#F5A900', fontSize: 17, fontWeight: 800 }}>Vai comprar ou registrar o imóvel?</div>
          <div style={{ marginTop: 4, color: '#cbd5e1', fontSize: 14 }}>
            Veja o passo a passo da escritura e encontre imóveis na sua região.
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Link
            href="/guias/escritura-do-imovel"
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
            Guia da escritura
          </Link>
          <Link
            href="/imoveis"
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
            Buscar imóveis
          </Link>
        </div>
      </div>

      <p style={{ margin: '20px 0 0', color: '#94a3b8', fontSize: 12, lineHeight: 1.6 }}>
        O valor venal é definido por cada município. Consulte a prefeitura da sua cidade para obter o valor
        oficial e a regra de cálculo aplicável ao seu imóvel.
      </p>
    </PaginaUtil>
  );
}
