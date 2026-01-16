const produtos = {
  "7898132951382": { nome: "Coca Cola Lata 350ml", preco: 2.30 },
  "7894900011517": { nome: "Carne", preco: 44.39 },
  "7891000053508": { nome: "Arroz 5kg", preco: 24.90 },
  "7891991000830": { nome: "Feijão Carioca", preco: 7.50 },
  "7896004000854": { nome: "Óleo de Soja", preco: 8.99 },
  "7894321711266": { nome: "Açúcar Refinado", preco: 4.80 },
  "7891910000197": { nome: "Café Tradicional", preco: 14.90 },
  "7891098038356": { nome: "Leite Integral", preco: 4.50 },
  "7892840813015": { nome: "Margarina", preco: 6.20 },
  "7891000100102": { nome: "Farinha de Trigo", preco: 5.30 },
  "7891515940018": { nome: "Biscoito Recheado", preco: 2.99 },
  "7894900011517": { nome: "Refrigerante Cola 2L", preco: 8.50 },
  "7891991010853": { nome: "Macarrão", preco: 3.50 },
  "7896051161904": { nome: "Molho de Tomate", preco: 2.80 },
  "7893000340406": { nome: "Achocolatado", preco: 7.90 },
  "7891025101208": { nome: "Sabonete", preco: 2.20 },
  "7891242423032": { nome: "Detergente", preco: 2.10 },
  "7896011100199": { nome: "Papel Higiênico", preco: 12.90 },
  "7891528030143": { nome: "Shampoo", preco: 14.50 },
  "7896090123456": { nome: "Creme Dental", preco: 4.90 },
  "7898080640016": { nome: "Água Mineral 1,5L", preco: 2.00 },
  "7894900700015": { nome: "Suco de Caixa", preco: 4.30 }
};

const vlrUnitSpan = document.querySelector("#vlr-unit span");
const totalItemSpan = document.querySelector("#total-item span");

let ultimoProduto = null;
let carrinho = {};

const input = document.getElementById("barcode");
const lista = document.getElementById("lista-produtos");
const subtotalEl = document.querySelector(".subtotal strong");

input.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    adicionar(input.value.trim());
    input.value = "";
  }
});

function adicionar(codigo) {
  if (!produtos[codigo]) {
    alert("Produto não cadastrado");
    return;
  }

  if (!carrinho[codigo]) {
    carrinho[codigo] = { ...produtos[codigo], codigo, qtd: 1 };
  } else {
    carrinho[codigo].qtd++;
  }

  ultimoProduto = carrinho[codigo];

  atualizarDestaques();
  atualizar();
}

function alterarQtd(codigo, delta) {
  carrinho[codigo].qtd += delta;

  if (carrinho[codigo].qtd <= 0) {
    delete carrinho[codigo];
    ultimoProduto = null;
  } else {
    ultimoProduto = carrinho[codigo];
  }

  atualizarDestaques();
  atualizar();
}

function atualizar() {
  lista.innerHTML = "";
  let subtotal = 0;
  let i = 1;

  Object.values(carrinho).forEach(p => {
    const totalItem = p.qtd * p.preco;
    subtotal += totalItem;

    lista.innerHTML += `
      <tr>
        <td>${i++}</td>
        <td>${p.codigo}</td>
        <td>${p.nome}</td>
        <td>
          <button class="qtd-btn" onclick="alterarQtd('${p.codigo}', -1)">-</button>
          ${p.qtd}
          <button class="qtd-btn" onclick="alterarQtd('${p.codigo}', 1)">+</button>
        </td>
        <td>${p.preco.toFixed(2)}</td>
        <td>${totalItem.toFixed(2)}</td>
      </tr>
    `;
  });

  subtotalEl.textContent = subtotal.toFixed(2);
}

function atualizarDestaques() {
  if (!ultimoProduto) {
    vlrUnitSpan.textContent = "R$ 0,00";
    totalItemSpan.textContent = "R$ 0,00";
    return;
  }

  const unit = ultimoProduto.preco;
  const total = ultimoProduto.preco * ultimoProduto.qtd;

  vlrUnitSpan.textContent = `R$ ${unit.toFixed(2)}`;
  totalItemSpan.textContent = `R$ ${total.toFixed(2)}`;
}

