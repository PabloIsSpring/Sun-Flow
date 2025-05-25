// Pega o ID do painel pela URL
const parametros = new URLSearchParams(window.location.search);
const painelId = parametros.get('id');
const painelInfo = document.getElementById('painel-info');

// Caminho do JSON com os dados
const DATA_URL = "../data/paineis.json";

// Função para carregar os dados do painel
async function carregarPainel() {
  try {
    const resposta = await fetch(DATA_URL);
    const paineis = await resposta.json();
    const painel = paineis.find(p => p.id === painelId);

    if (painel) {
      exibirPainel(painel);
    } else {
      painelInfo.innerHTML = `<p>Painel não encontrado.</p>`;
    }
  } catch (erro) {
    console.error('Erro ao carregar o painel:', erro);
    painelInfo.innerHTML = `<p>Erro ao carregar os dados.</p>`;
  }
}

// Exibe os dados e gráficos do painel
function exibirPainel(painel) {
  painelInfo.innerHTML = `
    <h2>${painel.nome}</h2>
    <p class="status ${painel.status}">Status: ${painel.status}</p>
    <p class="geracao">Geração atual: ${painel.geracao} W</p>

    <div class="grafico-container">
      <canvas id="grafico-dia"></canvas>
      <canvas id="grafico-semana"></canvas>
      <canvas id="grafico-mes"></canvas>
      <canvas id="grafico-ano"></canvas>
    </div>
  `;

  // Gráficos para o painel
  criarGrafico('grafico-dia', painel.historico.dia, 'Geração (W) por hora', 'hora');
  criarGrafico('grafico-semana', painel.historico.semana, 'Geração (W) por dia da semana', 'dia');
  criarGrafico('grafico-mes', painel.historico.mes, 'Geração (KWh) por semana do mês', 'semana');
  criarGrafico('grafico-ano', painel.historico.ano, 'Geração (W) por mês', 'mês');
}

// Função para criar o gráfico
function criarGrafico(id, dados, label, tipo) {
  const ctx = document.getElementById(id).getContext('2d');

  // Definir labels dinâmicos de acordo com o tipo de gráfico
  let labels;
  switch (tipo) {
    case 'hora':
      labels = dados.map((_, i) => `${i + 6}:00`);
      break;
    case 'dia':
      labels = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
      break;
    case 'semana':
      labels = ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'];
      break;
    case 'mês':
      labels = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
      break;
  }

  // Criar o gráfico
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: label,
        data: dados,
        borderColor: 'rgba(255, 165, 0, 0.9)',
        backgroundColor: 'rgba(255, 165, 0, 0.2)',
        borderWidth: 2,
        fill: true,
        tension: 0.3
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: (ctx) => `${ctx.parsed.y} W`
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

carregarPainel();
