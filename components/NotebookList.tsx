'use client';

import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { SortableNotebookCard } from './SortableNotebookCard';
import { GripVertical, Search } from 'lucide-react';
import FeynmanModal from './FeynmanModal'; // <--- IMPORTAÇÃO NOVA

import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import toast from 'react-hot-toast';

interface NotebookListProps {
  notebooks: any[];
  allTags: string[];
}

export default function NotebookList({ notebooks, allTags }: NotebookListProps) {
  const [selectedNotebook, setSelectedNotebook] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [items, setItems] = useState(notebooks);
  
  // --- ESTADO SIMPLIFICADO ---
  const [feynmanProblem, setFeynmanProblem] = useState<any>(null);
  // Removemos explanation e isSavingReview daqui para não travar a lista

  const router = useRouter();

  useEffect(() => {
    setItems(notebooks);
  }, [notebooks]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor)
  );

  async function handleDragEnd(event: any) {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);
      const newOrder = arrayMove(items, oldIndex, newIndex);
      setItems(newOrder); 
      const updates = newOrder.map((notebook, index) => ({
        id: notebook.id,
        position: index,
        title: notebook.title,
      }));
      try {
        await supabase.from('notebooks').upsert(updates, { onConflict: 'id' });
      } catch (error) {
        console.error("Erro ao tentar salvar:", error);
      }
    }
  }

  const filteredNotebooks = items.filter((nb) => {
    const term = searchTerm.toLowerCase();
    return (
      nb.title.toLowerCase().includes(term) || 
      (nb.description && nb.description.toLowerCase().includes(term))
    );
  });

  async function handleDeleteProblem(problemId: string) {
    if (!confirm("Tem certeza que deseja excluir esta questão?")) return;
    const { error } = await supabase.from('problems').delete().eq('id', problemId);
    if (error) alert('Erro: ' + error.message);
    else {
      const updatedProblems = selectedNotebook.problems.filter((p: any) => p.id !== problemId);
      setSelectedNotebook({ ...selectedNotebook, problems: updatedProblems });
      router.refresh();
    }
  }

  function handleCheckClick(problem: any) {
    if (problem.solved) {
      toggleStatusDirectly(problem.id, true);
    } else {
      // Abre o modal
      setFeynmanProblem(problem);
    }
  }

  async function toggleStatusDirectly(problemId: string, currentStatus: boolean) {
    const { error } = await supabase
      .from('problems')
      .update({ solved: !currentStatus })
      .eq('id', problemId);

    if (!error) {
      updateLocalProblem(problemId, { solved: !currentStatus });
      router.refresh();
    }
  }

  // --- NOVA CONFIRMAÇÃO OTIMISTA ---
  async function handleConfirmFeynman(difficulty: 'Easy' | 'Medium' | 'Hard', text: string) {
    const problemToUpdate = feynmanProblem;
    
    // 1. Fecha e atualiza UI na hora
    setFeynmanProblem(null);
    updateLocalProblem(problemToUpdate.id, { solved: true });

    // 2. Calcula data em background
    const now = new Date();
    let daysToAdd = 1;
    if (difficulty === 'Medium') daysToAdd = 3;
    if (difficulty === 'Easy') daysToAdd = 7;

    const nextReview = new Date();
    nextReview.setDate(now.getDate() + daysToAdd);

    // 3. Salva no Supabase
    const { error } = await supabase
      .from('problems')
      .update({ 
        solved: true,
        review_notes: text,
        last_reviewed_at: now.toISOString(),
        next_review_at: nextReview.toISOString(),
        difficulty_rating: difficulty === 'Hard' ? 3 : difficulty === 'Medium' ? 2 : 1,
        review_interval: daysToAdd 
      })
      .eq('id', problemToUpdate.id);

    if (error) {
      alert('Erro ao salvar revisão: ' + error.message);
      updateLocalProblem(problemToUpdate.id, { solved: false }); // Reverte se der erro
      router.refresh();
    } else {
      router.refresh();
    }
  }

  function updateLocalProblem(id: string, updates: any) {
    const updatedProblems = selectedNotebook.problems.map((p: any) => 
       p.id === id ? { ...p, ...updates } : p
    );
    setSelectedNotebook({ ...selectedNotebook, problems: updatedProblems });
  }

  return (
    <>
      <div id="page-header-container">
        <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2>Meus Cadernos</h2>
          
          <div style={{ position: 'relative', width: '300px' }}>
            <Search 
              size={18} 
              color="#999" 
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} 
            />
            <input 
              type="text" 
              id="search-notebook" 
              placeholder="Pesquisar Caderno..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 10px 10px 40px',
                borderRadius: '8px',
                border: '1px solid #e1e4e8',
                outline: 'none',
                fontSize: '0.95rem',
                transition: 'border-color 0.2s',
                backgroundColor: '#fff'
              }}
              onFocus={(e) => e.target.style.borderColor = '#0070f3'}
              onBlur={(e) => e.target.style.borderColor = '#e1e4e8'}
            />
          </div>
        </div>
      </div>

      <div className="container">
        <main>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={items.map(i => i.id)} strategy={rectSortingStrategy}>
              <div className="notebook-grid">
                {filteredNotebooks.length > 0 ? (
                  filteredNotebooks.map((notebook) => (
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

      {/* --- MODAL DETALHES DO CADERNO --- */}
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
                        onChange={() => handleCheckClick(prob)}
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
                        onClick={(e) => { e.stopPropagation(); handleDeleteProblem(prob.id); }}
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

      {/* --- MODAL FEYNMAN NOVO (IMPORTADO) --- */}
      {feynmanProblem && (
        <FeynmanModal 
          problem={feynmanProblem}
          onClose={() => setFeynmanProblem(null)}
          onConfirm={handleConfirmFeynman}
        />
      )}
    </>
  );
}