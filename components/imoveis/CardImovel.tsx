'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Imovel } from '@/types';
import { formatarPreco, formatarTipoImovel } from '@/lib/utils';

interface CardImovelProps {
  imovel: Imovel;
}

export default function CardImovel({ imovel }: CardImovelProps) {
  const [favoritado, setFavoritado] = useState(false);
  const [imgError, setImgError] = useState(false);

  const fotoUrl = imgError || !imovel.foto_principal
    ? 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80'
    : imovel.foto_principal;

  return (
    <div
      className="card-imovel"
      style={{
        background: 'white',
        borderRadius: 12,
        overflow: 'hidden',
        border: '1px solid #E5E7EB',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      {/* Foto */}
      <div style={{ position: 'relative', height: 220, overflow: 'hidden', background: '#F3F4F6' }}>
        <Image
          src={fotoUrl}
          alt={imovel.titulo}
          fill
          style={{ objectFit: 'cover', transition: 'transform 0.4s ease' }}
          onError={() => setImgError(true)}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
          onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
        />

        {/* Badges */}
        <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <span className={imovel.negocio === 'aluguel' ? 'badge-aluguel' : 'badge-venda'}>
            {imovel.negocio === 'aluguel' ? 'Aluguel' : 'Venda'}
          </span>
          {imovel.destaque && (
            <span className="badge-destaque">⭐ Destaque</span>
          )}
        </div>

        {/* Botão Favoritar */}
        <button
          onClick={() => setFavoritado(!favoritado)}
          aria-label={favoritado ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            background: 'white',
            border: 'none',
            borderRadius: '50%',
            width: 36,
            height: 36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            transition: 'transform 0.2s',
            fontSize: 18,
          }}
          onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.15)')}
          onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
        >
          {favoritado ? '❤️' : '🤍'}
        </button>

        {/* Tipo do imóvel */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.6))', padding: '20px 12px 10px' }}>
          <span style={{ color: 'white', fontSize: 12, fontWeight: 600, textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>
            {formatarTipoImovel(imovel.tipo)}
          </span>
        </div>
      </div>

      {/* Conteúdo */}
      <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Preço */}
        <div style={{ marginBottom: 8 }}>
          <div style={{ color: '#102B50', fontWeight: 800, fontSize: 22 }}>
            {formatarPreco(imovel.preco, imovel.negocio)}
          </div>
          {imovel.preco_condominio && (
            <div style={{ color: '#6B7280', fontSize: 12, marginTop: 2 }}>
              + R$ {imovel.preco_condominio.toLocaleString('pt-BR')}/mês cond.
            </div>
          )}
        </div>

        {/* Título */}
        <h3 style={{ color: '#1F2937', fontSize: 15, fontWeight: 600, marginBottom: 8, lineHeight: 1.4, flex: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {imovel.titulo}
        </h3>

        {/* Localização */}
        <div style={{ color: '#6B7280', fontSize: 13, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
          <span>📍</span>
          <span>{imovel.endereco.bairro}, {imovel.endereco.cidade} – {imovel.endereco.estado_sigla}</span>
        </div>

        {/* Características */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
          {imovel.quartos !== undefined && imovel.quartos > 0 && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#374151', fontSize: 13, fontWeight: 500 }}>
              🛏️ {imovel.quartos} {imovel.quartos === 1 ? 'quarto' : 'quartos'}
            </span>
          )}
          {imovel.banheiros !== undefined && imovel.banheiros > 0 && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#374151', fontSize: 13, fontWeight: 500 }}>
              🚿 {imovel.banheiros} {imovel.banheiros === 1 ? 'banheiro' : 'banheiros'}
            </span>
          )}
          {imovel.vagas !== undefined && imovel.vagas > 0 && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#374151', fontSize: 13, fontWeight: 500 }}>
              🚗 {imovel.vagas} {imovel.vagas === 1 ? 'vaga' : 'vagas'}
            </span>
          )}
          {(imovel.area_construida || imovel.area_total) && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#374151', fontSize: 13, fontWeight: 500 }}>
              📐 {imovel.area_construida || imovel.area_total} m²
            </span>
          )}
        </div>

        {/* Divisor */}
        <div style={{ borderTop: '1px solid #F0F0F0', paddingTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Anunciante */}
          {imovel.anunciante && (
            <span style={{ color: '#9CA3AF', fontSize: 12, fontWeight: 500, maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              🏢 {imovel.anunciante.nome}
            </span>
          )}

          {/* Botão ver */}
          <Link
            href={`/imovel/${imovel.slug}`}
            style={{
              background: '#102B50',
              color: 'white',
              textDecoration: 'none',
              padding: '8px 20px',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 700,
              transition: 'background 0.2s',
              display: 'inline-block',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = '#F5A900')}
            onMouseLeave={e => (e.currentTarget.style.background = '#102B50')}
          >
            Ver imóvel →
          </Link>
        </div>
      </div>
    </div>
  );
}

