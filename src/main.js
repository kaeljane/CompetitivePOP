import './style.css';
// --- LINHA DO 'slim-select' REMOVIDA ---
import { fetchUserSubmissions, CODEFORCES_TAGS } from './api.js';
import { renderAppShell, renderHomePage, renderNotebooksPage } from './ui.js';
import { registerEventListeners } from './events.js';
import { getStorage } from './storage.js';

// Variável global para o estado da página
let currentPage = 'home';
let appData = getStorage();

/**
 * Processa os dados da API para o gráfico
 */
function processTagData(submissions) {
  const tagCounts = submissions
    .flatMap(sub => sub.problem.tags)
    .reduce((acc, tag) => {
      acc[tag] = (acc[tag] || 0) + 1;
      return acc;
    }, {});
  return tagCounts;
}

/**
 * Função principal de navegação
 */
function navigateTo(page) {
  currentPage = page;
  renderCurrentPage();
}

/**
 * Função principal de renderização
 */
function renderCurrentPage() {
  // Atualiza os dados do storage toda vez que renderiza
  appData = getStorage();
  
  const mainContent = document.getElementById('main-content');
  const sidebar = document.getElementById('sidebar-content');

  if (!mainContent || !sidebar) {
    console.error("Erro: Elementos 'main-content' ou 'sidebar-content' não encontrados.");
    return;
  }

  if (currentPage === 'home') {
    const submissions = fetchUserSubmissions('mock_user');
    const tagData = processTagData(submissions);
    renderHomePage(tagData);
  } else if (currentPage === 'notebooks') {
    // Passa a lista de tags e os cadernos para a UI
    renderNotebooksPage(appData.notebooks, CODEFORCES_TAGS);
  }
}

// --- PONTO DE ENTRADA ---
document.addEventListener('DOMContentLoaded', () => {
  const appElement = document.getElementById('app');
  if (!appElement) {
    console.error("Erro fatal: Elemento '#app' não encontrado.");
    return;
  }
  
  // 1. Renderiza o "esqueleto" do app
  renderAppShell(appElement);
  
  // 2. Renderiza a página inicial (Home)
  navigateTo('home');
  
  // 3. Registra todos os listeners
  registerEventListeners(navigateTo, renderCurrentPage);
});