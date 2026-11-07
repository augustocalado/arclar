/**
 * Notificações por e-mail dos contatos recebidos pelo portal.
 * Usa a API do Resend quando as variáveis de ambiente estão configuradas.
 */

import type { ParceiroLead } from '@/lib/supabase/parceiros';

interface ResultadoNotificacao {
  enviado: boolean;
  motivo?: string;
}

function escaparHtml(valor: string): string {
  return valor
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function destinos(): string[] {
  const configurado = process.env.PARCEIROS_EMAIL || process.env.EMAIL_TO || '';
  return configurado
    .split(',')
    .map((email) => email.trim())
    .filter(Boolean);
}

export async function notificarNovoParceiro(lead: ParceiroLead): Promise<ResultadoNotificacao> {
  const apiKey = process.env.RESEND_API_KEY;
  const remetente = process.env.EMAIL_FROM;
  const destinatarios = destinos();

  if (!apiKey || !remetente || destinatarios.length === 0) {
    return { enviado: false, motivo: 'E-mail de notificação não configurado' };
  }

  const linhas = [
    ['Nome', lead.nome],
    ['E-mail', lead.email],
    ['Telefone', lead.telefone],
    ['Empresa', lead.empresa || 'Não informado'],
    ['Cidade', lead.cidade || 'Não informado'],
    ['Tipo de parceria', lead.tipo_parceria],
    ['Mensagem', lead.mensagem || 'Não informada'],
  ]
    .map(
      ([rotulo, valor]) =>
        `<tr><td style="padding:6px 12px 6px 0;color:#6B7280;font-weight:600">${escaparHtml(
          rotulo
        )}</td><td style="padding:6px 0;color:#1F2937">${escaparHtml(valor)}</td></tr>`
    )
    .join('');

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
      <h2 style="color:#102B50">Novo contato de parceria</h2>
      <p style="color:#4B5563">Recebemos um novo interesse de parceria pelo site.</p>
      <table style="border-collapse:collapse;font-size:14px">${linhas}</table>
      <p style="color:#9CA3AF;font-size:12px;margin-top:24px">ARC LAR — Portal Imobiliário</p>
    </div>
  `;

  try {
    const resposta = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: remetente,
        to: destinatarios,
        subject: `Novo parceiro interessado: ${lead.nome}`,
        html,
      }),
    });

    if (!resposta.ok) {
      const detalhe = await resposta.text();
      console.warn('[EMAIL] Falha ao notificar parceria:', detalhe);
      return { enviado: false, motivo: 'Falha no provedor de e-mail' };
    }

    return { enviado: true };
  } catch (err) {
    console.warn('[EMAIL] Erro ao notificar parceria:', err);
    return { enviado: false, motivo: 'Erro ao enviar e-mail' };
  }
}
