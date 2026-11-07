import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { formatarPreco, formatarTipoImovel } from '@/lib/utils';
import { buscarImovelPorSlug, listarImoveisSemelhantes } from '@/lib/supabase/imoveis';
import BotaoWhatsApp from '@/components/imoveis/BotaoWhatsApp';
import FormularioLead from '@/components/imoveis/FormularioLead';
import RegistrarVisualizacao from '@/components/imoveis/RegistrarVisualizacao';
import EventoImovel from '@/components/marketing/EventoImovel';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const imovel = await buscarImovelPorSlug(slug);
  if (!imovel) return { title: 'Imóvel não encontrado' };

  return {
    title: `${imovel.titulo} – ${imovel.endereco.cidade}, ${imovel.endereco.estado_sigla}`,
    description: imovel.descricao || `${formatarTipoImovel(imovel.tipo)} ${imovel.negocio === 'aluguel' ? 'para alugar' : 'à venda'} em ${imovel.endereco.bairro}, ${imovel.endereco.cidade}. ${formatarPreco(imovel.preco, imovel.negocio)}.`,
    openGraph: {
      title: imovel.titulo,
      description: `${formatarTipoImovel(imovel.tipo)} ${imovel.negocio === 'aluguel' ? 'para alugar' : 'à venda'} em ${imovel.endereco.cidade}`,
      images: imovel.foto_principal ? [{ url: imovel.foto_principal }] : [],
    },
  };
}

