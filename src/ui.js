// para funções que criam HTML
// (Adicione esta importação no topo do ui.js)
    import { getStorage } from './storage.js';

    /**
     * Renderiza APENAS a lista de cadernos
     * (chamado ao carregar e ao adicionar novo)
     */
    export function renderNotebooks() {
      const listElement = document.getElementById("notebook-list");
      if (!listElement) return; // Se o elemento não existe, não faz nada

      const { notebooks } = getStorage(); // Pega dados do LocalStorage

      if (notebooks.length === 0) {
        listElement.innerHTML = "<p>Nenhum caderno criado.</p>";
        return;
      }

      // Usa .map (Funcional) para transformar dados em HTML
      listElement.innerHTML = notebooks.map(notebook => `
        <div class="notebook-item">
          <h4>${notebook.title}</h4>
          <small>${notebook.problems.length} problemas</small>
        </div>
      `).join('');
    }
