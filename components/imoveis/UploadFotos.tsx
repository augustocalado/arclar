/* eslint-disable @next/next/no-img-element */
'use client';

import { useRef, useState } from 'react';
import { compactarImagemNoBrowser } from '@/lib/cloudflare/imageOptimizer';

interface UploadFotosProps {
  value: string[];
  onChange: (urls: string[]) => void;
  maxFotos?: number;
}

export default function UploadFotos({ value, onChange, maxFotos = 12 }: UploadFotosProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState('');
  const [resumo, setResumo] = useState('');

  async function handleSelecionar(event: React.ChangeEvent<HTMLInputElement>) {
    const arquivos = Array.from(event.target.files || []);
    event.target.value = '';
    if (!arquivos.length) return;

    const disponiveis = Math.max(maxFotos - value.length, 0);
    if (disponiveis === 0) {
      setErro(`Limite de ${maxFotos} fotos atingido. Remova uma foto para adicionar outra.`);
      return;
    }

    const selecionados = arquivos.slice(0, disponiveis);
    setEnviando(true);
    setErro('');
    setResumo('');

    const novasUrls: string[] = [];
    const falhas: string[] = [];
    let economiaTotal = 0;
    let enviadas = 0;

    for (const arquivo of selecionados) {
      try {
        const { blob, reducaoPercentual } = await compactarImagemNoBrowser(arquivo, {
          maxWidth: 1600,
          maxHeight: 1200,
          quality: 0.82,
        });

        const nomeWebp = `${arquivo.name.replace(/\.[^/.]+$/, '')}.webp`;
        const formData = new FormData();
        formData.append('file', new File([blob], nomeWebp, { type: 'image/webp' }));
        formData.append('pasta', 'imoveis');

        const resposta = await fetch('/api/upload', { method: 'POST', body: formData });
        const dados = await resposta.json();

        if (!resposta.ok || !dados.url) {
          throw new Error(dados.error || 'Falha no upload');
        }

        novasUrls.push(dados.url);
        economiaTotal += Number.parseInt(reducaoPercentual, 10) || 0;
        enviadas += 1;
      } catch {
        falhas.push(arquivo.name);
      }
    }

    if (novasUrls.length) {
      onChange([...value, ...novasUrls]);
    }

    if (falhas.length) {
      setErro(`Não foi possível enviar: ${falhas.join(', ')}`);
    }

    if (enviadas > 0) {
      setResumo(
        `${enviadas} foto(s) otimizada(s) e enviada(s) • ${Math.round(economiaTotal / enviadas)}% de redução média`
      );
    }

    if (arquivos.length > disponiveis) {
      setErro((atual) =>
        [atual, `Apenas ${disponiveis} foto(s) foram aceitas por causa do limite de ${maxFotos}.`]
          .filter(Boolean)
          .join(' ')
      );
    }

    setEnviando(false);
  }

  function remover(url: string) {
    onChange(value.filter((item) => item !== url));
  }

  return (
    <div>
      <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>
        Fotos do Imóvel ({value.length}/{maxFotos})
      </label>

      <div
        style={{
          border: '2px dashed #CBD5E1',
          borderRadius: 12,
          padding: 16,
          background: '#F8FAFC',
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          multiple
          onChange={handleSelecionar}
          style={{ display: 'none' }}
        />

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={enviando || value.length >= maxFotos}
          style={{
            background: '#102B50',
            color: 'white',
            border: 'none',
            padding: '10px 18px',
            borderRadius: 8,
            fontWeight: 700,
            fontSize: 14,
            cursor: enviando || value.length >= maxFotos ? 'not-allowed' : 'pointer',
            opacity: enviando || value.length >= maxFotos ? 0.6 : 1,
          }}
        >
          {enviando ? 'Otimizando e enviando...' : '+ Adicionar fotos'}
        </button>

        <p style={{ color: '#6B7280', fontSize: 12, margin: '10px 0 0', lineHeight: 1.5 }}>
          As imagens são redimensionadas e convertidas para WebP antes do envio, economizando até 80% de espaço.
        </p>

        {resumo && (
          <p style={{ color: '#065F46', fontSize: 12, margin: '8px 0 0', fontWeight: 600 }}>{resumo}</p>
        )}
        {erro && (
          <p style={{ color: '#B91C1C', fontSize: 12, margin: '8px 0 0', fontWeight: 600 }}>{erro}</p>
        )}

        {value.length > 0 && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(96px, 1fr))',
              gap: 10,
              marginTop: 14,
            }}
          >
            {value.map((url, index) => (
              <div
                key={`${url}-${index}`}
                style={{
                  position: 'relative',
                  borderRadius: 8,
                  overflow: 'hidden',
                  border: '1px solid #E5E7EB',
                  background: 'white',
                  aspectRatio: '1 / 1',
                }}
              >
                <img
                  src={url}
                  alt={`Foto ${index + 1} do imóvel`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                {index === 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      bottom: 4,
                      left: 4,
                      background: '#F5A900',
                      color: '#102B50',
                      fontSize: 10,
                      fontWeight: 800,
                      padding: '2px 6px',
                      borderRadius: 4,
                    }}
                  >
                    CAPA
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => remover(url)}
                  aria-label={`Remover foto ${index + 1}`}
                  style={{
                    position: 'absolute',
                    top: 4,
                    right: 4,
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    border: 'none',
                    background: 'rgba(17,24,39,0.8)',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: 13,
                    lineHeight: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
