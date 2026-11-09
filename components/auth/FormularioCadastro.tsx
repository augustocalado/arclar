'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Props {
  plano: string;
}

const TIPOS_CONTA = [
  { value: 'comprador', label: '🛒 Comprador', nivel: 'Cliente' },
  { value: 'locatario', label: '🔑 Locatário', nivel: 'Cliente' },
  { value: 'proprietario', label: '🏠 Proprietário', nivel: 'Cliente' },
  { value: 'interessado', label: '🔍 Interessado', nivel: 'Cliente' },
  { value: 'corretor', label: '👔 Corretor', nivel: 'Profissional (aprovação)' },
  { value: 'imobiliaria', label: '🏢 Imobiliária', nivel: 'Profissional (aprovação)' },
];

export default function FormularioCadastro({ plano }: Props) {
  const router = useRouter();
  const [perfil, setPerfil] = useState('proprietario');
  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const perfilSelecionado = TIPOS_CONTA.find((tipo) => tipo.value === perfil);

  async function handleSubmit(evento: React.FormEvent) {
    evento.preventDefault();
    setErro(null);

    if (senha !== confirmarSenha) {
      setErro('As senhas não conferem.');
      return;
    }

    if (senha.length < 8) {
      setErro('A senha deve ter no mínimo 8 caracteres.');
      return;
    }

    setCarregando(true);
    try {
      const resposta = await fetch('/api/auth/cadastro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, sobrenome, email, telefone, senha, perfil }),
      });

      const dados = await resposta.json();
      if (!resposta.ok) {
        throw new Error(dados?.error || 'Não foi possível criar a conta.');
      }

      if (dados.sessaoAtiva) {
        router.push('/cliente');
      } else {
        router.push('/login?aviso=corretor_pendente');
      }
    } catch (erroCapturado) {
      setErro(erroCapturado instanceof Error ? erroCapturado.message : 'Erro ao criar a conta.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F5F7FA', padding: 24 }}>
      <div className="auth-card" style={{ background: 'white', borderRadius: 16, padding: 40, width: '100%', maxWidth: 480, border: '1px solid #E5E7EB', boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <div style={{ color: '#102B50', fontSize: 28, fontWeight: 900, letterSpacing: -1 }}>ARC <span style={{ color: '#F5A900' }}>LAR</span></div>
          </Link>
          <h1 style={{ color: '#102B50', fontSize: 22, fontWeight: 800, marginTop: 16, marginBottom: 4 }}>Criar conta grátis</h1>
          {plano !== 'gratuito' && (
            <div style={{ background: '#FFF9E6', color: '#B45309', padding: '6px 16px', borderRadius: 20, fontSize: 13, fontWeight: 600, display: 'inline-block', border: '1px solid #FDE68A' }}>
              Plano selecionado: {plano}
            </div>
          )}
        </div>

        {erro && (
          <div style={{ background: '#FEE2E2', color: '#991B1B', padding: '10px 14px', borderRadius: 8, fontSize: 13, marginBottom: 16 }}>
            {erro}
          </div>
        )}

        <div style={{ marginBottom: 20 }}>
          <label style={{ color: '#374151', fontSize: 14, fontWeight: 600, display: 'block', marginBottom: 10 }}>Tipo de conta</label>
          <div className="cadastro-perfis" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
            {TIPOS_CONTA.map((tipo) => (
              <label
                key={tipo.value}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                  background: perfil === tipo.value ? '#F0F7FF' : '#F5F7FA',
                  borderRadius: 8,
                  padding: '10px 12px',
                  cursor: 'pointer',
                  border: perfil === tipo.value ? '1.5px solid #102B50' : '1.5px solid #E5E7EB',
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input
                    type="radio"
                    name="perfil"
                    value={tipo.value}
                    checked={perfil === tipo.value}
                    onChange={() => setPerfil(tipo.value)}
                  />
                  {tipo.label}
                </span>
                <span style={{ fontSize: 11, color: '#64748B', paddingLeft: 22 }}>{tipo.nivel}</span>
              </label>
            ))}
          </div>
          {perfilSelecionado && perfilSelecionado.nivel.includes('aprovação') && (
            <p style={{ color: '#B45309', fontSize: 12, margin: '10px 0 0' }}>
              Contas profissionais passam por aprovação do Admin Master antes de acessar o painel.
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="form-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ color: '#374151', fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Nome</label>
              <input type="text" placeholder="Seu nome" className="input-arclar" required value={nome} onChange={(e) => setNome(e.target.value)} />
            </div>
            <div>
              <label style={{ color: '#374151', fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Sobrenome</label>
              <input type="text" placeholder="Sobrenome" className="input-arclar" required value={sobrenome} onChange={(e) => setSobrenome(e.target.value)} />
            </div>
          </div>
          <div>
            <label style={{ color: '#374151', fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>E-mail</label>
            <input type="email" placeholder="seu@email.com" className="input-arclar" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label style={{ color: '#374151', fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Telefone / WhatsApp</label>
            <input type="tel" placeholder="(11) 99999-9999" className="input-arclar" value={telefone} onChange={(e) => setTelefone(e.target.value)} />
          </div>
          <div>
            <label style={{ color: '#374151', fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Senha</label>
            <input type="password" placeholder="Mínimo 8 caracteres" className="input-arclar" required value={senha} onChange={(e) => setSenha(e.target.value)} />
          </div>
          <div>
            <label style={{ color: '#374151', fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Confirmar senha</label>
            <input type="password" placeholder="Repita a senha" className="input-arclar" required value={confirmarSenha} onChange={(e) => setConfirmarSenha(e.target.value)} />
          </div>
          <label style={{ display: 'flex', alignItems: 'flex-start', gap: 8, cursor: 'pointer', marginTop: 4 }}>
            <input type="checkbox" required style={{ marginTop: 2, flexShrink: 0 }} />
            <span style={{ color: '#6B7280', fontSize: 13, lineHeight: 1.5 }}>
              Li e concordo com os{' '}
              <Link href="/termos" style={{ color: '#102B50', fontWeight: 600 }}>Termos de Uso</Link>
              {' '}e a{' '}
              <Link href="/privacidade" style={{ color: '#102B50', fontWeight: 600 }}>Política de Privacidade</Link>
            </span>
          </label>
          <button
            type="submit"
            disabled={carregando}
            style={{ background: '#F5A900', color: '#102B50', border: 'none', borderRadius: 10, padding: '14px', fontWeight: 800, fontSize: 15, cursor: carregando ? 'not-allowed' : 'pointer', marginTop: 4, opacity: carregando ? 0.75 : 1 }}
          >
            {carregando ? 'Criando conta...' : 'Criar minha conta grátis →'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 20, paddingTop: 20, borderTop: '1px solid #F0F0F0' }}>
          <span style={{ color: '#6B7280', fontSize: 14 }}>Já tem conta? </span>
          <Link href="/login" style={{ color: '#102B50', fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>
            Fazer login
          </Link>
        </div>
      </div>
    </div>
  );
}
