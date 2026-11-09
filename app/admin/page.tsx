'use client';

import { useEffect, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { CONFIGURACOES_SITE_PADRAO, type ConfiguracoesSite } from '@/lib/configuracoes';
import type { ParceiroLead } from '@/lib/supabase/parceiros';
import type { AnuncianteItem } from '@/app/api/anunciantes/route';

const ROTULOS_TIPO_PARCERIA: Record<string, string> = {
  imobiliaria: 'Imobiliária',
  corretor: 'Corretor(a)',
  portal: 'Portal / Divulgação',
  outro: 'Outro',
};

export default function AdminPage() {
  const [tab, setTab] = useState<'geral' | 'anunciantes' | 'planos' | 'parceiros' | 'redes' | 'xml'>('geral');
  const [parceiros, setParceiros] = useState<ParceiroLead[]>([]);
  const [carregandoParceiros, setCarregandoParceiros] = useState(false);
  const [configuracoes, setConfiguracoes] = useState<ConfiguracoesSite>(CONFIGURACOES_SITE_PADRAO);
  const [carregandoConfiguracoes, setCarregandoConfiguracoes] = useState(false);
  const [salvandoConfiguracoes, setSalvandoConfiguracoes] = useState(false);
  const [mensagemConfiguracoes, setMensagemConfiguracoes] = useState<{ tipo: 'sucesso' | 'erro'; texto: string } | null>(null);

  // Estados da Aba de Anunciantes & Moderação (CRUD)
  const [anunciantes, setAnunciantes] = useState<AnuncianteItem[]>([]);
  const [carregandoAnunciantes, setCarregandoAnunciantes] = useState(false);
  const [filtroAnunciante, setFiltroAnunciante] = useState('');
  const [modalAberto, setModalAberto] = useState(false);
  const [anuncianteEditando, setAnuncianteEditando] = useState<AnuncianteItem | null>(null);
  const [salvandoAnunciante, setSalvandoAnunciante] = useState(false);
  const [mensagemAnunciante, setMensagemAnunciante] = useState<{ tipo: 'sucesso' | 'erro'; texto: string } | null>(null);

  // Campos do formulário de anunciante
  const [formNome, setFormNome] = useState('');
  const [formNomeComercial, setFormNomeComercial] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formTelefone, setFormTelefone] = useState('');
  const [formWhatsapp, setFormWhatsapp] = useState('');
  const [formCreci, setFormCreci] = useState('');
  const [formPerfil, setFormPerfil] = useState<'imobiliaria' | 'corretor' | 'proprietario'>('imobiliaria');
  const [formPlano, setFormPlano] = useState('Profissional');
  const [formStatus, setFormStatus] = useState<'Ativo' | 'Pendente' | 'Bloqueado'>('Ativo');

  // Carregar parceiros
  useEffect(() => {
    if (tab !== 'parceiros') return;
    let ativo = true;
    fetch('/api/parceiros', { cache: 'no-store' })
      .then((resposta) => (resposta.ok ? resposta.json() : { leads: [] }))
      .then((dados) => {
        if (ativo && Array.isArray(dados.leads)) setParceiros(dados.leads);
      })
      .catch(() => {
        if (ativo) setParceiros([]);
      })
      .finally(() => {
        if (ativo) setCarregandoParceiros(false);
      });
    return () => { ativo = false; };
  }, [tab]);

  // Carregar configurações de redes
  useEffect(() => {
    if (tab !== 'redes') return;
    let ativo = true;
    fetch('/api/configuracoes', { cache: 'no-store' })
      .then((resposta) => (resposta.ok ? resposta.json() : Promise.reject(new Error('Falha ao carregar configurações.'))))
      .then((dados) => {
        if (ativo && dados?.configuracoes) {
          setConfiguracoes({ ...CONFIGURACOES_SITE_PADRAO, ...dados.configuracoes });
        }
      })
      .catch(() => {
        if (ativo) setMensagemConfiguracoes({ tipo: 'erro', texto: 'Não foi possível carregar as configurações.' });
      })
      .finally(() => {
        if (ativo) setCarregandoConfiguracoes(false);
      });
    return () => { ativo = false; };
  }, [tab]);

  // Carregar anunciantes
  useEffect(() => {
    if (tab !== 'anunciantes') return;
    carregarListaAnunciantes();
  }, [tab]);

  function carregarListaAnunciantes() {
    setCarregandoAnunciantes(true);
    fetch('/api/anunciantes', { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : { anunciantes: [] }))
      .then((dados) => {
        if (Array.isArray(dados.anunciantes)) {
          setAnunciantes(dados.anunciantes);
        }
      })
      .catch(() => {})
      .finally(() => setCarregandoAnunciantes(false));
  }

  function abrirModalNovo() {
    setAnuncianteEditando(null);
    setFormNome('');
    setFormNomeComercial('');
    setFormEmail('');
    setFormTelefone('');
    setFormWhatsapp('');
    setFormCreci('');
    setFormPerfil('imobiliaria');
    setFormPlano('Profissional');
    setFormStatus('Ativo');
    setMensagemAnunciante(null);
    setModalAberto(true);
  }

  function abrirModalEditar(a: AnuncianteItem) {
    setAnuncianteEditando(a);
    setFormNome(a.nome);
    setFormNomeComercial(a.nome_comercial);
    setFormEmail(a.email);
    setFormTelefone(a.telefone || '');
    setFormWhatsapp(a.whatsapp || '');
    setFormCreci(a.creci || '');
    setFormPerfil(a.perfil);
    setFormPlano(a.plano);
    setFormStatus(a.status);
    setMensagemAnunciante(null);
    setModalAberto(true);
  }

  async function handleSalvarAnunciante(e: FormEvent) {
    e.preventDefault();
    setSalvandoAnunciante(true);
    setMensagemAnunciante(null);

    const payload = {
      id: anuncianteEditando ? anuncianteEditando.id : undefined,
      nome: formNome,
      nome_comercial: formNomeComercial || formNome,
      email: formEmail,
      telefone: formTelefone,
      whatsapp: formWhatsapp,
      creci: formCreci,
      perfil: formPerfil,
      plano: formPlano,
      status: formStatus,
    };

    try {
      const res = await fetch('/api/anunciantes', {
        method: anuncianteEditando ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Erro ao salvar anunciante.');

      setModalAberto(false);
      carregarListaAnunciantes();
    } catch (err: any) {
      setMensagemAnunciante({ tipo: 'erro', texto: err.message || 'Erro ao processar.' });
    } finally {
      setSalvandoAnunciante(false);
    }
  }

  async function handleExcluirAnunciante(id: string, nome: string) {
    if (!confirm(`Tem certeza que deseja excluir o anunciante "${nome}"? Esta ação removerá os acessos.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/anunciantes?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Não foi possível excluir.');
      carregarListaAnunciantes();
    } catch {
      alert('Erro ao excluir o anunciante.');
    }
  }

  function atualizarConfiguracao(campo: keyof ConfiguracoesSite, valor: string) {
    setConfiguracoes((anteriores) => ({ ...anteriores, [campo]: valor }));
  }

  async function salvarConfiguracoesSite(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setSalvandoConfiguracoes(true);
    setMensagemConfiguracoes(null);

    try {
      const resposta = await fetch('/api/configuracoes', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(configuracoes),
      });
      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(dados?.error || 'Erro ao salvar as configurações.');
      }

      setConfiguracoes({ ...CONFIGURACOES_SITE_PADRAO, ...dados.configuracoes });
      setMensagemConfiguracoes({
        tipo: 'sucesso',
        texto: dados.persistido
          ? 'Configurações salvas e publicadas no site.'
          : 'Configurações salvas para esta sessão. Configure o Supabase para persistir.',
      });
    } catch (erro) {
      setMensagemConfiguracoes({
        tipo: 'erro',
        texto: erro instanceof Error ? erro.message : 'Erro ao salvar as configurações.',
      });
    } finally {
      setSalvandoConfiguracoes(false);
    }
  }

  const anunciantesFiltrados = anunciantes.filter((a) => {
    if (!filtroAnunciante) return true;
    const busca = filtroAnunciante.toLowerCase();
    return (
      a.nome.toLowerCase().includes(busca) ||
      a.nome_comercial.toLowerCase().includes(busca) ||
      a.email.toLowerCase().includes(busca) ||
      (a.creci && a.creci.toLowerCase().includes(busca))
    );
  });

  return (
    <div className="painel-page" style={{ background: '#F5F7FA', minHeight: '100vh', padding: '32px 24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        
        {/* Cabeçalho Admin */}
        <div className="painel-topo" style={{ background: '#0a1f3a', borderRadius: 16, padding: '24px 32px', color: 'white', marginBottom: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
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
            { label: 'Anunciantes Cadastrados', valor: anunciantes.length > 0 ? String(anunciantes.length) : '1.240', cor: '#102B50' },
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
        <div className="tabs-scroll" style={{ display: 'flex', gap: 8, marginBottom: 20, borderBottom: '2px solid #E5E7EB' }}>
          {[
            { id: 'geral', label: 'Visão Geral' },
            { id: 'anunciantes', label: 'Anunciantes & Moderação' },
            { id: 'planos', label: 'Planos & Mercado Pago' },
            { id: 'parceiros', label: 'Parceiros' },
            { id: 'redes', label: 'Redes & Atendimento' },
            { id: 'xml', label: 'Feeds XML & Integrações' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => {
                if (t.id === 'parceiros' && tab !== 'parceiros') setCarregandoParceiros(true);
                if (t.id === 'redes' && tab !== 'redes') {
                  setCarregandoConfiguracoes(true);
                  setMensagemConfiguracoes(null);
                }
                setTab(t.id as typeof tab);
              }}
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
        <div className="painel-conteudo" style={{ background: 'white', borderRadius: 16, padding: 28, border: '1px solid #E5E7EB' }}>
          {tab === 'geral' && (
            <div>
              <h2 style={{ fontSize: 18, color: '#102B50', fontWeight: 800, marginBottom: 16 }}>Status da Plataforma</h2>
              <p style={{ color: '#4B5563', fontSize: 14, lineHeight: 1.6 }}>
                Ambiente de produção conectado com monitoramento em tempo real de indexação SEO, sitemap ativo, tracking de contatos via WhatsApp e banco de dados relacional.
              </p>
            </div>
          )}

          {/* ABA ANUNCIANTES & MODERAÇÃO COM CRUD COMPLETO */}
          {tab === 'anunciantes' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <h2 style={{ fontSize: 18, color: '#102B50', fontWeight: 800, margin: 0 }}>Anunciantes & Moderação</h2>
                  <p style={{ color: '#6B7280', fontSize: 13, margin: '4px 0 0' }}>
                    Cadastre, edite, aprove ou exclua imobiliárias, corretores e proprietários do portal.
                  </p>
                </div>
                <button
                  onClick={abrirModalNovo}
                  style={{
                    background: '#102B50',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: 8,
                    fontWeight: 700,
                    fontSize: 14,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <span>+</span> Cadastrar Anunciante
                </button>
              </div>

              {/* Barra de Filtro */}
              <div style={{ marginBottom: 16 }}>
                <input
                  type="text"
                  placeholder="🔍 Buscar por nome comercial, e-mail ou CRECI..."
                  value={filtroAnunciante}
                  onChange={(e) => setFiltroAnunciante(e.target.value)}
                  className="input-arclar"
                  style={{ maxWidth: 420 }}
                />
              </div>

              {carregandoAnunciantes ? (
                <div style={{ padding: '32px 0', textAlign: 'center', color: '#6B7280', fontSize: 14 }}>
                  Carregando anunciantes...
                </div>
              ) : anunciantesFiltrados.length === 0 ? (
                <div style={{ padding: '32px 0', textAlign: 'center', color: '#6B7280', fontSize: 14 }}>
                  Nenhum anunciante encontrado.
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', minWidth: 680, borderCollapse: 'collapse', textAlign: 'left', fontSize: 14 }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid #F0F0F0', color: '#6B7280' }}>
                        <th style={{ padding: '12px 10px' }}>Nome / Razão Social</th>
                        <th style={{ padding: '12px 10px' }}>Contato / WhatsApp</th>
                        <th style={{ padding: '12px 10px' }}>Perfil / CRECI</th>
                        <th style={{ padding: '12px 10px' }}>Plano</th>
                        <th style={{ padding: '12px 10px' }}>Status</th>
                        <th style={{ padding: '12px 10px', textAlign: 'right' }}>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {anunciantesFiltrados.map((item) => (
                        <tr key={item.id} style={{ borderBottom: '1px solid #F0F0F0' }}>
                          <td style={{ padding: '12px 10px' }}>
                            <div style={{ fontWeight: 700, color: '#102B50' }}>{item.nome_comercial}</div>
                            <div style={{ fontSize: 12, color: '#6B7280' }}>{item.nome} • {item.email}</div>
                          </td>
                          <td style={{ padding: '12px 10px' }}>
                            <div style={{ color: '#1F2937' }}>{item.whatsapp || item.telefone || '—'}</div>
                            {item.whatsapp && (
                              <a
                                href={`https://wa.me/${item.whatsapp.replace(/\D/g, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ fontSize: 11, color: '#059669', textDecoration: 'none', fontWeight: 600 }}
                              >
                                💬 Abrir WhatsApp
                              </a>
                            )}
                          </td>
                          <td style={{ padding: '12px 10px' }}>
                            <div style={{ textTransform: 'capitalize', fontWeight: 600, color: '#374151' }}>
                              {item.perfil}
                            </div>
                            {item.creci ? (
                              <div style={{ fontSize: 12, color: '#6B7280' }}>CRECI: {item.creci}</div>
                            ) : (
                              <div style={{ fontSize: 12, color: '#9CA3AF' }}>Sem CRECI</div>
                            )}
                          </td>
                          <td style={{ padding: '12px 10px', fontWeight: 700, color: '#102B50' }}>
                            {item.plano}
                          </td>
                          <td style={{ padding: '12px 10px' }}>
                            <span
                              style={{
                                background: item.status === 'Ativo' ? '#ECFDF5' : item.status === 'Pendente' ? '#FFFBEB' : '#FEE2E2',
                                color: item.status === 'Ativo' ? '#065F46' : item.status === 'Pendente' ? '#B45309' : '#991B1B',
                                padding: '3px 8px',
                                borderRadius: 4,
                                fontSize: 12,
                                fontWeight: 700,
                              }}
                            >
                              {item.status}
                            </span>
                          </td>
                          <td style={{ padding: '12px 10px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                            <button
                              onClick={() => abrirModalEditar(item)}
                              style={{
                                background: '#F5A900',
                                color: '#102B50',
                                border: 'none',
                                padding: '6px 12px',
                                borderRadius: 6,
                                fontWeight: 700,
                                fontSize: 12,
                                cursor: 'pointer',
                                marginRight: 6,
                              }}
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => handleExcluirAnunciante(item.id, item.nome_comercial)}
                              style={{
                                background: '#EF4444',
                                color: 'white',
                                border: 'none',
                                padding: '6px 10px',
                                borderRadius: 6,
                                fontWeight: 600,
                                fontSize: 12,
                                cursor: 'pointer',
                              }}
                            >
                              Excluir
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
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

          {tab === 'parceiros' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
                <h2 style={{ fontSize: 18, color: '#102B50', fontWeight: 800, margin: 0 }}>
                  Solicitações de Parceria ({parceiros.length})
                </h2>
                <span style={{ fontSize: 12, color: '#64748b' }}>
                  Recebidas via página pública <code>/parceiros</code>
                </span>
              </div>

              {carregandoParceiros ? (
                <p style={{ color: '#64748b', fontSize: 14 }}>Carregando solicitações...</p>
              ) : parceiros.length === 0 ? (
                <div style={{ padding: '36px 16px', textAlign: 'center', color: '#64748b', fontSize: 14 }}>
                  Nenhuma solicitação de parceria registrada até o momento.
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', minWidth: 620, borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid #F0F0F0', color: '#6B7280' }}>
                        <th style={{ padding: '10px 8px' }}>Nome / Empresa</th>
                        <th style={{ padding: '10px 8px' }}>Tipo</th>
                        <th style={{ padding: '10px 8px' }}>Contato</th>
                        <th style={{ padding: '10px 8px' }}>Localidade</th>
                        <th style={{ padding: '10px 8px' }}>Imóveis</th>
                        <th style={{ padding: '10px 8px' }}>Mensagem</th>
                        <th style={{ padding: '10px 8px' }}>Data</th>
                      </tr>
                    </thead>
                    <tbody>
                      {parceiros.map((item) => (
                        <tr key={item.id} style={{ borderBottom: '1px solid #F0F0F0' }}>
                          <td style={{ padding: '10px 8px', fontWeight: 700, color: '#102B50' }}>
                            {item.nome}
                            {item.empresa && (
                              <div style={{ fontWeight: 400, color: '#64748b', fontSize: 12 }}>{item.empresa}</div>
                            )}
                          </td>
                          <td style={{ padding: '10px 8px' }}>
                            <span style={{ background: '#f1f5f9', color: '#334155', padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600 }}>
                              {ROTULOS_TIPO_PARCERIA[item.tipo] || item.tipo}
                            </span>
                          </td>
                          <td style={{ padding: '10px 8px' }}>
                            <div>{item.email}</div>
                            <div style={{ color: '#059669', fontWeight: 600 }}>{item.telefone}</div>
                          </td>
                          <td style={{ padding: '10px 8px' }}>
                            {item.cidade ? `${item.cidade}${item.estado ? ` - ${item.estado}` : ''}` : '—'}
                          </td>
                          <td style={{ padding: '10px 8px', color: '#64748b' }}>{item.volume_imoveis || '—'}</td>
                          <td style={{ padding: '10px 8px', maxWidth: 220, color: '#334155' }} title={item.mensagem || ''}>
                            {item.mensagem ? (
                              <span style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                {item.mensagem}
                              </span>
                            ) : (
                              '—'
                            )}
                          </td>
                          <td style={{ padding: '10px 8px', color: '#64748b', whiteSpace: 'nowrap', fontSize: 11 }}>
                            {item.criado_em ? new Date(item.criado_em).toLocaleDateString('pt-BR') : '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {tab === 'redes' && (
            <div>
              <div style={{ marginBottom: 20 }}>
                <h2 style={{ fontSize: 18, color: '#102B50', fontWeight: 800, margin: 0 }}>
                  Redes Sociais & Canais de Atendimento
                </h2>
                <p style={{ color: '#6B7280', fontSize: 13, margin: '4px 0 0' }}>
                  Edite aqui os links que aparecem no topo do site, na página de contato e na central de links.
                </p>
              </div>

              {mensagemConfiguracoes && (
                <div
                  style={{
                    padding: '12px 16px',
                    borderRadius: 8,
                    marginBottom: 20,
                    fontSize: 14,
                    background: mensagemConfiguracoes.tipo === 'sucesso' ? '#ECFDF5' : '#FEF2F2',
                    color: mensagemConfiguracoes.tipo === 'sucesso' ? '#065F46' : '#991B1B',
                    border: `1px solid ${mensagemConfiguracoes.tipo === 'sucesso' ? '#A7F3D0' : '#FECACA'}`,
                  }}
                >
                  {mensagemConfiguracoes.texto}
                </div>
              )}

              {carregandoConfiguracoes ? (
                <p style={{ color: '#64748b', fontSize: 14 }}>Carregando configurações...</p>
              ) : (
                <form onSubmit={salvarConfiguracoesSite} style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 720 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#102B50', marginBottom: 6 }}>
                        Telefone Principal
                      </label>
                      <input
                        type="text"
                        value={configuracoes.telefone}
                        onChange={(e) => atualizarConfiguracao('telefone', e.target.value)}
                        placeholder="(11) 3456-7890"
                        className="input-arclar"
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#102B50', marginBottom: 6 }}>
                        WhatsApp (apenas dígitos com DDD)
                      </label>
                      <input
                        type="text"
                        value={configuracoes.whatsapp}
                        onChange={(e) => atualizarConfiguracao('whatsapp', e.target.value)}
                        placeholder="5511999999999"
                        className="input-arclar"
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#102B50', marginBottom: 6 }}>
                        E-mail de Contato
                      </label>
                      <input
                        type="email"
                        value={configuracoes.email}
                        onChange={(e) => atualizarConfiguracao('email', e.target.value)}
                        placeholder="contato@arclar.com.br"
                        className="input-arclar"
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#102B50', marginBottom: 6 }}>
                        Horário de Atendimento
                      </label>
                      <input
                        type="text"
                        value={configuracoes.horario_atendimento}
                        onChange={(e) => atualizarConfiguracao('horario_atendimento', e.target.value)}
                        placeholder="Seg a Sex das 08h às 18h"
                        className="input-arclar"
                      />
                    </div>
                  </div>

                  <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: 16, marginTop: 4 }}>
                    <div style={{ fontSize: 14, fontWeight: 800, color: '#102B50', marginBottom: 12 }}>
                      Links das Redes Sociais
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      <div>
                        <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 4 }}>
                          Instagram
                        </label>
                        <input
                          type="url"
                          value={configuracoes.instagram_url}
                          onChange={(e) => atualizarConfiguracao('instagram_url', e.target.value)}
                          placeholder="https://www.instagram.com/seu_perfil"
                          className="input-arclar"
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 4 }}>
                          Facebook
                        </label>
                        <input
                          type="url"
                          value={configuracoes.facebook_url}
                          onChange={(e) => atualizarConfiguracao('facebook_url', e.target.value)}
                          placeholder="https://www.facebook.com/sua_pagina"
                          className="input-arclar"
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 4 }}>
                          TikTok
                        </label>
                        <input
                          type="url"
                          value={configuracoes.tiktok_url}
                          onChange={(e) => atualizarConfiguracao('tiktok_url', e.target.value)}
                          placeholder="https://www.tiktok.com/@seu_perfil"
                          className="input-arclar"
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 4 }}>
                          Perfil do Google (Google Meu Negócio / Avaliações)
                        </label>
                        <input
                          type="url"
                          value={configuracoes.google_url}
                          onChange={(e) => atualizarConfiguracao('google_url', e.target.value)}
                          placeholder="https://g.page/seu_negocio"
                          className="input-arclar"
                        />
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 12 }}>
                    <button
                      type="submit"
                      disabled={salvandoConfiguracoes}
                      style={{
                        background: '#102B50',
                        color: 'white',
                        border: 'none',
                        padding: '12px 28px',
                        borderRadius: 8,
                        fontWeight: 700,
                        fontSize: 14,
                        cursor: salvandoConfiguracoes ? 'not-allowed' : 'pointer',
                        opacity: salvandoConfiguracoes ? 0.7 : 1,
                      }}
                    >
                      {salvandoConfiguracoes ? 'Salvando...' : 'Salvar Configurações'}
                    </button>
                  </div>
                </form>
              )}
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

      {/* MODAL PARA CADASTRAR OU EDITAR ANUNCIANTE */}
      {modalAberto && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.55)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: 16,
          }}
        >
          <div
            style={{
              background: 'white',
              borderRadius: 16,
              width: '100%',
              maxWidth: 620,
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: 28,
              boxShadow: '0 24px 60px rgba(0,0,0,0.3)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: 19, color: '#102B50', fontWeight: 800, margin: 0 }}>
                {anuncianteEditando ? 'Editar Anunciante' : 'Novo Anunciante'}
              </h2>
              <button
                onClick={() => setModalAberto(false)}
                style={{ background: 'none', border: 'none', fontSize: 22, color: '#94a3b8', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            {mensagemAnunciante && (
              <div
                style={{
                  padding: '10px 14px',
                  borderRadius: 8,
                  marginBottom: 16,
                  fontSize: 13,
                  background: mensagemAnunciante.tipo === 'sucesso' ? '#ECFDF5' : '#FEF2F2',
                  color: mensagemAnunciante.tipo === 'sucesso' ? '#065F46' : '#991B1B',
                }}
              >
                {mensagemAnunciante.texto}
              </div>
            )}

            <form onSubmit={handleSalvarAnunciante} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 4 }}>
                    Nome Completo / Razão Social *
                  </label>
                  <input
                    type="text"
                    required
                    value={formNome}
                    onChange={(e) => setFormNome(e.target.value)}
                    placeholder="Ex: Prime Imóveis LTDA"
                    className="input-arclar"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 4 }}>
                    Nome Comercial / Fantasia
                  </label>
                  <input
                    type="text"
                    value={formNomeComercial}
                    onChange={(e) => setFormNomeComercial(e.target.value)}
                    placeholder="Ex: Prime Imóveis"
                    className="input-arclar"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 4 }}>
                    E-mail de Acesso *
                  </label>
                  <input
                    type="email"
                    required
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="contato@empresa.com.br"
                    className="input-arclar"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 4 }}>
                    CRECI (se houver)
                  </label>
                  <input
                    type="text"
                    value={formCreci}
                    onChange={(e) => setFormCreci(e.target.value)}
                    placeholder="Ex: 12345-J"
                    className="input-arclar"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 4 }}>
                    Telefone
                  </label>
                  <input
                    type="text"
                    value={formTelefone}
                    onChange={(e) => setFormTelefone(e.target.value)}
                    placeholder="(11) 3456-7890"
                    className="input-arclar"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 4 }}>
                    WhatsApp Direto
                  </label>
                  <input
                    type="text"
                    value={formWhatsapp}
                    onChange={(e) => setFormWhatsapp(e.target.value)}
                    placeholder="11999998888"
                    className="input-arclar"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 4 }}>
                    Tipo de Perfil
                  </label>
                  <select
                    value={formPerfil}
                    onChange={(e) => setFormPerfil(e.target.value as any)}
                    className="input-arclar"
                  >
                    <option value="imobiliaria">Imobiliária</option>
                    <option value="corretor">Corretor(a)</option>
                    <option value="proprietario">Proprietário(a)</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 4 }}>
                    Plano Atribuído
                  </label>
                  <select
                    value={formPlano}
                    onChange={(e) => setFormPlano(e.target.value)}
                    className="input-arclar"
                  >
                    <option value="Gratuito">Gratuito (Até 3)</option>
                    <option value="Básico">Básico (Até 20)</option>
                    <option value="Profissional">Profissional (Até 100)</option>
                    <option value="Imobiliária">Imobiliária (Ilimitado)</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 4 }}>
                    Status da Conta
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="input-arclar"
                  >
                    <option value="Ativo">Ativo (Aprovado)</option>
                    <option value="Pendente">Pendente de Análise</option>
                    <option value="Bloqueado">Bloqueado / Suspenso</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 14 }}>
                <button
                  type="button"
                  onClick={() => setModalAberto(false)}
                  style={{
                    background: '#F1F5F9',
                    color: '#475569',
                    border: 'none',
                    padding: '11px 20px',
                    borderRadius: 8,
                    fontWeight: 700,
                    fontSize: 14,
                    cursor: 'pointer',
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={salvandoAnunciante}
                  style={{
                    background: '#102B50',
                    color: 'white',
                    border: 'none',
                    padding: '11px 24px',
                    borderRadius: 8,
                    fontWeight: 700,
                    fontSize: 14,
                    cursor: salvandoAnunciante ? 'not-allowed' : 'pointer',
                    opacity: salvandoAnunciante ? 0.7 : 1,
                  }}
                >
                  {salvandoAnunciante ? 'Salvando...' : anuncianteEditando ? 'Salvar Alterações' : 'Cadastrar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
