'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function AdminPage() {
  const [tab, setTab] = useState<'geral' | 'anunciantes' | 'planos' | 'xml'>('geral');

  return (
    <div style={{ background: '#F5F7FA', minHeight: '100vh', padding: '32px 24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        
        {/* Cabeçalho Admin */}
        <div style={{ background: '#0a1f3a', borderRadius: 16, padding: '24px 32px', color: 'white', marginBottom: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <span style={{ color: '#F5A900', fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1.5 }}>Administração Geral</span>
            <h1 style={{ fontSize: 24, fontWeight: 900, margin: '4px 0 0' }}>Painel Master ARC LAR</h1>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <Link href="/painel" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', padding: '10px 18px', borderRadius: 8, textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>
              Painel Anunciante
            </Link>
            <Link href="/" style={{ background: '#F5A900', color: '#102B50', padding: '10px 18px', borderRadius: 8, textDecoration: 'none', fontSize: 14, fontWeight: 800 }}>
              Ver Portal
            </Link>
          </div>
        </div>

        {/* Métricas Master */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 28 }}>
          {[
            { label: 'Anunciantes Ativos', valor: '1.240', cor: '#102B50' },
            { label: 'Imóveis Publicados', valor: '52.340', cor: '#059669' },
            { label: 'Cliques no WhatsApp', valor: '18.920', cor: '#25D366' },
            { label: 'Receita Mensal (MP)', valor: 'R$ 48.750', cor: '#F5A900' },
          ].map((m, idx) => (
            <div key={idx} style={{ background: 'white', borderRadius: 12, padding: 20, border: '1px solid #E5E7EB' }}>
              <div style={{ color: '#6B7280', fontSize: 13 }}>{m.label}</div>
              <div style={{ color: m.cor, fontSize: 24, fontWeight: 900, marginTop: 4 }}>{m.valor}</div>
            </div>
          ))}
        </div>

        {/* Abas de Navegação */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20, borderBottom: '2px solid #E5E7EB' }}>
          {[
            { id: 'geral', label: 'Visão Geral' },
            { id: 'anunciantes', label: 'Anunciantes & Moderação' },
            { id: 'planos', label: 'Planos & Mercado Pago' },
            { id: 'xml', label: 'Feeds XML & Integrações' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id as any)}
              style={{
                background: 'none',
                border: 'none',
                borderBottom: tab === t.id ? '3px solid #102B50' : '3px solid transparent',
                padding: '12px 20px',
                color: tab === t.id ? '#102B50' : '#6B7280',
                fontWeight: tab === t.id ? 800 : 600,
                cursor: 'pointer',
                fontSize: 15,
                marginBottom: -2,
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Conteúdo Aba */}
        <div style={{ background: 'white', borderRadius: 16, padding: 28, border: '1px solid #E5E7EB' }}>
          {tab === 'geral' && (
            <div>
              <h2 style={{ fontSize: 18, color: '#102B50', fontWeight: 800, marginBottom: 16 }}>Status da Plataforma</h2>
              <p style={{ color: '#4B5563', fontSize: 14, lineHeight: 1.6 }}>
                Ambiente de produção conectado com monitoramento em tempo real de indexação SEO, sitemap ativo, tracking de contatos via WhatsApp e banco de dados relacional.
              </p>
            </div>
          )}

          {tab === 'anunciantes' && (
            <div>
              <h2 style={{ fontSize: 18, color: '#102B50', fontWeight: 800, marginBottom: 16 }}>Anunciantes Cadastrados</h2>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 14 }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #F0F0F0', color: '#6B7280' }}>
                      <th style={{ padding: '10px' }}>Nome Comercial</th>
                      <th style={{ padding: '10px' }}>Perfil</th>
                      <th style={{ padding: '10px' }}>Plano</th>
                      <th style={{ padding: '10px' }}>Imóveis</th>
                      <th style={{ padding: '10px' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { nome: 'Prime Imóveis', perfil: 'Imobiliária', plano: 'Imobiliária', total: 45, status: 'Ativo' },
                      { nome: 'Carlos Corretor', perfil: 'Corretor', plano: 'Profissional', total: 18, status: 'Ativo' },
                      { nome: 'Litoral Imóveis', perfil: 'Imobiliária', plano: 'Profissional', total: 32, status: 'Ativo' },
                    ].map((row, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid #F0F0F0' }}>
                        <td style={{ padding: '12px 10px', fontWeight: 700, color: '#102B50' }}>{row.nome}</td>
                        <td style={{ padding: '12px 10px' }}>{row.perfil}</td>
                        <td style={{ padding: '12px 10px', fontWeight: 600 }}>{row.plano}</td>
                        <td style={{ padding: '12px 10px' }}>{row.total}</td>
                        <td style={{ padding: '12px 10px' }}>
                          <span style={{ background: '#ECFDF5', color: '#065F46', padding: '3px 8px', borderRadius: 4, fontSize: 12, fontWeight: 700 }}>{row.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab === 'planos' && (
            <div>
              <h2 style={{ fontSize: 18, color: '#102B50', fontWeight: 800, marginBottom: 16 }}>Gestão de Planos & Cobrança</h2>
              <p style={{ color: '#6B7280', fontSize: 14, marginBottom: 20 }}>
                Integração configurada com a API oficial do Mercado Pago para assinaturas recorrentes e destaques avulsos.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
                {[
                  { nome: 'Gratuito', preco: 'R$ 0/mês', limite: 'Até 3 imóveis' },
                  { nome: 'Básico', preco: 'R$ 89/mês', limite: 'Até 20 imóveis' },
                  { nome: 'Profissional', preco: 'R$ 249/mês', limite: 'Até 100 imóveis + XML' },
                  { nome: 'Imobiliária', preco: 'R$ 549/mês', limite: 'Ilimitado + Multi-usuários' },
                ].map((p, idx) => (
                  <div key={idx} style={{ padding: 16, borderRadius: 10, border: '1px solid #E5E7EB', background: '#F8FAFC' }}>
                    <div style={{ fontWeight: 800, color: '#102B50' }}>{p.nome}</div>
                    <div style={{ fontSize: 18, fontWeight: 900, color: '#F5A900', margin: '6px 0' }}>{p.preco}</div>
                    <div style={{ fontSize: 12, color: '#6B7280' }}>{p.limite}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'xml' && (
            <div>
              <h2 style={{ fontSize: 18, color: '#102B50', fontWeight: 800, marginBottom: 16 }}>Feeds XML Conectados</h2>
              <p style={{ color: '#6B7280', fontSize: 14 }}>
                O módulo suporta sincronização contínua via CRON com limpeza de anúncios removidos do feed da imobiliária.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

