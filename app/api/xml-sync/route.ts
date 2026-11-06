import { NextResponse } from 'next/server';
import { parseXMLImoveis } from '@/lib/xml/xmlParser';
import { importarImoveisXML } from '@/lib/supabase/imoveis';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get('content-type') || '';
    let xmlContent = '';
    let feedUrl = '';

    if (contentType.includes('application/json')) {
      const json = await request.json();
      feedUrl = json.feedUrl;
      if (!feedUrl) {
        return NextResponse.json({ error: 'feedUrl é obrigatório' }, { status: 400 });
      }
      const res = await fetch(feedUrl, { headers: { 'User-Agent': 'ARC-LAR-XML-Bot/1.0' } });
      if (!res.ok) {
        return NextResponse.json(
          { error: `Falha ao acessar feed URL: ${res.statusText}` },
          { status: 502 }
        );
      }
      xmlContent = await res.text();
    } else {
      xmlContent = await request.text();
    }

    if (!xmlContent || xmlContent.length < 20) {
      return NextResponse.json({ error: 'Conteúdo XML inválido ou vazio' }, { status: 400 });
    }

    const imoveisExtraidos = parseXMLImoveis(xmlContent);
    const persistencia = await importarImoveisXML(imoveisExtraidos);

    const resultado = {
      sucesso: true,
      totalLidos: imoveisExtraidos.length,
      inseridos: persistencia.inseridos,
      atualizados: persistencia.atualizados,
      removidos: 0,
      erros: persistencia.erros,
      timestamp: new Date().toISOString(),
      amostra: imoveisExtraidos.slice(0, 3),
    };

    console.log(`[XML SYNC] Processados ${imoveisExtraidos.length} imóveis.`);

    return NextResponse.json(resultado);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erro ao sincronizar feed XML';
    console.error('[XML SYNC] Erro:', err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
