// Chave única para o LocalStorage
const APP_STORAGE_KEY = 'competitivePopData';

/**
 * Pega todos os dados do LocalStorage.
 * Se não houver nada, retorna o estado inicial.
 * @returns {object} O estado da aplicação
 */
export function getStorage() {
  const data = localStorage.getItem(APP_STORAGE_KEY);
  
  // Se não houver dados, retorna a estrutura inicial
  if (!data) {
    return {
      notebooks: [], // Array de cadernos
    };
  }
  
  // Se houver dados, converte de JSON string para objeto
  return JSON.parse(data);
}

/**
 * Salva o estado completo da aplicação no LocalStorage.
 * @param {object} data - O objeto de estado da aplicação
 */
function saveStorage(data) {
  localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(data));
}

/**
 * Adiciona um novo caderno ao storage.
 * @param {string} title - O título do novo caderno
 * @param {string} description - A descrição do novo caderno
 */
export function addNotebook(title, description) {
  const data = getStorage();
  
  const newNotebook = {
    id: `nb-${Date.now()}`, // ID único baseado no timestamp
    title: title,
    description: description,
    problems: [], // Lista de problemas começa vazia
  };
  
  data.notebooks.push(newNotebook);
  saveStorage(data);
}

/**
 * Adiciona um novo problema a um caderno específico.
 * @param {string} notebookId - O ID do caderno onde o problema será salvo
 * @param {string} title - O título do problema
 * @param {string} url - O link para o problema
 * @param {string[]} tags - Um *array* de tags (ex: ["dp", "graphs"])
 */
export function addProblem(notebookId, title, url, tags) {
  const data = getStorage();
  
  // 1. Encontra o caderno correto
  const notebook = data.notebooks.find(nb => nb.id === notebookId);
  
  if (!notebook) {
    console.error(`Erro: Caderno com ID ${notebookId} não encontrado.`);
    return;
  }
  
  // 2. Cria o novo objeto de problema
  const newProblem = {
    id: `prob-${Date.now()}`, // ID único
    title: title,
    url: url,
    tags: tags, // Salva o array de tags diretamente
  };
  
  // 3. Adiciona o problema ao caderno
  notebook.problems.push(newProblem);
  
  // 4. Salva os dados atualizados
  saveStorage(data);
}

/**
 * Busca um único caderno pelo seu ID.
 * @param {string} notebookId - O ID do caderno a ser buscado
 * @returns {object | undefined} O objeto do caderno, ou undefined se não for encontrado
 */
export function getNotebookById(notebookId) {
  const data = getStorage();
  return data.notebooks.find(nb => nb.id === notebookId);
}