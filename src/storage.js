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

/**
 * Adiciona um problema a um caderno específico no LocalStorage
 * @param {number} notebookId - O ID (timestamp) do caderno
 * @param {string} problemTitle - O nome do problema (ex: "Two Sum")
 * @param {string} problemUrl - O link para o problema
 */
export function addProblem(notebookId, problemTitle, problemUrl) {
  
  // 1. Pega os dados atuais
  const data = getStorage();

  // 2. Encontra o caderno correto usando o ID.
  // Usamos Number() para garantir que é um número,
  // pois ele pode vir de um 'data-attribute' como string.
  const notebook = data.notebooks.find(nb => nb.id === Number(notebookId));

  // 3. Se o caderno não for encontrado, avisa no console e para.
  if (!notebook) {
    console.error(`Erro: Caderno com ID ${notebookId} não encontrado.`);
    return;
  }

  // 4. Cria o novo objeto 'problema'
  const newProblem = {
    id: Date.now() + 1, // ID único (somo 1 para garantir ser diferente do ID do caderno)
    title: problemTitle,
    url: problemUrl,
    notes: "" // Deixamos um campo de notas pronto para o futuro
  };

  // 5. Adiciona o novo problema à lista 'problems' do caderno
  notebook.problems.push(newProblem);

  // 6. Salva o objeto 'data' (agora modificado) de volta no LocalStorage
  saveStorage(data);

  console.log(`Problema "${problemTitle}" adicionado ao caderno "${notebook.title}"`);
}
// --- FIM DA NOVA FUNÇÃO ---