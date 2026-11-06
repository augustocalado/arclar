export interface PreferenceItem {
  id: string;
  title: string;
  description?: string;
  unit_price: number;
  quantity: number;
}

export async function criarPreferenciaMercadoPago(item: PreferenceItem, payerEmail?: string) {
  const token = process.env.MERCADOPAGO_ACCESS_TOKEN;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://arclar.com.br';

  if (!token) {
    console.warn('[MERCADO PAGO] MERCADOPAGO_ACCESS_TOKEN não configurado no .env.');
    // Retorna mock seguro em ambiente de desenvolvimento
    return {
      id: `pref_mock_${Date.now()}`,
      init_point: `${appUrl}/planos?status=sandbox_mock`,
      sandbox_init_point: `${appUrl}/planos?status=sandbox_mock`,
    };
  }

  const payload = {
    items: [
      {
        id: item.id,
        title: item.title,
        description: item.description,
        unit_price: item.unit_price,
        quantity: item.quantity || 1,
        currency_id: 'BRL',
      },
    ],
    payer: {
      email: payerEmail || 'cliente@arclar.com.br',
    },
    back_urls: {
      success: `${appUrl}/painel?status=aprovado`,
      pending: `${appUrl}/painel?status=pendente`,
      failure: `${appUrl}/planos?status=erro`,
    },
    auto_return: 'approved',
    notification_url: `${appUrl}/api/mercadopago/webhook`,
  };

  const res = await fetch('https://api.mercadopago.com/checkout/preferences', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`Mercado Pago erro (${res.status}): ${errorBody}`);
  }

  return await res.json();
}

