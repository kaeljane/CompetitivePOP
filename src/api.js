// para dados "falsos" do codeforces

// Esta é uma simulação da API do Codeforces
    // Não precisamos de dados reais para o protótipo!

    const fakeSubmissions = {
      status: "OK",
      result: [
        {
          id: 1,
          verdict: "OK",
          problem: {
            tags: ["implementation", "greedy"]
          }
        },
        {
          id: 2,
          verdict: "OK",
          problem: {
            tags: ["dp", "math"]
          }
        },
        {
          id: 3,
          verdict: "WRONG_ANSWER",
          problem: {
            tags: ["graphs", "dfs and similar"]
          }
        },
        {
          id: 4,
          verdict: "OK",
          problem: {
            tags: ["graphs", "dfs and similar", "trees"]
          }
        },
        {
          id: 5,
          verdict: "OK",
          problem: {
            tags: ["dp"]
          }
        },
        {
          id: 6,
          verdict: "OK",
          problem: {
            tags: ["greedy"]
          }
        }
      ]
    };

    // Função "pura" que exportamos
    export const fetchUserSubmissions = (handle) => {
      console.log(`Buscando dados (falsos) para ${handle}`);
      // Retorna os resultados "OK"
      return fakeSubmissions.result.filter(sub => sub.verdict === "OK");
    };
// --- ADICIONE ISSO ---
// Lista de tags (pode ser expandida)
export const CODEFORCES_TAGS = [
  "implementation", "dp", "math", "graphs", "data structures",
  "greedy", "strings", "brute force", "binary search",
  "dfs and similar", "trees", "sortings", "number theory",
  "combinatorics", "two pointers", "bitmasks", "geometry",
  "shortest paths", "probabilities", "interactive", "hashing",
  "divide and conquer", "games", "flows", "string suffix structures",
  "dsu", "constructive algorithms", "fft"
];