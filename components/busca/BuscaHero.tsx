'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function BuscaHero() {
  const router = useRouter();
  const [negocio, setNegocio] = useState<'todos' | 'venda' | 'aluguel'>('todos');
  const [tipo, setTipo] = useState('');
  const [local, setLocal] = useState('');
  const [precoMin, setPrecoMin] = useState('');
  const [precoMax, setPrecoMax] = useState('');
  const [quartos, setQuartos] = useState('');

  const handleBuscar = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (negocio !== 'todos') params.set('negocio', negocio);
    if (tipo) params.set('tipo', tipo);
    if (local) params.set('local', local);
    if (precoMin) params.set('preco_min', precoMin);
    if (precoMax) params.set('preco_max', precoMax);
    if (quartos) params.set('quartos', quartos);
    router.push(`/imoveis?${params.toString()}`);
  };

  return (
    <div className="busca-hero-card" style={{ background: 'white', borderRadius: 16, padding: '24px 20px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', maxWidth: 900, width: '100%', margin: '0 auto' }}>
      {/* Tabs de tipo de negócio */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 16, background: '#F5F5F5', borderRadius: 10, padding: 4 }}>
        {[
          { value: 'todos', label: '🏠 Todos' },
          { value: 'venda', label: '💰 Comprar' },
          { value: 'aluguel', label: '🔑 Alugar' },
        ].map(tab => (
          <button
            key={tab.value}
            onClick={() => setNegocio(tab.value as typeof negocio)}
            style={{
              flex: 1,
              padding: '10px 12px',
              borderRadius: 8,
              border: 'none',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: 13,
              transition: 'all 0.2s',
              background: negocio === tab.value ? '#102B50' : 'transparent',
              color: negocio === tab.value ? 'white' : '#6B7280',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleBuscar}>
        {/* Linha 1: Local e Tipo */}
        <div className="grid-busca-linha1" style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 10, marginBottom: 10 }}>
          <input
            type="text"
            placeholder="🔍 Digite cidade, bairro ou estado..."
            value={local}
            onChange={e => setLocal(e.target.value)}
            className="input-arclar"
            style={{ fontSize: 14, padding: '12px 14px' }}
          />
          <select
            value={tipo}
            onChange={e => setTipo(e.target.value)}
            className="input-arclar select-tipo-hero"
            style={{ minWidth: 160 }}
          >
            <option value="">Tipo de imóvel</option>
            <option value="apartamento">Apartamento</option>
            <option value="casa">Casa</option>
            <option value="cobertura">Cobertura</option>
            <option value="studio">Studio / Kitnet</option>
            <option value="terreno">Terreno</option>
            <option value="comercial">Comercial</option>
            <option value="sala">Sala Comercial</option>
            <option value="galpao">Galpão</option>
            <option value="chacara">Chácara / Sítio</option>
          </select>
        </div>

        {/* Linha 2: Preços, Quartos e Botão */}
        <div className="grid-busca-linha2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: 10, alignItems: 'center' }}>
          <select
            value={precoMin}
            onChange={e => setPrecoMin(e.target.value)}
            className="input-arclar"
          >
            <option value="">Preço mínimo</option>
            <option value="100000">R$ 100.000</option>
            <option value="200000">R$ 200.000</option>
            <option value="300000">R$ 300.000</option>
            <option value="500000">R$ 500.000</option>
            <option value="700000">R$ 700.000</option>
            <option value="1000000">R$ 1.000.000</option>
            <option value="2000000">R$ 2.000.000</option>
          </select>
          <select
            value={precoMax}
            onChange={e => setPrecoMax(e.target.value)}
            className="input-arclar"
          >
            <option value="">Preço máximo</option>
            <option value="300000">R$ 300.000</option>
            <option value="500000">R$ 500.000</option>
            <option value="700000">R$ 700.000</option>
            <option value="1000000">R$ 1.000.000</option>
            <option value="2000000">R$ 2.000.000</option>
            <option value="5000000">R$ 5.000.000</option>
          </select>
          <select
            value={quartos}
            onChange={e => setQuartos(e.target.value)}
            className="input-arclar"
          >
            <option value="">Quartos</option>
            <option value="1">1 quarto</option>
            <option value="2">2 quartos</option>
            <option value="3">3 quartos</option>
            <option value="4">4+ quartos</option>
          </select>
          <button
            type="submit"
            className="btn-buscar-hero"
            style={{
              background: '#F5A900',
              color: '#102B50',
              border: 'none',
              borderRadius: 8,
              padding: '13px 24px',
              fontWeight: 800,
              fontSize: 14,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'background 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
            }}
          >
            🔍 Buscar Imóveis
          </button>
        </div>
      </form>

      {/* Buscas rápidas */}
      <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid #F0F0F0', display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
        <span style={{ color: '#9CA3AF', fontSize: 11, fontWeight: 600 }}>Buscas populares:</span>
        {[
          'São Paulo',
          'Praia Grande',
          'Rio de Janeiro',
          'Santos',
          'Curitiba',
        ].map(busca => (
          <button
            key={busca}
            onClick={() => { setLocal(busca); }}
            style={{
              background: '#F5F5F5',
              color: '#374151',
              border: '1px solid #E5E7EB',
              borderRadius: 20,
              padding: '3px 10px',
              fontSize: 11,
              cursor: 'pointer',
              fontWeight: 500,
            }}
          >
            {busca}
          </button>
        ))}
      </div>
    </div>
  );
}
