'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/navigation'; // Para atualizar a tela sem piscar tudo

interface NotebookListProps {
  notebooks: any[];
  allTags: string[];
}

export default function NotebookList({ notebooks, allTags }: NotebookListProps) {
  const [selectedNotebook, setSelectedNotebook] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter(); // Hook do Next.js para recarregar dados suavemente

  // Filtro de Pesquisa
  const filteredNotebooks = notebooks.filter((nb) => {
    const term = searchTerm.toLowerCase();
    return (
      nb.title.toLowerCase().includes(term) || 
      (nb.description && nb.description.toLowerCase().includes(term))
    );
  });

  // --- FUNÇÃO 1: DELETAR (Já existia) ---
  async function handleDeleteProblem(problemId: string) {
    if (!confirm("Tem certeza que deseja excluir esta questão?")) return;

    const { error } = await supabase.from('problems').delete().eq('id', problemId);

    if (error) alert('Erro: ' + error.message);
    else {
      alert('Questão excluída!');
      window.location.reload();
    }
  }

  // --- FUNÇÃO 2: MARCAR COMO RESOLVIDO (NOVA) ---
  async function handleToggleStatus(problemId: string, currentStatus: boolean) {
    // 1. Atualiza no Banco
    const { error } = await supabase
      .from('problems')
      .update({ solved: !currentStatus }) // Inverte o valor (True vira False e vice-versa)
      .eq('id', problemId);

    if (error) {
      alert('Erro ao atualizar status');
    } else {
      // 2. Atualiza a interface localmente para ser instantâneo
      const updatedProblems = selectedNotebook.problems.map((p: any) => 
        p.id === problemId ? { ...p, solved: !currentStatus } : p
      );
      
      setSelectedNotebook({ ...selectedNotebook, problems: updatedProblems });
      
      // 3. Pede para o Next.js atualizar os dados em segundo plano
      router.refresh(); 
    }
  }

  return (
    <>
      {/* CABEÇALHO */}
      <div id="page-header-container">
        <div className="page-header">
          <h2>Meus Cadernos</h2>
          <input 
            type="text" 
            id="search-notebook" 
            placeholder="Pesquisar Caderno..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* CONTEÚDO */}
      <div className="container">
        <main>
          <div className="notebook-grid">
            {filteredNotebooks.length > 0 ? (
              filteredNotebooks.map((notebook) => (
                <div key={notebook.id} className="notebook-card" onClick={() => setSelectedNotebook(notebook)}>
                  <h4 className="notebook-title">{notebook.title}</h4>
                  <p className="notebook-desc">{notebook.description || 'Sem descrição'}</p>
                  
                  <div style={{display: 'flex', gap: '10px', marginTop: '10px', fontSize: '0.85rem'}}>
                    {/* Contador de Questões */}
                    <span className="notebook-count">
                      {notebook.problems ? notebook.problems.length : 0} questões
                    </span>
                    {/* Contador de Resolvidos (Novo!) */}
                    {notebook.problems && notebook.problems.some((p:any) => p.solved) && (
                      <span style={{color: 'green', fontWeight: 'bold'}}>
                        ✅ {notebook.problems.filter((p:any) => p.solved).length} feitas
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p style={{ color: '#666', gridColumn: '1/-1', textAlign: 'center' }}>
                {searchTerm ? `Nada encontrado para "${searchTerm}"` : "Nenhum caderno encontrado."}
              </p>
            )}
          </div>
        </main>

        <Sidebar notebooks={notebooks} allTags={allTags} />
      </div>

      {/* MODAL DETALHES */}
      {selectedNotebook && (
        <div className="modal-backdrop" onClick={() => setSelectedNotebook(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedNotebook.title}</h3>
              <button className="modal-close" onClick={() => setSelectedNotebook(null)}>×</button>
            </div>
            
            <ul className="problem-list">
              {selectedNotebook.problems && selectedNotebook.problems.length > 0 ? (
                selectedNotebook.problems
                  // Ordenar: Pendentes primeiro, Resolvidas por último (Opcional, mas fica bom)
                  .sort((a: any, b: any) => (a.solved === b.solved ? 0 : a.solved ? 1 : -1))
                  .map((prob: any) => (
                  <li key={prob.id} className="problem-list-item" 
                      style={{ opacity: prob.solved ? 0.6 : 1, transition: 'all 0.2s' }}> {/* Efeito visual se resolvido */}
                    
                    <div style={{display: 'flex', alignItems: 'center', gap: '10px', flex: 1}}>
                      
                      {/* --- CHECKBOX DE STATUS --- */}
                      <input 
                        type="checkbox" 
                        checked={prob.solved || false}
                        onChange={() => handleToggleStatus(prob.id, prob.solved)}
                        style={{
                          width: '18px', 
                          height: '18px', 
                          cursor: 'pointer',
                          accentColor: '#28a745' // Cor verde do bootstrap
                        }}
                      />

                      {/* Link da Questão */}
                      <a 
                        href={prob.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{
                          textDecoration: prob.solved ? 'line-through' : 'none', // Riscar se feito
                          color: prob.solved ? '#28a745' : 'inherit', // Verde se feito
                          fontWeight: prob.solved ? 'normal' : '600'
                        }}
                      >
                        {prob.title}
                      </a>
                    </div>

                    {/* Área da Direita: Tags + Delete */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <div className="problem-tags">
                        {prob.tags && prob.tags.map((tag: string) => (
                          <span key={tag} className="tag">{tag}</span>
                        ))}
                      </div>

                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteProblem(prob.id);
                        }}
                        className="btn-delete"
                        title="Excluir questão"
                        style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}
                      >
                        🗑️
                      </button>
                    </div>
                  </li>
                ))
              ) : (
                <p style={{ color: '#999', padding: '10px 0' }}>Este caderno está vazio.</p>
              )}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}