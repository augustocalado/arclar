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
  atualizadoEm: string;
}

const formatadorMoeda = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

const formatadorPercentual = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function paraNumero(texto: string): number {
  const limpo = texto.trim();
  if (!limpo) {
    return Number.NaN;
  }
  if (limpo.includes(',')) {
    return Number(limpo.replace(/\./g, '').replace(',', '.'));
  }
  return Number(limpo);
}

const estiloInput: React.CSSProperties = {
  width: '100%',
  padding: '12px 14px',
  borderRadius: 10,
  border: '1px solid #CBD5E1',
  background: '#FFFFFF',
  color: '#102B50',
  fontSize: 16,
  outline: 'none',
};

const estiloLabel: React.CSSProperties = {
  display: 'block',
  marginBottom: 6,
  color: '#334155',
  fontSize: 13,
  fontWeight: 700,
};

export default function CalculadoraIgpm() {
  const [valor, setValor] = useState('');
  const [taxa, setTaxa] = useState('');
  const [resultado, setResultado] = useState<{ novoValor: number; aumento: number } | null>(null);
  const [erro, setErro] = useState('');
  const [indice, setIndice] = useState<IndiceInfo | null>(null);

  useEffect(() => {
    let ativo = true;

    fetch('/api/indices')
      .then((resposta) => (resposta.ok ? resposta.json() : Promise.reject(new Error('Falha ao carregar'))))
      .then((json: RespostaIndices) => {
        if (ativo && json.igpm) {
          setIndice(json.igpm);
        }
      })
      .catch(() => {
        if (ativo) {
          setIndice(null);
        }
      });

    return () => {
      ativo = false;
    };
  }, []);

  function usarIndiceAtual() {
    if (!indice) {
      return;
    }
    setTaxa(String(indice.acumulado12m).replace('.', ','));
    setErro('');
  }

  function calcular(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault();

    const valorNumero = paraNumero(valor);
    const taxaNumero = paraNumero(taxa);

    if (!Number.isFinite(valorNumero) || valorNumero <= 0) {
      setErro('Informe um valor de aluguel válido.');
      setResultado(null);
      return;
    }

    if (!Number.isFinite(taxaNumero) || taxaNumero <= -100) {
      setErro('Informe um percentual de reajuste válido.');
      setResultado(null);
      return;
    }

    const novoValor = valorNumero * (1 + taxaNumero / 100);
    setResultado({ novoValor, aumento: novoValor - valorNumero });
    setErro('');
  }

  return (
    <section
      style={{
        padding: '24px clamp(18px, 3vw, 32px)',
        marginBottom: 20,
        background: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: 18,
        boxShadow: '0 8px 28px rgba(15, 23, 42, 0.08)',
      }}
    >
      <h2 style={{ margin: '0 0 6px', color: '#102B50', fontSize: 'clamp(20px, 2.5vw, 24px)', fontWeight: 800 }}>
        Calcule o reajuste do aluguel
      </h2>
      <p style={{ margin: '0 0 20px', color: '#64748b', fontSize: 14, lineHeight: 1.6 }}>
        Informe o valor atual e o percentual acumulado no período de aniversário do contrato.
      </p>

      <form onSubmit={calcular}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 16,
            marginBottom: 18,
          }}
        >
          <div>
            <label htmlFor="valor-aluguel" style={estiloLabel}>
              Valor atual do aluguel (R$)
            </label>
            <input
              id="valor-aluguel"
              type="text"
              inputMode="decimal"
              placeholder="Ex.: 2.500,00"
              value={valor}
              onChange={(evento) => setValor(evento.target.value)}
              style={estiloInput}
            />
          </div>
          <div>
            <label htmlFor="percentual-reajuste" style={estiloLabel}>
              Percentual de reajuste (%)
            </label>
            <input
              id="percentual-reajuste"
              type="text"
              inputMode="decimal"
              placeholder="Ex.: 4,25"
              value={taxa}
              onChange={(evento) => setTaxa(evento.target.value)}
              style={estiloInput}
            />
          </div>
        </div>

        {indice && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              flexWrap: 'wrap',
              marginBottom: 18,
              padding: '12px 14px',
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: 12,
            }}
          >
            <div style={{ color: '#475569', fontSize: 13, lineHeight: 1.5 }}>
              <strong style={{ color: '#102B50' }}>IGP-M acumulado em 12 meses:</strong>{' '}
              {formatadorPercentual.format(indice.acumulado12m)}% ({indice.inicio} a {indice.fim})
            </div>
            <button
              type="button"
              onClick={usarIndiceAtual}
              style={{
                padding: '9px 14px',
                borderRadius: 8,
                border: '1px solid #102B50',
                background: '#FFFFFF',
                color: '#102B50',
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Usar este índice
            </button>
          </div>
        )}

        <button type="submit" className="btn-primary" style={{ cursor: 'pointer' }}>
          Calcular reajuste
        </button>
      </form>

      {erro && (
        <p role="alert" style={{ margin: '16px 0 0', color: '#B91C1C', fontSize: 14, fontWeight: 600 }}>
          {erro}
        </p>
      )}

      {resultado && (
        <div
          aria-live="polite"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 12,
            marginTop: 22,
          }}
        >
          <div style={{ padding: 18, background: '#102B50', borderRadius: 14 }}>
            <div style={{ color: '#cbd5e1', fontSize: 12, fontWeight: 700 }}>Novo valor do aluguel</div>
            <div style={{ marginTop: 6, color: '#F5A900', fontSize: 28, fontWeight: 800 }}>
              {formatadorMoeda.format(resultado.novoValor)}
            </div>
          </div>
          <div style={{ padding: 18, background: '#F1F5F9', borderRadius: 14 }}>
            <div style={{ color: '#64748b', fontSize: 12, fontWeight: 700 }}>Aumento no valor</div>
            <div style={{ marginTop: 6, color: '#102B50', fontSize: 28, fontWeight: 800 }}>
              {formatadorMoeda.format(resultado.aumento)}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
