'use client';

import { useEffect, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { CONFIGURACOES_SITE_PADRAO, type ConfiguracoesSite } from '@/lib/configuracoes';
import type { ParceiroLead } from '@/lib/supabase/parceiros';
import type { Plano } from '@/lib/planos';
import type { AnuncianteItem } from '@/app/api/anunciantes/route';
import type { Lead, NivelHierarquico, UsuarioAutenticado } from '@/types';
import { DESCRICAO_NIVEIS, podeAcessarAdmin } from '@/lib/auth/permissoes';
import BarraNivelHierarquico from '@/components/auth/BarraNivelHierarquico';

type PerfilAnunciante = AnuncianteItem['perfil'];
type StatusAnunciante = AnuncianteItem['status'];
type PlanoStatusAnunciante = AnuncianteItem['plano_status'];

const ROTULOS_TIPO_PARCERIA: Record<string, string> = {
  imobiliaria: 'Imobiliária',
  corretor: 'Corretor(a)',
  portal: 'Portal / Divulgação',
  outro: 'Outro',
};

export default function AdminPage() {
  // Controle de Sessão e Nível Hierárquico (RBAC)
  const [usuarioSessao, setUsuarioSessao] = useState<UsuarioAutenticado | null>(null);
  const [carregandoSessao, setCarregandoSessao] = useState(true);

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

  // Estados da Visão Geral (dashboard)
  const [totalImoveis, setTotalImoveis] = useState(0);
  const [leadsCrm, setLeadsCrm] = useState<Lead[]>([]);
  const [carregandoGeral, setCarregandoGeral] = useState(true);

  // Estados da aba de Planos
  const [planos, setPlanos] = useState<Plano[]>([]);
  const [carregandoPlanos, setCarregandoPlanos] = useState(false);
  const [planoEditando, setPlanoEditando] = useState<Plano | null>(null);
  const [salvandoPlano, setSalvandoPlano] = useState(false);
  const [mensagemPlano, setMensagemPlano] = useState<{ tipo: 'sucesso' | 'erro'; texto: string } | null>(null);

  // Campos do formulário de anunciante
  const [formNome, setFormNome] = useState('');
  const [formNomeComercial, setFormNomeComercial] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formTelefone, setFormTelefone] = useState('');
  const [formWhatsapp, setFormWhatsapp] = useState('');
  const [formCreci, setFormCreci] = useState('');
  const [formNivel, setFormNivel] = useState<NivelHierarquico>('corretor');
  const [formPerfil, setFormPerfil] = useState<'imobiliaria' | 'corretor' | 'proprietario' | 'admin_master' | 'cliente'>('imobiliaria');
  const [formPlano, setFormPlano] = useState('Profissional');
  const [formPlanoStatus, setFormPlanoStatus] = useState<PlanoStatusAnunciante>('ativo');
  const [formStatus, setFormStatus] = useState<'Ativo' | 'Pendente' | 'Bloqueado'>('Ativo');

  // Carregar dados de sessão do usuário logado
  useEffect(() => {
    let ativo = true;
    fetch('/api/auth/sessao', { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : null))
      .then((dados) => {
        if (ativo && dados?.usuario) {
          setUsuarioSessao(dados.usuario);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (ativo) setCarregandoSessao(false);
      });
    return () => { ativo = false; };
  }, []);

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

  // Carregar planos
  useEffect(() => {
    if (tab !== 'planos') return;
    carregarPlanos();
  }, [tab]);

  // Carregar dashboard da visão geral
  useEffect(() => {
    if (tab !== 'geral') return;
    let ativo = true;
    carregarListaAnunciantes();

    Promise.all([
      fetch('/api/imoveis', { cache: 'no-store' }).then((res) => (res.ok ? res.json() : { total: 0 })),
      fetch('/api/leads', { cache: 'no-store' }).then((res) => (res.ok ? res.json() : { leads: [] })),
    ])
      .then(([imoveisDados, leadsDados]) => {
        if (!ativo) return;
        setTotalImoveis(
          Number(imoveisDados.total) ||
            (Array.isArray(imoveisDados.imoveis) ? imoveisDados.imoveis.length : 0)
        );
        setLeadsCrm(Array.isArray(leadsDados.leads) ? leadsDados.leads : []);
      })
      .catch(() => {})
      .finally(() => {
        if (ativo) setCarregandoGeral(false);
      });

    return () => { ativo = false; };
  }, [tab]);

  function carregarPlanos() {
    setCarregandoPlanos(true);
    fetch('/api/planos', { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : { planos: [] }))
      .then((dados) => {
        if (Array.isArray(dados.planos)) {
          setPlanos(dados.planos);
        }
      })
      .catch(() => {})
      .finally(() => setCarregandoPlanos(false));
  }

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
    setFormNivel('corretor');
    setFormPerfil('imobiliaria');
    setFormPlano('Profissional');
    setFormPlanoStatus('ativo');
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
    setFormNivel(a.nivel || (a.perfil === 'admin_master' ? 'admin_master' : a.perfil === 'proprietario' ? 'cliente' : 'corretor'));
    setFormPerfil(a.perfil as PerfilAnunciante);
    setFormPlano(a.plano);
    setFormPlanoStatus(a.plano_status || 'ativo');
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
      nivel: formNivel,
      perfil: formPerfil,
      plano: formPlano,
      plano_status: formPlanoStatus,
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
    } catch (err) {
      setMensagemAnunciante({
        tipo: 'erro',
        texto: err instanceof Error ? err.message : 'Erro ao processar.',
      });
    } finally {
      setSalvandoAnunciante(false);
    }
  }

  async function handleAprovarAnunciante(item: AnuncianteItem) {
    try {
      const res = await fetch('/api/anunciantes', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: item.id,
          nivel: item.nivel,
          perfil: item.perfil,
          status: 'Ativo',
        }),
      });
      if (!res.ok) throw new Error('Não foi possível aprovar.');
      carregarListaAnunciantes();
    } catch {
      alert('Erro ao aprovar o anunciante.');
    }
  }

  async function handleConfirmarPlano(item: AnuncianteItem) {
    if (!confirm(`Confirmar o pagamento e ativar o plano "${item.plano}" de "${item.nome_comercial}"?`)) {
      return;
    }

    try {
      const res = await fetch('/api/anunciantes', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: item.id,
          plano: item.plano,
          plano_status: 'ativo',
          status: 'Ativo',
        }),
      });
      if (!res.ok) throw new Error('Não foi possível confirmar o plano.');
      carregarListaAnunciantes();
    } catch {
      alert('Erro ao confirmar o plano.');
    }
  }

  async function handleAlternarAcesso(item: AnuncianteItem) {
    const bloqueando = item.status !== 'Bloqueado';
    const novoStatus = bloqueando ? 'Bloqueado' : 'Ativo';
    const pergunta = bloqueando
      ? `Deseja cancelar o acesso de "${item.nome_comercial}"? O cadastro será mantido, mas o usuário não poderá entrar.`
      : `Deseja reativar o acesso de "${item.nome_comercial}"?`;

    if (!confirm(pergunta)) {
      return;
    }

    try {
      const res = await fetch('/api/anunciantes', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id, status: novoStatus }),
      });

      if (!res.ok) throw new Error('Não foi possível atualizar o acesso.');

      carregarListaAnunciantes();
      setMensagemAnunciante({
        tipo: 'sucesso',
        texto: bloqueando
          ? `Acesso de "${item.nome_comercial}" cancelado.`
          : `Acesso de "${item.nome_comercial}" reativado.`,
      });
    } catch {
      setMensagemAnunciante({ tipo: 'erro', texto: 'Erro ao atualizar o acesso do usuário.' });
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

  function abrirModalPlano(plano: Plano) {
    setPlanoEditando({ ...plano, features: [...plano.features] });
    setMensagemPlano(null);
  }

  function atualizarCampoPlano<K extends keyof Plano>(campo: K, valor: Plano[K]) {
    setPlanoEditando((atual) => (atual ? { ...atual, [campo]: valor } : atual));
  }

  async function handleSalvarPlano(evento: FormEvent) {
    evento.preventDefault();

    if (!planoEditando) return;

    setSalvandoPlano(true);
    setMensagemPlano(null);

    try {
      const res = await fetch('/api/planos', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(planoEditando),
      });
      const dados = await res.json();

      if (!res.ok) throw new Error(dados.error || 'Erro ao salvar plano.');

      setMensagemPlano({ tipo: 'sucesso', texto: 'Plano atualizado com sucesso.' });
      carregarPlanos();
    } catch (err) {
      setMensagemPlano({
        tipo: 'erro',
        texto: err instanceof Error ? err.message : 'Erro ao salvar plano.',
      });
    } finally {
      setSalvandoPlano(false);
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
      (a.creci && a.creci.toLowerCase().includes(busca)) ||
      (a.nivel && a.nivel.toLowerCase().includes(busca))
    );
  });

  const usuariosProfissionais = anunciantes.filter((a) => a.nivel === 'corretor');
  const usuariosClientes = anunciantes.filter((a) => a.nivel === 'cliente');
  const totalUsuarios = usuariosProfissionais.length + usuariosClientes.length;
  const planosPendentes = anunciantes.filter((a) => a.plano_status === 'pendente').length;
  const leadsNovos = leadsCrm.filter((lead) => lead.status === 'novo').length;

  // Verificação de Nível Hierárquico: se não for Admin Master, bloqueia o acesso
  if (!carregandoSessao && (!usuarioSessao || !podeAcessarAdmin(usuarioSessao.nivel))) {
    const isCorretor = usuarioSessao?.nivel === 'corretor';
    return (
      <div>
        <BarraNivelHierarquico onNivelAlterado={() => window.location.reload()} />
        <div style={{ minHeight: '85vh', background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ background: 'white', borderRadius: 16, padding: '40px 32px', maxWidth: 520, width: '100%', textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: 54, marginBottom: 12 }}>🔒</div>
            <span style={{ background: '#FEE2E2', color: '#991B1B', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1 }}>
              Acesso Restrito
            </span>
            <h1 style={{ color: '#0F172A', fontSize: 24, fontWeight: 900, marginTop: 14, marginBottom: 8 }}>
              Painel Exclusivo de Admin Master
            </h1>
            <p style={{ color: '#64748B', fontSize: 14, lineHeight: 1.6, marginBottom: 24 }}>
              {isCorretor ? (
                <>
                  Você está logado como <strong>Corretor / Imobiliária</strong>. O acesso a configurações globais, planos de pagamento e dados de outros corretores é restrito à administração geral. Seu painel dedicado de imóveis e leads está disponível abaixo.
                </>
              ) : (
                <>
                  Você está logado como <strong>Cliente / Comprador</strong>. O Painel Master é exclusivo para os administradores da plataforma ARC LAR.
                </>
              )}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {isCorretor && (
                <Link
                  href="/painel"
                  style={{
                    background: '#102B50',
                    color: 'white',
                    padding: '14px 20px',
                    borderRadius: 8,
                    fontWeight: 800,
                    fontSize: 15,
                    textDecoration: 'none',
                    display: 'block',
                  }}
                >
                  👔 Ir para Meu Painel de Corretor →
                </Link>
              )}
              <Link
                href="/"
                style={{
                  background: isCorretor ? '#F1F5F9' : '#102B50',
                  color: isCorretor ? '#334155' : 'white',
                  padding: '12px 20px',
                  borderRadius: 8,
                  fontWeight: 700,
                  fontSize: 14,
                  textDecoration: 'none',
                  display: 'block',
                }}
              >
                Voltar para a Página Inicial
              </Link>
            </div>
            <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid #F1F5F9', fontSize: 12, color: '#94A3B8' }}>
              💡 <em>Dica de desenvolvimento: Use a barra superior escura para alternar o papel para <strong>👑 Master</strong> e visualizar a administração.</em>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <BarraNivelHierarquico onNivelAlterado={() => window.location.reload()} />
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

        {/* Abas de Navegação */}
        <div className="tabs-scroll" style={{ display: 'flex', gap: 8, marginBottom: 20, borderBottom: '2px solid #E5E7EB' }}>
          {[
            { id: 'geral', label: 'Visão Geral' },
            { id: 'anunciantes', label: 'Usuários & Moderação' },
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
              <h2 style={{ fontSize: 18, color: '#102B50', fontWeight: 800, marginBottom: 4 }}>Visão Geral</h2>
              <p style={{ color: '#6B7280', fontSize: 13, margin: '0 0 20px' }}>
                Administração de usuários, carteira de imóveis e CRM da plataforma.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 16, marginBottom: 28 }}>
                {[
                  { label: 'Usuários cadastrados', valor: totalUsuarios, cor: '#102B50' },
                  { label: 'Imobiliárias e corretores', valor: usuariosProfissionais.length, cor: '#7C3AED' },
                  { label: 'Clientes', valor: usuariosClientes.length, cor: '#0EA5E9' },
                  { label: 'Imóveis cadastrados', valor: totalImoveis, cor: '#059669' },
                  { label: 'Leads no CRM', valor: leadsCrm.length, cor: '#F5A900' },
                  { label: 'Planos a confirmar', valor: planosPendentes, cor: '#DC2626' },
                ].map((metrica) => (
                  <div key={metrica.label} style={{ background: '#F8FAFC', borderRadius: 12, padding: 18, border: '1px solid #E5E7EB' }}>
                    <div style={{ color: '#6B7280', fontSize: 12, fontWeight: 600 }}>{metrica.label}</div>
                    <div style={{ color: metrica.cor, fontSize: 26, fontWeight: 900, marginTop: 4 }}>
                      {carregandoGeral ? '—' : metrica.valor}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
                <div style={{ border: '1px solid #E5E7EB', borderRadius: 12, padding: 20 }}>
                  <h3 style={{ fontSize: 15, color: '#102B50', fontWeight: 800, margin: '0 0 14px' }}>
                    Imobiliárias e corretores ({usuariosProfissionais.length})
                  </h3>
                  {usuariosProfissionais.length === 0 ? (
                    <p style={{ color: '#94A3B8', fontSize: 13, margin: 0 }}>Nenhum profissional cadastrado.</p>
                  ) : (
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {usuariosProfissionais.map((usuario) => (
                        <li
                          key={usuario.id}
                          style={{ padding: '10px 12px', background: '#F8FAFC', borderRadius: 8, fontSize: 14, fontWeight: 600, color: '#102B50' }}
                        >
                          {usuario.nome_comercial || usuario.nome}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div style={{ border: '1px solid #E5E7EB', borderRadius: 12, padding: 20 }}>
                  <h3 style={{ fontSize: 15, color: '#102B50', fontWeight: 800, margin: '0 0 14px' }}>
                    Clientes ({usuariosClientes.length})
                  </h3>
                  {usuariosClientes.length === 0 ? (
                    <p style={{ color: '#94A3B8', fontSize: 13, margin: 0 }}>Nenhum cliente cadastrado.</p>
                  ) : (
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {usuariosClientes.map((usuario) => (
                        <li
                          key={usuario.id}
                          style={{ padding: '10px 12px', background: '#F8FAFC', borderRadius: 8, fontSize: 14, fontWeight: 600, color: '#102B50' }}
                        >
                          {usuario.nome}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div style={{ border: '1px solid #E5E7EB', borderRadius: 12, padding: 20 }}>
                  <h3 style={{ fontSize: 15, color: '#102B50', fontWeight: 800, margin: '0 0 14px' }}>CRM</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 14, color: '#374151' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Total de leads</span>
                      <strong style={{ color: '#102B50' }}>{leadsCrm.length}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Leads novos</span>
                      <strong style={{ color: '#059669' }}>{leadsNovos}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Planos a confirmar</span>
                      <strong style={{ color: planosPendentes > 0 ? '#DC2626' : '#059669' }}>{planosPendentes}</strong>
                    </div>
                  </div>
                  <Link
                    href="/painel"
                    style={{
                      display: 'inline-block',
                      marginTop: 16,
                      background: '#102B50',
                      color: 'white',
                      padding: '10px 18px',
                      borderRadius: 8,
                      fontSize: 13,
                      fontWeight: 700,
                      textDecoration: 'none',
                    }}
                  >
                    Abrir CRM →
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* ABA ANUNCIANTES & MODERAÇÃO COM CRUD COMPLETO */}
          {tab === 'anunciantes' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <h2 style={{ fontSize: 18, color: '#102B50', fontWeight: 800, margin: 0 }}>Usuários & Moderação</h2>
                  <p style={{ color: '#6B7280', fontSize: 13, margin: '4px 0 0' }}>
                    Todos os cadastros do portal: edite, cancele/reative o acesso, aprove ou exclua imobiliárias, corretores e clientes.
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
                  <table style={{ width: '100%', minWidth: 780, borderCollapse: 'collapse', textAlign: 'left', fontSize: 14 }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid #F0F0F0', color: '#6B7280' }}>
                        <th style={{ padding: '12px 10px' }}>Nome / Razão Social</th>
                        <th style={{ padding: '12px 10px' }}>Nível Hierárquico</th>
                        <th style={{ padding: '12px 10px' }}>Contato / WhatsApp</th>
                        <th style={{ padding: '12px 10px' }}>Perfil / CRECI</th>
                        <th style={{ padding: '12px 10px' }}>Plano</th>
                        <th style={{ padding: '12px 10px' }}>Status</th>
                        <th style={{ padding: '12px 10px', textAlign: 'right' }}>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {anunciantesFiltrados.map((item) => {
                        const nivelItem = item.nivel || (item.perfil === 'admin_master' ? 'admin_master' : item.perfil === 'proprietario' ? 'cliente' : 'corretor');
                        const infoNivel = DESCRICAO_NIVEIS[nivelItem] || DESCRICAO_NIVEIS.corretor;

                        return (
                          <tr key={item.id} style={{ borderBottom: '1px solid #F0F0F0' }}>
                            <td style={{ padding: '12px 10px' }}>
                              <div style={{ fontWeight: 700, color: '#102B50' }}>{item.nome_comercial}</div>
                              <div style={{ fontSize: 12, color: '#6B7280' }}>{item.nome} • {item.email}</div>
                            </td>
                            <td style={{ padding: '12px 10px' }}>
                              <span
                                style={{
                                  background: infoNivel.bg,
                                  color: infoNivel.cor,
                                  padding: '4px 8px',
                                  borderRadius: 6,
                                  fontSize: 12,
                                  fontWeight: 800,
                                  display: 'inline-block',
                                }}
                              >
                                {infoNivel.badge}
                              </span>
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
                          <td style={{ padding: '12px 10px' }}>
                            <div style={{ fontWeight: 700, color: '#102B50' }}>{item.plano}</div>
                            {item.plano_status === 'pendente' && (
                              <div style={{ fontSize: 11, color: '#B45309', fontWeight: 700 }}>Pagamento a confirmar</div>
                            )}
                            {item.plano_status === 'cancelado' && (
                              <div style={{ fontSize: 11, color: '#991B1B', fontWeight: 700 }}>Cancelado</div>
                            )}
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
                            {item.status === 'Pendente' && (
                              <button
                                onClick={() => handleAprovarAnunciante(item)}
                                style={{
                                  background: '#059669',
                                  color: 'white',
                                  border: 'none',
                                  padding: '6px 10px',
                                  borderRadius: 6,
                                  fontWeight: 700,
                                  fontSize: 12,
                                  cursor: 'pointer',
                                  marginRight: 6,
                                }}
                              >
                                Aprovar
                              </button>
                            )}
                            {item.plano_status === 'pendente' && (
                              <button
                                onClick={() => handleConfirmarPlano(item)}
                                style={{
                                  background: '#0EA5E9',
                                  color: 'white',
                                  border: 'none',
                                  padding: '6px 10px',
                                  borderRadius: 6,
                                  fontWeight: 700,
                                  fontSize: 12,
                                  cursor: 'pointer',
                                  marginRight: 6,
                                }}
                              >
                                Confirmar plano
                              </button>
                            )}
                            {item.nivel !== 'admin_master' && (
                              <button
                                onClick={() => handleAlternarAcesso(item)}
                                style={{
                                  background: item.status === 'Bloqueado' ? '#ECFDF5' : '#FEF2F2',
                                  color: item.status === 'Bloqueado' ? '#065F46' : '#991B1B',
                                  border: item.status === 'Bloqueado' ? '1px solid #6EE7B7' : '1px solid #FCA5A5',
                                  padding: '6px 10px',
                                  borderRadius: 6,
                                  fontWeight: 700,
                                  fontSize: 12,
                                  cursor: 'pointer',
                                  marginRight: 6,
                                }}
                              >
                                {item.status === 'Bloqueado' ? 'Reativar acesso' : 'Cancelar acesso'}
                              </button>
                            )}
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
                            {item.nivel !== 'admin_master' && (
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
                            )}
                          </td>
                        </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {tab === 'planos' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <h2 style={{ fontSize: 18, color: '#102B50', fontWeight: 800, margin: 0 }}>Gestão de Planos & Cobrança</h2>
                  <p style={{ color: '#6B7280', fontSize: 14, margin: '4px 0 0' }}>
                    Edite nome, descrição, preço, limites e recursos dos planos exibidos no portal.
                  </p>
                </div>
                <button
                  onClick={carregarPlanos}
                  style={{
                    background: '#F1F5F9',
                    color: '#475569',
                    border: 'none',
                    padding: '9px 16px',
                    borderRadius: 8,
                    fontWeight: 700,
                    fontSize: 13,
                    cursor: 'pointer',
                  }}
                >
                  Atualizar lista
                </button>
              </div>

              {mensagemPlano && (
                <div
                  style={{
                    padding: '10px 14px',
                    borderRadius: 8,
                    marginBottom: 16,
                    fontSize: 13,
                    background: mensagemPlano.tipo === 'sucesso' ? '#ECFDF5' : '#FEF2F2',
                    color: mensagemPlano.tipo === 'sucesso' ? '#065F46' : '#991B1B',
                  }}
                >
                  {mensagemPlano.texto}
                </div>
              )}

              {carregandoPlanos ? (
                <div style={{ padding: '32px 0', textAlign: 'center', color: '#6B7280', fontSize: 14 }}>
                  Carregando planos...
                </div>
              ) : planos.length === 0 ? (
                <div style={{ padding: '32px 0', textAlign: 'center', color: '#6B7280', fontSize: 14 }}>
                  Nenhum plano encontrado.
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
                  {planos.map((plano) => (
                    <div key={plano.id} style={{ padding: 16, borderRadius: 10, border: '1px solid #E5E7EB', background: '#F8FAFC' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                        <div style={{ fontWeight: 800, color: '#102B50' }}>{plano.nome}</div>
                        <span
                          style={{
                            background: plano.ativo ? '#ECFDF5' : '#FEE2E2',
                            color: plano.ativo ? '#065F46' : '#991B1B',
                            padding: '2px 8px',
                            borderRadius: 4,
                            fontSize: 11,
                            fontWeight: 700,
                          }}
                        >
                          {plano.ativo ? 'Ativo' : 'Inativo'}
                        </span>
                      </div>
                      <div style={{ fontSize: 18, fontWeight: 900, color: '#F5A900', margin: '6px 0' }}>
                        R$ {plano.preco_mensal.toLocaleString('pt-BR')}/mês
                      </div>
                      <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 4 }}>
                        {plano.limite_imoveis >= 9999 ? 'Imóveis ilimitados' : `Até ${plano.limite_imoveis} imóveis`}
                      </div>
                      <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 12 }}>
                        {plano.destaque_incluso} destaques • {plano.super_destaque_incluso} super destaques
                      </div>
                      <button
                        onClick={() => abrirModalPlano(plano)}
                        style={{
                          background: '#102B50',
                          color: 'white',
                          border: 'none',
                          padding: '8px 14px',
                          borderRadius: 8,
                          fontWeight: 700,
                          fontSize: 13,
                          cursor: 'pointer',
                          width: '100%',
                        }}
                      >
                        Editar plano
                      </button>
                    </div>
                  ))}
                </div>
              )}
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
                              {ROTULOS_TIPO_PARCERIA[item.tipo_parceria] || item.tipo_parceria}
                            </span>
                          </td>
                          <td style={{ padding: '10px 8px' }}>
                            <div>{item.email}</div>
                            <div style={{ color: '#059669', fontWeight: 600 }}>{item.telefone}</div>
                          </td>
                          <td style={{ padding: '10px 8px' }}>
                            {item.cidade || '—'}
                          </td>
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
                        Atendimento Humano
                      </label>
                      <input
                        type="text"
                        value={configuracoes.atendimento_humano}
                        onChange={(e) => atualizarConfiguracao('atendimento_humano', e.target.value)}
                        placeholder="Seg a sex, das 8h às 18h"
                        className="input-arclar"
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#102B50', marginBottom: 6 }}>
                        Atendimento Virtual
                      </label>
                      <input
                        type="text"
                        value={configuracoes.atendimento_virtual}
                        onChange={(e) => atualizarConfiguracao('atendimento_virtual', e.target.value)}
                        placeholder="Atendimento virtual 24h"
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
                          value={configuracoes.instagram}
                          onChange={(e) => atualizarConfiguracao('instagram', e.target.value)}
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
                          value={configuracoes.facebook}
                          onChange={(e) => atualizarConfiguracao('facebook', e.target.value)}
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
                          value={configuracoes.tiktok}
                          onChange={(e) => atualizarConfiguracao('tiktok', e.target.value)}
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
                          value={configuracoes.google}
                          onChange={(e) => atualizarConfiguracao('google', e.target.value)}
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
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#102B50', marginBottom: 4 }}>
                    Nível Hierárquico *
                  </label>
                  <select
                    value={formNivel}
                    onChange={(e) => {
                      const nv = e.target.value as NivelHierarquico;
                      setFormNivel(nv);
                      if (nv === 'admin_master') setFormPerfil('admin_master');
                      else if (nv === 'cliente') setFormPerfil('proprietario');
                      else setFormPerfil('corretor');
                    }}
                    className="input-arclar"
                    style={{ fontWeight: 700 }}
                  >
                    <option value="corretor">👔 Corretor / Imobiliária</option>
                    <option value="admin_master">👑 Admin Master</option>
                    <option value="cliente">👤 Cliente / Proprietário</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 4 }}>
                    Tipo de Perfil
                  </label>
                  <select
                    value={formPerfil}
                    onChange={(e) => setFormPerfil(e.target.value as PerfilAnunciante)}
                    className="input-arclar"
                  >
                    <option value="imobiliaria">Imobiliária</option>
                    <option value="corretor">Corretor(a)</option>
                    <option value="proprietario">Proprietário(a)</option>
                    <option value="admin_master">Diretoria / Master</option>
                    <option value="cliente">Cliente Final</option>
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
                    <option value="Corporativo">Corporativo / Master</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 4 }}>
                    Status do Plano
                  </label>
                  <select
                    value={formPlanoStatus}
                    onChange={(e) => setFormPlanoStatus(e.target.value as PlanoStatusAnunciante)}
                    className="input-arclar"
                  >
                    <option value="ativo">Ativo (pagamento confirmado)</option>
                    <option value="pendente">Pendente (aguardando pagamento)</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 4 }}>
                    Status da Conta
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as StatusAnunciante)}
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

      {/* MODAL PARA EDITAR PLANO */}
      {planoEditando && (
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
              maxWidth: 680,
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: 28,
              boxShadow: '0 24px 60px rgba(0,0,0,0.3)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: 19, color: '#102B50', fontWeight: 800, margin: 0 }}>
                Editar plano: {planoEditando.nome}
              </h2>
              <button
                onClick={() => setPlanoEditando(null)}
                style={{ background: 'none', border: 'none', fontSize: 22, color: '#94a3b8', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            {mensagemPlano && (
              <div
                style={{
                  padding: '10px 14px',
                  borderRadius: 8,
                  marginBottom: 16,
                  fontSize: 13,
                  background: mensagemPlano.tipo === 'sucesso' ? '#ECFDF5' : '#FEF2F2',
                  color: mensagemPlano.tipo === 'sucesso' ? '#065F46' : '#991B1B',
                }}
              >
                {mensagemPlano.texto}
              </div>
            )}

            <form onSubmit={handleSalvarPlano} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 4 }}>
                    Nome do plano *
                  </label>
                  <input
                    type="text"
                    required
                    value={planoEditando.nome}
                    onChange={(e) => atualizarCampoPlano('nome', e.target.value)}
                    className="input-arclar"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 4 }}>
                    Descrição
                  </label>
                  <input
                    type="text"
                    value={planoEditando.descricao}
                    onChange={(e) => atualizarCampoPlano('descricao', e.target.value)}
                    className="input-arclar"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 4 }}>
                    Preço mensal (R$)
                  </label>
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    value={planoEditando.preco_mensal}
                    onChange={(e) => atualizarCampoPlano('preco_mensal', Number(e.target.value))}
                    className="input-arclar"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 4 }}>
                    Preço anual (R$)
                  </label>
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    value={planoEditando.preco_anual}
                    onChange={(e) => atualizarCampoPlano('preco_anual', Number(e.target.value))}
                    className="input-arclar"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 4 }}>
                    Limite de imóveis
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={planoEditando.limite_imoveis}
                    onChange={(e) => atualizarCampoPlano('limite_imoveis', Number(e.target.value))}
                    className="input-arclar"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 4 }}>
                    Destaques inclusos
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={planoEditando.destaque_incluso}
                    onChange={(e) => atualizarCampoPlano('destaque_incluso', Number(e.target.value))}
                    className="input-arclar"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 4 }}>
                    Super destaques inclusos
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={planoEditando.super_destaque_incluso}
                    onChange={(e) => atualizarCampoPlano('super_destaque_incluso', Number(e.target.value))}
                    className="input-arclar"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 10 }}>
                {[
                  { campo: 'multi_usuarios', rotulo: 'Múltiplos usuários' },
                  { campo: 'crm', rotulo: 'CRM de leads' },
                  { campo: 'importacao_xml', rotulo: 'Importação XML' },
                  { campo: 'relatorios', rotulo: 'Relatórios' },
                  { campo: 'ativo', rotulo: 'Plano ativo no site' },
                ].map((item) => (
                  <label
                    key={item.campo}
                    style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#374151', fontWeight: 600 }}
                  >
                    <input
                      type="checkbox"
                      checked={planoEditando[item.campo as 'multi_usuarios' | 'crm' | 'importacao_xml' | 'relatorios' | 'ativo']}
                      onChange={(e) =>
                        atualizarCampoPlano(
                          item.campo as 'multi_usuarios' | 'crm' | 'importacao_xml' | 'relatorios' | 'ativo',
                          e.target.checked
                        )
                      }
                    />
                    {item.rotulo}
                  </label>
                ))}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 4 }}>
                  Itens inclusos (um por linha)
                </label>
                <textarea
                  rows={5}
                  value={planoEditando.features.join('\n')}
                  onChange={(e) => atualizarCampoPlano('features', e.target.value.split('\n'))}
                  className="input-arclar"
                  style={{ resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 14 }}>
                <button
                  type="button"
                  onClick={() => setPlanoEditando(null)}
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
                  disabled={salvandoPlano}
                  style={{
                    background: '#102B50',
                    color: 'white',
                    border: 'none',
                    padding: '11px 24px',
                    borderRadius: 8,
                    fontWeight: 700,
                    fontSize: 14,
                    cursor: salvandoPlano ? 'not-allowed' : 'pointer',
                    opacity: salvandoPlano ? 0.7 : 1,
                  }}
                >
                  {salvandoPlano ? 'Salvando...' : 'Salvar plano'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

        </div>
      </div>
  );
}
