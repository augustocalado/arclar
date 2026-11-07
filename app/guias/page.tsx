import type { Metadata } from 'next';
import PaginaUtil from '@/components/conteudo/PaginaUtil';
import CartaoLink from '@/components/conteudo/CartaoLink';

export const metadata: Metadata = {
  title: 'Guias do Imóvel | Escritura e Lei do Inquilino | ARC LAR',
  description:
    'Guias práticos sobre escritura do imóvel, registro, documentos, lei do inquilino, direitos e deveres na locação.',
  alternates: {
    canonical: 'https://arclar.com.br/guias',
  },
  openGraph: {
    title: 'Guias do Imóvel | ARC LAR',
    description: 'Informações práticas para comprar, vender, alugar e regularizar seu imóvel.',
    url: 'https://arclar.com.br/guias',
    images: [{ url: '/logo.png', width: 600, height: 200, alt: 'ARC LAR' }],
  },
};

export default function GuiasPage() {
  return (
    <PaginaUtil
      icone="📖"
      titulo="Guias do Imóvel"
      subtitulo="Conteúdos práticos para você entender documentos, direitos e etapas de uma negociação imobiliária."
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 16,
          marginBottom: 28,
        }}
      >
        <CartaoLink
          href="/guias/escritura-do-imovel"
          titulo="Escritura do imóvel"
          descricao="O que é a escritura, documentos necessários, custos, registro em cartório e diferenças entre escritura e matrícula."
          emoji="📜"
          destaque
        />
        <CartaoLink
          href="/guias/lei-do-inquilino"
          titulo="Lei do inquilino"
          descricao="Direitos e deveres de locador e locatário, reajuste, renovação, rescisão, multa e vistoria."
          emoji="⚖️"
        />
        <CartaoLink
          href="/seja-corretor"
          titulo="Seja corretor"
          descricao="Requisitos, benefícios e passo a passo para corretores e imobiliárias anunciarem no ARC LAR."
          emoji="💼"
        />
        <CartaoLink
          href="/dados-e-indices"
          titulo="Dados e índices"
          descricao="Calculadoras de IGP-M e metro quadrado, índices de reajuste e valor venal."
          emoji="📊"
        />
      </div>

      <section
        style={{
          padding: '24px clamp(18px, 3vw, 30px)',
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: 16,
          boxShadow: '0 2px 10px rgba(15, 23, 42, 0.04)',
        }}
      >
        <h2 style={{ margin: '0 0 12px', color: '#102B50', fontSize: 22, fontWeight: 800 }}>
          Como usar nossos guias
        </h2>
        <p style={{ margin: '0 0 12px', color: '#334155', fontSize: 15, lineHeight: 1.8 }}>
          Os guias do ARC LAR foram feitos para quem está comprando, vendendo, alugando ou regularizando
          um imóvel. Cada página resume as etapas mais importantes e indica quando é necessário buscar um
          profissional habilitado.
        </p>
        <ul style={{ margin: 0, paddingLeft: 22, color: '#334155', fontSize: 15, lineHeight: 1.9 }}>
          <li>Entenda os documentos e custos antes de assinar qualquer contrato.</li>
          <li>Confira direitos e deveres para evitar problemas na locação.</li>
          <li>Use as calculadoras para simular reajustes e valores de mercado.</li>
          <li>Consulte sempre um advogado, corretor ou contador em casos específicos.</li>
        </ul>
      </section>

      <p style={{ margin: '20px 0 0', color: '#94a3b8', fontSize: 12, lineHeight: 1.6 }}>
        Conteúdo informativo. As regras podem variar conforme o município, o contrato e a legislação
        vigente. Não substitui assessoria jurídica ou técnica especializada.
      </p>
    </PaginaUtil>
  );
}
