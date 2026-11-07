import type { Metadata } from 'next';
import Link from 'next/link';
import PaginaUtil from '@/components/conteudo/PaginaUtil';
import BlocoTexto from '@/components/conteudo/BlocoTexto';

export const metadata: Metadata = {
  title: 'Lei do Inquilino: direitos, deveres e reajuste | ARC LAR',
  description:
    'Guia da Lei do Inquilino (Lei 8.245/1991): direitos e deveres, reajuste de aluguel, renovação, rescisão, multa e vistoria.',
  alternates: {
    canonical: 'https://arclar.com.br/guias/lei-do-inquilino',
  },
  openGraph: {
    title: 'Lei do Inquilino | ARC LAR',
    description: 'Direitos, deveres e regras principais da locação de imóveis.',
    url: 'https://arclar.com.br/guias/lei-do-inquilino',
    images: [{ url: '/logo.png', width: 600, height: 200, alt: 'ARC LAR' }],
  },
};

export default function LeiDoInquilinoPage() {
  return (
    <PaginaUtil
      icone="⚖️"
      titulo="Lei do Inquilino"
      subtitulo="Um resumo prático da Lei 8.245/1991: direitos e deveres, reajuste, renovação, rescisão, multa e vistoria na locação de imóveis."
      breadcrumb={[{ label: 'Guias', href: '/guias' }, { label: 'Lei do inquilino' }]}
    >
      <BlocoTexto titulo="O que é a Lei do Inquilino" icone="📘">
        <p style={{ marginTop: 0, marginBottom: 0 }}>
          A Lei nº 8.245/1991, conhecida como Lei do Inquilino, disciplina as locações de imóveis urbanos
          residenciais e comerciais. Ela trata de direitos e deveres das partes, reajuste, renovação,
          rescisão, vistoria, garantias e ações judiciais. O contrato pode complementar a lei, mas não pode
          contrariar normas obrigatórias.
        </p>
      </BlocoTexto>

      <BlocoTexto titulo="Direitos do inquilino" icone="🔑">
        <ul style={{ margin: 0, paddingLeft: 22 }}>
          <li style={{ marginBottom: 6 }}>Receber o imóvel em condições de uso, conforme a vistoria inicial.</li>
          <li style={{ marginBottom: 6 }}>Usar o imóvel para os fins previstos no contrato.</li>
          <li style={{ marginBottom: 6 }}>Ter recibo e comprovante de todos os pagamentos.</li>
          <li style={{ marginBottom: 6 }}>
            Ser avisado com antecedência sobre reajuste, renovação ou rescisão, conforme o contrato e a lei.
          </li>
          <li style={{ marginBottom: 6 }}>
            Receber de volta a garantia, quando não houver débitos, após a vistoria final.
          </li>
          <li>Ter preservada a sua privacidade, com visitas do locador combinadas previamente.</li>
        </ul>
      </BlocoTexto>

      <BlocoTexto titulo="Deveres do inquilino" icone="✅">
        <ul style={{ margin: 0, paddingLeft: 22 }}>
          <li style={{ marginBottom: 6 }}>Pagar aluguel, condomínio, IPTU e demais encargos previstos.</li>
          <li style={{ marginBottom: 6 }}>Conservar o imóvel e comunicar problemas ao locador.</li>
          <li style={{ marginBottom: 6 }}>
            Não realizar obras ou alterações sem autorização, quando necessária.
          </li>
          <li style={{ marginBottom: 6 }}>
            Devolver o imóvel nas mesmas condições da vistoria inicial, salvo desgaste natural.
          </li>
          <li>Respeitar o prazo de aviso prévio em caso de saída antecipada, conforme o contrato.</li>
        </ul>
      </BlocoTexto>

      <BlocoTexto titulo="Direitos e deveres do locador" icone="🏠">
        <ul style={{ margin: 0, paddingLeft: 22 }}>
          <li style={{ marginBottom: 6 }}>Receber o aluguel e os encargos nos prazos combinados.</li>
          <li style={{ marginBottom: 6 }}>
            Entregar o imóvel limpo, em condições de uso e com a documentação necessária.
          </li>
          <li style={{ marginBottom: 6 }}>Informar reajustes e cobranças de forma clara e por escrito.</li>
          <li style={{ marginBottom: 6 }}>
            Realizar reparos estruturais e de manutenção que não decorram do uso normal do inquilino.
          </li>
          <li>Emitir recibo e restituir a garantia na forma da lei e do contrato.</li>
        </ul>
      </BlocoTexto>

      <BlocoTexto titulo="Reajuste e renovação do aluguel" icone="📈">
        <p style={{ marginTop: 0 }}>
          Em regra, o aluguel residencial pode ser reajustado após 12 meses, pelo índice previsto no
          contrato. O período de aniversário e o índice precisam estar claros no documento. Não havendo
          índice pactuado, aplica-se a legislação e a negociação entre as partes.
        </p>
        <p style={{ marginBottom: 0 }}>
          Na renovação, as partes podem negociar novo valor, prazo e condições. Contratos comerciais podem
          ter regras próprias de renovação e de ação renovatória. Consulte a calculadora de IGP-M para
          simular o reajuste, mas confirme o índice e o período do seu contrato.
        </p>
      </BlocoTexto>

      <BlocoTexto titulo="Rescisão, multa e aviso prévio" icone="🚪">
        <ul style={{ margin: 0, paddingLeft: 22 }}>
          <li style={{ marginBottom: 6 }}>
            A multa por saída antecipada deve estar prevista no contrato e guardar proporcionalidade com o
            tempo restante.
          </li>
          <li style={{ marginBottom: 6 }}>
            O prazo de aviso prévio e as hipóteses de rescisão variam conforme o tipo de contrato e a
            legislação aplicável.
          </li>
          <li style={{ marginBottom: 6 }}>
            O locador também pode ter deveres de aviso e de indenização em determinadas situações.
          </li>
          <li>
            Antes de assinar a rescisão, faça a vistoria final e registre o estado do imóvel por escrito e
            com fotos.
          </li>
        </ul>
      </BlocoTexto>

      <BlocoTexto titulo="Vistoria e devolução do imóvel" icone="🔍">
        <p style={{ marginTop: 0, marginBottom: 0 }}>
          A vistoria inicial é a base para comparar o estado do imóvel na entrega. Faça um laudo com fotos,
          liste os móveis e equipamentos e registre eventuais problemas. Na devolução, o locador deve
          conferir o imóvel, emitir a vistoria final e restituir a garantia conforme o contrato, descontando
          apenas o que for devido. Guarde cópias de tudo.
        </p>
      </BlocoTexto>

      <BlocoTexto titulo="Onde buscar ajuda" icone="🤝">
        <ul style={{ margin: 0, paddingLeft: 22 }}>
          <li style={{ marginBottom: 6 }}>Procon do seu município, em caso de cobrança abusiva.</li>
          <li style={{ marginBottom: 6 }}>
            Defensoria Pública, quando houver hipossuficiência econômica.
          </li>
          <li style={{ marginBottom: 6 }}>
            Advogado especializado em direito imobiliário para análise do contrato e ações judiciais.
          </li>
          <li>Mediação e conciliação, que podem resolver conflitos sem processo judicial.</li>
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
          <div style={{ color: '#F5A900', fontSize: 17, fontWeight: 800 }}>Vai reajustar o aluguel?</div>
          <div style={{ marginTop: 4, color: '#cbd5e1', fontSize: 14 }}>
            Simule o novo valor e compare os índices usados nos contratos de locação.
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
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
            Calculadora IGP-M
          </Link>
          <Link
            href="/dados-e-indices/indices-reajuste-aluguel"
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
            Ver índices
          </Link>
        </div>
      </div>

      <p style={{ margin: '20px 0 0', color: '#94a3b8', fontSize: 12, lineHeight: 1.6 }}>
        Este guia é informativo e não substitui a leitura do contrato ou a orientação de um advogado. A
        aplicação da lei depende do tipo de locação, do contrato e das circunstâncias do caso.
      </p>
    </PaginaUtil>
  );
}
