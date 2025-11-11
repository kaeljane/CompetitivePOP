// --- CORREÇÃO: REMOVA O IMPORT 'navigateTo' DAQUI ---
import { 
  addNotebook, 
  addProblem, 
  getStorage, 
  getNotebookById 
} from './storage.js';
import { 
  renderNotebooksPage, 
  showNotebookModal, 
  hideNotebookModal 
} from './ui.js';
import { CODEFORCES_TAGS } from './api.js';

// --- CORREÇÃO: A FUNÇÃO AGORA RECEBE 'navigateToCallback' ---
let navigateTo = () => {}; // Função placeholder

/**
 * Lida com todos os envios de formulário (submit) na página.
 * @param {Event} event 
 */
function handleSubmit(event) {
  event.preventDefault(); // Impede o recarregamento da página
  const formId = event.target.id;
  const data = getStorage();

  // --- Lógica para Criar Novo Caderno ---
  if (formId === 'new-notebook-form') {
    const titleInput = document.getElementById('nb-title');
    const descInput = document.getElementById('nb-desc');
    
    if (titleInput && descInput) {
      const title = titleInput.value;
      const description = descInput.value;
      
      addNotebook(title, description); // Salva no storage
      
      // Limpa o formulário
      titleInput.value = '';
      descInput.value = '';
      
      // Re-renderiza a página de cadernos com os dados atualizados
      const newData = getStorage();
      renderNotebooksPage(newData.notebooks, CODEFORCES_TAGS);
    }
  }

  // --- Lógica para Adicionar Nova Questão ---
  if (formId === 'new-problem-form') {
    const title = document.getElementById('q-title').value;
    const url = document.getElementById('q-link').value;
    const notebookId = document.getElementById('q-notebook').value;
    const tagsElement = document.getElementById('q-tags');
    
    // Pega todas as tags selecionadas do <select multiple>
    const tags = Array.from(tagsElement.selectedOptions)
                      .map(option => option.value);

    if (title && url && notebookId && tags.length > 0) {
      // Adiciona o problema ao storage
      const success = addProblem(notebookId, title, url, tags);
      
      if (success !== false) { // Verifica se não houve erro (função retorna undefined no sucesso)
        // Limpa (reseta) o formulário de adicionar questão
        event.target.reset();
        
        // Re-renderiza a página de cadernos para atualizar a contagem
        const newData = getStorage();
        renderNotebooksPage(newData.notebooks, CODEFORCES_TAGS);
      } else {
        console.error(`Erro: Caderno com ID ${notebookId} não encontrado.`);
      }
    } else {
      alert("Por favor, preencha todos os campos para adicionar uma questão.");
    }
  }
  
  // --- Lógica para Criar Simulado ---
  if (formId === 'new-simulado-form') {
    alert("Funcionalidade de Simulado ainda não implementada!");
  }
}

/**
 * Lida com todos os cliques (click) na página.
 * @param {Event} event 
 */
function handleClick(event) {
  const target = event.target; // O elemento exato que foi clicado

  // --- Lógica de Navegação (Dashboard/Cadernos) ---
  const navButton = target.closest('.nav-button');
  if (navButton) {
    // 1. Remove a classe 'active' de TODOS os botões de navegação
    document.querySelectorAll('.nav-button').forEach(btn => {
      btn.classList.remove('active');
    });
    
    // 2. Adiciona a classe 'active' APENAS no botão que foi clicado
    navButton.classList.add('active');

    // 3. Navega para a página correta
    if (navButton.id === 'nav-home') {
      // --- CORREÇÃO: USA O CALLBACK ---
      navigateTo('home');
    } else if (navButton.id === 'nav-notebooks') {
      // --- CORREÇÃO: USA O CALLBACK ---
      navigateTo('notebooks');
    }
    return; // Para a execução, pois foi um clique de navegação
  }


  // --- Lógica para ABRIR o Modal (clique no card) ---
  const card = target.closest('.notebook-card');
  if (card) {
    const notebookId = card.dataset.notebookId;
    const notebook = getNotebookById(notebookId);
    if (notebook) {
      showNotebookModal(notebook);
    }
    return; // Para a execução
  }

  // --- Lógica para FECHAR o Modal ---
  // Se clicou no 'x' OU no fundo escuro (o próprio backdrop)
  if (target.id === 'modal-close-btn' || target.id === 'notebook-modal') {
    hideNotebookModal();
    return; // Para a execução
  }
}


/**
 * Registra os 'escutadores' de eventos principais (submit e click).
 * @param {Function} navigateToCallback - A função 'navigateTo' do main.js
 */
export function registerEventListeners(navigateToCallback) {
  // --- CORREÇÃO: Armazena o callback ---
  navigateTo = navigateToCallback; 

  // Usamos delegação de eventos, um 'escutador' para todos os submits
  document.addEventListener('submit', handleSubmit);
  
  // Um 'escutador' para todos os cliques
  document.addEventListener('click', handleClick);
}