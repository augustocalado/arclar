/**
 * Registro de eventos de analytics dos imóveis (visualizações e cliques no WhatsApp).
 */

import { isSupabaseConfigured } from './config';
import { isUuid } from './imoveis';
import { createSupabaseReadClient } from './server';

async function registrarEvento(
  imovelId: string,
  tipoEvento: 'view' | 'whatsapp_click',
  origem?: string,
  userAgent?: string
): Promise<boolean> {
  const client = createSupabaseReadClient();

  if (!client || !isSupabaseConfigured() || !isUuid(imovelId)) {
    return false;
  }

  try {
    const rpc =
      tipoEvento === 'view' ? 'increment_imovel_views' : 'increment_whatsapp_clicks';

    await client.rpc(rpc, { p_imovel_id: imovelId });

    await client.from('imovel_analytics').insert({
      imovel_id: imovelId,
      tipo_evento: tipoEvento,
      origem: origem || null,
      user_agent: userAgent || null,
    });

    return true;
  } catch (erro) {
    console.warn(`[SUPABASE] Falha ao registrar evento ${tipoEvento}:`, erro);
    return false;
  }
}

export function registrarVisualizacao(imovelId: string, origem?: string, userAgent?: string) {
  return registrarEvento(imovelId, 'view', origem, userAgent);
}

export function registrarCliqueWhatsapp(imovelId: string, origem?: string, userAgent?: string) {
  return registrarEvento(imovelId, 'whatsapp_click', origem, userAgent);
}
