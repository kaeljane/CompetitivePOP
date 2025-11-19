import './style.css';
import { CODEFORCES_TAGS } from './api.js';
import { getStorage } from './storage.js'; 
import { 
  renderAppShell, 
  renderHomePage, 
  renderNotebooksPage, 
  renderChart 
} from './ui.js';
import { registerEventListeners } from './events.js';

function processSubmissions() {
  const { notebooks } = getStorage(); 
  const tagCounts = {};

  notebooks.forEach(notebook => {
    notebook.problems.forEach(problem => {
      problem.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });
  });

  return tagCounts;
}

function getQuickStats() {
  const { notebooks } = getStorage();
  const totalNotebooks = notebooks.length;
  
  let totalProblems = 0;
  const allTags = [];

  notebooks.forEach(nb => {
    totalProblems += nb.problems.length;
    nb.problems.forEach(prob => {
      allTags.push(...prob.tags);
    });
  });

  let mostCommonTag = 'N/A';
  if (allTags.length > 0) {
    const tagCounts = allTags.reduce((acc, tag) => {
      acc[tag] = (acc[tag] || 0) + 1;
      return acc;
    }, {});
    
    mostCommonTag = Object.keys(tagCounts).reduce((a, b) => 
      tagCounts[a] > tagCounts[b] ? a : b
    );
  }

  return { totalNotebooks, totalProblems, mostCommonTag };
}

function navigateTo(page) {
  const data = getStorage();
  
  const headerContainer = document.getElementById('page-header-container');
  if (!headerContainer) return;

  if (page === 'home') {
    headerContainer.innerHTML = `
      <div class="page-header">
        <h2>Dashboard de Performance</h2>
      </div>
    `;
    
    const quickStats = getQuickStats(); 
    renderHomePage(quickStats); 
    
    setTimeout(() => {
      const tagCounts = processSubmissions();
      renderChart(tagCounts);
    }, 0);
    
  } else if (page === 'notebooks') {
    headerContainer.innerHTML = `
      <div class="page-header">
        <h2>Meus Cadernos</h2>
        <input type="text" id="search-notebook" placeholder="Pesquisar Caderno">
      </div>
    `;
    
    renderNotebooksPage(data.notebooks, CODEFORCES_TAGS);
  }
}

renderAppShell();

registerEventListeners(navigateTo);

navigateTo('home');