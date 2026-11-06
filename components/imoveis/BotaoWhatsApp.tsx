'use client';

import { useState } from 'react';

interface BotaoWhatsAppProps {
  telefone?: string;
  tituloImovel: string;
  codigoImovel: string;
  slugImovel: string;
  anuncianteId?: string;
}

export default function BotaoWhatsApp({
  telefone,
  tituloImovel,
  codigoImovel,
  slugImovel,
  anuncianteId,
}: BotaoWhatsAppProps) {
  const [clicado, setClicado] = useState(false);

  // Limpa caracteres especiais do telefone
  const numeroLimpo = (telefone || process.env.NEXT_PUBLIC_APP_WHATSAPP || '5511999999999').replace(/\D/g, '');
  const urlImovel = `https://arclar.com.br/imovel/${slugImovel}`;
  
  // Mensagem automática no modelo ImovelWhats com código, referência e link completo
  const textoMensagem = `Olá! Vi o anúncio "${tituloImovel}" (Código: ${codigoImovel}) no portal ARC LAR e gostaria de receber mais informações.\nLink: ${urlImovel}`;
  const linkWhatsApp = `https://wa.me/${numeroLimpo.startsWith('55') ? numeroLimpo : `55${numeroLimpo}`}?text=${encodeURIComponent(textoMensagem)}`;

  const handleClick = () => {
    setClicado(true);
    // Notifica a API de analytics em segundo plano sem bloquear a navegação
    fetch('/api/whatsapp-click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        imovelId: codigoImovel,
        anuncianteId: anuncianteId || 'central',
        origem: 'pagina_individual',
      }),
    }).catch(() => {});
  };

  return (
    <a
      href={linkWhatsApp}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        width: '100%',
        background: '#25D366',
        color: 'white',
        textDecoration: 'none',
        padding: '14px',
        borderRadius: 10,
        fontWeight: 800,
        fontSize: 15,
        marginBottom: 10,
        transition: 'transform 0.1s, opacity 0.2s',
        opacity: clicado ? 0.95 : 1,
      }}
    >
      <span style={{ fontSize: 20 }}>📱</span> Falar via WhatsApp
    </a>
  );
}

