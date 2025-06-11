const btnTema = document.getElementById("toggle-tema");
const lista = document.getElementById("lista-transacoes");
const saldo = document.getElementById("saldo");
const btnAdicionar = document.getElementById("adicionar");
const filtroMes = document.getElementById("filtroMes");
const btnExportar = document.getElementById("btnExportarCSV");

let transacoes = JSON.parse(localStorage.getItem("transacoes")) || [];
let filtroAtual = "todos";

if (localStorage.getItem("tema") === "dark") {
  document.body.classList.add("dark");
}

btnTema.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("tema", document.body.classList.contains("dark") ? "dark" : "light");
});

btnAdicionar.addEventListener("click", () => {
  const descricao = document.getElementById("descricao").value;
  const valor = parseFloat(document.getElementById("valor").value);
  const tipo = document.getElementById("tipo").value;
  const categoria = document.getElementById("categoria").value;
  const data = new Date();
  const dataFormatada = data.toLocaleDateString("pt-BR");
  const anoMes = data.toISOString().slice(0, 7); 

  if (!descricao || isNaN(valor)) return;

  transacoes.push({
    id: Date.now(),
    descricao,
    valor,
    tipo,
    categoria,
    data: dataFormatada,
    anoMes
  });

  document.getElementById("descricao").value = "";
  document.getElementById("valor").value = "";

  salvarTransacoes();
  atualizarInterface();
});

filtroMes.addEventListener("change", () => {
  filtroAtual = filtroMes.value;
  atualizarInterface();
});

if (btnExportar) {
  btnExportar.addEventListener("click", exportarCSV);
}

function salvarTransacoes() {
  localStorage.setItem("transacoes", JSON.stringify(transacoes));
}

function atualizarInterface() {
  lista.innerHTML = "";
  let total = 0;

  const transacoesFiltradas = filtroAtual === "todos"
    ? transacoes
    : transacoes.filter(t => t.anoMes === filtroAtual);

  transacoesFiltradas.forEach(t => {
    const li = document.createElement("li");
    li.classList.add(t.tipo);
    li.innerHTML = `
      ${t.data} — ${t.descricao} (${t.categoria}): R$ ${t.valor.toFixed(2)}
      <button onclick="removerTransacao(${t.id})">✖</button>
    `;
    lista.appendChild(li);
    total += t.tipo === "entrada" ? t.valor : -t.valor;
  });

  saldo.textContent = `R$ ${total.toFixed(2)}`;
}

function removerTransacao(id) {
  transacoes = transacoes.filter(t => t.id !== id);
  salvarTransacoes();
  atualizarInterface();
}

function exportarCSV() {
  const linhas = ['Data,Descrição,Tipo,Categoria,Valor'];
  const transacoesFiltradas = filtroAtual === "todos"
    ? transacoes
    : transacoes.filter(t => t.anoMes === filtroAtual);

  transacoesFiltradas.forEach(t => {
    linhas.push(`${t.data},${t.descricao},${t.tipo},${t.categoria},${t.valor}`);
  });

  const blob = new Blob([linhas.join('\n')], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "gastos.csv";
  a.click();
}

document.addEventListener("DOMContentLoaded", atualizarInterface);
