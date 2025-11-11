import './style.css';
import { fetchUserSubmissions } from './api.js';
import { 
  renderAppShell, 
  renderHomePage, 
  renderNotebooksPage 
} from './ui.js';
import { registerEventListeners } from './events.js';
import { getStorage } from './storage.js';

// Objeto 'state' simples para controlar a navegação
const state = {
  currentPage: 'home', // 'home' ou 'notebooks'
};

// Ponto de entrada da aplicação
function app() {
  console.log("App iniciado!");

  // 1. Renderiza o "esqueleto" principal do app (header, main, aside)
  renderAppShell();

  // 2. Decide qual página inicial mostrar
  navigateTo(state.currentPage);

  // 3. Registra TODOS os 'event listeners' da aplicação
  // (incluindo os de navegação)
  registerEventListeners(navigateTo, renderCurrentPage);
}

/**
 * Função "mágica" que decide o que renderizar
 * Funciona como um "roteador" simples
 */
function renderCurrentPage() {
  const { notebooks } = getStorage();

  if (state.currentPage === 'home') {
    // Se for 'home', busca dados da API e renderiza o gráfico
    const submissions = fetchUserSubmissions("kaeljane"); // Você pode trocar "kaeljane" por um handle dinâmico no futuro
    const tagData = processSubmissions(submissions);
    renderHomePage(tagData);
  } else if (state.currentPage === 'notebooks') {
    // Se for 'notebooks', renderiza a página de cadernos
    renderNotebooksPage(notebooks);
  }
}

/**
 * Função de Navegação
 * @param {string} page - A página para a qual navegar ('home' ou 'notebooks')
 */
export function navigateTo(page) {
  state.currentPage = page;
  renderCurrentPage();
}

/**
 * Processa submissões para contar a frequência de tags.
 * Pega o array de submissões e retorna um objeto com a contagem de tags.
 */
function processSubmissions(submissions) {
  // .flatMap pega as tags de todos os problemas e achata em um único array
  const allTags = submissions.flatMap(sub => sub.problem.tags);
  
  // .reduce conta a frequência de cada tag
  const tagCounts = allTags.reduce((acc, tag) => {
    acc[tag] = (acc[tag] || 0) + 1;
    return acc;
  }, {});
  
  return tagCounts;
}

// Inicia a aplicação
app();