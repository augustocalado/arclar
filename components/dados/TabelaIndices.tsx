'use client';

import { useEffect, useState } from 'react';

interface IndiceInfo {
  nome: string;
  acumulado12m: number;
  inicio: string;
  fim: string;
}

interface RespostaIndices {
  igpm: IndiceInfo | null;
  ipca: IndiceInfo | null;
  atualizadoEm: string;
  fonte: string;
}

const formatadorPercentual = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function formatarData(data: string) {
  return data || '—';
}

export default function TabelaIndices() {
  const [dados, setDados] = useState<RespostaIndices | null>(null);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    let ativo = true;

    fetch('/api/indices')
      .then((resposta) => (resposta.ok ? resposta.json() : Promise.reject(new Error('Falha ao carregar'))))
      .then((json: RespostaIndices) => {
        if (ativo) {
          setDados(json);
        }
      })
      .catch(() => {
        if (ativo) {
          setErro(true);
        }
      });

    return () => {
      ativo = false;
    };
  }, []);

  if (erro) {
    return (
      <div
        style={{
          padding: 20,
          background: '#FFF7E6',
          border: '1px solid #F5D08A',
          borderRadius: 14,
          color: '#7A4B00',
          fontSize: 14,
          lineHeight: 1.7,
        }}
      >
        Não foi possível carregar os índices agora. Consulte os dados oficiais no{' '}
        <a
          href="https://www.bcb.gov.br/estabilidadefinanceira/historicocotacoes"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#102B50', fontWeight: 700 }}
        >
          site do Banco Central
        </a>
        .
      </div>
    );
  }

  const cards = [
    { chave: 'igpm', rotulo: 'IGP-M', cor: '#F5A900', info: dados?.igpm },
    { chave: 'ipca', rotulo: 'IPCA', cor: '#102B50', info: dados?.ipca },
  ];

  return (
    <div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
          gap: 16,
          marginBottom: 14,
        }}
      >
        {cards.map((card) => (
          <div
            key={card.chave}
            style={{
              padding: 20,
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: 16,
              boxShadow: '0 2px 10px rgba(15, 23, 42, 0.04)',
            }}
          >
            <div style={{ color: '#64748b', fontSize: 12, fontWeight: 700, letterSpacing: 0.6 }}>
              {card.rotulo}
            </div>
            <div style={{ margin: '8px 0 4px', color: card.cor, fontSize: 32, fontWeight: 800, lineHeight: 1 }}>
              {dados && card.info
                ? `${formatadorPercentual.format(card.info.acumulado12m)}%`
                : dados
                  ? '—'
                  : '...'}
            </div>
            <div style={{ color: '#475569', fontSize: 13 }}>acumulado em 12 meses</div>
            {card.info && (
              <div style={{ marginTop: 8, color: '#94a3b8', fontSize: 12 }}>
                {formatarData(card.info.inicio)} a {formatarData(card.info.fim)}
              </div>
            )}
          </div>
        ))}
      </div>
      <p style={{ margin: 0, color: '#64748b', fontSize: 12, lineHeight: 1.6 }}>
        {dados
          ? `Fonte: ${dados.fonte}. Atualizado em ${new Date(dados.atualizadoEm).toLocaleString('pt-BR')}.`
          : 'Carregando dados oficiais do Banco Central...'}
        {' '}A variação acumulada é calculada sobre os últimos 12 meses divulgados e pode não coincidir
        com o período de aniversário do seu contrato.
      </p>
    </div>
  );
}
