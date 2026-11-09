'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CONFIGURACOES_SITE_PADRAO, type ConfiguracoesSite } from '@/lib/configuracoes';
import RedesSociais from './RedesSociais';

export default function Header() {
  const [menuAberto, setMenuAberto] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [configuracoes, setConfiguracoes] = useState<ConfiguracoesSite>(CONFIGURACOES_SITE_PADRAO);
  const estiloSublinkMobile = {
    display: 'block',
    color: '#cbd5e1',
    textDecoration: 'none',
    padding: '9px 0',
    fontSize: 14,
  } as const;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    let ativo = true;

    fetch('/api/configuracoes', { cache: 'no-store' })
      .then((resposta) => (resposta.ok ? resposta.json() : null))
      .then((dados) => {
        if (ativo && dados?.configuracoes) {
          setConfiguracoes({ ...CONFIGURACOES_SITE_PADRAO, ...dados.configuracoes });
        }
      })
      .catch(() => {
        // Mantém as configurações padrão caso a API não responda.
      });

    return () => {
      ativo = false;
    };
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
        <div className="header-topbar" style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="header-topbar-info" style={{ color: '#F5A900', fontSize: 12, fontWeight: 500 }}>
            🏠 Mais de 50.000 imóveis em todo o Brasil
          </span>
          <div className="header-topbar-links" style={{ display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            <span className="header-topbar-horario" style={{ color: '#94a3b8', fontSize: 12, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              🕒 {configuracoes.horario_atendimento}
            </span>
            <span style={{ color: '#444' }}>|</span>
            <RedesSociais configuracoes={configuracoes} tamanho={16} cor="#cbd5e1" />
          </div>
        </div>
      </div>

      {/* Navbar principal */}
      <nav className="header-nav" style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 70 }}>
        
        {/* Logo */}
        <Link href="/" className="header-logo" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', flexShrink: 0 }}>
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

          <div className="nav-dropdown">
            <Link
              href="/links-uteis"
              className="link-nav nav-dropdown-trigger"
              aria-haspopup="true"
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
              Links Úteis
              <span className="nav-dropdown-chevron" aria-hidden="true">
                ▾
              </span>
            </Link>

            <div className="nav-dropdown-menu">
              <div className="nav-dropdown-grupo">
                <Link href="/guias" className="nav-dropdown-titulo">
                  Guias
                </Link>
                <Link href="/guias/escritura-do-imovel" className="nav-dropdown-item">
                  Escritura do imóvel
                </Link>
                <Link href="/guias/lei-do-inquilino" className="nav-dropdown-item">
                  Lei do inquilino
                </Link>
              </div>

              <div className="nav-dropdown-grupo">
                <Link href="/dados-e-indices" className="nav-dropdown-titulo">
                  Dados e Índices
                </Link>
                <Link href="/dados-e-indices/calculadora-igpm" className="nav-dropdown-item">
                  Calculadora IGP-M
                </Link>
                <Link href="/dados-e-indices/indices-reajuste-aluguel" className="nav-dropdown-item">
                  Índices de reajuste de aluguel
                </Link>
                <Link href="/dados-e-indices/valor-metro-quadrado" className="nav-dropdown-item">
                  Valor metro quadrado
                </Link>
                <Link href="/dados-e-indices/valor-venal" className="nav-dropdown-item">
                  Valor venal
                </Link>
              </div>

              <div className="nav-dropdown-grupo">
                <Link href="/seja-corretor" className="nav-dropdown-titulo">
                  Parcerias
                </Link>
                <Link href="/seja-corretor" className="nav-dropdown-item">
                  Seja corretor
                </Link>
                <Link href="/parceiros" className="nav-dropdown-item">
                  Seja parceiro
                </Link>
                <Link href="/contato" className="nav-dropdown-item">
                  Fale conosco
                </Link>
                <Link href="/links-uteis" className="nav-dropdown-item" style={{ color: '#F5A900', fontWeight: 600 }}>
                  Todos os links úteis →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Ações */}
        <div className="header-acoes" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Link
            href="/login"
            className="header-login"
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
            className="header-cta"
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

          <details className="mobile-links-uteis" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <summary
              style={{
                color: '#e2e8f0',
                padding: '12px 0',
                fontSize: 15,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Links Úteis
            </summary>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                padding: '2px 0 12px 14px',
                marginLeft: 2,
                borderLeft: '2px solid rgba(245,169,0,0.4)',
              }}
            >
              <Link href="/links-uteis" onClick={() => setMenuAberto(false)} style={estiloSublinkMobile}>
                Todos os links úteis
              </Link>
              <Link
                href="/guias"
                onClick={() => setMenuAberto(false)}
                style={{ ...estiloSublinkMobile, color: '#F5A900', fontWeight: 700, marginTop: 6 }}
              >
                Guias
              </Link>
              <Link href="/guias/escritura-do-imovel" onClick={() => setMenuAberto(false)} style={estiloSublinkMobile}>
                Escritura do imóvel
              </Link>
              <Link href="/guias/lei-do-inquilino" onClick={() => setMenuAberto(false)} style={estiloSublinkMobile}>
                Lei do inquilino
              </Link>
              <Link
                href="/dados-e-indices"
                onClick={() => setMenuAberto(false)}
                style={{ ...estiloSublinkMobile, color: '#F5A900', fontWeight: 700, marginTop: 6 }}
              >
                Dados e Índices
              </Link>
              <Link
                href="/dados-e-indices/calculadora-igpm"
                onClick={() => setMenuAberto(false)}
                style={estiloSublinkMobile}
              >
                Calculadora IGP-M
              </Link>
              <Link
                href="/dados-e-indices/indices-reajuste-aluguel"
                onClick={() => setMenuAberto(false)}
                style={estiloSublinkMobile}
              >
                Índices de reajuste de aluguel
              </Link>
              <Link
                href="/dados-e-indices/valor-metro-quadrado"
                onClick={() => setMenuAberto(false)}
                style={estiloSublinkMobile}
              >
                Valor metro quadrado
              </Link>
              <Link
                href="/dados-e-indices/valor-venal"
                onClick={() => setMenuAberto(false)}
                style={estiloSublinkMobile}
              >
                Valor venal
              </Link>
              <Link
                href="/seja-corretor"
                onClick={() => setMenuAberto(false)}
                style={{ ...estiloSublinkMobile, color: '#F5A900', fontWeight: 700, marginTop: 6 }}
              >
                Parcerias
              </Link>
              <Link href="/seja-corretor" onClick={() => setMenuAberto(false)} style={estiloSublinkMobile}>
                Seja corretor
              </Link>
              <Link href="/parceiros" onClick={() => setMenuAberto(false)} style={estiloSublinkMobile}>
                Seja parceiro
              </Link>
              <Link href="/contato" onClick={() => setMenuAberto(false)} style={estiloSublinkMobile}>
                Fale conosco
              </Link>
            </div>
          </details>
        </div>
      )}
    </header>
  );
}
