import './style.css'; 
// (O import do slim-select foi removido, o que está correto)
import { fetchUserSubmissions, CODEFORCES_TAGS } from './api.js';
import { 
  renderAppShell, 
  renderHomePage, 
  renderNotebooksPage 
} from './ui.js';
import { registerEventListeners } from './events.js';
import { getStorage } from './storage.js';

// Estado global simples para a página atual
let currentPage = 'home';

/**
 * Processa as submissões falsas para contar as tags.
 * @returns {object} Um objeto com a contagem de cada tag
 */
function processSubmissions() {
  const submissions = fetchUserSubmissions('mock_user');
  
  const tagCounts = submissions
    .flatMap(sub => sub.problem.tags) // Pega todas as tags
    .reduce((acc, tag) => {
      acc[tag] = (acc[tag] || 0) + 1; // Conta a frequência
      return acc;
    }, {}); // Inicia com um objeto vazio

  return tagCounts;
}

/**
 * Roteador principal: Renderiza a página correta no DOM.
 * @param {string} page - O nome da página ('home' or 'notebooks')
 */
export function navigateTo(page) {
  currentPage = page;
  
  const tagData = processSubmissions();
  const storageData = getStorage();

  if (page === 'home') {
    renderHomePage(tagData);
  } else if (page === 'notebooks') {
    renderNotebooksPage(storageData.notebooks, CODEFORCES_TAGS);
  } else {
    // Página padrão (fallback)
    renderHomePage(tagData);
  }
}

/**
 * Ponto de entrada da aplicação.
 */
function initializeApp() {
  const appElement = document.getElementById('app');
  if (!appElement) {
    console.error("Erro fatal: Elemento #app não encontrado.");
    return;
  }
  
  // 1. Desenha o "esqueleto" do app (header, main, aside)
  renderAppShell(appElement);
  
  // 2. Registra os "escutadores" de eventos (cliques, submits)
  // --- CORREÇÃO: PASSA A FUNÇÃO 'navigateTo' ---
  registerEventListeners(navigateTo);
  
  // 3. Navega para a página inicial (home)
  navigateTo('home');
}

// Inicia a aplicação quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', initializeApp);