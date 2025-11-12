import Chart from 'chart.js/auto';

// Paleta de Cores Pré-definida
const CHART_COLORS = [
  'rgba(54, 162, 235, 0.8)', // Blue
  'rgba(75, 192, 192, 0.8)', // Green
  'rgba(255, 206, 86, 0.8)', // Yellow
  'rgba(255, 99, 132, 0.8)', // Red
  'rgba(153, 102, 255, 0.8)', // Purple
  'rgba(255, 159, 64, 0.8)',  // Orange
  'rgba(101, 143, 72, 0.8)',  // Olive
  'rgba(201, 203, 207, 0.8)', // Grey
  'rgba(255, 105, 180, 0.8)', // Pink
  'rgba(0, 206, 209, 0.8)',   // Cyan
];

/**
 * Renderiza o "esqueleto" principal da aplicação (header, main, aside)
 * @param {HTMLElement} appElement - O elemento <div id="app">
 */
export function renderAppShell(appElement) {
  appElement.innerHTML = `
    <header class="app-header">
      <div class="logo-container">
        
        <!-- --- NOVO: Ícone de Menu (Três Barras) --- -->
        <svg class="hamburger-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
          <path d="M3 4h18v2H3V4zm0 7h18v2H3v-2zm0 7h18v2H3v-2z"/>
        </svg>
        
        <span class="logo-text">CompetitivePOP</span>
      </div>
      <nav>
        <button id="nav-home" class="nav-button active">Dashboard</button>
        <button id="nav-notebooks" class="nav-button">Cadernos</button>
      </nav>
    </header>
    
    <div class="container">
      <main id="main-content">
        <!-- Conteúdo da página será injetado aqui -->
      </main>
      <aside id="sidebar-content">
        <!-- Conteúdo da sidebar será injetado aqui -->
      </aside>
    </div>
    
    <!-- HTML do Modal (começa escondido) -->
    <div id="notebook-modal" class="modal-backdrop hidden">
      <div class="modal-content">
        <div class="modal-header">
          <h3 id="modal-title">Título do Caderno</h3>
          <button class="modal-close" id="modal-close-btn">&times;</button>
        </div>
        <div class="modal-body" id="modal-body">
          <!-- O conteúdo do caderno (problemas) será injetado aqui -->
        </div>
      </div>
    </div>
  `;
}

/**
 * Renderiza a página "Home" (Dashboard com gráfico)
 * @param {object} tagData - Os dados das tags processadas
 */
export function renderHomePage(tagData) {
  const mainContent = document.getElementById('main-content');
  const sidebarContent = document.getElementById('sidebar-content');

  mainContent.innerHTML = `
    <div class="page-header">
      <h2>Dashboard de Performance</h2>
    </div>
    <div class="widget">
      <h3>Análise de Tópicos (Weakness Panel)</h3>
      
      <!-- --- TEXTO ATUALIZADO --- -->
      <p>Contagem de tags de todos os seus cadernos</p>

      <div class="chart-container">
        <canvas id="tags-chart"></canvas>
      </div>
    </div>
  `;
  
  sidebarContent.innerHTML = `
    <div class="widget">
      <h3>Bem-vindo!</h3>
      <p>Este é seu dashboard. Use o menu "Cadernos" para organizar seus estudos.</p>
    </div>
  `;

  renderChart(tagData);
}

/**
 * Renderiza a página "Cadernos" (com cards e sidebar de formulários)
 * @param {Array} notebooks - A lista de cadernos do storage
 * @param {Array} allTags - A lista de todas as tags do Codeforces
 */
