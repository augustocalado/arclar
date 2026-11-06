import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { imovelId, anuncianteId, origem } = body;

    if (!imovelId) {
      return NextResponse.json({ error: 'imovelId é obrigatório' }, { status: 400 });
    }

    // Registra estatística de clique no WhatsApp
    // Quando conectado ao Supabase ativo, executa a RPC increment_whatsapp_clicks
    console.log(`[ANALYTICS] Clique WhatsApp registrado: Imóvel ${imovelId}, Anunciante ${anuncianteId || 'central'}, Origem: ${origem || 'pagina_imovel'}`);

    return NextResponse.json({ success: true, imovelId });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Erro interno' }, { status: 500 });
  }
}

