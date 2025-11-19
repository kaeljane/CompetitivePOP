// Chave única para o LocalStorage
const APP_STORAGE_KEY = 'competitivePopData';

export function getStorage() {
  const data = localStorage.getItem(APP_STORAGE_KEY);
  if (!data) {
    return {
      notebooks: [],
    };
  }
  
  return JSON.parse(data);
}

function saveStorage(data) {
  localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(data));
}

export function addNotebook(title, description) {
  const data = getStorage();
  
  const newNotebook = {
    id: `nb-${Date.now()}`, 
    title: title,
    description: description,
    problems: [], 
  };
  
  data.notebooks.push(newNotebook);
  saveStorage(data);
}

export function addProblem(notebookId, title, url, tags) {
  const data = getStorage();
  
  const notebook = data.notebooks.find(nb => nb.id === notebookId);
  
  if (!notebook) {
    console.error(`Erro: Caderno com ID ${notebookId} não encontrado.`);
    return;
  }
  
  const newProblem = {
    id: `prob-${Date.now()}`,
    title: title,
    url: url,
    tags: tags, 
  };
  
  notebook.problems.push(newProblem);
  saveStorage(data);
}

export function getNotebookById(notebookId) {
  const data = getStorage();
  return data.notebooks.find(nb => nb.id === notebookId);
}