'use client';

import { useEffect } from 'react';
import { rastrearBusca } from '@/lib/marketing/eventos';

interface EventoBuscaProps {
  termo?: string;
  local?: string;
  tipo?: string;
  negocio?: string;
  total: number;
  ids?: string;
}

export default function EventoBusca({
  termo,
  local,
  tipo,
  negocio,
  total,
  ids,
}: EventoBuscaProps) {
  useEffect(() => {
    rastrearBusca({
      termo,
      local,
      tipo,
      negocio,
      total,
      ids: ids ? ids.split(',') : undefined,
    });
  }, [termo, local, tipo, negocio, total, ids]);

  return null;
}
