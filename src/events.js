import { 
  addNotebook, 
  addProblem, 
  getStorage, 
  getNotebookById 
} from './storage.js';
import { 
  renderNotebooksPage, 
  showNotebookModal, 
  hideNotebookModal,
  renderNotebookList
} from './ui.js';
import { CODEFORCES_TAGS } from './api.js';

let navigateTo = () => {}; 

function handleSubmit(event) {
  event.preventDefault(); 
  const formId = event.target.id;
  const data = getStorage();

  if (formId === 'new-notebook-form') {
    const titleInput = document.getElementById('nb-title');
    const descInput = document.getElementById('nb-desc');
    
    if (titleInput && descInput) {
      const title = titleInput.value;
      const description = descInput.value;
      
      addNotebook(title, description); 
      
      titleInput.value = '';
      descInput.value = '';
      
      const newData = getStorage();
      renderNotebooksPage(newData.notebooks, CODEFORCES_TAGS);
    }
  }

  if (formId === 'new-problem-form') {
    const title = document.getElementById('q-title').value;
    const url = document.getElementById('q-link').value;
    const notebookId = document.getElementById('q-notebook').value;
    const tagsElement = document.getElementById('q-tags');
    
    const tags = Array.from(tagsElement.selectedOptions)
                      .map(option => option.value);

    if (title && url && notebookId && tags.length > 0) {
      const success = addProblem(notebookId, title, url, tags);
      
      if (success !== false) { 
        event.target.reset();
        
        const newData = getStorage();
        renderNotebooksPage(newData.notebooks, CODEFORCES_TAGS);
      } else {
        console.error(`Erro: Caderno com ID ${notebookId} não encontrado.`);
      }
    } else {
      alert("Por favor, preencha todos os campos para adicionar uma questão.");
    }
  }
  
  if (formId === 'new-simulado-form') {
    alert("Funcionalidade de Simulado ainda não implementada!");
  }
}

function handleClick(event) {
  const target = event.target; 

  const navButton = target.closest('.nav-button');
  if (navButton) {
    document.querySelectorAll('.nav-button').forEach(btn => {
      btn.classList.remove('active');
    });
    navButton.classList.add('active');

    if (navButton.id === 'nav-home') {
      navigateTo('home');
    } else if (navButton.id === 'nav-notebooks') {
      navigateTo('notebooks');
    }
    return;
  }

  const card = target.closest('.notebook-card');
  if (card) {
    const notebookId = card.dataset.notebookId;
    const notebook = getNotebookById(notebookId);
    if (notebook) {
      showNotebookModal(notebook);
    }
    return; 
  }

  if (target.id === 'modal-close-btn' || target.id === 'notebook-modal') {
    hideNotebookModal();
    return;
  }
}

function handleInput(event) {
  if (event.target.id === 'search-notebook') {
    console.log('Evento "input" disparado pela barra de pesquisa!');
    
    const searchTerm = event.target.value.toLowerCase();
    const { notebooks } = getStorage(); 
    
    console.log('Termo da pesquisa:', searchTerm);

    const filteredNotebooks = notebooks.filter(nb => {
      const titleMatch = nb.title.toLowerCase().includes(searchTerm);
      const descMatch = (nb.description || '').toLowerCase().includes(searchTerm);
      return titleMatch || descMatch;
    });
    
    console.log('Cadernos filtrados:', filteredNotebooks);

    renderNotebookList(filteredNotebooks);
  }
}

export function registerEventListeners(navigateToCallback) {
  navigateTo = navigateToCallback; 

  document.addEventListener('submit', handleSubmit);
  document.addEventListener('click', handleClick);
  
  console.log('Registrando escutador de evento "input"...');
  document.addEventListener('input', handleInput);
}