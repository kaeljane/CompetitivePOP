import Chart from 'chart.js/auto';

/**
 * Renderiza o "esqueleto" principal da aplicação (header, main, aside)
 * Isso só roda UMA VEZ.
 */
export function renderAppShell() {
  const appElement = document.getElementById('app');
  appElement.innerHTML = `
    <header>
      <div class="logo-container">
        <!-- Ícone de Menu (não funcional por enquanto) -->
        <svg class="menu-icon" viewBox="0 0 24 24"><path d="M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z" /></svg>
        <h1 class="logo-title">POP</h1>
        <!-- Balões que você pediu -->
        <span class="balloons">🎈</span>
      </div>
    </header>
    
    <!-- Container principal com 2 colunas -->
    <div class="container">
      <!-- Conteúdo principal (Gráfico ou Grid de Cadernos) -->
      <main id="main-content">
        <!-- Conteúdo será injetado por renderHomePage ou renderNotebooksPage -->
      </main>
      
      <!-- Sidebar (Formulários) -->
      <aside id="sidebar">
        <!-- Conteúdo será injetado por renderHomePage ou renderNotebooksPage -->
      </aside>
    </div>
  `;
}

/**
 * Renderiza a "Página Home" (Gráfico)
 * @param {Object} tagData - Dados das tags para o gráfico
 */
export function renderHomePage(tagData) {
  document.getElementById('main-content').innerHTML = `
    <section class="chart-container">
      <h2>Painel de Fraquezas (Weakness Panel)</h2>
      <p>Problemas resolvidos por tópico (baseado em dados 'falsos'):</p>
      <canvas id="weaknessChart"></canvas>
    </section>
  `;
  // Limpa a sidebar
  document.getElementById('sidebar').innerHTML = `
    <div class="navigation">
      <button id="nav-home" class="nav-button active">Dashboard</button>
      <button id="nav-notebooks" class="nav-button">Cadernos</button>
    </div>
  `;
  renderChart(tagData);
}

/**
 * Renderiza a "Página de Cadernos" (Seu Protótipo)
 * @param {Array} notebooks - Lista de cadernos do storage
 */
export function renderNotebooksPage(notebooks) {
  const mainContent = document.getElementById('main-content');
  const sidebar = document.getElementById('sidebar');

  // 1. Renderiza o Conteúdo Principal (Grid de Cadernos)
  mainContent.innerHTML = `
    <div class="search-bar">
      <input type="text" placeholder="Pesquisar caderno ou questão..." />
    </div>
    <div class="notebook-grid">
      ${notebooks.length > 0 ? notebooks.map(nb => `
        <div class="notebook-card">
          <h4>${nb.title}</h4>
          <p>${nb.description || 'Sem descrição'}</p>
          <span>${nb.problems.length} questões</span>
        </div>
      `).join('') : '<p>Nenhum caderno criado.</p>'}
    </div>
  `;

  // 2. Renderiza a Sidebar (Formulários)
  // Criamos o HTML para o <select> de cadernos
  const notebooksOptions = notebooks.map(nb => 
    `<option value="${nb.id}">${nb.title}</option>`
  ).join('');

  sidebar.innerHTML = `
    <div class="navigation">
      <button id="nav-home" class="nav-button">Dashboard</button>
      <button id="nav-notebooks" class="nav-button active">Cadernos</button>
    </div>
    
    <!-- Formulário 1: Add Questão -->
    <div class="form-widget">
      <h3>Add Questão</h3>
      <form id="add-question-form">
        <label for="q-nome">Nome da Questão</label>
        <input type="text" id="q-nome" required />
        
        <label for="q-link">Link</label>
        <input type="url" id="q-link" required />
        
        <label for="q-tags">Tags (separadas por vírgula)</label>
        <input type="text" id="q-tags" placeholder="ex: dp, grafos, greedy" />
        
        <label for="q-caderno">Caderno</label>
        <select id="q-caderno" required>
          <option value="">Selecione um caderno</option>
          ${notebooksOptions}
        </select>
        
        <button type="submit">Add</button>
      </form>
    </div>
    
    <!-- Formulário 2: Criar Caderno -->
    <div class="form-widget">
      <h3>Criar Caderno</h3>
      <form id="new-notebook-form">
        <label for="nb-nome">Nome</label>
        <input type="text" id="nb-nome" required />
        
        <label for="nb-desc">Descrição</label>
        <input type="text" id="nb-desc" />
        
        <button type="submit">Criar</button>
      </form>
    </div>
    
    <!-- Formulário 3: Simulado (UI Apenas) -->
    <div class="form-widget">
      <h3>Simulado</h3>
      <form id="simulado-form">
        <label for="s-nome">Nome</label>
        <input type="text" id="s-nome" />
        <label for="s-questoes">Questões (nº)</label>
        <input type="number" id="s-questoes" min="1" />
        <label for="s-tempo">Tempo (min)</label>
        <input type="number" id="s-tempo" min="10" />
        
        <button type="submit" disabled>Criar (em breve)</button>
      </form>
    </div>
  `;
}

/**
 * Função auxiliar para renderizar o Chart.js
 * (Sem alterações)
 */
function renderChart(data) {
  const ctx = document.getElementById('weaknessChart');
  if (!ctx) return; 
  
  // Destruir gráfico anterior se existir
  const existingChart = Chart.getChart(ctx);
  if (existingChart) {
    existingChart.destroy();
  }
  
  new Chart(ctx.getContext('2d'), {
    type: 'bar', 
    data: {
      labels: Object.keys(data),
      datasets: [{
        label: '# de Problemas Resolvidos',
        data: Object.values(data),
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }]
    },
    options: {
      scales: { y: { beginAtZero: true } },
      responsive: true,
      maintainAspectRatio: false
    }
  });
}