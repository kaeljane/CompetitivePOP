'use client';

import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { SortableNotebookCard } from './SortableNotebookCard'; // <--- Importamos o cartão móvel

// Importações do Drag and Drop
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';

interface NotebookListProps {
  notebooks: any[];
  allTags: string[];
}

export default function NotebookList({ notebooks, allTags }: NotebookListProps) {
  const [selectedNotebook, setSelectedNotebook] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estado local para controlar a ordem visual (Items)
  const [items, setItems] = useState(notebooks);
  
  const router = useRouter();

  // Garante que a lista atualize se o banco mudar (ex: deletar caderno)
  useEffect(() => {
    setItems(notebooks);
  }, [notebooks]);

  // Sensores para detectar mouse e toque (celular)
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  // --- LÓGICA DO ARRASTAR (DRAG END) ---
  // --- VERSÃO CORRIGIDA QUE SALVA NO BANCO ---
  async function handleDragEnd(event: any) {
    const { active, over } = event;

    if (active.id !== over.id) {
      // 1. Calcula a nova ordem e atualiza a tela
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);
      
      const newOrder = arrayMove(items, oldIndex, newIndex);
      setItems(newOrder); 

      // 2. Prepara os dados (SEM a linha updated_at que dava erro)
      const updates = newOrder.map((notebook, index) => ({
        id: notebook.id,
        position: index,     // Salva a posição nova (0, 1, 2...)
        title: notebook.title,
      }));

      // 3. Envia para o Supabase
      try {
        const { error } = await supabase
          .from('notebooks')
          .upsert(updates, { onConflict: 'id' }); // Atualiza tudo de uma vez

        if (error) {
          console.error("Erro do Supabase:", error);
        } else {
          console.log("Ordem salva!");
        }
      } catch (error) {
        console.error("Erro ao tentar salvar:", error);
      }
    }
  }

  // --- SEU FILTRO DE PESQUISA (Aplicado na lista móvel) ---
  const filteredNotebooks = items.filter((nb) => {
    const term = searchTerm.toLowerCase();
    return (
      nb.title.toLowerCase().includes(term) || 
      (nb.description && nb.description.toLowerCase().includes(term))
    );
  });

  // --- SUA FUNÇÃO 1: DELETAR (Mantida intacta) ---
  async function handleDeleteProblem(problemId: string) {
    if (!confirm("Tem certeza que deseja excluir esta questão?")) return;

    const { error } = await supabase.from('problems').delete().eq('id', problemId);

    if (error) alert('Erro: ' + error.message);
    else {
      alert('Questão excluída!');
      window.location.reload();
    }
  }

  // --- SUA FUNÇÃO 2: STATUS (Mantida intacta) ---
  async function handleToggleStatus(problemId: string, currentStatus: boolean) {
    const { error } = await supabase
      .from('problems')
      .update({ solved: !currentStatus })
      .eq('id', problemId);

    if (error) {
      alert('Erro ao atualizar status');
    } else {
      const updatedProblems = selectedNotebook.problems.map((p: any) => 
        p.id === problemId ? { ...p, solved: !currentStatus } : p
      );
      setSelectedNotebook({ ...selectedNotebook, problems: updatedProblems });
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

      <div className="container">
        <main>
          {/* ÁREA DE ARRASTAR */}
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={items.map(i => i.id)} strategy={rectSortingStrategy}>
              
              <div className="notebook-grid">
                {filteredNotebooks.length > 0 ? (
                  filteredNotebooks.map((notebook) => (
                    // Aqui usamos o componente SortableNotebookCard em vez da div comum
                    <SortableNotebookCard 
                      key={notebook.id} 
                      notebook={notebook} 
                      onClick={() => setSelectedNotebook(notebook)}
                    />
                  ))
                ) : (
                  <p style={{ color: '#666', gridColumn: '1/-1', textAlign: 'center' }}>
                    {searchTerm ? `Nada encontrado para "${searchTerm}"` : "Nenhum caderno encontrado."}
                  </p>
                )}
              </div>

            </SortableContext>
          </DndContext>
        </main>

        <Sidebar notebooks={notebooks} allTags={allTags} />
      </div>

      {/* SEU MODAL DE DETALHES (Exatamente igual ao original) */}
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
                  .sort((a: any, b: any) => (a.solved === b.solved ? 0 : a.solved ? 1 : -1))
                  .map((prob: any) => (
                  <li key={prob.id} className="problem-list-item" 
                      style={{ opacity: prob.solved ? 0.6 : 1, transition: 'all 0.2s' }}>
                    
                    <div style={{display: 'flex', alignItems: 'center', gap: '10px', flex: 1}}>
                      <input 
                        type="checkbox" 
                        checked={prob.solved || false}
                        onChange={() => handleToggleStatus(prob.id, prob.solved)}
                        style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#28a745' }}
                      />
                      <a 
                        href={prob.url} target="_blank" rel="noopener noreferrer"
                        style={{
                          textDecoration: prob.solved ? 'line-through' : 'none',
                          color: prob.solved ? '#28a745' : 'inherit',
                          fontWeight: prob.solved ? 'normal' : '600'
                        }}
                      >
                        {prob.title}
                      </a>
                    </div>

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