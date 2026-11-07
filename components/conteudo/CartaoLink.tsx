import Link from 'next/link';

interface CartaoLinkProps {
  href: string;
  titulo: string;
  descricao: string;
  emoji?: string;
  destaque?: boolean;
}

export default function CartaoLink({ href, titulo, descricao, emoji, destaque }: CartaoLinkProps) {
  return (
    <Link
      href={href}
      className="card-link-item"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        padding: 22,
        borderRadius: 16,
        textDecoration: 'none',
        background: destaque ? '#102B50' : '#FFFFFF',
        border: destaque ? '1px solid #102B50' : '1px solid #E2E8F0',
        boxShadow: '0 4px 16px rgba(15, 23, 42, 0.06)',
        transition: 'transform 0.2s, box-shadow 0.2s',
      }}
    >
      {emoji && (
        <div aria-hidden="true" style={{ marginBottom: 12, fontSize: 30 }}>
          {emoji}
        </div>
      )}
      <div style={{ marginBottom: 6, color: destaque ? '#FFFFFF' : '#102B50', fontSize: 17, fontWeight: 800 }}>
        {titulo}
      </div>
      <div style={{ flex: 1, color: destaque ? '#cbd5e1' : '#475569', fontSize: 14, lineHeight: 1.65 }}>
        {descricao}
      </div>
      <div style={{ marginTop: 16, color: destaque ? '#F5A900' : '#102B50', fontSize: 13, fontWeight: 700 }}>
        Acessar →
      </div>
    </Link>
  );
}
