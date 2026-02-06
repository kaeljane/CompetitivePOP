# 🏆 CompetitivePOP

> **O seu dashboard central para conquistar a Programação Competitiva.**

![Status](https://img.shields.io/badge/STATUS-CONCLUÍDO-brightgreen?style=for-the-badge)
![Tech](https://img.shields.io/badge/STACK-NEXT.JS%20%7C%20SUPABASE-blue?style=for-the-badge)
![License](https://img.shields.io/badge/LICENSE-MIT-orange?style=for-the-badge)

---

## 📖 Sobre o Projeto

**CompetitivePOP** é uma plataforma web desenvolvida para resolver o maior desafio do programador competitivo: **a organização**.

Em vez de ter seu progresso espalhado por dezenas de juízes online (Codeforces, AtCoder, LeetCode, etc.), o POP centraliza tudo. Ele não é apenas um contador de problemas, mas sim um **diário de bordo inteligente** para sua evolução, transformando dados brutos em estratégia de estudo.

---

## ✨ Funcionalidades

### 1. 📊 Dashboard de Performance
Uma visão geral da sua constância e evolução.
* **Análise de Tópicos (Weakness Panel):** Gráficos dinâmicos que mostram quais áreas você domina (ex: *Greedy*) e quais precisa reforçar (ex: *DP*).
* **Estatísticas Rápidas:** Contadores de cadernos criados, questões salvas e tags mais frequentes.

### 2. 📚 Cadernos de Estudo Inteligentes
Organize seu aprendizado em listas personalizadas.
* **Criação de Listas:** Crie cadernos temáticos como *"Revisão de Grafos"*, *"Prova 1"*, *"Erros Comuns"*.
* **Gerenciamento de Questões:** Salve links de problemas importantes, adicione tags e anotações.
* **Status de Progresso:** Marque questões como "Resolvidas" (Checklist) para acompanhar sua evolução visualmente.
* **Exclusão Segura:** Remova questões ou cadernos que não fazem mais sentido para seu estudo.

### 3. 🛡️ Segurança e Validação
* **Validação via Regex:** O sistema garante que apenas links válidos (HTTP/HTTPS) sejam salvos, prevenindo erros nos dados.
* **Integridade de Dados:** Exclusão e edição conectadas diretamente ao banco de dados na nuvem.

---

## 🛠️ Tecnologias Utilizadas

Este projeto foi refatorado para utilizar as tecnologias mais modernas do ecossistema React:

* **Frontend:** [Next.js](https://nextjs.org/) (React Framework), TypeScript, CSS Modules.
* **Backend as a Service (DBaaS):** [Supabase](https://supabase.com/) (PostgreSQL).
* **Deploy & CI/CD:** [Vercel](https://vercel.com/).
* **Ferramentas:** Git, Regex (Expressões Regulares).

---

## 📋 Requisitos Acadêmicos Atendidos

Este projeto foi desenvolvido como parte da avaliação da disciplina, cumprindo os seguintes critérios técnicos:

- [x] **Requisição Assíncrona:** Comunicação não-bloqueante com o banco de dados (Async/Await).
- [x] **Back-end com DBaaS:** Persistência de dados na nuvem via Supabase.
- [x] **Componentes ReactJS:** Arquitetura modular (`Sidebar`, `NotebookList`, `TopicChart`).
- [x] **Gerência de Estado:** Uso de Hooks (`useState`, `useEffect`) para filtros e interatividade.
- [x] **Regexp (Expressões Regulares):** Validação de URLs nos formulários de entrada.

---

## 🚀 Como rodar o projeto localmente

### Pré-requisitos
* Node.js instalado.
* Conta no Supabase (para as chaves de API).

### Passo a passo

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/kaeljane/CompetitivePOP.git](https://github.com/kaeljane/CompetitivePOP.git)
    cd competitive-pop
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    # ou
    yarn install
    ```

3.  **Configure as Variáveis de Ambiente:**
    Crie um arquivo `.env.local` na raiz do projeto e adicione suas credenciais do Supabase:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=sua_url_aqui
    NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_aqui
    ```

4.  **Rode o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```

5.  **Acesse:** Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

---

## 👩‍💻 Autora

<div align="center">
  
  **Kaeljane Ferreira da Silva**
  <br>
  Matrícula: 202514320008
  <br>
  Curso: Engenharia de Software
  <br>
  <br>
  <a href="https://github.com/kaeljane">
    <img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" alt="GitHub Profile"/>
  </a>

</div>

---

<p align="center">Desenvolvido com 💙 por Kaeljane.</p>