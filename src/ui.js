import Chart from 'chart.js/auto';
// (O import do SlimSelect foi removido em passos anteriores, o que está correto)

/**
 * Renderiza o "esqueleto" principal da aplicação (header, main, aside)
 * @param {HTMLElement} appElement - O elemento <div id="app">
 */
export function renderAppShell(appElement) {
  appElement.innerHTML = `
    <header class="app-header">
      <div class="logo-container">
        <!-- SVG ou <img> da logo aqui -->
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
      <p>Problemas com "Accepted" (dados falsos)</p>
      <div class="chart-container">
        <canvas id="tags-chart"></canvas>
      </div>
    </div>
  `;
  
  // A sidebar da home pode ficar vazia ou ter outra info
  sidebarContent.innerHTML = `
    <div class="widget">
      <h3>Bem-vindo!</h3>
      <p>Este é seu dashboard. Use o menu "Cadernos" para organizar seus estudos.</p>
    </div>
  `;

  // Renderiza o gráfico
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

  // 1. Renderiza o conteúdo principal (AGORA COM A LISTA VAZIA)
  mainContent.innerHTML = `
    <div class="page-header">
      <h2>Meus Cadernos</h2>
      <input type="search" id="search-notebook" placeholder="Pesquisar caderno ou questão...">
    </div>
    <!-- A lista agora começa vazia e será preenchida pela renderNotebookList -->
    <div id="notebook-list" class="notebook-grid"></div>
  `;
  
  // --- ATUALIZAÇÃO ---
  // 2. Chama a nova função para preencher a lista
  renderNotebookList(notebooks);
  // --- FIM DA ATUALIZAÇÃO ---


  // 3. Renderiza a Sidebar (Formulários)
  
  // Gera as <option> para o <select> de tags
  const tagsOptions = allTags.map(tag => 
    `<option value="${tag}">${tag}</option>`
  ).join('');
  
  // Gera as <option> para o <select> de cadernos
  const notebookOptions = notebooks.map(nb => 
    `<option value="${nb.id}">${nb.title}</option>`
  ).join('');

  sidebarContent.innerHTML = `
    <!-- Formulário 1: Adicionar Questão -->
    <div class="widget">
      <form id="new-problem-form">
        <h3><i class="icon"></i> Add Questão</h3>
        
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
        
        <!-- (Lógica de seleção de cadernos para o simulado virá depois) -->
        
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
  if (!ctx) return; // Sai se o canvas não estiver na página

  // Destrói gráfico antigo, se houver, para evitar bugs
  const existingChart = Chart.getChart(ctx);
  if (existingChart) {
    existingChart.destroy();
  }

  // Gera cores aleatórias para o gráfico
  const labels = Object.keys(tagData);
  const data = Object.values(tagData);
  const backgroundColors = labels.map(() => 
    `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.6)`
  );

  new Chart(ctx, {
    type: 'bar', // Tipo de gráfico
    data: {
      labels: labels,
      datasets: [{
        label: '# de Problemas Resolvidos',
        data: data,
        backgroundColor: backgroundColors,
        borderColor: backgroundColors.map(color => color.replace('0.6', '1')),
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true
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
  
  // 1. Popula o título
  modalTitle.textContent = notebook.title;
  
  // 2. Popula o corpo com a lista de problemas
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
  
  // 3. Mostra o modal
  modal.classList.remove('hidden');
}

/**
 * Esconde o modal.
 */
export function hideNotebookModal() {
  const modal = document.getElementById('notebook-modal');
  if (!modal) return; // Proteção
  
  modal.classList.add('hidden');
  
  // Limpa o conteúdo para a próxima vez
  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body');
  
  if(modalTitle) modalTitle.textContent = '';
  if(modalBody) modalBody.innerHTML = '';
}


// --- NOVA FUNÇÃO ---
/**
 * Renderiza a lista de cards de caderno dentro do elemento #notebook-list.
 * @param {Array} notebooks - A lista de cadernos a ser renderizada.
 */
export function renderNotebookList(notebooks) {
  const listElement = document.getElementById('notebook-list');
  if (!listElement) {
    // Não é um erro, pode estar na 'home' page
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
// --- FIM DA NOVA FUNÇÃO ---