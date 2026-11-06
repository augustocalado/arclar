import { NextResponse } from 'next/server';
import { registrarCliqueWhatsapp } from '@/lib/supabase/analytics';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { imovelId, origem } = body;

    if (!imovelId) {
      return NextResponse.json({ error: 'imovelId é obrigatório' }, { status: 400 });
    }

    const registrado = await registrarCliqueWhatsapp(
      imovelId,
      origem || 'pagina_imovel',
      request.headers.get('user-agent') || undefined
    );

    console.log(`[ANALYTICS] Clique WhatsApp registrado: Imóvel ${imovelId} (persistido: ${registrado})`);

    return NextResponse.json({ success: true, imovelId, registrado });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erro interno';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
