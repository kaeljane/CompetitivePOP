// para funções que mexem no localstorage
const STORAGE_KEY = "competitivePopData";

    /**
     * Pega todos os dados do LocalStorage
     * @returns {Object} - Os dados (ex: { notebooks: [...] })
     */
    export function getStorage() {
      const data = localStorage.getItem(STORAGE_KEY);
      // Se não houver dados, retorna uma estrutura inicial
      return data ? JSON.parse(data) : { notebooks: [] };
    }

    /**
     * Salva todos os dados no LocalStorage
     * @param {Object} data - Os dados completos para salvar
     */
    function saveStorage(data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }

    /**
     * Adiciona um novo caderno e salva
     * @param {string} title - Título do novo caderno
     */
    export function addNotebook(title) {
      const data = getStorage();
      const newNotebook = {
        id: Date.now(), // ID único baseado no timestamp
        title: title,
        problems: [] // Lista de problemas
      };
      data.notebooks.push(newNotebook);
      saveStorage(data);
    }