const inputPago = document.getElementById("valorPago");
const trocoEl = document.getElementById("troco");

inputPago.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    calcularTroco();
  }
});

function calcularTroco() {
  const total = Number(subtotalEl.textContent);
  const pago = Number(inputPago.value.replace(",", "."));

  if (isNaN(pago)) return;

  if (pago < total) {
    trocoEl.textContent = `Faltam R$ ${(total - pago).toFixed(2)}`;
  } else {
    trocoEl.textContent = `R$ ${(pago - total).toFixed(2)}`;

    atualizar();
  }
}

const inputCPF = document.getElementById("cpf");

inputCPF.addEventListener("input", () => {
  let v = inputCPF.value.replace(/\D/g, ""); // só números
  v = v.slice(0, 11); // máximo 11 dígitos

  v = v.replace(/(\d{3})(\d)/, "$1.$2");
  v = v.replace(/(\d{3})(\d)/, "$1.$2");
  v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

  inputCPF.value = v;
});

function gerarNota(cpf) {
  const nota = document.getElementById("notaFiscal");
  const notaCpf = document.getElementById("notaCpf");
  const notaItens = document.getElementById("notaItens");

  const total = Number(subtotalEl.textContent);
  const pago = Number(inputPago.value.replace(",", "."));
  const troco = pago - total;

  notaCpf.textContent = cpf
    ? `CPF: ${cpf}`
    : "CPF não informado";

  notaItens.innerHTML = "";

  Object.values(carrinho).forEach(p => {
    notaItens.innerHTML += `
      <p>${p.nome} (${p.qtd}x) - R$ ${(p.qtd * p.preco).toFixed(2)}</p>
    `;
  });

  document.getElementById("notaTotal").textContent = `R$ ${total.toFixed(2)}`;
  document.getElementById("notaPago").textContent = `R$ ${pago.toFixed(2)}`;
  document.getElementById("notaTroco").textContent = `R$ ${troco.toFixed(2)}`;

  nota.classList.remove("hidden");
}

function fecharNota() {
  document.getElementById("notaFiscal").classList.add("hidden");
  resetarVenda();
}

function cpfValidoOuVazio(cpfFormatado) {
  const apenasNumeros = cpfFormatado.replace(/\D/g, "");

  if (apenasNumeros.length === 0) return true; // vazio pode
  if (apenasNumeros.length === 11) return true; // completo

  return false;
}

function finalizarVenda() {
  if (Object.keys(carrinho).length === 0) {
    alert("Nenhum item no carrinho");
    return;
  }

  const cpfInput = document.getElementById("cpf").value.trim();

  // valida CPF
  if (!cpfValidoOuVazio(cpfInput)) {
    alert("CPF incompleto! Preencha os 11 dígitos ou deixe em branco.");
    return;
  }

  const desejaNota = confirm("Deseja emitir nota fiscal?");

  if (!desejaNota) {
    resetarVenda();
    return;
  }

  // sem confirm do Chrome, direto pra nota
  gerarNota(cpfInput);
}

function resetarVenda() {
  carrinho = {};
  ultimoProduto = null;

  inputPago.value = "";
  document.getElementById("cpf").value = "";
  trocoEl.textContent = "R$ 0,00";

  atualizarDestaques();
  atualizar();
}

const btnFinalizar = document.getElementById("finalizarVenda");
const btnCancelar = document.getElementById("cancelarVenda");
btnCancelar.addEventListener("click", resetarVenda)
btnFinalizar.addEventListener("click", finalizarVenda);

const listaCatalogo = document.getElementById("lista-catalogo");

function carregarCatalogo() {
  listaCatalogo.innerHTML = "";

  Object.entries(produtos).forEach(([codigo, p]) => {
    listaCatalogo.innerHTML += `
      <tr>
        <td>${codigo}</td>
        <td>${p.nome}</td>
        <td>R$ ${p.preco.toFixed(2)}</td>
      </tr>
    `;
  });
}

carregarCatalogo();
