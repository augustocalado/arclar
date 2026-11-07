/**
 * Eventos de remarketing para Google Ads/GA4 e Meta Pixel.
 * As funções são seguras quando as tags não estão configuradas.
 */

import { FACEBOOK_PIXEL_ID, GA_ID, GOOGLE_ADS_ID } from './config';

export interface DadosImovelRemarketing {
  id: string;
  titulo: string;
  preco: number;
  tipo: string;
  negocio: string;
  cidade: string;
  estado: string;
}

export interface DadosBuscaRemarketing {
  termo?: string;
  local?: string;
  tipo?: string;
  negocio?: string;
  total: number;
  ids?: string[];
}

function destinosGoogle(): string[] {
  return [GOOGLE_ADS_ID, GA_ID].filter(Boolean);
}

function googleAtivo(): boolean {
  return typeof window !== 'undefined' && destinosGoogle().length > 0;
}

function metaAtivo(): boolean {
  return typeof window !== 'undefined' && Boolean(FACEBOOK_PIXEL_ID);
}

function itemImovel(imovel: DadosImovelRemarketing) {
  return {
    id: imovel.id,
    name: imovel.titulo,
    category: `${imovel.tipo} / ${imovel.negocio}`,
    price: imovel.preco,
    quantity: 1,
    google_business_vertical: 'real_estate',
  };
}

export function rastrearPageView(pathname: string): void {
  if (typeof window === 'undefined') return;

  if (googleAtivo()) {
    window.gtag?.('event', 'page_view', {
      page_path: pathname,
      page_location: window.location.href,
      page_title: document.title,
      send_to: destinosGoogle(),
    });
  }

  if (metaAtivo()) {
    window.fbq?.('track', 'PageView');
  }
}

export function rastrearImovel(imovel: DadosImovelRemarketing): void {
  if (typeof window === 'undefined') return;

  if (googleAtivo()) {
    window.gtag?.('event', 'view_item', {
      currency: 'BRL',
      value: imovel.preco,
      items: [itemImovel(imovel)],
      send_to: destinosGoogle(),
      ecomm_pagetype: 'offerdetail',
      ecomm_prodid: imovel.id,
      ecomm_totalvalue: imovel.preco,
    });
  }

  if (metaAtivo()) {
    window.fbq?.('track', 'ViewContent', {
      content_ids: [imovel.id],
      content_type: 'product',
      content_name: imovel.titulo,
      content_category: `${imovel.tipo} / ${imovel.negocio}`,
      value: imovel.preco,
      currency: 'BRL',
    });
  }
}

export function rastrearBusca(busca: DadosBuscaRemarketing): void {
  if (typeof window === 'undefined') return;

  const termo = [busca.termo, busca.tipo, busca.negocio, busca.local]
    .filter(Boolean)
    .join(' ')
    .trim();

  if (googleAtivo()) {
    window.gtag?.('event', 'search', {
      search_term: termo || 'todos os imóveis',
      send_to: destinosGoogle(),
      ...(busca.ids && busca.ids.length > 0
        ? {
            items: busca.ids.map((id) => ({
              id,
              google_business_vertical: 'real_estate',
            })),
          }
        : {}),
    });
  }

  if (metaAtivo()) {
    window.fbq?.('track', 'Search', {
      search_string: termo || 'todos os imóveis',
      content_type: 'product',
      ...(busca.ids && busca.ids.length > 0 ? { content_ids: busca.ids } : {}),
    });
  }
}

export function rastrearLead(dados: { imovelId?: string; valor?: number; tipo?: string }): void {
  if (typeof window === 'undefined') return;

  if (googleAtivo()) {
    window.gtag?.('event', 'generate_lead', {
      currency: 'BRL',
      value: dados.valor || 0,
      lead_type: dados.tipo || 'imovel',
      send_to: destinosGoogle(),
      ...(dados.imovelId
        ? {
            items: [
              {
                id: dados.imovelId,
                google_business_vertical: 'real_estate',
              },
            ],
          }
        : {}),
    });
  }

  if (metaAtivo()) {
    window.fbq?.('track', 'Lead', {
      value: dados.valor || 0,
      currency: 'BRL',
      content_category: dados.tipo || 'imovel',
      ...(dados.imovelId
        ? { content_ids: [dados.imovelId], content_type: 'product' }
        : {}),
    });
  }
}

export function rastrearContato(dados: { imovelId?: string; valor?: number }): void {
  if (typeof window === 'undefined') return;

  if (googleAtivo()) {
    window.gtag?.('event', 'contact', {
      currency: 'BRL',
      value: dados.valor || 0,
      send_to: destinosGoogle(),
      ...(dados.imovelId
        ? {
            items: [
              {
                id: dados.imovelId,
                google_business_vertical: 'real_estate',
              },
            ],
          }
        : {}),
    });
  }

  if (metaAtivo()) {
    window.fbq?.('track', 'Contact', {
      value: dados.valor || 0,
      currency: 'BRL',
      ...(dados.imovelId
        ? { content_ids: [dados.imovelId], content_type: 'product' }
        : {}),
    });
  }
}
