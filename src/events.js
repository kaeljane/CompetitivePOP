import { addNotebook } from './storage.js';
    import { renderNotebooks } from './ui.js';

    /**
     * Registra todos os event listeners da aplicação
     */
    export function registerEventListeners() {
      // Ouve o formulário de novo caderno
      // IMPORTANTE: O 'form' só existe DEPOIS da UI ser renderizada.
      // Usamos 'document' para garantir que o listener funcione.
      document.addEventListener('submit', (event) => {
        // Verifica se o evento veio do formulário que queremos
        if (event.target.id === 'new-notebook-form') {
          event.preventDefault(); // Impede o recarregamento da página

          const input = document.getElementById('notebook-title');
          const title = input.value.trim(); // Pega o valor

          if (title) {
            addNotebook(title); // Salva no LocalStorage
            renderNotebooks(); // Atualiza SÓ a lista de cadernos na tela
            input.value = ''; // Limpa o campo
          }
        }
      });

      // ... aqui você adicionaria listeners para "adicionar problema", "deletar", etc.
    }