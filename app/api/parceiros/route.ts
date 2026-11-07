import { NextResponse } from 'next/server';
import {
  criarParceiroLead,
  listarParceirosLeads,
  type NovoParceiroLeadInput,
  type TipoParceria,
} from '@/lib/supabase/parceiros';
import { notificarNovoParceiro } from '@/lib/email/notificacoes';

export const dynamic = 'force-dynamic';

const TIPOS_PARCERIA: TipoParceria[] = ['imobiliaria', 'corretor', 'portal', 'outro'];

function limpar(valor: unknown, limite: number): string {
  return typeof valor === 'string' ? valor.trim().slice(0, limite) : '';
}

function montarMensagem(input: NovoParceiroLeadInput): string {
  return [
    'Olá! Quero falar sobre parceria com o ARC LAR.',
    '',
    `Nome: ${input.nome}`,
    `E-mail: ${input.email}`,
    `Telefone: ${input.telefone}`,
    `Empresa: ${input.empresa || 'Não informado'}`,
    `Cidade: ${input.cidade || 'Não informado'}`,
    `Tipo de parceria: ${input.tipoParceria || 'imobiliaria'}`,
    `Mensagem: ${input.mensagem || 'Não informada'}`,
  ].join('\n');
}

function montarWhatsAppUrl(input: NovoParceiroLeadInput): string {
  const numero = (process.env.NEXT_PUBLIC_APP_WHATSAPP || '5511999999999').replace(/\D/g, '');
  return `https://wa.me/${numero}?text=${encodeURIComponent(montarMensagem(input))}`;
}

function montarEmailUrl(input: NovoParceiroLeadInput): string | null {
  const destinos = (process.env.PARCEIROS_EMAIL || process.env.EMAIL_TO || '')
    .split(',')
    .map((email) => email.trim())
    .filter(Boolean);

  if (destinos.length === 0) return null;

  const assunto = `Contato de parceria - ${input.nome}`;
  return `mailto:${destinos.join(',')}?subject=${encodeURIComponent(assunto)}&body=${encodeURIComponent(
    montarMensagem(input)
  )}`;
}

export async function GET() {
  const leads = await listarParceirosLeads();
  return NextResponse.json({ total: leads.length, leads });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (limpar(body.website, 200)) {
      return NextResponse.json({ success: true });
    }

    const nome = limpar(body.nome, 255);
    const email = limpar(body.email, 255);
    const telefone = limpar(body.telefone, 50);
    const empresa = limpar(body.empresa, 255);
    const cidade = limpar(body.cidade, 255);
    const mensagem = limpar(body.mensagem, 2000);
    const tipoInformado = limpar(body.tipoParceria, 50) as TipoParceria;
    const tipoParceria = TIPOS_PARCERIA.includes(tipoInformado) ? tipoInformado : 'imobiliaria';

    if (!nome || !email || !telefone) {
      return NextResponse.json(
        { error: 'Preencha nome, e-mail e telefone.' },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Informe um e-mail válido.' }, { status: 400 });
    }

    const input: NovoParceiroLeadInput = {
      nome,
      email,
      telefone,
      empresa,
      cidade,
      tipoParceria,
      mensagem,
    };

    const { lead, persistido } = await criarParceiroLead(input);
    const notificacao = await notificarNovoParceiro(lead);

    console.log('[PARCERIAS] Novo contato:', lead.id, `persistido=${persistido}`);

    return NextResponse.json({
      success: true,
      persistido,
      notificado: notificacao.enviado,
      whatsappUrl: montarWhatsAppUrl(input),
      emailUrl: montarEmailUrl(input),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erro interno';
    console.error('[PARCERIAS] Erro ao registrar contato:', err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
