'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { IMOVEIS_MOCK, formatarPreco } from '@/lib/utils';
import type { UsuarioAutenticado } from '@/types';
import BarraNivelHierarquico from '@/components/auth/BarraNivelHierarquico';

export default function AreaClientePage() {
  const [usuarioSessao, setUsuarioSessao] = useState<UsuarioAutenticado | null>(null);
  const [tab, setTab] = useState<'favoritos' | 'contatos' | 'dados'>('favoritos');

  useEffect(() => {
    fetch('/api/auth/sessao', { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : null))
      .then((dados) => {
        if (dados?.usuario) setUsuarioSessao(dados.usuario);
      })
      .catch(() => {});
  }, []);

  const favoritosMock = IMOVEIS_MOCK.slice(0, 3);

  return (
    <div>
      <BarraNivelHierarquico onNivelAlterado={() => window.location.reload()} />
      <div style={{ background: '#F5F7FA', minHeight: '90vh', padding: '36px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          
          {/* Topo Área do Cliente */}
          <div
            style={{
              background: '#102B50',
              borderRadius: 16,
              padding: '28px 32px',
              color: 'white',
              marginBottom: 28,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 16,
            }}
          >
            <div>
              <span style={{ color: '#F5A900', fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1.5 }}>
                Área do Cliente & Interessado
              </span>
              <h1 style={{ fontSize: 24, fontWeight: 900, margin: '4px 0 0' }}>
                Olá, {usuarioSessao?.nome || 'Cliente'}! 👋
              </h1>
              <p style={{ color: '#94A3B8', fontSize: 13, margin: '4px 0 0' }}>
                Acompanhe seus imóveis salvos e propostas enviadas aos corretores.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <Link
                href="/imoveis"
                style={{
                  background: '#F5A900',
                  color: '#102B50',
                  padding: '10px 18px',
                  borderRadius: 8,
                  textDecoration: 'none',
                  fontSize: 14,
                  fontWeight: 800,
                }}
              >
                🔍 Buscar Mais Imóveis
              </Link>
            </div>
          </div>

          {/* Abas */}
          <div style={{ display: 'flex', gap: 10, borderBottom: '2px solid #E2E8F0', marginBottom: 24 }}>
            {[
              { id: 'favoritos', rotulo: `❤️ Imóveis Favoritos (${favoritosMock.length})` },
              { id: 'contatos', rotulo: '💬 Contatos Enviados (2)' },
              { id: 'dados', rotulo: '👤 Meus Dados' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id as 'favoritos' | 'contatos' | 'dados')}
                style={{
                  background: 'none',
                  border: 'none',
                  borderBottom: tab === t.id ? '3px solid #102B50' : '3px solid transparent',
                  padding: '12px 18px',
                  color: tab === t.id ? '#102B50' : '#64748B',
                  fontWeight: tab === t.id ? 800 : 600,
                  fontSize: 14,
                  cursor: 'pointer',
                  marginBottom: -2,
                }}
              >
                {t.rotulo}
              </button>
            ))}
          </div>

          {/* Conteúdo Aba Favoritos */}
          {tab === 'favoritos' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
                {favoritosMock.map((imovel) => (
                  <div
                    key={imovel.id}
                    style={{
                      background: 'white',
                      borderRadius: 14,
                      overflow: 'hidden',
                      border: '1px solid #E5E7EB',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    }}
                  >
                    <div style={{ height: 180, background: '#CBD5E1', position: 'relative' }}>
                      {imovel.foto_principal ? (
                        <img
                          src={imovel.foto_principal}
                          alt={imovel.titulo}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#64748B' }}>
                          Foto do Imóvel
                        </div>
                      )}
                      <span
                        style={{
                          position: 'absolute',
                          top: 10,
                          left: 10,
                          background: imovel.negocio === 'venda' ? '#102B50' : '#059669',
                          color: 'white',
                          padding: '4px 10px',
                          borderRadius: 6,
                          fontSize: 11,
                          fontWeight: 800,
                          textTransform: 'uppercase',
                        }}
                      >
                        {imovel.negocio === 'venda' ? 'Venda' : 'Aluguel'}
                      </span>
                    </div>

                    <div style={{ padding: 18 }}>
                      <div style={{ color: '#F5A900', fontSize: 18, fontWeight: 900 }}>
                        {formatarPreco(imovel.preco)}
                      </div>
                      <h3 style={{ fontSize: 15, fontWeight: 700, color: '#102B50', margin: '6px 0' }}>
                        {imovel.titulo}
                      </h3>
                      <p style={{ color: '#64748B', fontSize: 13, margin: '0 0 14px' }}>
                        📍 {imovel.endereco.bairro}, {imovel.endereco.cidade} - {imovel.endereco.estado_sigla}
                      </p>

                      <div style={{ display: 'flex', gap: 8 }}>
                        <Link
                          href={`/imovel/${imovel.slug}`}
                          style={{
                            flex: 1,
                            textAlign: 'center',
                            background: '#102B50',
                            color: 'white',
                            padding: '10px',
                            borderRadius: 6,
                            textDecoration: 'none',
                            fontWeight: 700,
                            fontSize: 13,
                          }}
                        >
                          Ver Detalhes
                        </Link>
                        {imovel.anunciante?.whatsapp && (
                          <a
                            href={`https://wa.me/${imovel.anunciante.whatsapp.replace(/\D/g, '')}?text=Olá,%20tenho%20interesse%20no%20imóvel%20${encodeURIComponent(imovel.titulo)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              background: '#25D366',
                              color: 'white',
                              padding: '10px 14px',
                              borderRadius: 6,
                              textDecoration: 'none',
                              fontWeight: 700,
                              fontSize: 13,
                            }}
                          >
                            WhatsApp
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Conteúdo Aba Contatos */}
          {tab === 'contatos' && (
            <div style={{ background: 'white', borderRadius: 12, padding: 24, border: '1px solid #E2E8F0' }}>
              <h2 style={{ fontSize: 18, color: '#102B50', fontWeight: 800, marginBottom: 16 }}>
                Histórico de Contatos & Conversas
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  {
                    corretor: 'Carlos Eduardo Corretor (CRECI 98765-F)',
                    imovel: 'Apartamento com 2 quartos no Jardins',
                    data: '08/11/2026 às 15:30',
                    status: 'Respondido via WhatsApp',
                  },
                  {
                    corretor: 'Prime Imóveis LTDA (CRECI 12345-J)',
                    imovel: 'Casa em condomínio fechado com piscina',
                    data: '07/11/2026 às 11:15',
                    status: 'Aguardando retorno',
                  },
                ].map((c, i) => (
                  <div key={i} style={{ padding: 16, borderRadius: 8, background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                    <div style={{ fontWeight: 800, color: '#102B50', fontSize: 14 }}>{c.corretor}</div>
                    <div style={{ color: '#475569', fontSize: 13, margin: '4px 0' }}>Imóvel: {c.imovel}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#64748B', marginTop: 8 }}>
                      <span>Data: {c.data}</span>
                      <span style={{ color: '#059669', fontWeight: 700 }}>{c.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Conteúdo Aba Dados */}
          {tab === 'dados' && (
            <div style={{ background: 'white', borderRadius: 12, padding: 28, border: '1px solid #E2E8F0', maxWidth: 600 }}>
              <h2 style={{ fontSize: 18, color: '#102B50', fontWeight: 800, marginBottom: 16 }}>
                Seus Dados Cadastrais
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: '#64748B', display: 'block', marginBottom: 4 }}>Nome Completo</label>
                  <div style={{ padding: '10px 14px', background: '#F8FAFC', borderRadius: 8, border: '1px solid #E2E8F0', fontWeight: 600, color: '#102B50' }}>
                    {usuarioSessao?.nome || 'Mariana Ferreira'}
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: '#64748B', display: 'block', marginBottom: 4 }}>E-mail</label>
                  <div style={{ padding: '10px 14px', background: '#F8FAFC', borderRadius: 8, border: '1px solid #E2E8F0', fontWeight: 600, color: '#102B50' }}>
                    {usuarioSessao?.email || 'mariana.cliente@email.com'}
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: '#64748B', display: 'block', marginBottom: 4 }}>Nível de Usuário</label>
                  <div style={{ padding: '10px 14px', background: '#ECFDF5', borderRadius: 8, border: '1px solid #A7F3D0', fontWeight: 800, color: '#065F46' }}>
                    👤 Cliente / Interessado
                  </div>
                </div>
                <div style={{ marginTop: 10, paddingTop: 16, borderTop: '1px solid #F1F5F9' }}>
                  <p style={{ color: '#64748B', fontSize: 13, marginBottom: 12 }}>
                    É corretor ou possui imobiliária e deseja anunciar carteiras completas no portal?
                  </p>
                  <Link
                    href="/seja-corretor"
                    style={{
                      background: '#102B50',
                      color: 'white',
                      padding: '10px 16px',
                      borderRadius: 8,
                      textDecoration: 'none',
                      fontSize: 13,
                      fontWeight: 700,
                      display: 'inline-block',
                    }}
                  >
                    Credenciar-me como Corretor / Imobiliária →
                  </Link>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

