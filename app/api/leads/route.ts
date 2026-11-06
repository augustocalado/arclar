import { NextResponse } from 'next/server';
import { criarLead, listarLeads } from '@/lib/supabase/leads';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const anuncianteId = searchParams.get('anuncianteId') || undefined;

  const leads = await listarLeads(anuncianteId);

  return NextResponse.json({ total: leads.length, leads });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nome, email, telefone, mensagem, imovelId, anuncianteId } = body;

    if (!nome || !email || !imovelId) {
      return NextResponse.json({ error: 'Campos obrigatórios ausentes' }, { status: 400 });
    }

    const lead = await criarLead({
      imovelId,
      anuncianteId,
      nome,
      email,
      telefone,
      mensagem,
      origem: 'formulario_imovel',
    });

    console.log('[CRM] Novo lead registrado:', lead.id);

    return NextResponse.json({ success: true, lead });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erro interno';
    console.error('[CRM] Erro ao registrar lead:', err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
