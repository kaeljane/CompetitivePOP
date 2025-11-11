import { addNotebook, addProblem, getNotebookById } from './storage.js';
import { showNotebookModal, hideNotebookModal } from './ui.js';

/**
 * Registra todos os listeners de eventos da aplicação
 */
export function registerEventListeners(navigateTo, renderCurrentPage) {
  
  // Listener de 'submit' (para todos os formulários)
  document.addEventListener('submit', (e) => {
    // Previne o recarregamento da página
    e.preventDefault(); 
    
    // Pega o ID do formulário
    const formId = e.target.id;

    // --- CASO 1: Criar novo caderno ---
    if (formId === 'new-notebook-form') {
      const form = e.target;
      const title = form.elements['nb-title'].value;
      const description = form.elements['nb-desc'].value;

      if (!title) {
        alert('Por favor, dê um nome ao caderno.'); // Vamos trocar isso por um modal depois
        return;
      }

      addNotebook(title, description);
      form.reset(); // Limpa o formulário
      renderCurrentPage(); // Atualiza a UI para mostrar o novo caderno
    }

    // --- CASO 2: Adicionar nova questão ---
    if (formId === 'new-problem-form') {
      const form = e.target;
      const title = form.elements['q-title'].value;
      const url = form.elements['q-link'].value;
      const notebookId = form.elements['q-notebook'].value;
      
      // --- LÓGICA CORRETA PARA LER O <select multiple> ---
      const tagsElement = form.elements['q-tags'];
      const selectedTags = Array.from(tagsElement.selectedOptions)
                                .map(option => option.value);
      // --- FIM DA LÓGICA ---

      if (!title || !url || !notebookId) {
        alert('Preencha todos os campos da questão.');
        return;
      }
      
      // Adiciona o problema no storage
      addProblem(notebookId, title, url, selectedTags);
      
      form.reset(); // Limpa o formulário "Add Questão"
      renderCurrentPage(); // Re-renderiza a página (para atualizar a contagem de "X questões")
    }
    
    // --- CASO 3: Criar simulado (Placeholder) ---
    if (formId === 'new-simulado-form') {
      alert('Funcionalidade de Simulado ainda não implementada!');
    }
  }); // Fim do listener 'submit'
  
  // Listener de 'click' (para navegação e modal)
  document.addEventListener('click', (e) => {
    const target = e.target; // O elemento exato que foi clicado
    
    // --- 1. NAVEGAÇÃO ---
    if (target.id === 'nav-home') {
      e.preventDefault();
      navigateTo('home');
    }
    if (target.id === 'nav-notebooks') {
      e.preventDefault();
      navigateTo('notebooks');
    }
    
    // --- 2. ABRIR MODAL ---
    // closest() verifica se o clique foi *dentro* de um notebook-card
    const clickedCard = target.closest('.notebook-card');
    if (clickedCard) {
      const notebookId = clickedCard.dataset.notebookId;
      const notebook = getNotebookById(notebookId);
      if (notebook) {
        showNotebookModal(notebook);
      }
    }
    
    // --- 3. FECHAR MODAL ---
    // Fecha se clicar no 'X' ou no fundo escuro (backdrop)
    if (target.id === 'modal-close-btn' || target.id === 'notebook-modal') {
      hideNotebookModal();
    }
  }); // Fim do listener 'click'
}