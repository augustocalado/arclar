'use client';

import { useState } from 'react';

interface FormularioLeadProps {
  imovelId: string;
  anuncianteId?: string;
}

export default function FormularioLead({ imovelId, anuncianteId }: FormularioLeadProps) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [erro, setErro] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    setErro('');

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome,
          email,
          telefone,
          mensagem,
          imovelId,
          anuncianteId: anuncianteId || 'central',
        }),
      });

      if (!res.ok) throw new Error('Não foi possível enviar a mensagem no momento.');

      setSucesso(true);
      setNome('');
      setEmail('');
      setTelefone('');
      setMensagem('');
    } catch (err: any) {
      setErro(err.message || 'Erro ao enviar. Tente pelo WhatsApp.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid #F0F0F0' }}>
      <h3 style={{ color: '#102B50', fontSize: 15, fontWeight: 700, marginBottom: 14 }}>
        Tenho interesse neste imóvel
      </h3>

      {sucesso ? (
        <div style={{ background: '#ECFDF5', color: '#065F46', padding: '14px', borderRadius: 8, fontSize: 13, textAlign: 'center', fontWeight: 600 }}>
          ✅ Mensagem enviada com sucesso! O anunciante entrará em contato em breve.
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <input
            type="text"
            placeholder="Seu nome completo"
            className="input-arclar"
            required
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
          <input
            type="email"
            placeholder="Seu melhor e-mail"
            className="input-arclar"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="tel"
            placeholder="Seu telefone / WhatsApp"
            className="input-arclar"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
          />
          <textarea
            placeholder="Mensagem (opcional)"
            className="input-arclar"
            rows={3}
            style={{ resize: 'vertical' }}
            value={mensagem}
            onChange={(e) => setMensagem(e.target.value)}
          />

          {erro && (
            <div style={{ color: '#DC2626', fontSize: 12, textAlign: 'center' }}>
              {erro}
            </div>
          )}

          <button
            type="submit"
            disabled={enviando}
            style={{
              background: '#102B50',
              color: 'white',
              border: 'none',
              borderRadius: 8,
              padding: '12px',
              fontWeight: 700,
              fontSize: 14,
              cursor: enviando ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s',
              opacity: enviando ? 0.7 : 1,
            }}
          >
            {enviando ? 'Enviando...' : '📩 Enviar interesse'}
          </button>
          <p style={{ color: '#9CA3AF', fontSize: 11, textAlign: 'center', margin: 0 }}>
            Suas informações são protegidas. Não fazemos spam.
          </p>
        </form>
      )}
    </div>
  );
}

