/**
 * Módulo de Integração com Cloudflare R2 Storage (API S3 Compatible)
 * 10GB Gratuitos por mês sem custo de tráfego/egress.
 */

import { createHash, createHmac } from 'node:crypto';

export interface CloudflareR2Config {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucketName: string;
  publicDomain: string; // Ex: https://imagens.arclar.com.br ou https://pub-xxxx.r2.dev
}

export function getR2Config(): CloudflareR2Config | null {
  const accountId = process.env.CLOUDFLARE_R2_ACCOUNT_ID;
  const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;
  const bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME || 'arclar-imoveis';
  const publicDomain = process.env.CLOUDFLARE_R2_PUBLIC_DOMAIN || '';

  if (!accountId || !accessKeyId || !secretAccessKey) {
    return null;
  }

  return {
    accountId,
    accessKeyId,
    secretAccessKey,
    bucketName,
    publicDomain,
  };
}

function sha256Hex(data: string | Uint8Array): string {
  return createHash('sha256').update(data).digest('hex');
}

function hmac(key: Buffer | string, data: string): Buffer {
  return createHmac('sha256', key).update(data).digest();
}

function encodePath(path: string): string {
  return path
    .split('/')
    .map((segment) =>
      encodeURIComponent(segment).replace(/[!'()*]/g, (char) =>
        `%${char.charCodeAt(0).toString(16).toUpperCase()}`
      )
    )
    .join('/');
}

/**
 * Gera os headers assinados (AWS Signature V4) exigidos pelo Cloudflare R2.
 */
function assinarRequisicaoS3(params: {
  method: string;
  host: string;
  canonicalUri: string;
  payloadHash: string;
  contentType: string;
  accessKeyId: string;
  secretAccessKey: string;
}): Record<string, string> {
  const { method, host, canonicalUri, payloadHash, contentType, accessKeyId, secretAccessKey } = params;

  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, '');
  const dateStamp = amzDate.slice(0, 8);
  const region = 'auto';
  const service = 's3';

  const canonicalHeaders =
    `content-type:${contentType}\n` +
    `host:${host}\n` +
    `x-amz-content-sha256:${payloadHash}\n` +
    `x-amz-date:${amzDate}\n`;
  const signedHeaders = 'content-type;host;x-amz-content-sha256;x-amz-date';

  const canonicalRequest =
    `${method}\n` +
    `${canonicalUri}\n` +
    `${''}\n` +
    `${canonicalHeaders}\n` +
    `${signedHeaders}\n` +
    `${payloadHash}`;

  const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
  const stringToSign =
    `AWS4-HMAC-SHA256\n` +
    `${amzDate}\n` +
    `${credentialScope}\n` +
    `${sha256Hex(canonicalRequest)}`;

  const kDate = hmac(`AWS4${secretAccessKey}`, dateStamp);
  const kRegion = hmac(kDate, region);
  const kService = hmac(kRegion, service);
  const kSigning = hmac(kService, 'aws4_request');
  const signature = createHmac('sha256', kSigning).update(stringToSign).digest('hex');

  return {
    'Content-Type': contentType,
    'x-amz-content-sha256': payloadHash,
    'x-amz-date': amzDate,
    Authorization:
      `AWS4-HMAC-SHA256 Credential=${accessKeyId}/${credentialScope}, ` +
      `SignedHeaders=${signedHeaders}, Signature=${signature}`,
  };
}

/**
 * Envia arquivo diretamente para o Cloudflare R2 via endpoint S3 compatível.
 */
export async function uploadToCloudflareR2(
  fileBuffer: Buffer | Uint8Array,
  fileName: string,
  contentType: string = 'image/webp'
): Promise<{ url: string; key: string }> {
  const config = getR2Config();
  const key = fileName.replace(/^\/+/, '');

  if (!config) {
    console.warn(
      '[CLOUDFLARE R2] Credenciais não preenchidas no .env.local. Retornando URL simulada para desenvolvimento.'
    );
    return {
      url: `/uploads/${key}`,
      key,
    };
  }

  const host = `${config.accountId}.r2.cloudflarestorage.com`;
  const canonicalUri = encodePath(`/${config.bucketName}/${key}`);
  const payloadHash = sha256Hex(fileBuffer);

  const headers = assinarRequisicaoS3({
    method: 'PUT',
    host,
    canonicalUri,
    payloadHash,
    contentType,
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey,
  });

  const response = await fetch(`https://${host}${canonicalUri}`, {
    method: 'PUT',
    headers,
    body: fileBuffer as BodyInit,
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    throw new Error(`Falha no upload para o Cloudflare R2 (${response.status}): ${errorText}`);
  }

  const baseDomain = config.publicDomain
    ? config.publicDomain.replace(/\/$/, '')
    : `https://${host}/${config.bucketName}`;

  return {
    url: `${baseDomain}/${key}`,
    key,
  };
}
