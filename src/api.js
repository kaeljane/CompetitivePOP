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