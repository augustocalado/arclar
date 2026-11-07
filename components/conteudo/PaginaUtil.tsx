import Link from 'next/link';
import type { ReactNode } from 'react';

interface ItemBreadcrumb {
  label: string;
  href?: string;
}

interface PaginaUtilProps {
  titulo: string;
  subtitulo: string;
  icone?: string;
  breadcrumb?: ItemBreadcrumb[];
  atualizadoEm?: string;
  children: ReactNode;
}

export default function PaginaUtil({
  titulo,
  subtitulo,
  icone,
  breadcrumb,
  atualizadoEm,
  children,
}: PaginaUtilProps) {
  return (
    <div style={{ background: '#F1F5F9', minHeight: '100vh' }}>
      <header
        style={{
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #102B50 0%, #1a4a8a 100%)',
          padding: '48px 24px 56px',
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: -80,
            right: -60,
            width: 280,
            height: 280,
            borderRadius: '50%',
            background: 'rgba(245, 169, 0, 0.12)',
            filter: 'blur(2px)',
          }}
        />
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            bottom: -120,
            left: -40,
            width: 240,
            height: 240,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.05)',
          }}
        />
        <div style={{ position: 'relative', maxWidth: 1100, margin: '0 auto' }}>
          <nav
            aria-label="Trilha de navegação"
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: 6,
              marginBottom: 18,
              color: '#94a3b8',
              fontSize: 13,
            }}
          >
            <Link href="/" style={{ color: '#cbd5e1', textDecoration: 'none' }}>
              Início
            </Link>
            <span>›</span>
            <Link href="/links-uteis" style={{ color: '#cbd5e1', textDecoration: 'none' }}>
              Links Úteis
            </Link>
            {breadcrumb && breadcrumb.length > 0 ? (
              breadcrumb.map((item, indice) => (
                <span key={`${item.label}-${indice}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <span>›</span>
                  {item.href ? (
                    <Link href={item.href} style={{ color: '#cbd5e1', textDecoration: 'none' }}>
                      {item.label}
                    </Link>
                  ) : (
                    <span style={{ color: '#F5A900' }}>{item.label}</span>
                  )}
                </span>
              ))
            ) : (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <span>›</span>
                <span style={{ color: '#F5A900' }}>{titulo}</span>
              </span>
            )}
          </nav>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 18, flexWrap: 'wrap' }}>
            {icone && (
              <div
                aria-hidden="true"
                style={{
                  display: 'grid',
                  placeItems: 'center',
                  width: 64,
                  height: 64,
                  borderRadius: 18,
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.16)',
                  fontSize: 32,
                }}
              >
                {icone}
              </div>
            )}
            <div style={{ flex: 1, minWidth: 240 }}>
              <h1
                style={{
                  margin: '0 0 12px',
                  color: '#FFFFFF',
                  fontSize: 'clamp(28px, 4vw, 42px)',
                  fontWeight: 800,
                  lineHeight: 1.15,
                }}
              >
                {titulo}
              </h1>
              <p style={{ margin: 0, maxWidth: 780, color: '#cbd5e1', fontSize: 17, lineHeight: 1.65 }}>
                {subtitulo}
              </p>
              {atualizadoEm && (
                <p style={{ margin: '16px 0 0', color: '#94a3b8', fontSize: 12 }}>
                  Atualizado em {atualizadoEm}
                </p>
              )}
            </div>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px 72px' }}>{children}</main>
    </div>
  );
}
