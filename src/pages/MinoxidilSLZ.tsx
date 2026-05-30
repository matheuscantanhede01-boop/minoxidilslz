import { useState } from "react";

const produtos = [
  { qtd: 1,  original: "R$75,00",  valor: "R$69,99"  },
  { qtd: 2,  original: "R$135,00", valor: "R$125,00" },
  { qtd: 3,  original: "R$195,00", valor: "R$175,00" },
  { qtd: 4,  original: "R$255,00", valor: "R$225,00" },
  { qtd: 5,  original: "R$315,00", valor: "R$280,00" },
  { qtd: 6,  original: "R$375,00", valor: "R$330,00" },
  { qtd: 12, original: "R$735,00", valor: "R$630,00" },
];

interface Produto {
  qtd: number;
  original: string;
  valor: string;
}

interface Form {
  nome: string;
  telefone: string;
  rua: string;
  numero: string;
  bairro: string;
  referencia: string;
  pagamento: string;
  horario: string;
  observacao: string;
}

const camposObrigatorios: (keyof Form)[] = [
  "nome",
  "telefone",
  "rua",
  "numero",
  "bairro",
  "pagamento",
];

export default function MinoxidilSLZ() {
  const [quantidade, setQuantidade] = useState<Produto>(produtos[0]);
  const [form, setForm] = useState<Form>({
    nome: "",
    telefone: "",
    rua: "",
    numero: "",
    bairro: "",
    referencia: "",
    pagamento: "",
    horario: "",
    observacao: "",
  });
  const [erros, setErros] = useState<Partial<Record<keyof Form, boolean>>>({});

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (erros[name as keyof Form]) {
      setErros((prev) => ({ ...prev, [name]: false }));
    }
  }

  async function enviarPedido() {
    const novosErros: Partial<Record<keyof Form, boolean>> = {};
    let valido = true;

    for (const campo of camposObrigatorios) {
      if (!form[campo].trim()) {
        novosErros[campo] = true;
        valido = false;
      }
    }

    setErros(novosErros);

    if (!valido) return;

    const codigoPedido = `SLZ-${Date.now().toString().slice(-5)}`;

    const agora = new Date();
    const dataAtual = agora.toLocaleDateString("pt-BR");
    const horaAtual = agora.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const mensagem = `
*Pedido nº:* ${codigoPedido}
*Data:* ${dataAtual} às ${horaAtual}

*MinoxidilSLZ - São Luis*

*Nome:* ${form.nome}
*Telefone:* ${form.telefone}
*Quantidade e Preço:* ${quantidade.qtd} Frasco + entrega: ${quantidade.valor}

*Informações para entrega*

*Rua:* ${form.rua}
*Numero da casa:* ${form.numero}
*Bairro:* ${form.bairro}
*Ponto de Referência:* ${form.referencia}
*Forma de pagamento:* ${form.pagamento}
*Qual horário você quer receber seu pedido?* ${form.horario}
*Alguma observação?* ${form.observacao || "Nenhuma"}
`;

    const url = `https://wa.me/5598989137114?text=${encodeURIComponent(mensagem)}`;

    await fetch("https://hook.us2.make.com/4fxycouwxdp6uibj53q6tejnxb7c4pl3", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        codigo: codigoPedido,
        dataCompra: dataAtual,
        horarioCompra: horaAtual,
        nome: form.nome,
        telefone: form.telefone,
        quantidade: Number(quantidade.qtd),
        valor: Number(
          quantidade.valor
            .replace("R$", "")
            .replace(",", ".")
        ),
        rua: form.rua,
        numero: form.numero,
        bairro: form.bairro,
        referencia: form.referencia,
        pagamento: form.pagamento,
        horarioEntrega: form.horario,
        observacao: form.observacao || "Sem observações",
      }),
    });

    window.open(url, "_blank");
  }

  function inputClass(campo: keyof Form) {
    return `w-full border-2 rounded-xl p-3 outline-none transition ${
      erros[campo]
        ? "border-red-400 bg-red-50"
        : "border-gray-200 focus:border-sky-400"
    }`;
  }

  return (
    <div className="min-h-screen bg-sky-50 p-3 flex justify-center">
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden mb-8">

        {/* Cabeçalho */}
        <div className="bg-gradient-to-br from-sky-400 to-sky-600 p-3" style={{boxShadow: "0 10px 25px rgba(0,0,0,0.15)"}}>

          {/* Topo: logo + info */}
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-sky-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
              <img src="minox.jpg" alt="MinoxidilSLZ" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-lg font-bold text-white leading-tight">MinoxidilSLZ</p>
              <p className="text-sm text-sky-100 mt-0.5">São Luís - MA</p>
              <span className="inline-flex items-center gap-1.5 mt-1.5 bg-white/20 rounded-full px-2.5 py-1 text-xs text-white font-medium">
                🚚 Entrega rápida em toda São Luís
              </span>
            </div>
          </div>

        </div>

        <div className="p-3 space-y-2">

          {/* Imagem + produto */}
          <div className="text-center">
            <img
              src="minox.jpg"
              alt="Minoxidil"
              className="rounded-xl w-1/3 mx-auto border shadow-sm"
              style={{ maxWidth: "140px" }}
            />
            <h3 className="text-lg font-bold text-gray-800 text-center mt-2">
              Minoxidil Kirkland 5%
            </h3>
            <div className="flex justify-center mt-1 mb-2">
              <div className="bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full border border-blue-100 shadow-sm">
                ⭐ Avaliação 5.0 · +5 mil pedidos entregues
              </div>
            </div>
          </div>

          {/* Nome */}
          <div>
            <label className="font-semibold text-gray-700 block mb-2">
              Nome <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="nome"
              placeholder="Nome de quem vai receber"
              value={form.nome}
              onChange={handleChange}
              className={inputClass("nome")}
            />
            {erros.nome && (
              <p className="text-red-400 text-sm mt-1">Campo obrigatório</p>
            )}
          </div>

          {/* Telefone */}
          <div>
            <label className="font-semibold text-gray-700 block mb-2">
              Telefone <span className="text-red-400">*</span>
            </label>
            <input
              type="tel"
              name="telefone"
              placeholder="Número WhatsApp ou ligação"
              value={form.telefone}
              onChange={handleChange}
              className={inputClass("telefone")}
            />
            {erros.telefone && (
              <p className="text-red-400 text-sm mt-1">Campo obrigatório</p>
            )}
          </div>

          {/* Quantidade */}
          <div>
            <h3 className="font-bold text-base text-gray-800 mb-3">
              Quantidade e Preço
            </h3>
            <div className="space-y-2">
              {produtos.map((item) => (
                <label
                  key={item.qtd}
                  className={`flex justify-between items-center border-2 rounded-xl p-3 cursor-pointer transition-all ${
                    quantidade.qtd === item.qtd
                      ? "border-sky-400 bg-sky-50"
                      : "border-gray-200 hover:border-sky-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="produto"
                      checked={quantidade.qtd === item.qtd}
                      onChange={() => setQuantidade(item)}
                      className="accent-sky-500 w-4 h-4"
                    />
                    <span className="text-gray-700">
                      {item.qtd} Frasco{item.qtd > 1 ? "s" : ""} + entrega
                    </span>
                  </div>
                  <span className="text-lg font-bold text-sky-500">{item.valor}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Endereço */}
          <div className="space-y-2">
            <div>
              <h3 className="font-bold text-base text-gray-800">
                Informações para entrega
              </h3>
              <p className="text-gray-400 text-sm mt-1">
                Compartilhe o endereço para o qual os itens devem ser enviados
              </p>
            </div>

            <div>
              <label className="font-semibold text-gray-700 block mb-2">
                Rua <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="rua"
                placeholder="Ex: Rua das Flores"
                value={form.rua}
                onChange={handleChange}
                className={inputClass("rua")}
              />
              {erros.rua && (
                <p className="text-red-400 text-sm mt-1">Campo obrigatório</p>
              )}
            </div>

            <div>
              <label className="font-semibold text-gray-700 block mb-2">
                Número da casa <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="numero"
                placeholder="Ex: 120"
                value={form.numero}
                onChange={handleChange}
                className={inputClass("numero")}
              />
              {erros.numero && (
                <p className="text-red-400 text-sm mt-1">Campo obrigatório</p>
              )}
            </div>

            <div>
              <label className="font-semibold text-gray-700 block mb-2">
                Bairro <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="bairro"
                placeholder="Ex: Centro"
                value={form.bairro}
                onChange={handleChange}
                className={inputClass("bairro")}
              />
              {erros.bairro && (
                <p className="text-red-400 text-sm mt-1">Campo obrigatório</p>
              )}
            </div>

            <div>
              <label className="font-semibold text-gray-700 block mb-2">
                Ponto de referência
              </label>
              <input
                type="text"
                name="referencia"
                placeholder="Ex: Próximo à farmácia"
                value={form.referencia}
                onChange={handleChange}
                className="w-full border-2 border-gray-200 rounded-xl p-3 outline-none focus:border-sky-400 transition"
              />
            </div>
          </div>

          {/* Pagamento */}
          <div>
            <h3 className="font-bold text-base text-gray-800 mb-3">
              Forma de pagamento <span className="text-red-400">*</span>
            </h3>
            <div className="space-y-2">
              {["Dinheiro", "Pix", "Cartão"].map((op) => (
                <label
                  key={op}
                  className={`flex items-center gap-3 border-2 rounded-xl p-3 cursor-pointer transition-all ${
                    form.pagamento === op
                      ? "border-sky-400 bg-sky-50"
                      : erros.pagamento
                      ? "border-red-300 bg-red-50"
                      : "border-gray-200 hover:border-sky-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="pagamento"
                    value={op}
                    checked={form.pagamento === op}
                    onChange={handleChange}
                    className="accent-sky-500 w-4 h-4"
                  />
                  <span className="text-gray-700">{op}</span>
                </label>
              ))}
            </div>
            {erros.pagamento && (
              <p className="text-red-400 text-sm mt-2">
                Selecione uma forma de pagamento
              </p>
            )}
          </div>

          {/* Horário */}
          <div>
            <label className="font-semibold text-gray-700 block mb-2">
              Qual horário você quer receber seu pedido?
            </label>
            <input
              type="text"
              name="horario"
              placeholder="Ex: 18h às 19h"
              value={form.horario}
              onChange={handleChange}
              className="w-full border-2 border-gray-200 rounded-xl p-3 outline-none focus:border-sky-400 transition"
            />
          </div>

          {/* Observação */}
          <div>
            <label className="font-semibold text-gray-700 block mb-2">
              Alguma observação?
            </label>
            <textarea
              name="observacao"
              rows={4}
              placeholder="Alguma informação importante?"
              value={form.observacao}
              onChange={handleChange}
              className="w-full border-2 border-gray-200 rounded-xl p-3 outline-none focus:border-sky-400 transition resize-none"
            />
          </div>

          {/* Aviso */}
          <div className="bg-sky-50 border border-sky-200 rounded-xl p-3 text-sm text-sky-700">
            Seu pedido será enviado automaticamente para um entregador
            disponível.
          </div>

          {/* Botão */}
          <button
            onClick={enviarPedido}
            type="submit"
            className="w-full bg-[#25D366] hover:bg-[#20ba5a] active:scale-[0.98] text-white font-semibold py-3 rounded-2xl text-base transition-all duration-200 shadow-lg flex items-center justify-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M20.52 3.48A11.86 11.86 0 0012.06 0C5.5 0 .16 5.34.16 11.9c0 2.1.55 4.15 1.6 5.97L0 24l6.33-1.66a11.84 11.84 0 005.73 1.47h.01c6.56 0 11.9-5.34 11.9-11.9 0-3.18-1.24-6.17-3.45-8.43zM12.07 21.3h-.01a9.3 9.3 0 01-4.74-1.3l-.34-.2-3.76.99 1-3.66-.22-.38a9.28 9.28 0 01-1.42-4.95c0-5.13 4.17-9.3 9.31-9.3a9.23 9.23 0 016.58 2.73 9.23 9.23 0 012.73 6.58c0 5.14-4.17 9.31-9.3 9.31zm5.1-6.96c-.28-.14-1.66-.82-1.91-.91-.26-.1-.44-.14-.63.14-.19.28-.72.9-.89 1.08-.16.19-.33.21-.61.07-.28-.14-1.17-.43-2.22-1.37-.82-.73-1.37-1.63-1.53-1.91-.16-.28-.02-.43.12-.57.13-.13.28-.33.42-.49.14-.17.19-.28.28-.47.1-.19.05-.35-.02-.49-.07-.14-.63-1.52-.86-2.08-.23-.56-.47-.48-.63-.49h-.54c-.19 0-.49.07-.75.35-.26.28-.98.96-.98 2.35s1 2.73 1.14 2.92c.14.19 1.97 3 4.78 4.2.67.29 1.2.46 1.61.59.68.22 1.3.19 1.79.11.55-.08 1.66-.68 1.89-1.33.23-.65.23-1.21.16-1.33-.07-.12-.26-.19-.54-.33z"/>
            </svg>
            Enviar pedido no WhatsApp
          </button>

          <div className="h-8" />

        </div>
      </div>
    </div>
  );
}
