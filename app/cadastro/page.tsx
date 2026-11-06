import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Criar Conta – ARC LAR',
};

export default function CadastroPage({
  searchParams,
}: {
  searchParams: { plano?: string };
}) {
  const plano = searchParams?.plano || 'gratuito';

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

        {/* Tipo de perfil */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ color: '#374151', fontSize: 14, fontWeight: 600, display: 'block', marginBottom: 10 }}>Tipo de conta</label>
          <div className="cadastro-perfis" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
            {[
              { value: 'proprietario', label: '🏠 Proprietário' },
              { value: 'corretor', label: '👔 Corretor' },
              { value: 'imobiliaria', label: '🏢 Imobiliária' },
              { value: 'interessado', label: '🔍 Interessado' },
            ].map(tipo => (
              <label key={tipo.value} style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#F5F7FA', borderRadius: 8, padding: '10px 12px', cursor: 'pointer', border: '1.5px solid #E5E7EB', fontSize: 13, fontWeight: 500 }}>
                <input type="radio" name="perfil" value={tipo.value} defaultChecked={tipo.value === 'proprietario'} />
                {tipo.label}
              </label>
            ))}
          </div>
        </div>

        <form style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="form-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ color: '#374151', fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Nome</label>
              <input type="text" placeholder="Seu nome" className="input-arclar" required />
            </div>
            <div>
              <label style={{ color: '#374151', fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Sobrenome</label>
              <input type="text" placeholder="Sobrenome" className="input-arclar" required />
            </div>
          </div>
          <div>
            <label style={{ color: '#374151', fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>E-mail</label>
            <input type="email" placeholder="seu@email.com" className="input-arclar" required />
          </div>
          <div>
            <label style={{ color: '#374151', fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Telefone / WhatsApp</label>
            <input type="tel" placeholder="(11) 99999-9999" className="input-arclar" />
          </div>
          <div>
            <label style={{ color: '#374151', fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Senha</label>
            <input type="password" placeholder="Mínimo 8 caracteres" className="input-arclar" required />
          </div>
          <div>
            <label style={{ color: '#374151', fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Confirmar senha</label>
            <input type="password" placeholder="Repita a senha" className="input-arclar" required />
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
          <button type="submit" style={{ background: '#F5A900', color: '#102B50', border: 'none', borderRadius: 10, padding: '14px', fontWeight: 800, fontSize: 15, cursor: 'pointer', marginTop: 4 }}>
            Criar minha conta grátis →
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

