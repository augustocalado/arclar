'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { IMOVEIS_MOCK } from '@/lib/utils';
import { formatarPreco } from '@/lib/utils';
import UploadFotos from '@/components/imoveis/UploadFotos';
import type { Lead } from '@/types';

const ROTULOS_LEAD: Record<string, string> = {
  novo: 'Novo',
  atendimento: 'Em Atendimento',
  visita_agendada: 'Visita Agendada',
  proposta: 'Proposta',
  negociacao: 'Negociação',
  vendido: 'Vendido',
  perdido: 'Perdido',
};

export default function PainelAnunciantePage() {
  const [tab, setTab] = useState<'imoveis' | 'cadastrar' | 'leads' | 'xml'>('imoveis');
  const [imoveis, setImoveis] = useState(IMOVEIS_MOCK);
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    let ativo = true;

    async function carregarDados() {
      try {
        const [resImoveis, resLeads] = await Promise.all([
          fetch('/api/imoveis', { cache: 'no-store' }),
          fetch('/api/leads', { cache: 'no-store' }),
        ]);

        if (resImoveis.ok) {
          const dados = await resImoveis.json();
          if (ativo && Array.isArray(dados.imoveis) && dados.imoveis.length > 0) {
            setImoveis(dados.imoveis);
          }
        }

        if (resLeads.ok) {
          const dados = await resLeads.json();
          if (ativo && Array.isArray(dados.leads)) {
            setLeads(dados.leads);
          }
        }
      } catch {
        // Mantém os dados de exemplo quando a API não estiver disponível.
      }
    }

    carregarDados();

    return () => {
      ativo = false;
    };
  }, []);

  // Form de cadastro
  const [novoTitulo, setNovoTitulo] = useState('');
  const [novoTipo, setNovoTipo] = useState('apartamento');
  const [novoNegocio, setNovoNegocio] = useState<'venda' | 'aluguel'>('venda');
  const [novoPreco, setNovoPreco] = useState('');
  const [novoBairro, setNovoBairro] = useState('');
  const [novaCidade, setNovaCidade] = useState('');
  const [novoEstado, setNovoEstado] = useState('SP');
  const [novoQuartos, setNovoQuartos] = useState('2');
  const [fotos, setFotos] = useState<string[]>([]);
  const [cadastrando, setCadastrando] = useState(false);
  const [msgSucesso, setMsgSucesso] = useState('');

  // XML
  const [urlFeed, setUrlFeed] = useState('');
  const [sincronizandoXml, setSincronizandoXml] = useState(false);
  const [xmlLog, setXmlLog] = useState<string | null>(null);

  const handleCadastrarImovel = async (e: React.FormEvent) => {
    e.preventDefault();
    setCadastrando(true);
    setMsgSucesso('');

    try {
      const res = await fetch('/api/imoveis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titulo: novoTitulo,
          tipo: novoTipo,
          negocio: novoNegocio,
          preco: novoPreco,
          quartos: novoQuartos,
          fotos,
          foto_principal: fotos[0],
          endereco: {
            bairro: novoBairro || 'Centro',
            cidade: novaCidade || 'São Paulo',
            estado: 'São Paulo',
            estado_sigla: novoEstado,
          },
        }),
      });

      const data = await res.json();
      if (data.imovel) {
        setImoveis([data.imovel, ...imoveis]);
        setMsgSucesso('Imóvel cadastrado com sucesso!');
        setNovoTitulo('');
        setNovoPreco('');
        setNovoBairro('');
        setNovaCidade('');
        setFotos([]);
        setTab('imoveis');
      }
    } catch {
      alert('Erro ao cadastrar imóvel');
    } finally {
      setCadastrando(false);
    }
  };

  const handleSincronizarXml = async (e: React.FormEvent) => {
    e.preventDefault();
    setSincronizandoXml(true);
    setXmlLog(null);

    try {
      const res = await fetch('/api/xml-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feedUrl: urlFeed }),
      });
      const data = await res.json();
      if (data.sucesso) {
        setXmlLog(`✅ Feed sincronizado com sucesso! Total lidos: ${data.totalLidos}. Novos imóveis importados: ${data.inseridos}.`);
      } else {
        setXmlLog(`❌ ${data.error || 'Erro na sincronização'}`);
      }
    } catch {
      setXmlLog('❌ Erro de conexão ao tentar processar o feed.');
    } finally {
      setSincronizandoXml(false);
    }
  };

  const totalCliques = imoveis.reduce(
    (total, imovel) => total + (imovel.total_cliques_whatsapp || 0),
    0
  );
  const totalVisualizacoes = imoveis.reduce(
    (total, imovel) => total + (imovel.total_visualizacoes || imovel.visualizacoes || 0),
    0
  );

  return (
    <div className="painel-page" style={{ background: '#F5F7FA', minHeight: '100vh', padding: '32px 24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        
        {/* Topo do Painel */}
        <div className="painel-topo" style={{ background: '#102B50', borderRadius: 16, padding: '28px 32px', color: 'white', marginBottom: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <span style={{ color: '#F5A900', fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Painel Profissional</span>
            <h1 style={{ fontSize: 24, fontWeight: 800, margin: '6px 0 0' }}>Gestão de Imóveis & CRM</h1>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={() => setTab('cadastrar')}
              style={{ background: '#F5A900', color: '#102B50', border: 'none', padding: '10px 20px', borderRadius: 8, fontWeight: 800, cursor: 'pointer', fontSize: 14 }}
            >
              + Novo Imóvel
            </button>
            <Link href="/" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', padding: '10px 18px', borderRadius: 8, textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>
              Ver Portal
            </Link>
          </div>
        </div>

        {/* Estatísticas Rápidas */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginBottom: 28 }}>
          {[
            { label: 'Total de Imóveis', valor: imoveis.length, emoji: '🏠' },
            { label: 'Cliques no WhatsApp', valor: totalCliques.toLocaleString('pt-BR'), emoji: '📱' },
            { label: 'Visualizações Totais', valor: totalVisualizacoes.toLocaleString('pt-BR'), emoji: '👁️' },
            { label: 'Leads no CRM', valor: leads.length.toLocaleString('pt-BR'), emoji: '📩' },
          ].map((item, idx) => (
            <div key={idx} style={{ background: 'white', borderRadius: 12, padding: 20, border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: 10, background: '#F5F7FA', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
                {item.emoji}
              </div>
              <div>
                <div style={{ color: '#6B7280', fontSize: 13 }}>{item.label}</div>
                <div style={{ color: '#102B50', fontSize: 22, fontWeight: 800 }}>{item.valor}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Abas */}
        <div className="tabs-scroll" style={{ display: 'flex', gap: 8, marginBottom: 20, borderBottom: '2px solid #E5E7EB' }}>
          {[
            { id: 'imoveis', label: 'Meus Imóveis' },
            { id: 'cadastrar', label: '+ Cadastrar Imóvel' },
            { id: 'leads', label: 'CRM de Leads' },
            { id: 'xml', label: 'Integração XML' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id as typeof tab)}
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

        {msgSucesso && (
          <div style={{ background: '#ECFDF5', color: '#065F46', padding: 14, borderRadius: 8, marginBottom: 20, fontWeight: 600 }}>
            {msgSucesso}
          </div>
        )}

        {/* Conteúdo Aba: Meus Imóveis */}
        {tab === 'imoveis' && (
          <div className="painel-conteudo" style={{ background: 'white', borderRadius: 16, padding: 24, border: '1px solid #E5E7EB' }}>
            <h2 style={{ fontSize: 18, color: '#102B50', fontWeight: 800, marginBottom: 16 }}>Carteira de Imóveis</h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', minWidth: 680, borderCollapse: 'collapse', textAlign: 'left', fontSize: 14 }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #F0F0F0', color: '#6B7280' }}>
                    <th style={{ padding: '12px 8px' }}>Imóvel</th>
                    <th style={{ padding: '12px 8px' }}>Tipo/Negócio</th>
                    <th style={{ padding: '12px 8px' }}>Preço</th>
                    <th style={{ padding: '12px 8px' }}>Destaque</th>
                    <th style={{ padding: '12px 8px' }}>WhatsApp</th>
                    <th style={{ padding: '12px 8px' }}>Status</th>
                    <th style={{ padding: '12px 8px', textAlign: 'right' }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {imoveis.map((imv) => (
                    <tr key={imv.id} style={{ borderBottom: '1px solid #F0F0F0' }}>
                      <td style={{ padding: '14px 8px', fontWeight: 600, color: '#1F2937' }}>
                        {imv.titulo}
                        <div style={{ fontSize: 12, color: '#9CA3AF', fontWeight: 400 }}>{imv.endereco.cidade} - {imv.endereco.estado_sigla}</div>
                      </td>
                      <td style={{ padding: '14px 8px', textTransform: 'capitalize' }}>
                        {imv.tipo} ({imv.negocio})
                      </td>
                      <td style={{ padding: '14px 8px', fontWeight: 700, color: '#102B50' }}>
                        {formatarPreco(imv.preco, imv.negocio)}
                      </td>
                      <td style={{ padding: '14px 8px' }}>
                        {imv.destaque ? (
                          <span style={{ background: '#FFFBEB', color: '#B45309', padding: '4px 8px', borderRadius: 4, fontSize: 12, fontWeight: 700 }}>⭐ Ativo</span>
                        ) : (
                          <span style={{ color: '#9CA3AF', fontSize: 12 }}>Padrão</span>
                        )}
                      </td>
                      <td style={{ padding: '14px 8px', color: '#059669', fontWeight: 700 }}>
                        {imv.total_cliques_whatsapp || 0} cliques
                      </td>
                      <td style={{ padding: '14px 8px' }}>
                        <span style={{ background: '#ECFDF5', color: '#065F46', padding: '4px 8px', borderRadius: 4, fontSize: 12, fontWeight: 600 }}>Ativo</span>
                      </td>
                      <td style={{ padding: '14px 8px', textAlign: 'right' }}>
                        <Link href={`/imovel/${imv.slug}`} style={{ color: '#102B50', fontWeight: 700, textDecoration: 'none', fontSize: 13 }}>
                          Ver →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Conteúdo Aba: Cadastrar Imóvel */}
        {tab === 'cadastrar' && (
          <div className="painel-conteudo" style={{ background: 'white', borderRadius: 16, padding: 32, border: '1px solid #E5E7EB', maxWidth: 700 }}>
            <h2 style={{ fontSize: 20, color: '#102B50', fontWeight: 800, marginBottom: 20 }}>Cadastro Gratuito de Imóvel</h2>
            <form onSubmit={handleCadastrarImovel} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Título do Anúncio</label>
                <input
                  type="text"
                  placeholder="Ex: Apartamento 3 quartos com varanda gourmet em Moema"
                  className="input-arclar"
                  required
                  value={novoTitulo}
                  onChange={(e) => setNovoTitulo(e.target.value)}
                />
              </div>

              <div className="form-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Finalidade</label>
                  <select value={novoNegocio} onChange={(e) => setNovoNegocio(e.target.value as 'venda' | 'aluguel')} className="input-arclar">
                    <option value="venda">Venda</option>
                    <option value="aluguel">Aluguel</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Tipo de Imóvel</label>
                  <select value={novoTipo} onChange={(e) => setNovoTipo(e.target.value)} className="input-arclar">
                    <option value="apartamento">Apartamento</option>
                    <option value="casa">Casa</option>
                    <option value="cobertura">Cobertura</option>
                    <option value="terreno">Terreno</option>
                    <option value="comercial">Comercial</option>
                  </select>
                </div>
              </div>

              <div className="form-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Preço (R$)</label>
                  <input
                    type="number"
                    placeholder="Ex: 450000"
                    className="input-arclar"
                    required
                    value={novoPreco}
                    onChange={(e) => setNovoPreco(e.target.value)}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Quartos</label>
                  <input
                    type="number"
                    placeholder="2"
                    className="input-arclar"
                    value={novoQuartos}
                    onChange={(e) => setNovoQuartos(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-grid-3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 100px', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Bairro</label>
                  <input
                    type="text"
                    placeholder="Ex: Gonzaga"
                    className="input-arclar"
                    value={novoBairro}
                    onChange={(e) => setNovoBairro(e.target.value)}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Cidade</label>
                  <input
                    type="text"
                    placeholder="Ex: Santos"
                    className="input-arclar"
                    value={novaCidade}
                    onChange={(e) => setNovaCidade(e.target.value)}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>UF</label>
                  <input
                    type="text"
                    placeholder="SP"
                    maxLength={2}
                    className="input-arclar"
                    value={novoEstado}
                    onChange={(e) => setNovoEstado(e.target.value.toUpperCase())}
                  />
                </div>
              </div>

              <UploadFotos value={fotos} onChange={setFotos} />

              <button
                type="submit"
                disabled={cadastrando}
                style={{
                  background: '#F5A900',
                  color: '#102B50',
                  border: 'none',
                  padding: 14,
                  borderRadius: 10,
                  fontWeight: 800,
                  fontSize: 15,
                  cursor: cadastrando ? 'not-allowed' : 'pointer',
                  marginTop: 10,
                }}
              >
                {cadastrando ? 'Publicando...' : 'Publicar Imóvel Gratuitamente'}
              </button>
            </form>
          </div>
        )}

        {/* Conteúdo Aba: CRM de Leads */}
        {tab === 'leads' && (
          <div style={{ background: 'white', borderRadius: 16, padding: 24, border: '1px solid #E5E7EB' }}>
            <h2 style={{ fontSize: 18, color: '#102B50', fontWeight: 800, marginBottom: 16 }}>Contatos e Leads Recebidos</h2>
            {leads.length === 0 ? (
              <p style={{ color: '#6B7280', fontSize: 14, lineHeight: 1.6 }}>
                Nenhum lead recebido ainda. Os contatos enviados pelo formulário dos imóveis aparecerão aqui.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {leads.map((lead) => (
                  <div key={lead.id} style={{ padding: 16, border: '1px solid #E5E7EB', borderRadius: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                    <div>
                      <div style={{ fontWeight: 700, color: '#1F2937', fontSize: 15 }}>{lead.nome}</div>
                      <div style={{ color: '#6B7280', fontSize: 13 }}>{lead.telefone} • {lead.email}</div>
                      <div style={{ color: '#102B50', fontSize: 13, fontWeight: 600, marginTop: 4 }}>
                        Imóvel: {lead.imovel_id.slice(0, 8)}
                      </div>
                      {lead.mensagem && (
                        <div style={{ color: '#6B7280', fontSize: 12, marginTop: 4 }}>{lead.mensagem}</div>
                      )}
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ background: '#FFFBEB', color: '#B45309', padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
                        {ROTULOS_LEAD[lead.status] || lead.status}
                      </span>
                      <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 6 }}>
                        {lead.criado_em ? new Date(lead.criado_em).toLocaleString('pt-BR') : ''}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Conteúdo Aba: Importação XML */}
        {tab === 'xml' && (
          <div className="painel-conteudo" style={{ background: 'white', borderRadius: 16, padding: 32, border: '1px solid #E5E7EB', maxWidth: 700 }}>
            <h2 style={{ fontSize: 20, color: '#102B50', fontWeight: 800, marginBottom: 12 }}>Sincronização de Feed XML</h2>
            <p style={{ color: '#6B7280', fontSize: 14, marginBottom: 20, lineHeight: 1.6 }}>
              Conecte o feed XML da sua imobiliária ou sistema CRM (compatível com os padrões VivaReal, Zap e ARC LAR).
            </p>
            <form onSubmit={handleSincronizarXml} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>URL do Feed XML</label>
                <input
                  type="url"
                  placeholder="https://seu-sistema.com.br/integracao/feed.xml"
                  className="input-arclar"
                  required
                  value={urlFeed}
                  onChange={(e) => setUrlFeed(e.target.value)}
                />
              </div>

              {xmlLog && (
                <div style={{ padding: 14, borderRadius: 8, background: '#F8FAFC', border: '1px solid #E2E8F0', fontSize: 13 }}>
                  {xmlLog}
                </div>
              )}

              <button
                type="submit"
                disabled={sincronizandoXml}
                style={{
                  background: '#102B50',
                  color: 'white',
                  border: 'none',
                  padding: 14,
                  borderRadius: 10,
                  fontWeight: 800,
                  fontSize: 15,
                  cursor: sincronizandoXml ? 'not-allowed' : 'pointer',
                }}
              >
                {sincronizandoXml ? 'Sincronizando feed...' : 'Sincronizar Carteira Agora'}
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}

