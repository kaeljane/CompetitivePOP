import './style.css';
    import { fetchUserSubmissions } from './api.js';
    import { renderDashboard, renderNotebooks } from './ui.js';
    import { registerEventListeners } from './events.js'; // Importe

    // Ponto de entrada da aplicação
    function app() {
      console.log("App iniciado!");

      // 1. Buscar dados (da nossa API falsa)
      const submissions = fetchUserSubmissions("kaeljane");

      // 2. Processar Dados (Programação Funcional)
      const tagData = processSubmissions(submissions);

      // 3. Renderizar a página (Página Dinâmica)
      renderDashboard(tagData); // Renderiza o layout principal

      // 4. Renderizar os cadernos do LocalStorage
      renderNotebooks();

      // 5. Registrar os Event Listeners
      registerEventListeners();
    }

    /**
     * Processa submissões para contar a frequência de tags.
     * (Função 'processSubmissions' continua igual a antes)
     */
    function processSubmissions(submissions) {
      const allTags = submissions.flatMap(sub => sub.problem.tags);
      const tagCounts = allTags.reduce((acc, tag) => {
        acc[tag] = (acc[tag] || 0) + 1;
        return acc;
      }, {});
      return tagCounts;
    }

    // Inicia a aplicação
    app();