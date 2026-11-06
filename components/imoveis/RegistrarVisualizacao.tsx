'use client';

import { useEffect } from 'react';

interface RegistrarVisualizacaoProps {
  imovelId: string;
}

export default function RegistrarVisualizacao({ imovelId }: RegistrarVisualizacaoProps) {
  useEffect(() => {
    fetch('/api/imovel-view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imovelId, origem: 'pagina_individual' }),
    }).catch(() => {});
  }, [imovelId]);

  return null;
}