export function renderNotebooksPage(notebooks, allTags) {
  const mainContent = document.getElementById('main-content');
  const sidebarContent = document.getElementById('sidebar-content');

  mainContent.innerHTML = `
    <div class="page-header">
      <h2>Meus Cadernos</h2>
      
      <!-- --- PLACEHOLDER ATUALIZADO --- -->
      <input type="search" id="search-notebook" placeholder="Pesquisar Caderno">

    </div>
    <div id="notebook-list" class="notebook-grid"></div>
  `;
  
  renderNotebookList(notebooks);


  // Renderiza a Sidebar (Formulários)
  
  const tagsOptions = allTags.map(tag => 
    `<option value="${tag}">${tag}</option>`
  ).join('');
  
  const notebookOptions = notebooks.map(nb => 
    `<option value="${nb.id}">${nb.title}</option>`
  ).join('');

  sidebarContent.innerHTML = `
    <!-- Formulário 1: Adicionar Questão -->
    <div class="widget">
      <form id="new-problem-form">
        
        <!-- --- AQUI: Título do formulário atualizado --- -->
        <h3><i class="icon"></i> Adicionar Questões</h3>
        
        <label for="q-title">Nome da Questão</label>
        <input type="text" id="q-title" name="q-title" required>
        
        <label for="q-link">Link</label>
        <input type="url" id="q-link" name="q-link" required>
        
        <label for="q-tags">Tags (Segure Ctrl/Cmd para selecionar)</label>
        <select id="q-tags" name="q-tags" multiple required>
          ${tagsOptions}
        </select>
        
        <label for="q-notebook">Caderno</label>
        <select id="q-notebook" name="q-notebook" required>
          <option value="" disabled selected>Selecione um caderno...</option>
          ${notebookOptions}
        </select>
        
        <button type="submit" class="btn btn-primary">Add</button>
      </form>
    </div>
    
    <!-- Formulário 2: Criar Caderno -->
    <div class="widget">
      <form id="new-notebook-form">
        <h3><i class="icon"></i> Criar Caderno</h3>
        
        <label for="nb-title">Nome</label>
        <input type="text" id="nb-title" name="nb-title" required>
        
        <label for="nb-desc">Descrição</label>
        <input type="text" id="nb-desc" name="nb-desc" placeholder="Ex: Problemas de DP">
        
        <button type="submit" class="btn btn-primary">Criar</button>
      </form>
    </div>
    
    <!-- Formulário 3: Simulado -->
    <div class="widget">
      <form id="new-simulado-form">
        <h3><i class="icon"></i> Simulado</h3>
        <p>Selecione os cadernos, tempo e crie seu simulado.</p>
        
        <label for="s-tempo">Tempo (minutos)</label>
        <input type="number" id="s-tempo" name="s-tempo" min="30" value="120">
        
        <button type="submit" class="btn">Criar Simulado</button>
      </form>
    </div>
  `;
}

/**
 * Renderiza o gráfico de tags.
 * @param {object} tagData - O objeto com contagem de tags
 */
export function renderChart(tagData) {
  const ctx = document.getElementById('tags-chart');
  if (!ctx) return; 

  const existingChart = Chart.getChart(ctx);
  if (existingChart) {
    existingChart.destroy();
  }

  const labels = Object.keys(tagData);
  const data = Object.values(tagData);
  
  const backgroundColors = labels.map((_, index) => 
    CHART_COLORS[index % CHART_COLORS.length]
  );
  const borderColors = backgroundColors.map(color => color.replace('0.8', '1'));

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: '# de Problemas Resolvidos',
        data: data,
        backgroundColor: backgroundColors,
        borderColor: borderColors,
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          // --- AQUI: Desativa a legenda ---
          display: false,
          position: 'bottom',
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            display: false,
          },
          ticks: {
            precision: 0,
            stepSize: 1 
          }
        },
        x: {
          grid: {
            display: false,
          }
        }
      }
    }
  });
}

/**
 * Mostra o modal com os detalhes de um caderno.
 * @param {object} notebook - O objeto do caderno (vindo do storage)
 */
export function showNotebookModal(notebook) {
  const modal = document.getElementById('notebook-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body');
  
  modalTitle.textContent = notebook.title;
  
  if (notebook.problems.length === 0) {
    modalBody.innerHTML = '<p>Nenhum problema adicionado a este caderno ainda.</p>';
  } else {
    modalBody.innerHTML = `
      <ul class="problem-list">
        ${notebook.problems.map(problem => `
          <li class="problem-list-item">
            <a href="${problem.url}" target="_blank" rel="noopener noreferrer">
              ${problem.title}
            </a>
            <div class="problem-tags">
              ${problem.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
          </li>
        `).join('')}
      </ul>
    `;
  }
  
  modal.classList.remove('hidden');
}

/**
 * Esconde o modal.
 */
export function hideNotebookModal() {
  const modal = document.getElementById('notebook-modal');
  if (!modal) return; 
  
  modal.classList.add('hidden');
  
  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body');
  
  if(modalTitle) modalTitle.textContent = '';
  if(modalBody) modalBody.innerHTML = '';
}


/**
 * Renderiza a lista de cards de caderno dentro do elemento #notebook-list.
 * @param {Array} notebooks - A lista de cadernos a ser renderizada.
 */
export function renderNotebookList(notebooks) {
  const listElement = document.getElementById('notebook-list');
  if (!listElement) {
    return;
  }

  if (notebooks.length === 0) {
    listElement.innerHTML = '<p>Nenhum caderno encontrado. Use o formulário ao lado para criar um!</p>';
    return;
  }

  listElement.innerHTML = notebooks.map(nb => `
    <div class="notebook-card" data-notebook-id="${nb.id}">
      <h3 class="notebook-title">${nb.title}</h3>
      <p class="notebook-desc">${nb.description || 'Sem descrição'}</p>
      <span class="notebook-count">${nb.problems.length} questões</span>
    </div>
  `).join('');
}