import Chart from 'chart.js/auto';
import { getStorage } from './storage.js';

// Paleta de cores para o gráfico
const CHART_COLORS = [
  '#36A2EB', // Azul
  '#4BC0C0', // Verde-água
  '#FFCE56', // Amarelo
  '#E7608A', // Rosa
  '#9966FF', // Roxo
  '#FF9F40', // Laranja
  '#4CAF50', // Verde
];

let chartInstance = null; // Variável global para guardar a instância do gráfico

/**
 * Renderiza o gráfico de tags.
 * @param {object} tagCounts - Objeto com tags como chaves e contagens como valores
 */
export function renderChart(tagCounts) {
  const canvas = document.getElementById('tagsChart');
  if (!canvas) return; // Sai se o canvas não estiver na página

  const ctx = canvas.getContext('2d');
  
  // Destrói o gráfico anterior (se existir) para evitar sobreposição
  if (chartInstance) {
    chartInstance.destroy();
  }

  const labels = Object.keys(tagCounts);
  const data = Object.values(tagCounts);
  
  // Mapeia os dados para a paleta de cores
  const backgroundColors = labels.map((_, index) => 
    CHART_COLORS[index % CHART_COLORS.length]
  );

  chartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: '# de Problemas Resolvidos',
        data: data,
        backgroundColor: backgroundColors,
        borderRadius: 4,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false, // Remove a legenda (quadrado azul)
          position: 'bottom',
        },
        title: {
          display: false,
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            display: false, // Remove linhas de grade (fundo)
          },
          ticks: {
            // Força o eixo Y a usar apenas números inteiros
            stepSize: 1, 
            precision: 0
          }
        },
        x: {
          grid: {
            display: false, // Remove linhas de grade (fundo)
          }
        }
      }
    }
  });
}

/**
 * Renderiza o conteúdo principal da página "Home" (Dashboard).
 * @param {object} quickStats - Objeto com as estatísticas rápidas
 */
export function renderHomePage(quickStats) {
  const app = document.getElementById('app');
  if (!app) return;

  // O <h2> foi removido daqui e será controlado pelo main.js
  const mainContent = `
    <div class="widget">
      <h3>Análise de Tópicos (Weakness Panel)</h3>
      <p>Contagem de tags de todos os seus cadernos</p>
      <div class="chart-container">
        <canvas id="tagsChart"></canvas>
      </div>
    </div>
  `;
  
  // Conteúdo da Sidebar para a Home
  const sidebarContent = `
    <div class="widget quick-stats">
      <h3>Estatísticas Rápidas</h3>
      
      <div class="stat-item">
        <span class="stat-value">${quickStats.totalNotebooks}</span>
        <span class="stat-label">Cadernos Criados</span>
      </div>
      
      <div class="stat-item">
        <span class="stat-value">${quickStats.totalProblems}</span>
        <span class="stat-label">Questões Salvas</span>
      </div>
      
      <div class="stat-item">
        <span class="stat-value">${quickStats.mostCommonTag}</span>
        <span class="stat-label">Tag Mais Comum</span>
      </div>
    </div>
  `;

  // Seleciona os containers de conteúdo
  const mainContainer = app.querySelector('main');
  const asideContainer = app.querySelector('aside');

  if (mainContainer && asideContainer) {
    mainContainer.innerHTML = mainContent;
    asideContainer.innerHTML = sidebarContent;
  }
}

/**
 * Renderiza a lista de cards de caderno.
 * Esta função é separada para permitir a re-renderização (ex: pesquisa).
 * @param {Array} notebooks - A lista de cadernos a ser renderizada
 */
export function renderNotebookList(notebooks) {
  const grid = document.getElementById('notebook-list');
  if (!grid) return;

  // Limpa a grade antes de renderizar
  grid.innerHTML = ''; 
  
  if (notebooks.length === 0) {
    grid.innerHTML = '<p>Nenhum caderno encontrado.</p>';
    return;
  }

  notebooks.forEach(notebook => {
    grid.innerHTML += `
      <div class="notebook-card" data-notebook-id="${notebook.id}">
        <h4 class="notebook-title">${notebook.title}</h4>
        <p class="notebook-desc">${notebook.description || 'Sem descrição'}</p>
        <span class="notebook-count">${notebook.problems.length} questões</span>
      </div>
    `;
  });
}

/**
 * Renderiza o conteúdo principal da página "Cadernos".
 * @param {Array} notebooks - A lista de todos os cadernos
 * @param {Array} allTags - A lista de todas as tags do Codeforces
 */
