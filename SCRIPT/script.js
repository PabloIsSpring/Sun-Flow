const painelContainer = document.getElementById('painel-container');
const DATA_URL = "../data/paineis.json";

async function carregarPaineis() {
  try {
    const resposta = await fetch(DATA_URL);
    const paineis = await resposta.json();

    painelContainer.innerHTML = ''; // limpa antes de preencher

    paineis.forEach(painel => {
      const card = document.createElement('div');
      card.classList.add('painel-card');

      // Calcular média do dia
      const historicoDia = painel.historico?.dia || [];
      const horasColetadas = historicoDia.length;
      const soma = historicoDia.reduce((acc, val) => acc + val, 0);
      const media = horasColetadas > 0 ? (soma / horasColetadas).toFixed(2) : 'N/A';

      const canvasId = `grafico-${painel.id}`;

      card.innerHTML = `
        <h4>${painel.nome}</h4>
        <p class="status ${painel.status}">Status: ${painel.status}</p>
        <p class="geracao">Média do dia: ${media} W</p>
        <canvas id="${canvasId}" ></canvas>
        <a href="painel.html?id=${painel.id}">Ver detalhes →</a>
      `;

      card.style.border = '3px rgb(39, 39, 78) solid'
      card.style.padding = '50px'
      card.style.borderRadius = '10px'
      card.style.margin = '20px'

      painelContainer.appendChild(card);

      // Criar gráfico por painel
      setTimeout(() => {
        if (horasColetadas > 0) {
          const ctx = document.getElementById(canvasId).getContext('2d');
          new Chart(ctx, {
            type: 'bar',
            data: {
              labels: historicoDia.map((_, i) => `${i + 6}:00`),
              datasets: [{
                label: 'Geração (KWh)',
                data: historicoDia,
                borderColor: 'rgba(255, 165, 0, 0.9)',
                backgroundColor: 'rgba(255, 165, 0, 0.2)',
                borderWidth: 2,
                fill: true,
                tension: 0.3,
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
      }, 0);
    });

  } catch (erro) {
    console.error('Erro ao carregar painéis:', erro);
    painelContainer.innerHTML = '<p>Erro ao carregar dados.</p>';
  }
}

const painelGastos = document.getElementById('#painel-gastos');

async function carregarGastos() {
  
}

carregarPaineis();
