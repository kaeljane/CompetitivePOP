// 1. DADOS FALSOS (MOCK)
// No mundo real, você chamaria a API do Codeforces.
// Para a entrega, "fingimos" que esta é a resposta da API.
const fakeSubmissions = {
  "status": "OK",
  "result": [
    { "problem": { "tags": ["dp", "math"] }, "verdict": "OK" },
    { "problem": { "tags": ["graphs", "dfs and similar"] }, "verdict": "OK" },
    { "problem": { "tags": ["data structures", "trees"] }, "verdict": "OK" },
    { "problem": { "tags": ["implementation"] }, "verdict": "WRONG_ANSWER" },
    { "problem": { "tags": ["dp", "games"] }, "verdict": "OK" },
    { "problem": { "tags": ["greedy", "sortings"] }, "verdict": "OK" },
    { "problem": { "tags": ["math", "number theory"] }, "verdict": "OK" },
    { "problem": { "tags": ["graphs", "shortest paths"] }, "verdict": "OK" },
    { "problem": { "tags": ["strings", "hashing"] }, "verdict": "OK" },
    { "problem": { "tags": ["implementation"] }, "verdict": "OK" },
    { "problem": { "tags": ["dp"] }, "verdict": "OK" },
    { "problem": { "tags": ["greedy"] }, "verdict": "OK" },
    { "problem": { "tags": ["math"] }, "verdict": "OK" },
    { "problem": { "tags": ["graphs"] }, "verdict": "OK" },
    { "problem": { "tags": ["data structures"] }, "verdict": "OK" },
    { "problem": { "tags": ["dp"] }, "verdict": "OK" },
  ]
};

// 2. FUNÇÃO "FALSA" DA API
/**
 * Finge que busca as submissões de um usuário.
 * @param {string} handle - O nome do usuário (não usado, mas simula a API)
 * @returns {Array} - Uma lista de submissões com "verdict": "OK"
 */
export function fetchUserSubmissions(handle) {
  console.log(`Fingindo buscar dados para: ${handle}`);
  // Retorna os resultados "OK"
  return fakeSubmissions.result.filter(sub => sub.verdict === "OK");
};

// --- ADICIONE ISSO ---
// 3. LISTA DE TAGS DO CODEFORCES
export const CODEFORCES_TAGS = [
  "implementation", "dp", "math", "graphs", "data structures",
  "greedy", "strings", "brute force", "binary search",
  "dfs and similar", "trees", "sortings", "number theory",
  "combinatorics", "two pointers", "bitmasks", "geometry",
  "shortest paths", "probabilities", "interactive", "hashing",
  "divide and conquer", "games", "flows", "string suffix structures",
  "dsu", "constructive algorithms", "fft"
];