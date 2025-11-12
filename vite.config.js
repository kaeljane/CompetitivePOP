import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  // --- IMPORTANTE ---
  // Esta linha diz ao Vite que seu site não estará na raiz (dominio.com),
  // mas sim em um subdiretório (kaeljane.github.io/CompetitivePOP/).
  // Troque 'CompetitivePOP' se o nome do seu repositório for outro.
  base: '/CompetitivePOP/', 
});