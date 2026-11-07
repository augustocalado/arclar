import type { Metadata } from 'next';
import Link from 'next/link';
import PaginaUtil from '@/components/conteudo/PaginaUtil';
import BlocoTexto from '@/components/conteudo/BlocoTexto';

export const metadata: Metadata = {
  title: 'Escritura do Imóvel: documentos, custos e registro | ARC LAR',
  description:
    'Saiba o que é a escritura do imóvel, quais documentos são necessários, quanto custa o registro e a diferença entre escritura, matrícula e contrato.',
  alternates: {
    canonical: 'https://arclar.com.br/guias/escritura-do-imovel',
  },
  openGraph: {
    title: 'Escritura do Imóvel | ARC LAR',
    description: 'Guia completo sobre escritura, registro, documentos e custos.',
    url: 'https://arclar.com.br/guias/escritura-do-imovel',
    images: [{ url: '/logo.png', width: 600, height: 200, alt: 'ARC LAR' }],
  },
};

const documentos = [
  'Documento de identidade e CPF das partes (ou CNPJ da empresa)',
  'Certidão de estado civil atualizada (casamento, união estável, divórcio)',
  'Matrícula atualizada do imóvel, emitida pelo Registro de Imóveis',
  'Certidão negativa de ônus e débitos do imóvel',
  'Comprovantes de quitação de IPTU, condomínio e demais taxas',
  'Certidões pessoais dos vendedores (distribuidores, protestos e execuções)',
  'Comprovante de renda e documentação do financiamento, quando houver',
  'Procuração pública, se alguma parte estiver representada por terceiro',
];

const passos = [
  'Confira a matrícula e as certidões do imóvel e dos vendedores.',
  'Negocie e formalize as condições no contrato de compra e venda.',
  'Recolha o ITBI e demais tributos municipais aplicáveis.',
  'Lave a escritura pública no cartório de notas com as partes presentes.',
  'Registre a escritura na matrícula do imóvel no Registro de Imóveis.',
];

export default function EscrituraDoImovelPage() {
  return (
    <PaginaUtil
      icone="📜"
      titulo="Escritura do Imóvel"
      subtitulo="Entenda o papel da escritura pública, os documentos exigidos, os custos envolvidos e por que o registro é a etapa que garante a propriedade."
      breadcrumb={[{ label: 'Guias', href: '/guias' }, { label: 'Escritura do imóvel' }]}
    >
      <BlocoTexto titulo="O que é a escritura do imóvel" icone="📄">
        <p style={{ marginTop: 0 }}>
          A escritura pública é o instrumento lavrado por um tabelião de notas que formaliza a transferência
          de um imóvel ou a constituição de direitos sobre ele, como compra e venda, doação, permuta e
          inventário. Ela registra as condições negociadas, as partes envolvidas e o valor da transação.
        </p>
        <p style={{ marginBottom: 0 }}>
          A escritura, sozinha, não transfere a propriedade. A segurança jurídica completa acontece com o
          registro da escritura na matrícula do imóvel, no Registro de Imóveis competente.
        </p>
      </BlocoTexto>

      <BlocoTexto titulo="Escritura x registro: qual é a diferença?" icone="🔎">
        <p style={{ marginTop: 0 }}>
          A <strong>escritura</strong> é feita no cartório de notas e formaliza o negócio. O{' '}
          <strong>registro</strong> é feito no Registro de Imóveis e insere a transferência na matrícula,
          tornando o novo proprietário reconhecido perante terceiros.
        </p>
        <p style={{ marginBottom: 0 }}>
          A <strong>matrícula</strong> é a certidão que conta a história do imóvel: proprietários, ônus,
          hipotecas, penhoras, servidões e demais restrições. Consulte a matrícula atualizada antes de
          qualquer pagamento.
        </p>
      </BlocoTexto>

      <BlocoTexto titulo="Documentos mais comuns" icone="📋">
        <ul style={{ margin: 0, paddingLeft: 22 }}>
          {documentos.map((documento) => (
            <li key={documento} style={{ marginBottom: 6 }}>
              {documento}
            </li>
          ))}
        </ul>
        <p style={{ margin: '12px 0 0', color: '#64748b', fontSize: 13 }}>
          A lista pode variar conforme o cartório, o tipo de negócio e a existência de financiamento.
          Confirme os documentos com o tabelionato antes de agendar a escritura.
        </p>
      </BlocoTexto>

      <BlocoTexto titulo="Custos envolvidos" icone="💰">
        <p style={{ marginTop: 0 }}>
          Os custos variam por município e por estado. Os principais são:
        </p>
        <ul style={{ margin: 0, paddingLeft: 22 }}>
          <li style={{ marginBottom: 6 }}>
            <strong>ITBI:</strong> imposto municipal sobre a transmissão onerosa, calculado sobre o valor
            venal ou o valor da transação, conforme a regra local.
          </li>
          <li style={{ marginBottom: 6 }}>
            <strong>Emolumentos do cartório de notas:</strong> cobrados pela lavratura da escritura.
          </li>
          <li style={{ marginBottom: 6 }}>
            <strong>Registro de Imóveis:</strong> taxa cobrada para registrar a escritura na matrícula.
          </li>
          <li>
            <strong>Certidões e taxas:</strong> documentos, certidões negativas e eventual assessoria.
          </li>
        </ul>
        <p style={{ margin: '12px 0 0', color: '#64748b', fontSize: 13 }}>
          Consulte a prefeitura e o cartório para simular os valores. Em alguns estados, os tabelionatos
          disponibilizam calculadoras oficiais de emolumentos.
        </p>
      </BlocoTexto>

      <BlocoTexto titulo="Passo a passo da compra" icone="🪜">
        <ol style={{ margin: 0, paddingLeft: 22 }}>
          {passos.map((passo) => (
            <li key={passo} style={{ marginBottom: 8 }}>
              {passo}
            </li>
          ))}
        </ol>
      </BlocoTexto>

      <BlocoTexto titulo="Cuidados importantes" icone="⚠️">
        <ul style={{ margin: 0, paddingLeft: 22 }}>
          <li style={{ marginBottom: 6 }}>Nunca pague sinal sem analisar a matrícula e as certidões.</li>
          <li style={{ marginBottom: 6 }}>
            Verifique se o vendedor é o proprietário e se está autorizado a vender.
          </li>
          <li style={{ marginBottom: 6 }}>
            Em imóvel financiado, confirme as regras do banco e a quitação da dívida anterior.
          </li>
          <li style={{ marginBottom: 6 }}>
            Em inventário, a venda só pode ocorrer após autorização judicial ou com todos os herdeiros
            representados.
          </li>
          <li>
            Guarde a escritura registrada, a matrícula atualizada e todos os comprovantes de pagamento.
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
          <div style={{ color: '#F5A900', fontSize: 17, fontWeight: 800 }}>Vai comprar ou vender?</div>
          <div style={{ marginTop: 4, color: '#cbd5e1', fontSize: 14 }}>
            Compare o valor venal, simule o metro quadrado e encontre o imóvel ideal.
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Link
            href="/dados-e-indices/valor-venal"
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
            Ver valor venal
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
        Este guia é informativo e não substitui orientação jurídica. As exigências e os custos podem mudar
        conforme o município, o estado e o tipo de negócio.
      </p>
    </PaginaUtil>
  );
}
