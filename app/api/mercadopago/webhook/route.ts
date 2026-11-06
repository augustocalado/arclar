import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const topic = searchParams.get('topic') || searchParams.get('type');
    const id = searchParams.get('id') || searchParams.get('data.id');

    const body = await request.json().catch(() => ({}));

    console.log(`[MERCADO PAGO WEBHOOK] Notificação recebida: Topic: ${topic}, ID: ${id}`, body);

    if (topic === 'payment' || body.type === 'payment') {
      const paymentId = id || body.data?.id;
      const mpToken = process.env.MERCADOPAGO_ACCESS_TOKEN;

      if (mpToken && paymentId) {
        // Consulta detalhes do pagamento de forma segura na API oficial do Mercado Pago
        const paymentRes = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
          headers: { Authorization: `Bearer ${mpToken}` },
        });

        if (paymentRes.ok) {
          const paymentData = await paymentRes.json();
          const status = paymentData.status; // 'approved', 'pending', etc.
          console.log(`[MERCADO PAGO] Pagamento ${paymentId} confirmado com status: ${status}`);
          // Aqui atualiza a assinatura ou ativa o destaque do anúncio no banco
        }
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err: any) {
    console.error('[MERCADO PAGO WEBHOOK ERROR]', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

