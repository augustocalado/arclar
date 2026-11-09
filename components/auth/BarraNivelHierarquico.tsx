'use client';

import { useEffect, useState } from 'react';
import type { NivelHierarquico, UsuarioAutenticado } from '@/types';
import { DESCRICAO_NIVEIS } from '@/lib/auth/permissoes';

interface Props {
  onNivelAlterado?: (novoNivel: NivelHierarquico) => void;
}

export default function BarraNivelHierarquico({ onNivelAlterado }: Props) {
  const [usuario, setUsuario] = useState<UsuarioAutenticado | null>(null);
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    fetch('/api/auth/sessao', { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : null))
      .then((dados) => {
        if (dados?.usuario) setUsuario(dados.usuario);
      })
      .catch(() => {});
  }, []);

  async function alternarNivel(nivel: NivelHierarquico) {
    setCarregando(true);
    try {
      const res = await fetch('/api/auth/sessao', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nivel }),
      });
      if (res.ok) {
        const dados = await res.json();
        setUsuario(dados.usuario);
        if (onNivelAlterado) onNivelAlterado(nivel);
        window.location.reload();
      }
    } catch {
      // Ignora erro
    } finally {
      setCarregando(false);
    }
  }

  if (!usuario) return null;

  const infoAtual = DESCRICAO_NIVEIS[usuario.nivel] || DESCRICAO_NIVEIS.cliente;

  return (
    <div
      style={{
        background: '#0F172A',
        color: '#F8FAFC',
        padding: '8px 16px',
        fontSize: 12,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 10,
        borderBottom: '1px solid rgba(255,255,255,0.1)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <span style={{ color: '#94A3B8', fontWeight: 600 }}>Nível de Acesso Ativo:</span>
        <span
          style={{
            background: infoAtual.bg,
            color: infoAtual.cor,
            padding: '3px 10px',
            borderRadius: 6,
            fontWeight: 800,
            fontSize: 12,
          }}
        >
          {infoAtual.badge}
        </span>
        <span style={{ color: '#CBD5E1' }}>
          Logado como: <strong>{usuario.nome}</strong> ({usuario.email})
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ color: '#64748B', fontSize: 11 }}>Alternar simulação de papel:</span>
        {(['admin_master', 'corretor', 'cliente'] as NivelHierarquico[]).map((nv) => {
          const ativo = usuario.nivel === nv;
          return (
            <button
              key={nv}
              onClick={() => alternarNivel(nv)}
              disabled={carregando || ativo}
              style={{
                background: ativo ? '#F5A900' : '#1E293B',
                color: ativo ? '#102B50' : '#E2E8F0',
                border: ativo ? '1px solid #F5A900' : '1px solid #334155',
                padding: '4px 8px',
                borderRadius: 4,
                cursor: ativo ? 'default' : 'pointer',
                fontWeight: ativo ? 700 : 500,
                fontSize: 11,
                transition: 'all 0.15s ease',
              }}
            >
              {nv === 'admin_master' ? '👑 Master' : nv === 'corretor' ? '👔 Corretor' : '👤 Cliente'}
            </button>
          );
        })}
      </div>
    </div>
  );
}

