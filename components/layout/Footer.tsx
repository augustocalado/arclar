import Link from 'next/link';

export default function Footer() {
  const ano = new Date().getFullYear();

  return (
    <footer style={{ background: '#102B50', color: '#cbd5e1', marginTop: 'auto' }}>
      {/* CTA anunciantes */}
      <div style={{ background: '#0a1f3a', padding: '48px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <h2 className="footer-cta-title" style={{ color: '#F5A900', fontSize: 28, fontWeight: 800, marginBottom: 12 }}>
            Anuncie seus imóveis no ARC LAR
          </h2>
          <p style={{ color: '#94a3b8', fontSize: 16, marginBottom: 28, lineHeight: 1.6 }}>
            Alcance milhares de compradores e locatários em todo o Brasil. Planos a partir de R$0,00/mês.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/anunciar" className="btn-primary" style={{ background: '#F5A900', color: '#102B50', fontWeight: 700, padding: '14px 32px', borderRadius: 8, textDecoration: 'none', fontSize: 16 }}>
              Anunciar Imóvel
            </Link>
            <Link href="/planos" className="btn-planos" style={{ background: 'transparent', color: '#F5A900', fontWeight: 600, padding: '14px 32px', borderRadius: 8, textDecoration: 'none', fontSize: 16, border: '2px solid #F5A900' }}>
              Ver Planos
            </Link>
          </div>
        </div>
      </div>

      {/* Links */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '56px 24px 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 40, marginBottom: 48 }}>
          {/* Coluna 1 - Sobre */}
          <div>
            <h3 style={{ color: '#F5A900', fontWeight: 700, fontSize: 15, marginBottom: 20, textTransform: 'uppercase', letterSpacing: 1 }}>
              ARC LAR
            </h3>
            <p style={{ color: '#94a3b8', fontSize: 14, lineHeight: 1.7, marginBottom: 16 }}>
              O portal imobiliário nacional que conecta pessoas ao imóvel dos seus sonhos.
            </p>
            <p style={{ color: '#64748b', fontSize: 13, fontStyle: 'italic' }}>
              &quot;Seu novo endereço está aqui!&quot;
            </p>
          </div>

          {/* Coluna 2 - Imóveis */}
          <div>
            <h3 style={{ color: 'white', fontWeight: 700, fontSize: 14, marginBottom: 20, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Imóveis
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { href: '/comprar', label: 'Imóveis à venda' },
                { href: '/alugar', label: 'Imóveis para alugar' },
                { href: '/imoveis?tipo=apartamento', label: 'Apartamentos' },
                { href: '/imoveis?tipo=casa', label: 'Casas' },
                { href: '/imoveis?tipo=terreno', label: 'Terrenos' },
                { href: '/imoveis?tipo=comercial', label: 'Comercial' },
                { href: '/imoveis?tipo=cobertura', label: 'Coberturas' },
              ].map(item => (
                <Link key={item.href} href={item.href} className="link-footer" style={{ color: '#94a3b8', fontSize: 14, textDecoration: 'none', transition: 'color 0.2s' }}>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Coluna 3 - Cidades */}
          <div>
            <h3 style={{ color: 'white', fontWeight: 700, fontSize: 14, marginBottom: 20, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Cidades
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { href: '/cidade/sao-paulo-sp', label: 'São Paulo' },
                { href: '/cidade/rio-de-janeiro-rj', label: 'Rio de Janeiro' },
                { href: '/cidade/curitiba-pr', label: 'Curitiba' },
                { href: '/cidade/belo-horizonte-mg', label: 'Belo Horizonte' },
                { href: '/cidade/santos-sp', label: 'Santos' },
                { href: '/cidade/praia-grande-sp', label: 'Praia Grande' },
                { href: '/cidade/florianopolis-sc', label: 'Florianópolis' },
                { href: '/cidade/campinas-sp', label: 'Campinas' },
              ].map(item => (
                <Link key={item.href} href={item.href} className="link-footer" style={{ color: '#94a3b8', fontSize: 14, textDecoration: 'none', transition: 'color 0.2s' }}>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Coluna 4 - Anunciantes */}
          <div>
            <h3 style={{ color: 'white', fontWeight: 700, fontSize: 14, marginBottom: 20, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Anunciantes
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { href: '/anunciar', label: 'Anunciar imóvel' },
                { href: '/planos', label: 'Nossos planos' },
                { href: '/login', label: 'Painel do anunciante' },
                { href: '/cadastro', label: 'Cadastre-se' },
              ].map(item => (
                <Link key={item.href} href={item.href} className="link-footer" style={{ color: '#94a3b8', fontSize: 14, textDecoration: 'none', transition: 'color 0.2s' }}>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Coluna 5 - Links rápidos & Redes */}
          <div>
            <h3 style={{ color: 'white', fontWeight: 700, fontSize: 14, marginBottom: 20, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Acesso Rápido
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Link href="/links" className="link-footer" style={{ color: '#F5A900', fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>
                🔗 Central de Links (Linktree)
              </Link>
              <Link href="/parceiros" className="link-footer" style={{ color: '#94a3b8', fontSize: 14, textDecoration: 'none' }}>
                🤝 Links para Parceiros
              </Link>
              <Link href="/imoveis" className="link-footer" style={{ color: '#94a3b8', fontSize: 14, textDecoration: 'none' }}>
                Buscar Imóveis
              </Link>
              <Link href="/planos" className="link-footer" style={{ color: '#94a3b8', fontSize: 14, textDecoration: 'none' }}>
                Tabela de Planos
              </Link>
            </div>
          </div>
        </div>

        {/* Rodapé final */}
        <div className="footer-bottom" style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <p style={{ color: '#475569', fontSize: 13, margin: 0 }}>
            © {ano} ARC LAR — Portal Imobiliário Nacional. Todos os direitos reservados.
          </p>
          <div className="footer-bottom-links" style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            <Link href="/links" style={{ color: '#F5A900', fontSize: 13, textDecoration: 'none', fontWeight: 600 }}>Página de Links</Link>
            <Link href="/sitemap.xml" style={{ color: '#475569', fontSize: 13, textDecoration: 'none' }}>Sitemap XML</Link>
            <Link href="/robots.txt" style={{ color: '#475569', fontSize: 13, textDecoration: 'none' }}>Robots.txt</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
