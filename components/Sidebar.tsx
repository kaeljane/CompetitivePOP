'use client';

import React, { useState, useEffect } from 'react'; // 1. Adicionado useEffect
import { supabase } from '../lib/supabaseClient';

export default function Sidebar({ notebooks, allTags }: { notebooks: any[], allTags: string[] }) {
  const [loading, setLoading] = useState(false);

  // --- NOVOS ESTADOS (Para lembrar as escolhas) ---
  const [selectedNotebook, setSelectedNotebook] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // 2. Ao abrir a página, busca o que estava salvo no navegador
  useEffect(() => {
    const savedNotebook = localStorage.getItem('last_notebook_id');
    const savedTags = localStorage.getItem('last_tags');

    if (savedNotebook) setSelectedNotebook(savedNotebook);
    if (savedTags) {
      try {
        setSelectedTags(JSON.parse(savedTags));
      } catch (e) {
        console.error("Erro ao ler tags salvas", e);
      }
    }
  }, []);

  // Criar Caderno (NÃO MUDOU NADA)
  async function handleCreateNotebook(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const title = formData.get('nb-title') as string;
    const desc = formData.get('nb-desc') as string;

    const { error } = await supabase.from('notebooks').insert([{ title, description: desc }]);
    if (error) alert('Erro: ' + error.message);
    else window.location.reload();
    setLoading(false);
  }

  // Adicionar Questão (COM SALVAMENTO DE ESTADO)
  async function handleAddProblem(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const title = formData.get('q-title') as string;
    // Pega o link do input (seja ele url ou text)
    const url = formData.get('q-link') as string;
    
    // IMPORTANTE: Agora usamos os estados para garantir que estamos salvando o que está visualmente selecionado
    // (embora o formData também pegue, usar o estado aqui garante sincronia)
    
    // Salva no Supabase
    const { error } = await supabase
      .from('problems')
      .insert([{ 
        title, 
        url, 
        notebook_id: selectedNotebook, // Usa a variável de estado
        tags: selectedTags             // Usa a variável de estado
      }]);
      
    if (error) {
      alert('Erro: ' + error.message);
    } else {
      // 3. SUCESSO! Antes do reload, salva no localStorage
      localStorage.setItem('last_notebook_id', selectedNotebook);
      localStorage.setItem('last_tags', JSON.stringify(selectedTags));
      
      window.location.reload();
    }
    setLoading(false);
  }

  // Função para lidar com mudança nas Tags (Multi-select)
  const handleTagChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const options = e.target.options;
    const newSelectedTags: string[] = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        newSelectedTags.push(options[i].value);
      }
    }
    setSelectedTags(newSelectedTags);
  };

  return (
    <aside>
      {/* Widget Adicionar Questão */}
      <div className="widget">
        {/* MUDANÇA NO TÍTULO AQUI */}
        <h3>Add Questão || Task</h3> 
        <form onSubmit={handleAddProblem}>
          <div className="form-group">
            <label>Nome da Questão</label>
            <input type="text" name="q-title" required />
          </div>
          <div className="form-group">
            <label>Link</label>
            {/* Mantive type="url" conforme seu snippet, mas sem required */}
            <input type="url" name="q-link" placeholder="Link (Opcional)" />
          </div>
          
          <div className="form-group">
            <label>Tags (Ctrl+Click)</label>
            <select 
              name="q-tags" 
              id="q-tags" 
              multiple
              value={selectedTags}       // Controlado pelo React
              onChange={handleTagChange} // Atualiza o estado
            >
              {allTags.map(tag => <option key={tag} value={tag}>{tag}</option>)}
            </select>
          </div>
          
          <div className="form-group">
            <label>Caderno</label>
            <select 
              name="q-notebook" 
              required
              value={selectedNotebook} // Controlado pelo React
              onChange={(e) => setSelectedNotebook(e.target.value)} // Atualiza o estado
            >
              <option value="">Selecione...</option>
              {notebooks.map(nb => <option key={nb.id} value={nb.id}>{nb.title}</option>)}
            </select>
          </div>
          
          <button type="submit" disabled={loading} className="btn btn-primary" style={{width: '100%'}}>
            {loading ? 'Salvando...' : 'Adicionar'}
          </button>
        </form>
      </div>

      {/* Widget Criar Caderno (INTACTO) */}
      <div className="widget">
        <h3>Criar Caderno</h3>
        <form onSubmit={handleCreateNotebook}>
          <div className="form-group">
            <label>Nome</label>
            <input type="text" name="nb-title" required />
          </div>
          <div className="form-group">
            <label>Descrição</label>
            <input type="text" name="nb-desc" />
          </div>
          <button type="submit" disabled={loading} className="btn btn-primary" style={{width: '100%'}}>
            {loading ? 'Criando...' : 'Criar'}
          </button>
        </form>
      </div>
      
    </aside>
  );
}