import { NextResponse } from 'next/server';
import { uploadToCloudflareR2 } from '@/lib/cloudflare/r2';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const EXTENSAO_POR_TIPO: Record<string, string> = {
  'image/webp': 'webp',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif',
  'image/avif': 'avif',
};

const TAMANHO_MAXIMO_MB = 15;

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const pasta = ((formData.get('pasta') as string) || 'imoveis').replace(/[^a-zA-Z0-9_-]/g, '') || 'imoveis';

    if (!file) {
      return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 });
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'O arquivo enviado não é uma imagem válida' }, { status: 400 });
    }

    if (file.size > TAMANHO_MAXIMO_MB * 1024 * 1024) {
      return NextResponse.json(
        { error: `A imagem excede o limite de ${TAMANHO_MAXIMO_MB}MB` },
        { status: 413 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const tamanhoOriginalMB = (buffer.length / (1024 * 1024)).toFixed(2);

    const extensaoOriginal = file.name.split('.').pop()?.toLowerCase() || '';
    const extensao = EXTENSAO_POR_TIPO[file.type] || extensaoOriginal || 'webp';
    const nomeLimpo =
      file.name.replace(/[^a-zA-Z0-9.-]/g, '_').replace(/\.[^/.]+$/, '') || 'imagem';
    const fileName = `${pasta}/${Date.now()}-${nomeLimpo}.${extensao}`;

    const uploadResult = await uploadToCloudflareR2(buffer, fileName, file.type || 'image/webp');

    return NextResponse.json({
      success: true,
      url: uploadResult.url,
      fileName,
      tamanhoOriginalMB: `${tamanhoOriginalMB} MB`,
      formato: extensao,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erro ao processar imagem';
    console.error('[UPLOAD ERROR]', err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
