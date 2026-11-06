import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Login – Acesse sua conta no ARC LAR',
};

export default function LoginPage() {
  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F5F7FA', padding: 24 }}>
      <div className="auth-card" style={{ background: 'white', borderRadius: 16, padding: 40, width: '100%', maxWidth: 420, border: '1px solid #E5E7EB', boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}>
        {/* Logo texto */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <div style={{ color: '#102B50', fontSize: 28, fontWeight: 900, letterSpacing: -1 }}>ARC <span style={{ color: '#F5A900' }}>LAR</span></div>
          </Link>
          <h1 style={{ color: '#102B50', fontSize: 22, fontWeight: 800, marginTop: 16, marginBottom: 4 }}>Acesse sua conta</h1>
          <p style={{ color: '#6B7280', fontSize: 14 }}>Bem-vindo de volta!</p>
        </div>

        <form style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ color: '#374151', fontSize: 14, fontWeight: 600, display: 'block', marginBottom: 6 }}>E-mail</label>
            <input type="email" placeholder="seu@email.com" className="input-arclar" required />
          </div>
          <div>
            <label style={{ color: '#374151', fontSize: 14, fontWeight: 600, display: 'block', marginBottom: 6 }}>Senha</label>
            <input type="password" placeholder="••••••••" className="input-arclar" required />
          </div>
          <div style={{ textAlign: 'right' }}>
            <Link href="/recuperar-senha" style={{ color: '#102B50', fontSize: 13, textDecoration: 'none', fontWeight: 600 }}>
              Esqueceu a senha?
            </Link>
          </div>
          <button type="submit" style={{ background: '#102B50', color: 'white', border: 'none', borderRadius: 10, padding: '14px', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>
            Entrar
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 24, paddingTop: 24, borderTop: '1px solid #F0F0F0' }}>
          <span style={{ color: '#6B7280', fontSize: 14 }}>Ainda não tem conta? </span>
          <Link href="/cadastro" style={{ color: '#F5A900', fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>
            Cadastre-se grátis
          </Link>
        </div>
      </div>
    </div>
  );
}

