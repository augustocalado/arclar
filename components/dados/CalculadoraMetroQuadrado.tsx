'use client';

import { useState } from 'react';

const formatadorMoeda = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

const formatadorNumero = new Intl.NumberFormat('pt-BR', {
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
  padding: '11px 13px',
  borderRadius: 10,
  border: '1px solid #CBD5E1',
  background: '#FFFFFF',
  color: '#102B50',
  fontSize: 15,
  outline: 'none',
};

const estiloLabel: React.CSSProperties = {
  display: 'block',
  marginBottom: 6,
  color: '#334155',
  fontSize: 12,
  fontWeight: 700,
};

const estiloCard: React.CSSProperties = {
  padding: '22px clamp(16px, 2.5vw, 26px)',
  background: '#FFFFFF',
  border: '1px solid #E2E8F0',
  borderRadius: 16,
  boxShadow: '0 4px 16px rgba(15, 23, 42, 0.05)',
};

export default function CalculadoraMetroQuadrado() {
  const [areaValor, setAreaValor] = useState('');
  const [valorTotal, setValorTotal] = useState('');
  const [resultadoM2, setResultadoM2] = useState<number | null>(null);

  const [areaTotal, setAreaTotal] = useState('');
  const [valorM2, setValorM2] = useState('');
  const [resultadoTotal, setResultadoTotal] = useState<number | null>(null);

  function calcularValorM2(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const area = paraNumero(areaValor);
    const total = paraNumero(valorTotal);

    if (!Number.isFinite(area) || area <= 0 || !Number.isFinite(total) || total <= 0) {
      setResultadoM2(null);
      return;
    }

    setResultadoM2(total / area);
  }

  function calcularValorTotal(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const area = paraNumero(areaTotal);
    const porMetro = paraNumero(valorM2);

    if (!Number.isFinite(area) || area <= 0 || !Number.isFinite(porMetro) || porMetro <= 0) {
      setResultadoTotal(null);
      return;
    }

    setResultadoTotal(area * porMetro);
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 18,
        marginBottom: 20,
      }}
    >
      <form onSubmit={calcularValorM2} style={estiloCard}>
        <h2 style={{ margin: '0 0 6px', color: '#102B50', fontSize: 20, fontWeight: 800 }}>
          Descobrir o valor por m²
        </h2>
        <p style={{ margin: '0 0 16px', color: '#64748b', fontSize: 13, lineHeight: 1.6 }}>
          Divida o valor total do imóvel pela área útil ou total.
        </p>
        <div style={{ marginBottom: 12 }}>
          <label htmlFor="area-valor" style={estiloLabel}>
            Área do imóvel (m²)
          </label>
          <input
            id="area-valor"
            type="text"
            inputMode="decimal"
            placeholder="Ex.: 72"
            value={areaValor}
            onChange={(evento) => setAreaValor(evento.target.value)}
            style={estiloInput}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label htmlFor="valor-total" style={estiloLabel}>
            Valor total do imóvel (R$)
          </label>
          <input
            id="valor-total"
            type="text"
            inputMode="decimal"
            placeholder="Ex.: 450.000,00"
            value={valorTotal}
            onChange={(evento) => setValorTotal(evento.target.value)}
            style={estiloInput}
          />
        </div>
        <button type="submit" className="btn-primary" style={{ cursor: 'pointer', width: '100%' }}>
          Calcular valor do m²
        </button>
        {resultadoM2 !== null && (
          <div
            aria-live="polite"
            style={{ marginTop: 16, padding: 16, background: '#F1F5F9', borderRadius: 12 }}
          >
            <div style={{ color: '#64748b', fontSize: 12, fontWeight: 700 }}>Valor por metro quadrado</div>
            <div style={{ marginTop: 4, color: '#102B50', fontSize: 28, fontWeight: 800 }}>
              {formatadorMoeda.format(resultadoM2)}
            </div>
          </div>
        )}
      </form>

      <form onSubmit={calcularValorTotal} style={estiloCard}>
        <h2 style={{ margin: '0 0 6px', color: '#102B50', fontSize: 20, fontWeight: 800 }}>
          Estimar o valor total
        </h2>
        <p style={{ margin: '0 0 16px', color: '#64748b', fontSize: 13, lineHeight: 1.6 }}>
          Multiplique a área pelo valor médio do metro quadrado na região.
        </p>
        <div style={{ marginBottom: 12 }}>
          <label htmlFor="area-total" style={estiloLabel}>
            Área do imóvel (m²)
          </label>
          <input
            id="area-total"
            type="text"
            inputMode="decimal"
            placeholder="Ex.: 72"
            value={areaTotal}
            onChange={(evento) => setAreaTotal(evento.target.value)}
            style={estiloInput}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label htmlFor="valor-m2" style={estiloLabel}>
            Valor por m² na região (R$)
          </label>
          <input
            id="valor-m2"
            type="text"
            inputMode="decimal"
            placeholder="Ex.: 6.250,00"
            value={valorM2}
            onChange={(evento) => setValorM2(evento.target.value)}
            style={estiloInput}
          />
        </div>
        <button type="submit" className="btn-primary" style={{ cursor: 'pointer', width: '100%' }}>
          Calcular valor total
        </button>
        {resultadoTotal !== null && (
          <div
            aria-live="polite"
            style={{ marginTop: 16, padding: 16, background: '#102B50', borderRadius: 12 }}
          >
            <div style={{ color: '#cbd5e1', fontSize: 12, fontWeight: 700 }}>Valor estimado do imóvel</div>
            <div style={{ marginTop: 4, color: '#F5A900', fontSize: 28, fontWeight: 800 }}>
              {formatadorMoeda.format(resultadoTotal)}
            </div>
            <div style={{ marginTop: 4, color: '#94a3b8', fontSize: 11 }}>
              {formatadorNumero.format(paraNumero(areaTotal))} m² × {formatadorMoeda.format(paraNumero(valorM2))}
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
