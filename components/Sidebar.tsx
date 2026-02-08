'use client';

import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Sidebar({ notebooks, allTags }: { notebooks: any[], allTags: string[] }) {
  const [loading, setLoading] = useState(false);

  // Criar Caderno
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

  // Adicionar Questão
  async function handleAddProblem(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const title = formData.get('q-title') as string;
    const url = formData.get('q-link') as string;
    const notebookId = formData.get('q-notebook') as string;
    
    // --- MUDANÇA: REGEX REMOVIDO ---
    // Agora confiamos apenas no input type="url" do HTML
    // e permitimos salvar o link direto no banco.
    
    // Pega as tags selecionadas (multi-select)
    const select = e.currentTarget.querySelector('#q-tags') as HTMLSelectElement;
    const selectedTags = Array.from(select.selectedOptions).map(opt => opt.value);

    // Salva no Supabase
    const { error } = await supabase
      .from('problems')
      .insert([{ title, url, notebook_id: notebookId, tags: selectedTags }]);
      
    if (error) alert('Erro: ' + error.message);
    else window.location.reload();
    setLoading(false);
  }

  return (
    <aside>
      {/* Widget Adicionar Questão */}
      <div className="widget">
        <h3>Add Questão || Task</h3>
        <form onSubmit={handleAddProblem}>
          <div className="form-group">
            <label>Nome da Questão</label>
            <input type="text" name="q-title" required />
          </div>
          <div className="form-group">
            <label>Link</label>
            <input type="url" name="q-link" placeholder="Link (Opcional)" />
          </div>
          <div className="form-group">
            <label>Tags (Ctrl+Click)</label>
            <select name="q-tags" id="q-tags" multiple>
              {allTags.map(tag => <option key={tag} value={tag}>{tag}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Caderno</label>
            <select name="q-notebook" required>
              <option value="">Selecione...</option>
              {notebooks.map(nb => <option key={nb.id} value={nb.id}>{nb.title}</option>)}
            </select>
          </div>
          <button type="submit" disabled={loading} className="btn btn-primary" style={{width: '100%'}}>
            {loading ? 'Salvando...' : 'Adicionar'}
          </button>
        </form>
      </div>

      {/* Widget Criar Caderno */}
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