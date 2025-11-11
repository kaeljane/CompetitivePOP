const STORAGE_KEY = "competitivePopData";

export function getStorage() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : { notebooks: [] };
}

function saveStorage(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

/**
 * ATUALIZADO: Agora salva 'title' e 'description'
 */
export function addNotebook(title, description) {
  const data = getStorage();
  const newNotebook = {
    id: Date.now(),
    title: title,
    description: description || "", // Salva a descrição
    problems: [] 
  };
  data.notebooks.push(newNotebook);
  saveStorage(data);
}

/**
 * ATUALIZADO: Agora salva 'tags' como um array
 */
export function addProblem(notebookId, problemTitle, problemUrl, tags) {
  const data = getStorage();
  const notebook = data.notebooks.find(nb => nb.id === Number(notebookId));

  if (!notebook) {
    console.error(`Erro: Caderno com ID ${notebookId} não encontrado.`);
    return;
  }

  // --- LINHA REMOVIDA ---
  // A conversão .split(',') não é mais necessária.

  const newProblem = {
    id: Date.now() + 1,
    title: problemTitle,
    url: problemUrl,
    tags: tags, // 'tags' já é um array limpo vindo do events.js
    notes: "" 
  };

  notebook.problems.push(newProblem);
  saveStorage(data);
  console.log(`Problema "${problemTitle}" adicionado ao caderno "${notebook.title}"`);
}