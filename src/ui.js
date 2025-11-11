import Chart from 'chart.js/auto';
// --- LINHA DO 'SlimSelect' REMOVIDA ---

/**
 * Renderiza o "esqueleto" principal da aplicação (header, main, aside)
 */
export function renderAppShell(appElement) {
  appElement.innerHTML = `
    <header>
      <div class="logo-container">
        <!-- Ícone do Menu Hamburguer (placeholder) -->
        <svg class="menu-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M3 4h18v2H3V4zm0 7h18v2H3v-2zm0 7h18v2H3v-2z"/></svg>
        <h1 class="logo-title">POP</h1>
        <span class="balloons" title="Competitive POP">🎈</span>
      </div>
    </header>
    <div class="container">
      <main id="main-content"></main>
      <aside id="sidebar-content"></aside>
    </div>
  `;
}

/**
 * Renderiza a "Página Home" (Gráfico)
 */
export function renderHomePage(tagData) {
  const mainContent = document.getElementById('main-content');
  const sidebar = document.getElementById('sidebar-content');

  mainContent.innerHTML = `
    <div class="navigation">
      <button id="nav-home" class="nav-button active">Dashboard</button>
      <button id="nav-notebooks" class="nav-button">Cadernos</button>
    </div>
    <div class="chart-container">
      <canvas id="tagsChart"></canvas>
    </div>
  `;
  
  // Limpa a sidebar na home page
  sidebar.innerHTML = `
    <div class="navigation">
      <!-- Botões "falsos" só para preencher espaço -->
      <button class="nav-button" disabled style="opacity: 0; pointer-events: none;"></button>
    </div>
  `;

  renderChart(tagData);
}

/**
 * Renderiza a "Página de Cadernos" (Seu Protótipo)
 */
export function renderNotebooksPage(notebooks, allTags) {
  const mainContent = document.getElementById('main-content');
  const sidebar = document.getElementById('sidebar-content');

  // --- 1. CONTEÚDO PRINCIPAL (Grid de Cadernos) ---
  let notebooksGridHTML = notebooks.map(nb => `
    <div class="notebook-card" data-notebook-id="${nb.id}">
      <h4>${nb.title}</h4>
      <p>${nb.description || 'Sem descrição'}</p>
      <span>${nb.problems.length} ${nb.problems.length === 1 ? 'questão' : 'questões'}</span>
    </div>
  `).join('');

  // Mensagem se não houver cadernos
  if (notebooks.length === 0) {
    notebooksGridHTML = '<p>Nenhum caderno criado. Crie um na sidebar!</p>';
  }

  mainContent.innerHTML = `
    <div class="navigation">
      <button id="nav-home" class="nav-button">Dashboard</button>
      <button id="nav-notebooks" class="nav-button active">Cadernos</button>
    </div>
    <div class="search-bar">
      <input type="text" placeholder="Pesquisar caderno // Questão...">
    </div>
    <div class="notebook-grid">
      ${notebooksGridHTML}
    </div>
  `;

  // --- 2. SIDEBAR (Formulários) ---
  
  // Gera as <option> para as tags
  const tagsOptions = allTags.map(tag => `<option value="${tag}">${tag}</option>`).join('');
  
  // Gera as <option> para os cadernos
  const notebookOptions = notebooks.map(nb => `<option value="${nb.id}">${nb.title}</option>`).join('');

  sidebar.innerHTML = `
    <div class="form-widget">
      <h3><span class="balloons">🎈</span> Add Questão</h3>
      <form id="new-problem-form">
        <label for="q-title">Nome da Questão</label>
        <input type="text" id="q-title" required>
        
        <label for="q-url">Link</label>
        <input type="url" id="q-url" required>
        
        <label for="q-tags">Tags (Segure Ctrl/Cmd para selecionar)</label>
        <!-- Este é o <select> padrão -->
        <select id="q-tags" multiple>
          ${tagsOptions}
        </select>
        
        <label for="q-notebook">Caderno</label>
        <select id="q-notebook" required ${notebooks.length === 0 ? 'disabled' : ''}>
          ${notebooks.length === 0 ? '<option value="">Crie um caderno primeiro</option>' : notebookOptions}
        </select>
        
        <button ${notebooks.length === 0 ? 'disabled' : ''}>Add</button>
      </form>
    </div>
    
    <div class="form-widget">
      <h3>Criar Caderno</h3>
      <form id="new-notebook-form">
        <label for="n-title">Nome</label>
        <input type="text" id="n-title" required>
        
        <label for="n-desc">Descrição</label>
        <input type="text" id="n-desc" placeholder="Ex: Problemas de DP">
        
        <button>Criar</button>
      </form>
    </div>
    
    <div class="form-widget">
      <h3>Simulado</h3>
      <form id="new-simulado-form">
        <label>Nome</label>
        <input type="text" placeholder="Em breve...">
        <label>Questões</label>
        <input type="number" min="1" value="5" disabled>
        <label>Tempo (min)</label>
        <input type="number" min="10" value="120" step="10" disabled>
        <label>Cadernos</label>
        <select multiple disabled><option>Em breve...</option></select>
        <button type="button" disabled>Criar (Em breve)</button>
      </form>
    </div>
  `;

  // --- CHAMADA PARA initTagSelector() REMOVIDA ---
}

/**
 * Função auxiliar para renderizar o Chart.js
 */
function renderChart(data) {
  const canvas = document.getElementById('tagsChart');
  if (!canvas) return; // Se a tela mudou, não faz nada
  
  const ctx = canvas.getContext('2d');
  
  // Destrói gráfico anterior, se existir
  let existingChart = Chart.getChart(ctx);
  if (existingChart) {
    existingChart.destroy();
  }
  
  const labels = Object.keys(data);
  const values = Object.values(data);
  
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Submissões OK por Tag',
        data: values,
        backgroundColor: '#3498db',
        borderRadius: 4,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true
        }
      },
      plugins: {
        legend: {
          display: false
        }
      }
    }
  });
}

// --- FUNÇÃO initTagSelector() REMOVIDA ---