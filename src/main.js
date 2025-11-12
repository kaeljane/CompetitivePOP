import './style.css';
import { CODEFORCES_TAGS } from './api.js';
import { getStorage } from './storage.js'; 
import { 
  renderAppShell, 
  renderHomePage, 
  renderNotebooksPage, 
  renderChart 
} from './ui.js';
import { registerEventListeners } from './events.js';

/**
 * Processa as submissões para contar as tags.
 * LÊ DO LOCALSTORAGE
 * @returns {object} Um objeto com contagens de tags (ex: { dp: 5, graphs: 3 })
 */
function processSubmissions() {
  const { notebooks } = getStorage(); // Pega os dados reais
  const tagCounts = {};

  // Itera por todos os cadernos
  notebooks.forEach(notebook => {
    // Itera por todos os problemas em cada caderno
    notebook.problems.forEach(problem => {
      // Itera por todas as tags em cada problema
      problem.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });
  });

  return tagCounts;
}

/**
 * Calcula as estatísticas rápidas para a sidebar.
 * @returns {object}
 */
function getQuickStats() {
  const { notebooks } = getStorage();
  const totalNotebooks = notebooks.length;
  
  let totalProblems = 0;
  const allTags = [];

  notebooks.forEach(nb => {
    totalProblems += nb.problems.length;
    nb.problems.forEach(prob => {
      allTags.push(...prob.tags);
    });
  });

  let mostCommonTag = 'N/A';
  if (allTags.length > 0) {
    const tagCounts = allTags.reduce((acc, tag) => {
      acc[tag] = (acc[tag] || 0) + 1;
      return acc;
    }, {});
    
    mostCommonTag = Object.keys(tagCounts).reduce((a, b) => 
      tagCounts[a] > tagCounts[b] ? a : b
    );
  }

  return { totalNotebooks, totalProblems, mostCommonTag };
}


/**
 * Navega para uma página diferente no app (SPA)
 * @param {string} page - O nome da página ('home' or 'notebooks')
 */
function navigateTo(page) {
  const data = getStorage();
  
  // --- MUDANÇA AQUI ---
  // Pega o novo container do cabeçalho da página
  const headerContainer = document.getElementById('page-header-container');
  if (!headerContainer) return;
  // --- Fim da mudança ---

  
  if (page === 'home') {
    // 1. Injeta o Título da Página Home
    headerContainer.innerHTML = `
      <div class="page-header">
        <h2>Dashboard de Performance</h2>
      </div>
    `;
    
    // 2. Renderiza o conteúdo da página home
    const quickStats = getQuickStats(); // Calcula as estatísticas
    renderHomePage(quickStats); // Passa as estatísticas
    
    // 3. Renderiza o gráfico
    setTimeout(() => {
      const tagCounts = processSubmissions();
      renderChart(tagCounts);
    }, 0);
    
  } else if (page === 'notebooks') {
    // 1. Injeta o Título e a Barra de Pesquisa da Página Cadernos
    headerContainer.innerHTML = `
      <div class="page-header">
        <h2>Meus Cadernos</h2>
        <input type="text" id="search-notebook" placeholder="Pesquisar Caderno">
      </div>
    `;
    
    // 2. Renderiza o conteúdo da página cadernos
    renderNotebooksPage(data.notebooks, CODEFORCES_TAGS);
  }
}

// 1. Renderiza o "esqueleto" do app
renderAppShell();

// 2. Registra todos os event listeners (passando a função de navegação)
registerEventListeners(navigateTo);

// 3. Navega para a página inicial (Home) por padrão
navigateTo('home');