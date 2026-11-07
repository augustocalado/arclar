'use client';

import { useState } from 'react';

interface RespostaParceria {
  success: boolean;
  persistido?: boolean;
  whatsappUrl?: string;
  emailUrl?: string | null;
  error?: string;
}

const FORMULARIO_INICIAL = {
  nome: '',
  email: '',
  telefone: '',
  empresa: '',
  cidade: '',
  tipoParceria: 'imobiliaria',
  mensagem: '',
  website: '',
};

type CampoFormulario = keyof typeof FORMULARIO_INICIAL;

export default function FormularioParceiro() {
  const [formulario, setFormulario] = useState(FORMULARIO_INICIAL);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState('');
  const [resultado, setResultado] = useState<RespostaParceria | null>(null);

  function atualizar(campo: CampoFormulario, valor: string) {
    setFormulario((atual) => ({ ...atual, [campo]: valor }));
  }

  async function enviar(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setErro('');
    setEnviando(true);

    try {
      const resposta = await fetch('/api/parceiros', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formulario),
      });

      const dados = (await resposta.json()) as RespostaParceria;

      if (!resposta.ok) {
        throw new Error(dados.error || 'Não foi possível enviar seu contato.');
      }

      setResultado(dados);
      setFormulario((atual) => ({
        ...FORMULARIO_INICIAL,
        tipoParceria: atual.tipoParceria,
      }));
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Erro ao enviar. Tente novamente.');
    } finally {
      setEnviando(false);
    }
  }

  if (resultado) {
    return (
      <div className="form-parceiro form-parceiro-sucesso">
        <div className="form-parceiro-icone">✅</div>
        <h2>Contato enviado!</h2>
        <p className="form-parceiro-sub">
          Recebemos seus dados. Para falar agora com nossa equipe, use um dos canais abaixo:
        </p>

        {resultado.persistido === false && (
          <p className="form-parceiro-aviso">
            Não foi possível salvar o contato no painel automaticamente, mas você pode falar
            diretamente com a equipe pelos canais abaixo.
          </p>
        )}

        <div className="form-parceiro-canais">
          {resultado.whatsappUrl && (
            <a
              className="form-parceiro-btn"
              href={resultado.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              💬 Falar no WhatsApp
            </a>
          )}
          {resultado.emailUrl && (
            <a className="form-parceiro-btn secundario" href={resultado.emailUrl}>
              ✉️ Enviar por e-mail
            </a>
          )}
        </div>

        <button
          type="button"
          className="form-parceiro-link"
          onClick={() => setResultado(null)}
        >
          Enviar outro contato
        </button>
      </div>
    );
  }

  return (
    <form className="form-parceiro" onSubmit={enviar}>
      <h2>Fale com a equipe de parcerias</h2>
      <p className="form-parceiro-sub">
        Preencha os dados abaixo e retornaremos com as condições para imobiliárias, corretores
        e parceiros.
      </p>

      <div className="form-parceiro-grid">
        <div className="form-parceiro-campo">
          <label htmlFor="parceiro-nome">Nome *</label>
          <input
            id="parceiro-nome"
            type="text"
            value={formulario.nome}
            onChange={(evento) => atualizar('nome', evento.target.value)}
            placeholder="Seu nome completo"
            autoComplete="name"
            required
          />
        </div>

        <div className="form-parceiro-campo">
          <label htmlFor="parceiro-email">E-mail *</label>
          <input
            id="parceiro-email"
            type="email"
            value={formulario.email}
            onChange={(evento) => atualizar('email', evento.target.value)}
            placeholder="voce@empresa.com.br"
            autoComplete="email"
            required
          />
        </div>

        <div className="form-parceiro-campo">
          <label htmlFor="parceiro-telefone">WhatsApp / Telefone *</label>
          <input
            id="parceiro-telefone"
            type="tel"
            value={formulario.telefone}
            onChange={(evento) => atualizar('telefone', evento.target.value)}
            placeholder="(11) 99999-9999"
            autoComplete="tel"
            required
          />
        </div>

        <div className="form-parceiro-campo">
          <label htmlFor="parceiro-empresa">Empresa / Imobiliária</label>
          <input
            id="parceiro-empresa"
            type="text"
            value={formulario.empresa}
            onChange={(evento) => atualizar('empresa', evento.target.value)}
            placeholder="Nome da sua empresa"
            autoComplete="organization"
          />
        </div>

        <div className="form-parceiro-campo">
          <label htmlFor="parceiro-cidade">Cidade / UF</label>
          <input
            id="parceiro-cidade"
            type="text"
            value={formulario.cidade}
            onChange={(evento) => atualizar('cidade', evento.target.value)}
            placeholder="Ex.: Santos / SP"
            autoComplete="address-level2"
          />
        </div>

        <div className="form-parceiro-campo">
          <label htmlFor="parceiro-tipo">Tipo de parceria *</label>
          <select
            id="parceiro-tipo"
            value={formulario.tipoParceria}
            onChange={(evento) => atualizar('tipoParceria', evento.target.value)}
            required
          >
            <option value="imobiliaria">Imobiliária</option>
            <option value="corretor">Corretor(a) autônomo(a)</option>
            <option value="portal">Portal / Divulgação</option>
            <option value="outro">Outro</option>
          </select>
        </div>

        <div className="form-parceiro-campo full">
          <label htmlFor="parceiro-mensagem">Mensagem</label>
          <textarea
            id="parceiro-mensagem"
            value={formulario.mensagem}
            onChange={(evento) => atualizar('mensagem', evento.target.value)}
            placeholder="Conte um pouco sobre sua operação e o que procura na parceria."
            rows={4}
          />
        </div>

        <input
          className="form-parceiro-honeypot"
          type="text"
          name="website"
          value={formulario.website}
          onChange={(evento) => atualizar('website', evento.target.value)}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
        />
      </div>

      {erro && <p className="form-parceiro-erro">{erro}</p>}

      <button type="submit" className="form-parceiro-btn" disabled={enviando}>
        {enviando ? 'Enviando...' : 'Enviar contato'}
      </button>

      <p className="form-parceiro-privacidade">
        Seus dados serão usados apenas para contato sobre a parceria.
      </p>
    </form>
  );
}
