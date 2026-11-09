'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CONFIGURACOES_SITE_PADRAO, type ConfiguracoesSite } from '@/lib/configuracoes';
import RedesSociais from './RedesSociais';

// Categorias imobiliárias organizadas para o submenu
const CATEGORIAS_IMOVEIS = [
  { href: 'casa', label: 'Casas', emoji: '🏠' },
  { href: 'apartamento', label: 'Apartamentos', emoji: '🏢' },
  { href: 'chacara', label: 'Chácaras', emoji: '🌾' },
  { href: 'sitio', label: 'Sítios', emoji: '🌳' },
  { href: 'fazenda', label: 'Fazendas', emoji: '🚜' },
  { href: 'terreno', label: 'Terrenos', emoji: '🌿' },
  { href: 'cobertura', label: 'Coberturas', emoji: '🏙️' },
  { href: 'comercial', label: 'Comercial / Salas', emoji: '💼' },
  { href: 'galpao', label: 'Galpões', emoji: '🏭' },
];

export default function Header() {
  const [menuAberto, setMenuAberto] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [configuracoes, setConfiguracoes] = useState<ConfiguracoesSite>(CONFIGURACOES_SITE_PADRAO);

  const estiloSublinkMobile = {
    display: 'block',
    color: '#cbd5e1',
    textDecoration: 'none',
    padding: '8px 0',
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

        {/* Menu desktop com Submenus organizados */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 2 }} className="nav-desktop">
          <Link
            href="/"
            className="link-nav"
            style={{
              color: '#e2e8f0',
              textDecoration: 'none',
              fontSize: 14,
              fontWeight: 500,
              padding: '8px 12px',
              borderRadius: 6,
              transition: 'color 0.2s, background 0.2s',
            }}
          >
            Início
          </Link>

          {/* SUBMENU 1: COMPRAR */}
          <div className="nav-dropdown">
            <Link
              href="/comprar"
              className="link-nav nav-dropdown-trigger"
              aria-haspopup="true"
              style={{
                color: '#e2e8f0',
                textDecoration: 'none',
                fontSize: 14,
                fontWeight: 500,
                padding: '8px 12px',
                borderRadius: 6,
                transition: 'color 0.2s, background 0.2s',
              }}
            >
              Comprar
              <span className="nav-dropdown-chevron" aria-hidden="true">▾</span>
            </Link>

            <div className="nav-dropdown-menu">
              <div className="nav-dropdown-grupo">
                <Link href="/comprar" className="nav-dropdown-titulo" style={{ color: '#F5A900' }}>
                  Comprar Imóveis
                </Link>
                {CATEGORIAS_IMOVEIS.map((cat) => (
                  <Link
                    key={`comprar-${cat.href}`}
                    href={`/comprar/${cat.href}`}
                    className="nav-dropdown-item"
                  >
                    <span style={{ marginRight: 6 }}>{cat.emoji}</span>
                    {cat.label} à Venda
                  </Link>
                ))}
                <Link
                  href="/comprar"
                  className="nav-dropdown-item"
                  style={{ color: '#F5A900', fontWeight: 700, borderTop: '1px solid rgba(255,255,255,0.08)', marginTop: 4, paddingTop: 8 }}
                >
                  Ver todos à venda →
                </Link>
              </div>
            </div>
          </div>

          {/* SUBMENU 2: ALUGAR */}
          <div className="nav-dropdown">
            <Link
              href="/alugar"
              className="link-nav nav-dropdown-trigger"
              aria-haspopup="true"
              style={{
                color: '#e2e8f0',
                textDecoration: 'none',
                fontSize: 14,
                fontWeight: 500,
                padding: '8px 12px',
                borderRadius: 6,
                transition: 'color 0.2s, background 0.2s',
              }}
            >
              Alugar
              <span className="nav-dropdown-chevron" aria-hidden="true">▾</span>
            </Link>

            <div className="nav-dropdown-menu">
              <div className="nav-dropdown-grupo">
                <Link href="/alugar" className="nav-dropdown-titulo" style={{ color: '#F5A900' }}>
                  Alugar Imóveis
                </Link>
                {CATEGORIAS_IMOVEIS.map((cat) => (
                  <Link
                    key={`alugar-${cat.href}`}
                    href={`/alugar/${cat.href}`}
                    className="nav-dropdown-item"
                  >
                    <span style={{ marginRight: 6 }}>{cat.emoji}</span>
                    {cat.label} para Alugar
                  </Link>
                ))}
                <Link
                  href="/alugar"
                  className="nav-dropdown-item"
                  style={{ color: '#F5A900', fontWeight: 700, borderTop: '1px solid rgba(255,255,255,0.08)', marginTop: 4, paddingTop: 8 }}
                >
                  Ver todos para alugar →
                </Link>
              </div>
            </div>
          </div>

          {/* SUBMENU 3: IMÓVEIS (CATÁLOGO GERAL) */}
          <div className="nav-dropdown">
            <Link
              href="/imoveis"
              className="link-nav nav-dropdown-trigger"
              aria-haspopup="true"
              style={{
                color: '#e2e8f0',
                textDecoration: 'none',
                fontSize: 14,
                fontWeight: 500,
                padding: '8px 12px',
                borderRadius: 6,
                transition: 'color 0.2s, background 0.2s',
              }}
            >
              Imóveis
              <span className="nav-dropdown-chevron" aria-hidden="true">▾</span>
            </Link>

            <div className="nav-dropdown-menu">
              <div className="nav-dropdown-grupo">
                <Link href="/imoveis" className="nav-dropdown-titulo" style={{ color: '#F5A900' }}>
                  Por Categoria
                </Link>
                {CATEGORIAS_IMOVEIS.map((cat) => (
                  <Link
                    key={`imoveis-${cat.href}`}
                    href={`/imoveis/${cat.href}`}
                    className="nav-dropdown-item"
                  >
                    <span style={{ marginRight: 6 }}>{cat.emoji}</span>
                    Todos os {cat.label}
                  </Link>
                ))}
                <Link
                  href="/imoveis"
                  className="nav-dropdown-item"
                  style={{ color: '#F5A900', fontWeight: 700, borderTop: '1px solid rgba(255,255,255,0.08)', marginTop: 4, paddingTop: 8 }}
                >
                  Buscar todos os imóveis →
                </Link>
              </div>
            </div>
          </div>

          <Link
            href="/planos"
            className="link-nav"
            style={{
              color: '#e2e8f0',
              textDecoration: 'none',
              fontSize: 14,
              fontWeight: 500,
              padding: '8px 12px',
              borderRadius: 6,
              transition: 'color 0.2s, background 0.2s',
            }}
          >
            Planos
          </Link>

          {/* SUBMENU 4: LINKS ÚTEIS */}
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
                padding: '8px 12px',
                borderRadius: 6,
                transition: 'color 0.2s, background 0.2s',
              }}
            >
              Links Úteis
              <span className="nav-dropdown-chevron" aria-hidden="true">▾</span>
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
                  Parcerias & Contato
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

      {/* Menu mobile organizado com acordeons separados para não misturar */}
      {menuAberto && (
        <div style={{ background: '#0a1f3a', padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.1)', maxHeight: '82vh', overflowY: 'auto' }}>
          <Link
            href="/"
            onClick={() => setMenuAberto(false)}
            style={{
              display: 'block',
              color: '#e2e8f0',
              textDecoration: 'none',
              padding: '10px 0',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
              fontSize: 15,
              fontWeight: 500,
            }}
          >
            Início
          </Link>

          {/* MOBILE: COMPRAR */}
          <details className="mobile-links-uteis" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <summary style={{ color: '#e2e8f0', padding: '10px 0', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
              💰 Comprar (Por tipo de imóvel)
            </summary>
            <div style={{ display: 'flex', flexDirection: 'column', padding: '2px 0 10px 14px', borderLeft: '2px solid #F5A900' }}>
              <Link href="/comprar" onClick={() => setMenuAberto(false)} style={{ ...estiloSublinkMobile, color: '#F5A900', fontWeight: 700 }}>
                Ver todos à venda
              </Link>
              {CATEGORIAS_IMOVEIS.map((cat) => (
                <Link
                  key={`m-comprar-${cat.href}`}
                  href={`/comprar/${cat.href}`}
                  onClick={() => setMenuAberto(false)}
                  style={estiloSublinkMobile}
                >
                  {cat.emoji} {cat.label} à Venda
                </Link>
              ))}
            </div>
          </details>

          {/* MOBILE: ALUGAR */}
          <details className="mobile-links-uteis" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <summary style={{ color: '#e2e8f0', padding: '10px 0', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
              🔑 Alugar (Por tipo de imóvel)
            </summary>
            <div style={{ display: 'flex', flexDirection: 'column', padding: '2px 0 10px 14px', borderLeft: '2px solid #059669' }}>
              <Link href="/alugar" onClick={() => setMenuAberto(false)} style={{ ...estiloSublinkMobile, color: '#F5A900', fontWeight: 700 }}>
                Ver todos para alugar
              </Link>
              {CATEGORIAS_IMOVEIS.map((cat) => (
                <Link
                  key={`m-alugar-${cat.href}`}
                  href={`/alugar/${cat.href}`}
                  onClick={() => setMenuAberto(false)}
                  style={estiloSublinkMobile}
                >
                  {cat.emoji} {cat.label} para Alugar
                </Link>
              ))}
            </div>
          </details>

          {/* MOBILE: IMÓVEIS */}
          <details className="mobile-links-uteis" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <summary style={{ color: '#e2e8f0', padding: '10px 0', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
              🏢 Imóveis (Catálogo geral)
            </summary>
            <div style={{ display: 'flex', flexDirection: 'column', padding: '2px 0 10px 14px', borderLeft: '2px solid #3b82f6' }}>
              <Link href="/imoveis" onClick={() => setMenuAberto(false)} style={{ ...estiloSublinkMobile, color: '#F5A900', fontWeight: 700 }}>
                Buscar todos os imóveis
              </Link>
              {CATEGORIAS_IMOVEIS.map((cat) => (
                <Link
                  key={`m-imoveis-${cat.href}`}
                  href={`/imoveis/${cat.href}`}
                  onClick={() => setMenuAberto(false)}
                  style={estiloSublinkMobile}
                >
                  {cat.emoji} {cat.label}
                </Link>
              ))}
            </div>
          </details>

          <Link
            href="/planos"
            onClick={() => setMenuAberto(false)}
            style={{
              display: 'block',
              color: '#e2e8f0',
              textDecoration: 'none',
              padding: '10px 0',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
              fontSize: 15,
              fontWeight: 500,
            }}
          >
            Planos
          </Link>

          {/* MOBILE: LINKS ÚTEIS */}
          <details className="mobile-links-uteis" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <summary style={{ color: '#e2e8f0', padding: '10px 0', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
              📚 Links Úteis & Guias
            </summary>
            <div style={{ display: 'flex', flexDirection: 'column', padding: '2px 0 10px 14px', borderLeft: '2px solid rgba(245,169,0,0.4)' }}>
              <Link href="/links-uteis" onClick={() => setMenuAberto(false)} style={estiloSublinkMobile}>
                Todos os links úteis
              </Link>
              <Link href="/guias/escritura-do-imovel" onClick={() => setMenuAberto(false)} style={estiloSublinkMobile}>
                Escritura do imóvel
              </Link>
              <Link href="/guias/lei-do-inquilino" onClick={() => setMenuAberto(false)} style={estiloSublinkMobile}>
                Lei do inquilino
              </Link>
              <Link href="/dados-e-indices/calculadora-igpm" onClick={() => setMenuAberto(false)} style={estiloSublinkMobile}>
                Calculadora IGP-M
              </Link>
              <Link href="/dados-e-indices/indices-reajuste-aluguel" onClick={() => setMenuAberto(false)} style={estiloSublinkMobile}>
                Índices de reajuste de aluguel
              </Link>
              <Link href="/dados-e-indices/valor-metro-quadrado" onClick={() => setMenuAberto(false)} style={estiloSublinkMobile}>
                Valor metro quadrado
              </Link>
              <Link href="/dados-e-indices/valor-venal" onClick={() => setMenuAberto(false)} style={estiloSublinkMobile}>
                Valor venal
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

          <Link
            href="/anunciar"
            onClick={() => setMenuAberto(false)}
            style={{
              display: 'block',
              color: '#F5A900',
              textDecoration: 'none',
              padding: '10px 0',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
              fontSize: 15,
              fontWeight: 700,
            }}
          >
            + Anuncie seu imóvel
          </Link>
          <Link
            href="/login"
            onClick={() => setMenuAberto(false)}
            style={{
              display: 'block',
              color: '#e2e8f0',
              textDecoration: 'none',
              padding: '10px 0',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
              fontSize: 15,
              fontWeight: 500,
            }}
          >
            Entrar
          </Link>
          <Link
            href="/cadastro"
            onClick={() => setMenuAberto(false)}
            style={{
              display: 'block',
              color: '#e2e8f0',
              textDecoration: 'none',
              padding: '10px 0',
              fontSize: 15,
              fontWeight: 500,
            }}
          >
            Criar Conta
          </Link>
        </div>
      )}
    </header>
  );
}