export function renderNotebooksPage(notebooks, allTags) {
  const app = document.getElementById('app');
  if (!app) return;

  // O <h2> e o <input> de pesquisa foram removidos daqui
  const mainContent = `
    <div class="notebook-grid" id="notebook-list">
      <!-- Os cards de caderno serão injetados aqui -->
    </div>
  `;
  
  // Gera as <option> para o <select> de tags
  const tagsOptions = allTags.map(tag => 
    `<option value="${tag}">${tag}</option>`
  ).join('');
  
  // Gera as <option> para o <select> de cadernos
  const notebookOptions = notebooks.map(nb => 
    `<option value="${nb.id}">${nb.title}</option>`
  ).join('');

  // Conteúdo da Sidebar para a página "Cadernos"
  const sidebarContent = `
    <div class="widget">
      <h3>Adicionar Questões</h3>
      <form id="new-problem-form">
        <label for="q-title">Nome da Questão</label>
        <input type="text" id="q-title" required>
        
        <label for="q-link">Link</label>
        <input type="url" id="q-link" required>
        
        <label for="q-tags">Tags (Segure Ctrl/Cmd para selecionar)</label>
        <select id="q-tags" multiple required>
          ${tagsOptions}
        </select>
        
        <label for="q-notebook">Caderno</label>
        <select id="q-notebook" required>
          <option value="">Selecione um caderno...</option>
          ${notebookOptions}
        </select>
        
        <button type="submit" class="btn btn-primary">Add</button>
      </form>
    </div>

    <div class="widget">
      <h3>Criar Caderno</h3>
      <form id="new-notebook-form">
        <label for="nb-title">Nome</label>
        <input type="text" id="nb-title" required>
        
        <label for="nb-desc">Descrição</label>
        <input type="text" id="nb-desc" placeholder="Ex: Problemas de DP">
        
        <button type="submit" class="btn btn-primary">Criar</button>
      </form>
    </div>
    
    <div class="widget">
      <h3>Simulado</h3>
      <form id="new-simulado-form">
        <label for="s-time">Tempo (minutos)</label>
        <input type="number" id="s-time" value="120" min="10" required>
        
        <button type="submit" class="btn">Criar Simulado</button>
      </form>
    </div>
  `;

  // Seleciona os containers de conteúdo
  const mainContainer = app.querySelector('main');
  const asideContainer = app.querySelector('aside');

  if (mainContainer && asideContainer) {
    mainContainer.innerHTML = mainContent;
    asideContainer.innerHTML = sidebarContent;
  }
  
  // IMPORTANTE: Após o HTML ser injetado, renderiza a lista
  renderNotebookList(notebooks);
}

/**
 * Renderiza o "esqueleto" principal do app (Header, Main, Aside).
 * Isso é chamado apenas uma vez no início.
 */
export function renderAppShell() {
  const appRoot = document.getElementById('app');
  if (!appRoot) return;

  appRoot.innerHTML = `
    <header class="app-header">
      <div class="logo-container">
        <!-- Ícone de Menu (Hamburger) -->
        <svg class="hamburger-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
          <path d="M3 4h18a1 1 0 0 1 0 2H3a1 1 0 0 1 0-2Zm0 7h18a1 1 0 0 1 0 2H3a1 1 0 0 1 0-2Zm0 7h18a1 1 0 0 1 0 2H3a1 1 0 0 1 0-2Z"></path>
        </svg>
        <h1 class="logo-text">CompetitivePOP</h1>
      </div>
      <nav class="nav-links">
        <button id="nav-home" class="nav-button active">Dashboard</button>
        <button id="nav-notebooks" class="nav-button">Cadernos</button>
      </nav>
    </header>
    
    <!-- --- NOVO CONTAINER PARA O TÍTULO DA PÁGINA --- -->
    <div id="page-header-container">
      <!-- O título (H2) e a barra de pesquisa serão injetados aqui pelo main.js -->
    </div>

    <!-- Container principal com as colunas de grid -->
    <div class="container">
      <main>
        <!-- O conteúdo da página (ex: gráfico) será injetado aqui -->
      </main>
      <aside>
        <!-- A sidebar (ex: estatísticas) será injetada aqui -->
      </aside>
    </div>
    
    <!-- Modal (invisível por padrão) -->
    <div id="notebook-modal" class="modal-backdrop hidden">
      <div class="modal-content">
        <div class="modal-header">
          <h3 id="modal-title">Título do Caderno</h3>
          <button id="modal-close-btn" class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
          <ul class="problem-list" id="modal-problem-list">
            <!-- Itens da lista de problemas serão injetados aqui -->
          </ul>
        </div>
      </div>
    </div>
  `;
}

/**
 * Mostra o modal com os detalhes de um caderno.
 * @param {object} notebook - O objeto do caderno
 */
export function showNotebookModal(notebook) {
  const modal = document.getElementById('notebook-modal');
  const title = document.getElementById('modal-title');
  const list = document.getElementById('modal-problem-list');
  
  if (!modal || !title || !list) return;

  // Preenche os dados do modal
  title.textContent = notebook.title;
  list.innerHTML = ''; // Limpa a lista anterior

  if (notebook.problems.length === 0) {
    list.innerHTML = '<li>Nenhum problema adicionado a este caderno.</li>';
  } else {
    notebook.problems.forEach(problem => {
      // Gera os "chips" de tags
      const tagsHtml = problem.tags.map(tag => `<span class="tag">${tag}</span>`).join('');
      
      list.innerHTML += `
        <li class="problem-list-item">
          <a href="${problem.url}" target="_blank">${problem.title}</a>
          <div class="problem-tags">
            ${tagsHtml}
          </div>
        </li>
      `;
    });
  }

  // Mostra o modal
  modal.classList.remove('hidden');
}

/**
 * Esconde o modal.
 */
export function hideNotebookModal() {
  const modal = document.getElementById('notebook-modal');
  if (modal) {
    modal.classList.add('hidden');
  }
}