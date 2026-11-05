import type { Metadata } from 'next';
import Link from 'next/link';
import CardImovel from '@/components/imoveis/CardImovel';
import { IMOVEIS_MOCK, formatarTipoImovel } from '@/lib/utils';

interface PageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const params = await searchParams;
  const negocio = params.negocio;
  const tipo = params.tipo;
  const local = params.local;

  let title = 'Imóveis à venda e para alugar em todo o Brasil';
  if (negocio === 'venda') title = 'Imóveis à venda';
  if (negocio === 'aluguel') title = 'Imóveis para alugar';
  if (tipo) title = `${formatarTipoImovel(tipo)}s ${negocio === 'aluguel' ? 'para alugar' : 'à venda'}`;
  if (local) title += ` em ${local}`;

  return {
    title,
    description: `Encontre ${title.toLowerCase()} no ARC LAR. Milhares de opções com fotos, preços e contato direto com anunciantes.`,
  };
}

export default async function ImoveisPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const negocio = params.negocio;
  const tipo = params.tipo;
  const local = params.local || '';
  const precoMin = params.preco_min ? parseInt(params.preco_min) : 0;
  const precoMax = params.preco_max ? parseInt(params.preco_max) : Infinity;
  const quartos = params.quartos ? parseInt(params.quartos) : 0;

  // Filtrar imóveis (aqui usa mock; na fase final usa Supabase)
  let imoveis = IMOVEIS_MOCK;
  if (negocio && negocio !== 'todos') imoveis = imoveis.filter(i => i.negocio === negocio);
  if (tipo) imoveis = imoveis.filter(i => i.tipo === tipo);
  if (precoMin > 0) imoveis = imoveis.filter(i => i.preco >= precoMin);
  if (precoMax < Infinity) imoveis = imoveis.filter(i => i.preco <= precoMax);
  if (quartos > 0) imoveis = imoveis.filter(i => (i.quartos || 0) >= quartos);
  if (local) {
    const localLower = local.toLowerCase();
    imoveis = imoveis.filter(i =>
      i.endereco.cidade.toLowerCase().includes(localLower) ||
      i.endereco.bairro.toLowerCase().includes(localLower) ||
      i.endereco.estado.toLowerCase().includes(localLower)
    );
  }

  const titulo = negocio === 'aluguel'
    ? 'Imóveis para Alugar'
    : negocio === 'venda'
    ? 'Imóveis à Venda'
    : tipo
    ? `${formatarTipoImovel(tipo)}s`
    : 'Todos os Imóveis';

  return (
    <div style={{ background: '#F5F7FA', minHeight: '100vh' }}>
      {/* Breadcrumb + Cabeçalho */}
      <div style={{ background: '#102B50', padding: '24px 24px 32px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <nav style={{ marginBottom: 12 }}>
            <Link href="/" style={{ color: '#94a3b8', fontSize: 13, textDecoration: 'none' }}>Início</Link>
            <span style={{ color: '#475569', margin: '0 8px' }}>›</span>
            <span style={{ color: '#F5A900', fontSize: 13, fontWeight: 600 }}>{titulo}</span>
          </nav>
          <h1 style={{ color: 'white', fontSize: 'clamp(20px, 3vw, 32px)', fontWeight: 800 }}>
            {titulo} {local && `em ${local}`}
          </h1>
          <p style={{ color: '#94a3b8', fontSize: 14, marginTop: 6 }}>
            {imoveis.length} {imoveis.length === 1 ? 'imóvel encontrado' : 'imóveis encontrados'}
            {local && ` em ${local}`}
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          {/* Filtros laterais */}
          <aside style={{ width: 260, flexShrink: 0 }}>
            <div style={{ background: 'white', borderRadius: 12, padding: 24, border: '1px solid #E5E7EB', position: 'sticky', top: 100 }}>
              <h3 style={{ color: '#102B50', fontWeight: 700, fontSize: 16, marginBottom: 20 }}>🔽 Filtrar resultados</h3>
              
              <form method="get" action="/imoveis">
                {/* Negócio */}
                <div style={{ marginBottom: 16 }}>
                  <label style={{ color: '#374151', fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 8 }}>Tipo de negócio</label>
                  <select name="negocio" defaultValue={negocio || ''} className="input-arclar">
                    <option value="">Todos</option>
                    <option value="venda">Venda</option>
                    <option value="aluguel">Aluguel</option>
                  </select>
                </div>

                {/* Tipo de imóvel */}
                <div style={{ marginBottom: 16 }}>
                  <label style={{ color: '#374151', fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 8 }}>Tipo de imóvel</label>
                  <select name="tipo" defaultValue={tipo || ''} className="input-arclar">
                    <option value="">Todos os tipos</option>
                    <option value="apartamento">Apartamento</option>
                    <option value="casa">Casa</option>
                    <option value="cobertura">Cobertura</option>
                    <option value="studio">Studio / Kitnet</option>
                    <option value="terreno">Terreno</option>
                    <option value="comercial">Comercial</option>
                    <option value="sala">Sala Comercial</option>
                    <option value="galpao">Galpão</option>
                    <option value="chacara">Chácara / Sítio</option>
                  </select>
                </div>

                {/* Local */}
                <div style={{ marginBottom: 16 }}>
                  <label style={{ color: '#374151', fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 8 }}>Cidade ou bairro</label>
                  <input type="text" name="local" defaultValue={local} placeholder="Ex: São Paulo, Moema..." className="input-arclar" />
                </div>

                {/* Preço min */}
                <div style={{ marginBottom: 16 }}>
                  <label style={{ color: '#374151', fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 8 }}>Preço mínimo</label>
                  <select name="preco_min" defaultValue={params.preco_min || ''} className="input-arclar">
                    <option value="">Sem mínimo</option>
                    <option value="100000">R$ 100.000</option>
                    <option value="200000">R$ 200.000</option>
                    <option value="300000">R$ 300.000</option>
                    <option value="500000">R$ 500.000</option>
                    <option value="1000000">R$ 1.000.000</option>
                  </select>
                </div>

                {/* Preço max */}
                <div style={{ marginBottom: 16 }}>
                  <label style={{ color: '#374151', fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 8 }}>Preço máximo</label>
                  <select name="preco_max" defaultValue={params.preco_max || ''} className="input-arclar">
                    <option value="">Sem máximo</option>
                    <option value="300000">R$ 300.000</option>
                    <option value="500000">R$ 500.000</option>
                    <option value="1000000">R$ 1.000.000</option>
                    <option value="2000000">R$ 2.000.000</option>
                    <option value="5000000">R$ 5.000.000</option>
                  </select>
                </div>

                {/* Quartos */}
                <div style={{ marginBottom: 24 }}>
                  <label style={{ color: '#374151', fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 8 }}>Quartos (mínimo)</label>
                  <select name="quartos" defaultValue={params.quartos || ''} className="input-arclar">
                    <option value="">Qualquer</option>
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                    <option value="4">4+</option>
                  </select>
                </div>

                <button type="submit" style={{ width: '100%', background: '#102B50', color: 'white', border: 'none', borderRadius: 8, padding: '12px', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
                  Aplicar filtros
                </button>
                <Link href="/imoveis" style={{ display: 'block', textAlign: 'center', color: '#6B7280', fontSize: 13, marginTop: 10, textDecoration: 'none' }}>
                  Limpar filtros
                </Link>
              </form>
            </div>
          </aside>

          {/* Grid de imóveis */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Ordenação */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, background: 'white', padding: '12px 16px', borderRadius: 10, border: '1px solid #E5E7EB', flexWrap: 'wrap', gap: 8 }}>
              <span style={{ color: '#374151', fontSize: 14, fontWeight: 600 }}>
                {imoveis.length} {imoveis.length === 1 ? 'resultado' : 'resultados'}
              </span>
              <select className="input-arclar" style={{ width: 'auto', minWidth: 180 }}>
                <option>Mais relevantes</option>
                <option>Menor preço</option>
                <option>Maior preço</option>
                <option>Mais recentes</option>
                <option>Mais visualizados</option>
              </select>
            </div>

            {imoveis.length === 0 ? (
              <div style={{ background: 'white', borderRadius: 12, padding: 48, textAlign: 'center', border: '1px solid #E5E7EB' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
                <h3 style={{ color: '#374151', fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Nenhum imóvel encontrado</h3>
                <p style={{ color: '#6B7280', fontSize: 15, marginBottom: 24 }}>Tente ajustar os filtros ou buscar em outra cidade.</p>
                <Link href="/imoveis" style={{ background: '#102B50', color: 'white', textDecoration: 'none', padding: '12px 28px', borderRadius: 8, fontWeight: 700 }}>
                  Ver todos os imóveis
                </Link>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
                {imoveis.map(imovel => (
                  <CardImovel key={imovel.id} imovel={imovel as any} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

