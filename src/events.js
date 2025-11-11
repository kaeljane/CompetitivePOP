import { addNotebook, addProblem } from './storage.js'; // 1. Importe a nova função 'addProblem'
import { renderNotebooks } from './ui.js';

export function registerEventListeners() {
  
  // Usamos um único listener no 'document' para "ouvir" todos os submits
  document.addEventListener('submit', (event) => {
    
    // CASO 1: O formulário de NOVO CADERNO foi enviado
    if (event.target.id === 'new-notebook-form') {
      event.preventDefault(); // Impede o recarregamento da página
      const input = document.getElementById('notebook-title');
      const title = input.value.trim();

      if (title) {
        addNotebook(title); 
        renderNotebooks(); // Re-renderiza a lista de cadernos
        input.value = ''; 
      }
    }

    // --- INÍCIO DA NOVA LÓGICA ---
    
    // CASO 2: O formulário de NOVO PROBLEMA foi enviado
    // (Verificamos pela classe que definimos no ui.js)
    if (event.target.classList.contains('new-problem-form')) {
      event.preventDefault(); // Impede o recarregamento da página

      const form = event.target;
      
      // 2. Pegamos o ID do caderno que guardamos no 'data-attribute'
      const notebookId = Number(form.dataset.notebookId);

      // 3. Pegamos os inputs DENTRO do formulário que foi enviado
      const titleInput = form.querySelector('.problem-title');
      const urlInput = form.querySelector('.problem-url');

      const title = titleInput.value.trim();
      const url = urlInput.value.trim();

      // 4. Se tudo estiver preenchido, chamamos a função 'addProblem'
      if (title && url && notebookId) {
        addProblem(notebookId, title, url); // Salva no LocalStorage
        
        renderNotebooks(); // Re-renderiza tudo para mostrar o novo problema
        
        // (Não precisamos limpar os inputs, pois a re-renderização já faz isso)
        // Mas se não fizesse, limparíamos aqui:
        // titleInput.value = '';
        // urlInput.value = '';
      }
    }
    // --- FIM DA NOVA LÓGICA ---
  });
}