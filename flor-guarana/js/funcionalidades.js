const precos = {
  tamanhos: {
    "300ml": 8,
    "500ml": 12,
    "700ml": 14
  },

  extras: {
    nutella: 2,
    granola: 1,
    amendoim: 2,
    chocoball: 2,
    disquete: 2,
    gotas: 3,
    condensado: 2
  }
};

const extrasQtd = {
  nutella: 0,
  granola: 0,
  amendoim: 0,
  chocoball: 0,
  disquete: 0,
  gotas: 0,
  condensado: 0
};

let pedidos = [];

/* =======================
   EXTRAS (+ / −)
======================= */
function maisExtra(tipo) {
  extrasQtd[tipo]++;
  atualizarExtras();
}

function menosExtra(tipo) {
  if (extrasQtd[tipo] > 0) {
    extrasQtd[tipo]--;
  }
  atualizarExtras();
}

function atualizarExtras() {
  for (let tipo in extrasQtd) {
    const el = document.getElementById("qtd-" + tipo);
    if (el) el.textContent = extrasQtd[tipo];
  }
}

/* =======================
   ADICIONAR PEDIDO
======================= */
document.getElementById("add").addEventListener("click", () => {

  const tamanho = document.getElementById("tamanho").value;
  const sabor = document.getElementById("sabor").value;
  const cobertura = document.getElementById("cobertura").value;
  const qtd = parseInt(document.getElementById("qtd").value);

  const recheios = getChecked("Recheios");
  const acompanhamentos = getChecked("Acompanhamentos");

  const pedido = {
    tamanho,
    sabor,
    cobertura,
    recheios,
    acompanhamentos,
    extras: { ...extrasQtd },
    quantidade: qtd
  };

  pedidos.push(pedido);

  renderPedidos();
  resetForm();
});

/* =======================
   CHECKBOX FIXO
======================= */
function getChecked(grupo) {
  const section = [...document.querySelectorAll("section")];

  let values = [];

  section.forEach(sec => {
    if (sec.innerText.includes(grupo)) {
      sec.querySelectorAll("input:checked").forEach(i => {
        values.push(i.value);
      });
    }
  });

  return values;
}

/* =======================
   RESET
======================= */
function resetForm() {
  document.getElementById("qtd").value = 1;

  document.querySelectorAll("input[type='checkbox']").forEach(i => {
    i.checked = false;
  });

  document.getElementById("cobertura").value = "Sem";
}

/* =======================
   CÁLCULO
======================= */
function calcularPedido(p) {
  let total = 0;

  total += precos.tamanhos[p.tamanho] * p.quantidade;

  for (let tipo in p.extras) {
    total += precos.extras[tipo] * p.extras[tipo] * p.quantidade;
  }

  return total;
}

/* =======================
   RENDER
======================= */
function renderPedidos() {
  const lista = document.getElementById("lista");
  lista.innerHTML = "";

  let total = 0;

  pedidos.forEach((p, i) => {
    const subtotal = calcularPedido(p);
    total += subtotal;

    const div = document.createElement("div");

    div.innerHTML = `
      <p><strong>Pedido ${i + 1}</strong></p>
      <p>${p.tamanho} - ${p.sabor}</p>
      <p>Cobertura: ${p.cobertura}</p>
      <p>Recheios: ${p.recheios.join(", ") || "Nenhum"}</p>
      <p>Acompanhamentos: ${p.acompanhamentos.join(", ") || "Nenhum"}</p>
      <p>Extras:</p>
      ${formatExtras(p.extras)}
      <p><strong>Subtotal: R$ ${subtotal.toFixed(2)}</strong></p>
      <button onclick="remover(${i})">Remover</button>
    `;

    lista.appendChild(div);
  });

  document.getElementById("total").innerText =
    "TOTAL: R$ " + total.toFixed(2);
}

document.getElementById("enviarWhats").addEventListener("click", () => {

  let mensagem = "🍹 *Novo pedido - Flor de Guaraná*%0A%0A";

  pedidos.forEach((p, i) => {

    mensagem += `*Pedido ${i + 1}*%0A`;
    mensagem += `Tamanho: ${p.tamanho}%0A`;
    mensagem += `Sabor: ${p.sabor}%0A`;
    mensagem += `Cobertura: ${p.cobertura}%0A`;

    mensagem += `Recheio: ${p.recheios.join(", ") || "Nenhum"}%0A`;
    mensagem += `Acompanhamento: ${p.acompanhamentos.join(", ") || "Nenhum"}%0A`;

    mensagem += `Extras:%0A`;

    for (let t in p.extras) {
      if (p.extras[t] > 0) {
        mensagem += `- ${t} x${p.extras[t]}%0A`;
      }
    }

    mensagem += `Quantidade: ${p.quantidade}%0A`;
    mensagem += `%0A`;
  });

  const total = document.getElementById("total").innerText;
  mensagem += `*${total}*`;

  const numero = "5584996222620"; // TROQUE pelo seu número com DDD

  const url = `https://wa.me/${numero}?text=${mensagem}`;

  window.open(url, "_blank");
});

/* =======================
   FORMATAR EXTRAS
======================= */
function formatExtras(extras) {
  let txt = "";

  for (let t in extras) {
    if (extras[t] > 0) {
      txt += `${t} x${extras[t]}<br>`;
    }
  }

  return txt || "Nenhum";
}

/* =======================
   REMOVER
======================= */
function remover(i) {
  pedidos.splice(i, 1);
  renderPedidos();
}