export default async function ImovelPage({ params }: PageProps) {
  const { slug } = await params;
  const imovel = await buscarImovelPorSlug(slug);
  if (!imovel) notFound();

  const semelhantes = await listarImoveisSemelhantes(imovel);

  return (
    <div style={{ background: '#F5F7FA', minHeight: '100vh' }}>
      <RegistrarVisualizacao imovelId={imovel.id} />
      <EventoImovel
        imovel={{
          id: imovel.id,
          titulo: imovel.titulo,
          preco: imovel.preco,
          tipo: imovel.tipo,
          negocio: imovel.negocio,
          cidade: imovel.endereco.cidade,
          estado: imovel.endereco.estado_sigla,
        }}
      />
      {/* Breadcrumb */}
      <div style={{ background: '#102B50', padding: '16px 24px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <nav style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <Link href="/" style={{ color: '#94a3b8', fontSize: 13, textDecoration: 'none' }}>Início</Link>
            <span style={{ color: '#475569' }}>›</span>
            <Link href="/imoveis" style={{ color: '#94a3b8', fontSize: 13, textDecoration: 'none' }}>Imóveis</Link>
            <span style={{ color: '#475569' }}>›</span>
            <Link href={`/cidade/${imovel.endereco.cidade.toLowerCase().replace(/ /g, '-')}-${imovel.endereco.estado_sigla.toLowerCase()}`} style={{ color: '#94a3b8', fontSize: 13, textDecoration: 'none' }}>
              {imovel.endereco.cidade}
            </Link>
            <span style={{ color: '#475569' }}>›</span>
            <span style={{ color: '#F5A900', fontSize: 13, fontWeight: 600, maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{imovel.titulo}</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 24px' }}>
        <div className="imovel-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 32, alignItems: 'start' }}>
          {/* Coluna principal */}
          <div>
            {/* Galeria de fotos */}
            <div style={{ background: 'white', borderRadius: 16, overflow: 'hidden', marginBottom: 24, border: '1px solid #E5E7EB' }}>
              <div className="imovel-galeria" style={{ position: 'relative', height: 480, background: '#F3F4F6' }}>
                <Image
                  src={imovel.foto_principal || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80'}
                  alt={imovel.titulo}
                  fill
                  style={{ objectFit: 'cover' }}
                  priority
                  sizes="(max-width: 1200px) 100vw, 800px"
                />
                {/* Badges sobre a foto */}
                <div style={{ position: 'absolute', top: 20, left: 20, display: 'flex', gap: 8 }}>
                  <span className={imovel.negocio === 'aluguel' ? 'badge-aluguel' : 'badge-venda'} style={{ fontSize: 13, padding: '5px 14px' }}>
                    {imovel.negocio === 'aluguel' ? 'Aluguel' : 'Venda'}
                  </span>
                  {imovel.destaque && <span className="badge-destaque" style={{ fontSize: 13, padding: '5px 14px' }}>⭐ Destaque</span>}
                </div>
                {/* Contador de fotos */}
                {imovel.fotos && imovel.fotos.length > 1 && (
                  <div style={{ position: 'absolute', bottom: 20, right: 20, background: 'rgba(0,0,0,0.6)', color: 'white', padding: '6px 14px', borderRadius: 20, fontSize: 13, fontWeight: 600 }}>
                    📷 {imovel.fotos.length} fotos
                  </div>
                )}
              </div>
              {/* Miniaturas */}
              {imovel.fotos && imovel.fotos.length > 1 && (
                <div style={{ display: 'flex', gap: 8, padding: 12, overflowX: 'auto' }}>
                  {imovel.fotos.slice(0, 6).map((foto, idx) => (
                    <div key={idx} style={{ position: 'relative', width: 100, height: 70, flexShrink: 0, borderRadius: 8, overflow: 'hidden', border: idx === 0 ? '2px solid #F5A900' : '2px solid transparent', cursor: 'pointer' }}>
                      <Image src={foto} alt={`Foto ${idx + 1}`} fill style={{ objectFit: 'cover' }} sizes="100px" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Detalhes do imóvel */}
            <div className="imovel-info-card" style={{ background: 'white', borderRadius: 16, padding: 32, marginBottom: 24, border: '1px solid #E5E7EB' }}>
              <div style={{ marginBottom: 20 }}>
                <span style={{ color: '#6B7280', fontSize: 14, fontWeight: 500 }}>{formatarTipoImovel(imovel.tipo)}</span>
                <h1 style={{ color: '#102B50', fontSize: 'clamp(20px, 3vw, 28px)', fontWeight: 800, margin: '8px 0 12px' }}>
                  {imovel.titulo}
                </h1>
                <div style={{ color: '#6B7280', fontSize: 15, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span>📍</span>
                  <span>{imovel.endereco.bairro}, {imovel.endereco.cidade} – {imovel.endereco.estado}, {imovel.endereco.estado_sigla}</span>
                </div>
              </div>

              {/* Características principais */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 16, padding: '20px 0', borderTop: '1px solid #F0F0F0', borderBottom: '1px solid #F0F0F0', marginBottom: 24 }}>
                {[
                  imovel.quartos && imovel.quartos > 0 ? { emoji: '🛏️', valor: imovel.quartos, label: imovel.quartos === 1 ? 'Quarto' : 'Quartos' } : null,
                  imovel.suites && imovel.suites > 0 ? { emoji: '🌟', valor: imovel.suites, label: imovel.suites === 1 ? 'Suíte' : 'Suítes' } : null,
                  imovel.banheiros && imovel.banheiros > 0 ? { emoji: '🚿', valor: imovel.banheiros, label: imovel.banheiros === 1 ? 'Banheiro' : 'Banheiros' } : null,
                  imovel.vagas && imovel.vagas > 0 ? { emoji: '🚗', valor: imovel.vagas, label: imovel.vagas === 1 ? 'Vaga' : 'Vagas' } : null,
                  imovel.area_construida ? { emoji: '📐', valor: `${imovel.area_construida} m²`, label: 'Área útil' } : null,
                  imovel.area_total ? { emoji: '🗺️', valor: `${imovel.area_total} m²`, label: 'Área total' } : null,
                ].filter(Boolean).map((item, idx) => (
                  <div key={idx} style={{ textAlign: 'center', padding: '12px 8px', background: '#F8FAFC', borderRadius: 10 }}>
                    <div style={{ fontSize: 24, marginBottom: 4 }}>{item!.emoji}</div>
                    <div style={{ color: '#102B50', fontWeight: 800, fontSize: 18 }}>{item!.valor}</div>
                    <div style={{ color: '#6B7280', fontSize: 12 }}>{item!.label}</div>
                  </div>
                ))}
              </div>

              {/* Descrição */}
              {imovel.descricao && (
                <div style={{ marginBottom: 24 }}>
                  <h2 style={{ color: '#102B50', fontSize: 18, fontWeight: 700, marginBottom: 12 }}>Sobre o imóvel</h2>
                  <p style={{ color: '#374151', fontSize: 15, lineHeight: 1.8 }}>{imovel.descricao}</p>
                </div>
              )}

              {/* Valores adicionais */}
              {(imovel.preco_condominio || imovel.preco_iptu) && (
                <div style={{ background: '#F8FAFC', borderRadius: 10, padding: 20 }}>
                  <h3 style={{ color: '#102B50', fontSize: 15, fontWeight: 700, marginBottom: 12 }}>Valores adicionais</h3>
                  <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                    {imovel.preco_condominio && (
                      <div>
                        <div style={{ color: '#6B7280', fontSize: 13 }}>Condomínio</div>
                        <div style={{ color: '#1F2937', fontWeight: 700, fontSize: 16 }}>R$ {imovel.preco_condominio.toLocaleString('pt-BR')}/mês</div>
                      </div>
                    )}
                    {imovel.preco_iptu && (
                      <div>
                        <div style={{ color: '#6B7280', fontSize: 13 }}>IPTU</div>
                        <div style={{ color: '#1F2937', fontWeight: 700, fontSize: 16 }}>R$ {imovel.preco_iptu.toLocaleString('pt-BR')}/ano</div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Localização */}
            <div style={{ background: 'white', borderRadius: 16, padding: 24, marginBottom: 24, border: '1px solid #E5E7EB' }}>
              <h2 style={{ color: '#102B50', fontSize: 18, fontWeight: 700, marginBottom: 16 }}>📍 Localização</h2>
              <p style={{ color: '#374151', fontSize: 15, marginBottom: 16 }}>
                {imovel.endereco.bairro} · {imovel.endereco.cidade}, {imovel.endereco.estado} – {imovel.endereco.estado_sigla}
              </p>
              {/* Placeholder do mapa */}
              <div style={{ background: '#E5E7EB', borderRadius: 10, height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 8 }}>
                <span style={{ fontSize: 36 }}>🗺️</span>
                <span style={{ color: '#6B7280', fontSize: 14 }}>Mapa em breve (integração Google Maps)</span>
                <span style={{ color: '#9CA3AF', fontSize: 12 }}>Configure NEXT_PUBLIC_GOOGLE_MAPS_KEY no .env</span>
              </div>
            </div>

            {/* Compartilhar */}
            <div style={{ background: 'white', borderRadius: 16, padding: 24, marginBottom: 24, border: '1px solid #E5E7EB' }}>
              <h3 style={{ color: '#102B50', fontSize: 16, fontWeight: 700, marginBottom: 16 }}>📢 Compartilhar este imóvel</h3>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {[
                  { label: '📱 WhatsApp', bg: '#25D366', href: `https://wa.me/?text=${encodeURIComponent(`${imovel.titulo} - Veja no ARC LAR: https://arclar.com.br/imovel/${imovel.slug}`)}` },
                  { label: '📘 Facebook', bg: '#1877F2', href: `https://facebook.com/sharer/sharer.php?u=https://arclar.com.br/imovel/${imovel.slug}` },
                  { label: '🐦 Twitter/X', bg: '#1DA1F2', href: `https://twitter.com/intent/tweet?url=https://arclar.com.br/imovel/${imovel.slug}&text=${encodeURIComponent(imovel.titulo)}` },
                ].map(item => (
                  <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer"
                    style={{ background: item.bg, color: 'white', padding: '10px 20px', borderRadius: 8, textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>
                    {item.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Imóveis semelhantes */}
            {semelhantes.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <h2 style={{ color: '#102B50', fontSize: 20, fontWeight: 800, marginBottom: 20 }}>Imóveis semelhantes</h2>
                <div className="grid-semelhantes" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
                  {semelhantes.map(sim => (
                    <div key={sim.id} style={{ background: 'white', borderRadius: 12, overflow: 'hidden', border: '1px solid #E5E7EB' }}>
                      <div style={{ position: 'relative', height: 160 }}>
                        <Image src={sim.foto_principal || ''} alt={sim.titulo} fill style={{ objectFit: 'cover' }} sizes="300px" />
                      </div>
                      <div style={{ padding: 16 }}>
                        <div style={{ color: '#102B50', fontWeight: 800, fontSize: 18, marginBottom: 4 }}>{formatarPreco(sim.preco, sim.negocio)}</div>
                        <div style={{ color: '#374151', fontSize: 14, marginBottom: 8, fontWeight: 600 }}>{sim.titulo}</div>
                        <div style={{ color: '#6B7280', fontSize: 12, marginBottom: 12 }}>{sim.endereco.bairro}, {sim.endereco.cidade}</div>
                        <Link href={`/imovel/${sim.slug}`} style={{ background: '#102B50', color: 'white', textDecoration: 'none', padding: '8px 16px', borderRadius: 6, fontSize: 13, fontWeight: 600 }}>
                          Ver imóvel →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Coluna lateral – Contato */}
          <div className="imovel-sidebar" style={{ position: 'sticky', top: 100 }}>
            {/* Preço */}
            <div style={{ background: 'white', borderRadius: 16, padding: 24, marginBottom: 16, border: '2px solid #102B50', boxShadow: '0 8px 32px rgba(16,43,80,0.12)' }}>
              <div style={{ marginBottom: 20 }}>
                <div style={{ color: '#6B7280', fontSize: 13, fontWeight: 500 }}>
                  {imovel.negocio === 'aluguel' ? 'Valor do aluguel' : 'Valor de venda'}
                </div>
                <div style={{ color: '#102B50', fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 900, lineHeight: 1.1 }}>
                  {formatarPreco(imovel.preco, imovel.negocio)}
                </div>
                {imovel.preco_condominio && (
                  <div style={{ color: '#6B7280', fontSize: 13, marginTop: 4 }}>
                    + R$ {imovel.preco_condominio.toLocaleString('pt-BR')}/mês cond.
                  </div>
                )}
              </div>

              {/* Visualizações */}
              <div style={{ color: '#9CA3AF', fontSize: 12, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 4 }}>
                👁️ {(imovel.visualizacoes || 0) + 1} visualizações
              </div>

              {/* Anunciante */}
              {imovel.anunciante && (
                <div style={{ background: '#F8FAFC', borderRadius: 10, padding: 14, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 48, height: 48, background: '#102B50', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: 20, flexShrink: 0 }}>
                    {imovel.anunciante.nome[0]}
                  </div>
                  <div>
                    <div style={{ color: '#1F2937', fontWeight: 700, fontSize: 14 }}>{imovel.anunciante.nome}</div>
                    <div style={{ color: '#6B7280', fontSize: 12 }}>Anunciante verificado ✅</div>
                  </div>
                </div>
              )}

              {/* Botão WhatsApp com tracking e link automático */}
              <BotaoWhatsApp
                telefone={imovel.anunciante?.whatsapp || imovel.anunciante?.telefone}
                tituloImovel={imovel.titulo}
                codigoImovel={imovel.id}
                slugImovel={imovel.slug}
                anuncianteId={imovel.anunciante?.id}
                valor={imovel.preco}
              />

              {/* Formulário de interesse / CRM */}
              <FormularioLead
                imovelId={imovel.id}
                anuncianteId={imovel.anunciante?.id}
                valor={imovel.preco}
              />
            </div>

            {/* Código do imóvel */}
            <div style={{ background: 'white', borderRadius: 12, padding: 16, border: '1px solid #E5E7EB', textAlign: 'center' }}>
              <span style={{ color: '#9CA3AF', fontSize: 12 }}>Código do imóvel: </span>
              <span style={{ color: '#374151', fontWeight: 700, fontSize: 12 }}>#{imovel.id.toUpperCase()}</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

