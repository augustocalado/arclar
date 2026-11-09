'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import type { NivelHierarquico } from '@/types';
import { DESCRICAO_NIVEIS } from '@/lib/auth/permissoes';

const AVISOS_ACESSO: Record<string, string> = {
  login_necessario: 'Faça login para acessar esta área.',
  sem_permissao: 'Seu perfil não tem permissão para acessar esta área.',
  acesso_negado_admin: 'O Painel Master é exclusivo para administradores. Seu perfil foi redirecionado para a área permitida.',
  acesso_negado_painel: 'O painel profissional é exclusivo para corretores e imobiliárias aprovados.',
  corretor_pendente: 'Seu cadastro de corretor está aguardando aprovação do Admin Master.',
};

function LoginConteudo() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const aviso = searchParams.get('aviso');
  const mensagemAviso = aviso ? AVISOS_ACESSO[aviso] : null;
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [nivelSelecionado, setNivelSelecionado] = useState<NivelHierarquico>('corretor');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function entrarComNivel(nivel: NivelHierarquico) {
    setCarregando(true);
    setErro(null);
    try {
      const res = await fetch('/api/auth/sessao', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nivel }),
      });

      if (res.ok) {
        if (nivel === 'admin_master') router.push('/admin');
        else if (nivel === 'corretor') router.push('/painel');
        else router.push('/cliente');
      } else {
        setErro('Não foi possível iniciar a sessão.');
      }
    } catch {
      setErro('Erro de conexão com o servidor.');
    } finally {
      setCarregando(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await entrarComNivel(nivelSelecionado);
  }

  return (
    <div style={{ minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F5F7FA', padding: 24 }}>
      <div className="auth-card" style={{ background: 'white', borderRadius: 16, padding: '36px 32px', width: '100%', maxWidth: 460, border: '1px solid #E5E7EB', boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 26 }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <div style={{ color: '#102B50', fontSize: 28, fontWeight: 900, letterSpacing: -1 }}>
              ARC <span style={{ color: '#F5A900' }}>LAR</span>
            </div>
          </Link>
          <h1 style={{ color: '#102B50', fontSize: 22, fontWeight: 800, marginTop: 12, marginBottom: 4 }}>
            Acesse sua conta
          </h1>
          <p style={{ color: '#6B7280', fontSize: 13 }}>
            Selecione seu perfil hierárquico para ser direcionado ao seu painel
          </p>
        </div>

        {erro && (
          <div style={{ background: '#FEE2E2', color: '#991B1B', padding: '10px 14px', borderRadius: 8, fontSize: 13, marginBottom: 16 }}>
            {erro}
          </div>
        )}

        {mensagemAviso && (
          <div style={{ background: '#FFF9E6', color: '#B45309', border: '1px solid #FDE68A', padding: '10px 14px', borderRadius: 8, fontSize: 13, marginBottom: 16 }}>
            ⚠️ {mensagemAviso}
          </div>
        )}

        {/* Seletor de Nível Hierárquico no Login */}
        <div style={{ marginBottom: 18 }}>
          <label style={{ color: '#374151', fontSize: 13, fontWeight: 700, display: 'block', marginBottom: 8 }}>
            Entrar como:
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
            {[
              { id: 'corretor', rotulo: '👔 Corretor', subtitulo: 'Painel CRM' },
              { id: 'cliente', rotulo: '👤 Cliente', subtitulo: 'Favoritos' },
              { id: 'admin_master', rotulo: '👑 Master', subtitulo: 'Gestão Geral' },
            ].map((op) => {
              const ativo = nivelSelecionado === op.id;
              return (
                <button
                  key={op.id}
                  type="button"
                  onClick={() => setNivelSelecionado(op.id as NivelHierarquico)}
                  style={{
                    padding: '10px 6px',
                    borderRadius: 8,
                    border: ativo ? '2px solid #102B50' : '1px solid #E2E8F0',
                    background: ativo ? '#F0F7FF' : '#F8FAFC',
                    color: ativo ? '#102B50' : '#475569',
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ fontWeight: 800, fontSize: 13 }}>{op.rotulo}</div>
                  <div style={{ fontSize: 10, color: '#64748B', marginTop: 2 }}>{op.subtitulo}</div>
                </button>
              );
            })}
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ color: '#374151', fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 4 }}>
              E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="input-arclar"
              required
            />
          </div>
          <div>
            <label style={{ color: '#374151', fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 4 }}>
              Senha
            </label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="••••••••"
              className="input-arclar"
              required
            />
          </div>

          <div style={{ textAlign: 'right' }}>
            <Link href="/recuperar-senha" style={{ color: '#102B50', fontSize: 13, textDecoration: 'none', fontWeight: 600 }}>
              Esqueceu a senha?
            </Link>
          </div>

          <button
            type="submit"
            disabled={carregando}
            style={{
              background: '#102B50',
              color: 'white',
              border: 'none',
              borderRadius: 10,
              padding: '13px',
              fontWeight: 800,
              fontSize: 15,
              cursor: carregando ? 'not-allowed' : 'pointer',
              opacity: carregando ? 0.8 : 1,
            }}
          >
            {carregando ? 'Acessando...' : `Entrar como ${DESCRICAO_NIVEIS[nivelSelecionado].titulo}`}
          </button>
        </form>

        {/* Atalhos Rápidos para Demonstração */}
        <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid #F1F5F9' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: 8, textAlign: 'center' }}>
            ⚡ Acesso Direto para Teste de Permissões:
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
            <button
              onClick={() => entrarComNivel('admin_master')}
              type="button"
              style={{ background: '#7C3AED', color: 'white', border: 'none', padding: '6px 4px', borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}
            >
              👑 Entrar Master
            </button>
            <button
              onClick={() => entrarComNivel('corretor')}
              type="button"
              style={{ background: '#0F172A', color: 'white', border: 'none', padding: '6px 4px', borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}
            >
              👔 Entrar Corretor
            </button>
            <button
              onClick={() => entrarComNivel('cliente')}
              type="button"
              style={{ background: '#059669', color: 'white', border: 'none', padding: '6px 4px', borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}
            >
              👤 Entrar Cliente
            </button>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: 18 }}>
          <span style={{ color: '#6B7280', fontSize: 13 }}>Ainda não tem conta? </span>
          <Link href="/cadastro" style={{ color: '#F5A900', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
            Cadastre-se grátis
          </Link>
        </div>

      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginConteudo />
    </Suspense>
  );
}
