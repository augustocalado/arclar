import type { ReactNode } from 'react';

interface BlocoTextoProps {
  titulo: string;
  icone?: string;
  children: ReactNode;
}

export default function BlocoTexto({ titulo, icone, children }: BlocoTextoProps) {
  return (
    <section
      style={{
        marginBottom: 20,
        padding: '24px clamp(18px, 3vw, 32px)',
        background: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: 16,
        boxShadow: '0 2px 10px rgba(15, 23, 42, 0.04)',
      }}
    >
      <h2
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          margin: '0 0 14px',
          color: '#102B50',
          fontSize: 'clamp(19px, 2.4vw, 23px)',
          fontWeight: 800,
          lineHeight: 1.3,
        }}
      >
        {icone && <span aria-hidden="true">{icone}</span>}
        {titulo}
      </h2>
      <div style={{ color: '#334155', fontSize: 15, lineHeight: 1.8 }}>{children}</div>
    </section>
  );
}
