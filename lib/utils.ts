import { type ClassValue, clsx } from "clsx";
import { Imovel } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatarPreco(valor: number, tipo?: 'venda' | 'aluguel'): string {
  const formatado = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(valor);
  
  if (tipo === 'aluguel') return `${formatado}/mês`;
  return formatado;
}

export function gerarSlug(texto: string): string {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export function formatarArea(metros: number): string {
  return `${metros} m²`;
}

export function formatarTipoImovel(tipo: string): string {
  const mapa: Record<string, string> = {
    apartamento: 'Apartamento',
    casa: 'Casa',
    terreno: 'Terreno',
    comercial: 'Comercial',
    cobertura: 'Cobertura',
    studio: 'Studio',
    flat: 'Flat',
    sala: 'Sala Comercial',
    galpao: 'Galpão',
    chacara: 'Chácara',
    sitio: 'Sítio',
    fazenda: 'Fazenda',
  };
  return mapa[tipo] || tipo;
}

export function formatarNegocio(negocio: string): string {
  return negocio === 'aluguel' ? 'Aluguel' : 'Venda';
}

export function formatarEstado(sigla: string): string {
  const estados: Record<string, string> = {
    AC: 'Acre', AL: 'Alagoas', AP: 'Amapá', AM: 'Amazonas',
    BA: 'Bahia', CE: 'Ceará', DF: 'Distrito Federal', ES: 'Espírito Santo',
    GO: 'Goiás', MA: 'Maranhão', MT: 'Mato Grosso', MS: 'Mato Grosso do Sul',
    MG: 'Minas Gerais', PA: 'Pará', PB: 'Paraíba', PR: 'Paraná',
    PE: 'Pernambuco', PI: 'Piauí', RJ: 'Rio de Janeiro', RN: 'Rio Grande do Norte',
    RS: 'Rio Grande do Sul', RO: 'Rondônia', RR: 'Roraima', SC: 'Santa Catarina',
    SP: 'São Paulo', SE: 'Sergipe', TO: 'Tocantins',
  };
  return estados[sigla] || sigla;
}

// Dados mockados para desenvolvimento (substituir por Supabase na fase 1 final)
export const IMOVEIS_MOCK: Imovel[] = [
  {
    id: '1',
    slug: 'apartamento-venda-sao-paulo-moema-1',
    titulo: 'Apartamento Moderno com Vista para o Parque',
    descricao: 'Lindo apartamento com acabamento de alto padrão, varanda gourmet e vista privilegiada. Próximo a restaurantes, shoppings e parques.',
    tipo: 'apartamento',
    negocio: 'venda',
    status: 'ativo',
    preco: 850000,
    preco_condominio: 1200,
    preco_iptu: 450,
    area_total: 95,
    area_construida: 85,
    quartos: 3,
    suites: 1,
    banheiros: 2,
    vagas: 2,
    destaque: true,
    nivel_destaque: 'super_destaque',
    foto_principal: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
    fotos: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
    ],
    endereco: { bairro: 'Moema', cidade: 'São Paulo', estado: 'São Paulo', estado_sigla: 'SP' },
    anunciante: { id: 'a1', nome: 'Prime Imóveis', perfil: 'imobiliaria', logo_url: '', whatsapp: '11999998888', telefone: '11999998888' },
    total_cliques_whatsapp: 34,
    total_visualizacoes: 342,
    visualizacoes: 342,
  },
  {
    id: '2',
    slug: 'casa-venda-praia-grande-vila-tupi-2',
    titulo: 'Casa Espaçosa a 200m da Praia',
    descricao: 'Casa ampla com quintal, churrasqueira e piscina. Localização privilegiada próxima à praia e ao comércio.',
    tipo: 'casa',
    negocio: 'venda',
    status: 'ativo',
    preco: 620000,
    area_total: 200,
    area_construida: 150,
    quartos: 4,
    suites: 2,
    banheiros: 3,
    vagas: 3,
    destaque: true,
    nivel_destaque: 'destaque',
    foto_principal: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80',
    fotos: ['https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80'],
    endereco: { bairro: 'Vila Tupi', cidade: 'Praia Grande', estado: 'São Paulo', estado_sigla: 'SP' },
    anunciante: { id: 'a2', nome: 'Litoral Imóveis', perfil: 'imobiliaria', logo_url: '', whatsapp: '13988887777', telefone: '13988887777' },
    total_cliques_whatsapp: 19,
    total_visualizacoes: 218,
    visualizacoes: 218,
  },
  {
    id: '3',
    slug: 'apartamento-aluguel-santos-gonzaga-3',
    titulo: 'Apartamento Frente ao Mar em Gonzaga',
    descricao: 'Apartamento com vista para o mar, totalmente mobiliado. Ideal para morar ou investimento.',
    tipo: 'apartamento',
    negocio: 'aluguel',
    status: 'ativo',
    preco: 4500,
    area_construida: 70,
    quartos: 2,
    suites: 1,
    banheiros: 2,
    vagas: 1,
    destaque: false,
    nivel_destaque: 'normal',
    foto_principal: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
    fotos: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80'],
    endereco: { bairro: 'Gonzaga', cidade: 'Santos', estado: 'São Paulo', estado_sigla: 'SP' },
    anunciante: { id: 'a3', nome: 'Santos Premium', perfil: 'imobiliaria', logo_url: '', whatsapp: '13977776666', telefone: '13977776666' },
    total_cliques_whatsapp: 12,
    total_visualizacoes: 156,
    visualizacoes: 156,
  },
  {
    id: '4',
    slug: 'casa-aluguel-curitiba-batel-4',
    titulo: 'Casa de Alto Padrão no Batel',
    descricao: 'Sobrado sofisticado em condomínio fechado, com área gourmet completa e jardim paisagístico.',
    tipo: 'casa',
    negocio: 'aluguel',
    status: 'ativo',
    preco: 8500,
    area_total: 320,
    area_construida: 280,
    quartos: 4,
    suites: 3,
    banheiros: 4,
    vagas: 4,
    destaque: true,
    nivel_destaque: 'destaque',
    foto_principal: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
    fotos: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80'],
    endereco: { bairro: 'Batel', cidade: 'Curitiba', estado: 'Paraná', estado_sigla: 'PR' },
    anunciante: { id: 'a4', nome: 'Curitiba Exclusive', perfil: 'imobiliaria', logo_url: '', whatsapp: '41999995555', telefone: '41999995555' },
    total_cliques_whatsapp: 28,
    total_visualizacoes: 198,
    visualizacoes: 198,
  },
  {
    id: '5',
    slug: 'apartamento-venda-rio-de-janeiro-ipanema-5',
    titulo: 'Cobertura Duplex em Ipanema',
    descricao: 'Cobertura luxuosa com terraço privativo, piscina e vista para o mar de Ipanema. Acabamento impecável.',
    tipo: 'cobertura',
    negocio: 'venda',
    status: 'ativo',
    preco: 4200000,
    preco_condominio: 3500,
    area_construida: 250,
    quartos: 4,
    suites: 4,
    banheiros: 5,
    vagas: 3,
    destaque: true,
    nivel_destaque: 'super_destaque',
    foto_principal: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80',
    fotos: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80'],
    endereco: { bairro: 'Ipanema', cidade: 'Rio de Janeiro', estado: 'Rio de Janeiro', estado_sigla: 'RJ' },
    anunciante: { id: 'a5', nome: 'Rio Luxury', perfil: 'imobiliaria', logo_url: '', whatsapp: '21988884444', telefone: '21988884444' },
    total_cliques_whatsapp: 54,
    total_visualizacoes: 487,
    visualizacoes: 487,
  },
  {
    id: '6',
    slug: 'apartamento-venda-campinas-cambuí-6',
    titulo: 'Apartamento Novo no Cambuí',
    descricao: 'Apartamento em condomínio clube com academia, piscina, salão de festas e segurança 24h.',
    tipo: 'apartamento',
    negocio: 'venda',
    status: 'ativo',
    preco: 495000,
    preco_condominio: 850,
    area_construida: 78,
    quartos: 3,
    suites: 1,
    banheiros: 2,
    vagas: 2,
    destaque: false,
    nivel_destaque: 'normal',
    foto_principal: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80',
    fotos: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80'],
    endereco: { bairro: 'Cambuí', cidade: 'Campinas', estado: 'São Paulo', estado_sigla: 'SP' },
    anunciante: { id: 'a6', nome: 'Campinas Imóveis', perfil: 'corretor', logo_url: '', whatsapp: '19977773333', telefone: '19977773333' },
    total_cliques_whatsapp: 9,
    total_visualizacoes: 134,
    visualizacoes: 134,
  },
];

