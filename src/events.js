import { addNotebook, addProblem } from './storage.js';

/**
 * Registra todos os listeners da aplicação.
 * Usa delegação de eventos para 'click' e 'submit'
 * @param {function} navigateTo - Função para trocar de página (de main.js)
 * @param {function} renderCurrentPage - Função para re-renderizar a view (de main.js)
 */
export function registerEventListeners(navigateTo, renderCurrentPage) {
  
  // Listener genérico para cliques (Navegação)
  document.addEventListener('click', (event) => {
    
    // Navegação HOME
    if (event.target.id === 'nav-home') {
      navigateTo('home');
    }
    
    // Navegação CADERNOS
    if (event.target.id === 'nav-notebooks') {
      navigateTo('notebooks');
    }
  });

  // Listener genérico para formulários
  document.addEventListener('submit', (event) => {
    
    // CASO 1: Formulário CRIAR CADERNO
    if (event.target.id === 'new-notebook-form') {
      event.preventDefault(); 
      const title = document.getElementById('nb-nome').value;
      const description = document.getElementById('nb-desc').value;

      if (title) {
        addNotebook(title, description); 
        renderCurrentPage(); // Re-renderiza a página de cadernos para mostrar o novo
      }
    }
    
    // CASO 2: Formulário ADD QUESTÃO
    if (event.target.id === 'add-question-form') {
      event.preventDefault(); 
      
      const title = document.getElementById('q-nome').value;
      const url = document.getElementById('q-link').value;
      // --- ATUALIZE AQUI ---
      const tagsElement = document.getElementById('q-tags');
      // Pega todos os options selecionados, transforma em array, e pega o .value de cada um
      const tags = Array.from(tagsElement.selectedOptions).map(option => option.value);
      // --- FIM DA ATUALIZAÇÃO ---
      const notebookId = document.getElementById('q-caderno').value;

      if (title && url && notebookId) {
        addProblem(notebookId, title, url, tags);
        // Não precisa re-renderizar, pois a sidebar não muda
        // Mas podemos re-renderizar para atualizar o <select> no futuro
        // Por agora, vamos re-renderizar para atualizar o card (contagem de questões)
        renderCurrentPage(); 
        
        // Limpar o formulário
        event.target.reset();
      } else if (!notebookId) {
        alert("Por favor, crie um caderno antes de adicionar uma questão!");
      }
    }

    // CASO 3: Formulário Simulado (não faz nada)
    if (event.target.id === 'simulado-form') {
      event.preventDefault();
      alert("Funcionalidade de Simulado em construção!");
    }
  });
}