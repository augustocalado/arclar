import { MetadataRoute } from 'next';
import { CIDADES_DESTAQUE } from '@/lib/utils';
import { listarImoveis } from '@/lib/supabase/imoveis';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://arclar.com.br';
  const agora = new Date();
  const imoveis = await listarImoveis();

  // Rotas estáticas essenciais
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: agora,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/imoveis`,
      lastModified: agora,
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/comprar`,
      lastModified: agora,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/alugar`,
      lastModified: agora,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/planos`,
      lastModified: agora,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/anunciar`,
      lastModified: agora,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/links`,
      lastModified: agora,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];

  // Rotas de imóveis dinâmicos
  const imoveisRoutes: MetadataRoute.Sitemap = imoveis.map((imovel) => ({
    url: `${baseUrl}/imovel/${imovel.slug}`,
    lastModified: agora,
    changeFrequency: 'daily',
    priority: 0.8,
  }));

  // Rotas de cidades
  const cidadesRoutes: MetadataRoute.Sitemap = CIDADES_DESTAQUE.map((cidade) => ({
    url: `${baseUrl}/cidade/${cidade.slug}`,
    lastModified: agora,
    changeFrequency: 'daily',
    priority: 0.85,
  }));

  return [...staticRoutes, ...imoveisRoutes, ...cidadesRoutes];
}