export const CIDADES_DESTAQUE = [
  { nome: 'São Paulo', estado: 'SP', slug: 'sao-paulo-sp', foto: 'https://images.unsplash.com/photo-1543059080-f9b1272213d5?w=400&q=80', total: 12450 },
  { nome: 'Rio de Janeiro', estado: 'RJ', slug: 'rio-de-janeiro-rj', foto: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=400&q=80', total: 8320 },
  { nome: 'Curitiba', estado: 'PR', slug: 'curitiba-pr', foto: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=400&q=80', total: 4210 },
  { nome: 'Praia Grande', estado: 'SP', slug: 'praia-grande-sp', foto: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80', total: 2180 },
  { nome: 'Santos', estado: 'SP', slug: 'santos-sp', foto: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80', total: 1890 },
  { nome: 'Campinas', estado: 'SP', slug: 'campinas-sp', foto: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400&q=80', total: 3540 },
  { nome: 'Florianópolis', estado: 'SC', slug: 'florianopolis-sc', foto: 'https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?w=400&q=80', total: 2760 },
  { nome: 'Belo Horizonte', estado: 'MG', slug: 'belo-horizonte-mg', foto: 'https://images.unsplash.com/photo-1573974369024-5c9fce50cce7?w=400&q=80', total: 5120 },
];

