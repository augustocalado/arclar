/**
 * Utilitário de Compactação de Imagens no Navegador (Client-side)
 * Reduz imagens pesadas de 5MB-15MB para menos de 300KB-500KB em WebP antes de enviar.
 * Isso garante que o plano gratuito do Cloudflare R2 (10GB) suporte dezenas de milhares de fotos.
 */

export interface CompressOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0.1 a 1.0
}

export async function compactarImagemNoBrowser(
  file: File,
  options: CompressOptions = {}
): Promise<{ blob: Blob; tamanhoOriginalKB: number; tamanhoFinalKB: number; reducaoPercentual: string }> {
  const { maxWidth = 1920, maxHeight = 1080, quality = 0.82 } = options;

  const tamanhoOriginalKB = Math.round(file.size / 1024);

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Redimensiona proporcionalmente mantendo alta qualidade visual
        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Não foi possível obter contexto do canvas'));
          return;
        }

        // Desenha imagem com suavização bicúbica
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Converte diretamente para formato WebP moderno altamente compactado
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Falha ao converter canvas para WebP'));
              return;
            }
            const tamanhoFinalKB = Math.round(blob.size / 1024);
            const reducao = Math.round(((tamanhoOriginalKB - tamanhoFinalKB) / tamanhoOriginalKB) * 100);

            resolve({
              blob,
              tamanhoOriginalKB,
              tamanhoFinalKB,
              reducaoPercentual: `${reducao > 0 ? reducao : 0}%`,
            });
          },
          'image/webp',
          quality
        );
      };

      img.onerror = (err) => reject(err);
    };

    reader.onerror = (err) => reject(err);
  });
}

