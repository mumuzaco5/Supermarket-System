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

  atualizar();
}

function alterarQtd(codigo, delta) {
  carrinho[codigo].qtd += delta;
  if (carrinho[codigo].qtd <= 0) delete carrinho[codigo];
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

    // reset da venda
    carrinho = {};
    inputPago.value = "";
    atualizar();
  }
}

function finalizarVenda() {
lista.textContent = "";
subtotalEl.textContent = "0,00";
trocoEl.textContent = "R$ 0,00";
}

const btnFinalizar = document.getElementById("finalizarVenda");
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