'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Negocio = 'todos' | 'venda' | 'aluguel';

interface BuscaCompactaProps {
  negocioInicial?: Negocio;
  localInicial?: string;
}

export default function BuscaCompacta({ negocioInicial = 'todos', localInicial = '' }: BuscaCompactaProps) {
  const router = useRouter();
  const [negocio, setNegocio] = useState<Negocio>(negocioInicial);
  const [tipo, setTipo] = useState('');
  const [local, setLocal] = useState(localInicial);

  const handleBuscar = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (negocio !== 'todos') params.set('negocio', negocio);
    if (tipo) params.set('tipo', tipo);
    if (local.trim()) params.set('local', local.trim());
    router.push(`/imoveis?${params.toString()}`);
  };

  return (
    <form className="busca-compacta" onSubmit={handleBuscar}>
      <div className="busca-compacta-tabs">
        {[
          { value: 'todos', label: 'Todos' },
          { value: 'venda', label: 'Comprar' },
          { value: 'aluguel', label: 'Alugar' },
        ].map(tab => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setNegocio(tab.value as Negocio)}
            className={`busca-compacta-tab${negocio === tab.value ? ' ativo' : ''}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <input
        type="text"
        value={local}
        onChange={e => setLocal(e.target.value)}
        placeholder="Cidade, bairro ou estado..."
        aria-label="Cidade, bairro ou estado"
        className="input-arclar busca-compacta-local"
      />

      <select
        value={tipo}
        onChange={e => setTipo(e.target.value)}
        aria-label="Tipo de imóvel"
        className="input-arclar busca-compacta-tipo"
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

      <button type="submit" className="busca-compacta-btn">
        🔍 Buscar
      </button>
    </form>
  );
}
