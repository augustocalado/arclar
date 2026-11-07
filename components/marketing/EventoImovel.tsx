'use client';

import { useEffect } from 'react';
import { rastrearImovel, type DadosImovelRemarketing } from '@/lib/marketing/eventos';

export default function EventoImovel({ imovel }: { imovel: DadosImovelRemarketing }) {
  const { id, titulo, preco, tipo, negocio, cidade, estado } = imovel;

  useEffect(() => {
    rastrearImovel({ id, titulo, preco, tipo, negocio, cidade, estado });
  }, [id, titulo, preco, tipo, negocio, cidade, estado]);

  return null;
}
