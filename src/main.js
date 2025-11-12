import './style.css'; 
// Importamos o getStorage para ler os dados reais
import { getStorage } from './storage.js';
// Não precisamos mais do fetchUserSubmissions, então o removemos
import { CODEFORCES_TAGS } from './api.js';
import { 
  renderAppShell, 
  renderHomePage, 
  renderNotebooksPage 
} from './ui.js';
import { registerEventListeners } from './events.js';

// Estado global simples para a página atual
let currentPage = 'home';

/**
 * Processa as submissões reais dos cadernos do usuário.
 * @returns {object} Um objeto com a contagem de cada tag
 */
function processSubmissions() {
  // 1. Pega os dados REAIS do LocalStorage
  const { notebooks } = getStorage();
  
  // 2. Usa .flatMap() para pegar todas as tags de todos os problemas
  const allTags = notebooks
    .flatMap(notebook => notebook.problems) // Pega todos os problemas de todos os cadernos
    .flatMap(problem => problem.tags); // Pega todas as tags de todos os problemas
  
  // allTags agora é um array gigante com todas as tags, ex: ["dp", "graphs", "dp", "math"]

  // 3. Conta a frequência das tags (exatamente como antes)
  const tagCounts = allTags.reduce((acc, tag) => {
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
  
  // Agora esta função usa os dados reais!
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
  registerEventListeners(navigateTo);
  
  // 3. Navega para a página inicial (home)
  navigateTo('home');
}

// Inicia a aplicação quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', initializeApp);