'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  const [menuAberto, setMenuAberto] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      style={{
        background: '#102B50',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.3)' : '0 1px 8px rgba(0,0,0,0.2)',
        transition: 'box-shadow 0.3s',
      }}
    >
      {/* Barra superior */}
      <div style={{ background: '#0a1f3a', padding: '6px 0' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: '#F5A900', fontSize: 12, fontWeight: 500 }}>
            🏠 Mais de 50.000 imóveis em todo o Brasil
          </span>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <Link href="/links" style={{ color: '#F5A900', fontSize: 12, textDecoration: 'none', fontWeight: 600 }}>
              🔗 Nossos Links
            </Link>
            <span style={{ color: '#444' }}>|</span>
            <Link href="/anunciar" style={{ color: '#ccc', fontSize: 12, textDecoration: 'none' }}>
              Anunciar imóvel
            </Link>
          </div>
        </div>
      </div>

      {/* Navbar principal */}
      <nav style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 70 }}>
        
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', flexShrink: 0 }}>
          <Image
            src="/logo.png"
            alt="ARC LAR - Portal Imobiliário"
            width={160}
            height={50}
            style={{ objectFit: 'contain', maxHeight: 50 }}
            priority
          />
        </Link>

        {/* Menu desktop */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }} className="nav-desktop">
          {[
            { href: '/', label: 'Início' },
            { href: '/comprar', label: 'Comprar' },
            { href: '/alugar', label: 'Alugar' },
            { href: '/imoveis', label: 'Imóveis' },
            { href: '/planos', label: 'Planos' },
            { href: '/links', label: 'Links Úteis' },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="link-nav"
              style={{
                color: '#e2e8f0',
                textDecoration: 'none',
                fontSize: 14,
                fontWeight: 500,
                padding: '8px 14px',
                borderRadius: 6,
                transition: 'color 0.2s, background 0.2s',
              }}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Ações */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Link
            href="/login"
            style={{
              color: '#e2e8f0',
              textDecoration: 'none',
              fontSize: 14,
              fontWeight: 500,
              padding: '8px 16px',
              borderRadius: 6,
              border: '1px solid rgba(255,255,255,0.2)',
              transition: 'all 0.2s',
            }}
          >
            Entrar
          </Link>
          <Link
            href="/anunciar"
            style={{
              background: '#F5A900',
              color: '#102B50',
              textDecoration: 'none',
              fontSize: 14,
              fontWeight: 700,
              padding: '10px 20px',
              borderRadius: 8,
              whiteSpace: 'nowrap',
              transition: 'background 0.2s, transform 0.1s',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            + Anuncie Grátis
          </Link>

          {/* Hamburguer mobile */}
          <button
            onClick={() => setMenuAberto(!menuAberto)}
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              padding: 8,
              fontSize: 24,
            }}
            className="btn-menu-mobile"
            aria-label="Menu"
          >
            {menuAberto ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      {/* Menu mobile */}
      {menuAberto && (
        <div style={{ background: '#0a1f3a', padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          {[
            { href: '/', label: 'Início' },
            { href: '/comprar', label: 'Comprar' },
            { href: '/alugar', label: 'Alugar' },
            { href: '/imoveis', label: 'Imóveis' },
            { href: '/planos', label: 'Planos' },
            { href: '/links', label: 'Links Úteis' },
            { href: '/anunciar', label: 'Anunciar Imóvel' },
            { href: '/login', label: 'Entrar' },
            { href: '/cadastro', label: 'Criar Conta' },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuAberto(false)}
              style={{
                display: 'block',
                color: '#e2e8f0',
                textDecoration: 'none',
                padding: '12px 0',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
                fontSize: 15,
                fontWeight: 500,
              }}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
