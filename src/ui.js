import Chart from 'chart.js/auto';
import { getStorage } from './storage.js';

/**
 * Renderiza o layout principal do dashboard (o gráfico)
 * (Esta função já deve existir da Fase 1)
 * @param {Object} tagData - Objeto com dados das tags (ex: { dp: 2, greedy: 1 })
 */
export function renderDashboard(tagData) {
  const appElement = document.getElementById("app");

  // Criamos o HTML dinamicamente
  appElement.innerHTML = `
    <header>
      <h1>🏆 CompetitivePOP Dashboard</h1>
    </header>
    <main>
      <section class="chart-container">
        <h2>Painel de Fraquezas (Weakness Panel)</h2>
        <p>Problemas resolvidos por tópico (baseado em dados 'falsos'):</p>
        <canvas id="weaknessChart"></canvas>
      </section>

      <section id="notebooks">
        <h2>Cadernos de Estudo</h2>
        <div id="notebook-list">
          <!-- Nossos cadernos do LocalStorage irão aqui -->
        </div>
        <form id="new-notebook-form">
          <input type="text" id="notebook-title" placeholder="Novo caderno (ex: Grafos)" required />
          <button type="submit">Criar Caderno</button>
        </form>
      </section>
    </main>
  `;

  // Seção do Gráfico
  renderChart(tagData);
}

/**
 * Função auxiliar para renderizar o Chart.js
 * (Esta função já deve existir da Fase 1)
 */
function renderChart(data) {
  const ctx = document.getElementById('weaknessChart');
  if (!ctx) return; // Garante que o elemento existe
  
  new Chart(ctx.getContext('2d'), {
    type: 'bar', // Gráfico de barras
    data: {
      labels: Object.keys(data), // Nomes das tags (ex: 'dp', 'greedy')
      datasets: [{
        label: '# de Problemas Resolvidos',
        data: Object.values(data), // Contagem (ex: 2, 1)
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      },
      responsive: true,
      maintainAspectRatio: false
    }
  });
}


// --- INÍCIO DA ATUALIZAÇÃO ---
// Esta é a função que estamos modificando

/**
 * Renderiza APENAS a lista de cadernos
 * (Esta é a versão ATUALIZADA)
 */
export function renderNotebooks() {
  const listElement = document.getElementById("notebook-list");
  if (!listElement) return;

  const { notebooks } = getStorage();

  if (notebooks.length === 0) {
    listElement.innerHTML = "<p>Nenhum caderno criado.</p>";
    return;
  }

  // Transforma os dados em HTML
  listElement.innerHTML = notebooks.map(notebook => {
    
    // Mapeia os problemas dentro do caderno
    const problemsHtml = notebook.problems.map(problem => `
      <li class="problem-item">
        <a href="${problem.url}" target="_blank">${problem.title}</a>
      </li>
    `).join('');

    // Retorna o HTML completo do caderno
    return `
      <div class="notebook-item">
        <h4>${notebook.title}</h4>
        
        <!-- Lista de problemas -->
        <ul class="problem-list">
          ${problemsHtml.length > 0 ? problemsHtml : '<li>Nenhum problema adicionado.</li>'}
        </ul>

        <!-- Formulário para adicionar novo problema -->
        <!-- Usamos 'data-notebook-id' para saber em qual caderno salvar -->
        <form class="new-problem-form" data-notebook-id="${notebook.id}">
          <input type="text" class="problem-title" placeholder="Nome do Problema" required />
          <input type="url" class="problem-url" placeholder="https" required />
          <button type="submit">Add +</button>
        </form>
      </div>
    `;
  }).join('');
}
// --- FIM DA ATUALIZAÇÃO ---