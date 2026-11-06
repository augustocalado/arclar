import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nome, email, telefone, mensagem, imovelId, anuncianteId } = body;

    if (!nome || !email || !imovelId) {
      return NextResponse.json({ error: 'Campos obrigatórios ausentes' }, { status: 400 });
    }

    const novoLead = {
      id: `lead_${Date.now()}`,
      nome,
      email,
      telefone: telefone || '',
      mensagem: mensagem || '',
      imovel_id: imovelId,
      anunciante_id: anuncianteId || 'central',
      status: 'novo',
      origem: 'formulario_imovel',
      criado_em: new Date().toISOString(),
    };

    console.log('[CRM] Novo lead registrado com sucesso:', novoLead);

    return NextResponse.json({ success: true, lead: novoLead });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Erro interno' }, { status: 500 });
  }
}

