'use client';

import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Pencil } from 'lucide-react'; // Ícone opcional para indicar edição

export default function ReviewCard({ problem }: { problem: any }) {
  const [isVisible, setIsVisible] = useState(true); // Controla se o card aparece na lista
  const [loading, setLoading] = useState(false); // Loading dos botões de dificuldade

  // --- NOVOS ESTADOS PARA EDIÇÃO ---
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [noteText, setNoteText] = useState(problem.review_notes || "Sem anotações..."); // O texto exibido no card
  const [textToEdit, setTextToEdit] = useState(''); // O texto dentro do modal de edição
  const [isSavingNote, setIsSavingNote] = useState(false); // Loading do botão salvar nota

  // Lógica do Algoritmo de Repetição Espaçada (Spaced Repetition)
  async function handleReview(difficulty: 'Easy' | 'Medium' | 'Hard') {
    setLoading(true);
    const now = new Date();
    let nextInterval = 1; 

    if (difficulty === 'Hard') {
      nextInterval = 1;
    } else if (difficulty === 'Medium') {
      nextInterval = 3;
    } else if (difficulty === 'Easy') {
      const currentInterval = problem.review_interval || 0;
      nextInterval = currentInterval > 0 ? Math.ceil(currentInterval * 2.5) : 7;
    }

    const nextReviewDate = new Date();
    nextReviewDate.setDate(now.getDate() + nextInterval);

    const { error } = await supabase
      .from('problems')
      .update({
        last_reviewed_at: now.toISOString(),
        next_review_at: nextReviewDate.toISOString(),
        review_interval: nextInterval,
        difficulty_rating: difficulty === 'Hard' ? 3 : difficulty === 'Medium' ? 2 : 1
      })
      .eq('id', problem.id);

    if (error) {
      alert('Erro ao salvar: ' + error.message);
      setLoading(false);
    } else {
      setIsVisible(false); // Sucesso: Esconde o card
    }
  }

  // --- NOVA LÓGICA PARA SALVAR A EDIÇÃO DA NOTA ---
  async function handleSaveEditedNote() {
    if (textToEdit.trim() === '') return;
    setIsSavingNote(true);

    const { error } = await supabase
      .from('problems')
      .update({ review_notes: textToEdit }) // Atualiza só a nota
      .eq('id', problem.id);

    if (error) {
      alert('Erro ao salvar anotação: ' + error.message);
    } else {
      setNoteText(textToEdit); // Atualiza o card visualmente
      setIsEditModalOpen(false); // Fecha o modal
    }
    setIsSavingNote(false);
  }

  // Se já revisou, não mostra nada
  if (!isVisible) return null;

  return (
    <>
      {/* --- O CARD PRINCIPAL --- */}
      <div className="widget" style={{ display: 'flex', flexDirection: 'column', gap: '10px', transition: 'all 0.3s' }}>
        <div style={{ borderBottom: '1px solid #eee', paddingBottom: '8px', marginBottom: '4px' }}>
          <small style={{ color: '#888', textTransform: 'uppercase', fontSize: '0.75rem' }}>
            {problem.notebooks?.title || 'Sem caderno'}
          </small>
          <h3 style={{ margin: '4px 0' }}>
            <a href={problem.url} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', color: '#333' }}>
              {problem.title} ↗
            </a>
          </h3>
        </div>

        {/* --- A ÁREA DA ANOTAÇÃO (COM CSS MÁGICO DE TRUNCAR) --- */}
        <div 
          style={{ background: '#f9f9f9', padding: '10px', borderRadius: '6px', fontSize: '0.9rem', color: '#555', position: 'relative' }}
        >
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px'}}>
             <strong>Sua anotação (Feynman):</strong>
             <Pencil size={14} color="#999" /> {/* Ícone visual indicando que dá pra editar */}
          </div>
         
          {/* AQUI ESTÁ A MÁGICA DO CSS */}
          <div 
            onClick={() => {
              setTextToEdit(noteText); // Prepara o texto para o modal
              setIsEditModalOpen(true); // Abre o modal
            }}
            title="Clique para ver tudo e editar"
            style={{
              cursor: 'pointer',
              // CSS para limitar linhas e quebrar palavras longas
              display: '-webkit-box',
              WebkitLineClamp: '3',    // Máximo de 3 linhas
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              wordBreak: 'break-word', // Essencial para o "kkkkk" não quebrar o layout
              border: '1px solid transparent',
              transition: 'all 0.2s'
            }}
            // Efeito visual ao passar o mouse
            onMouseEnter={(e) => { e.currentTarget.style.background = '#eee'; e.currentTarget.style.borderColor = '#ddd'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'transparent'; }}
          >
            {noteText}
          </div>
        </div>

        {/* Botões de Ação (Revisão) */}
        <div style={{ marginTop: 'auto', paddingTop: '10px' }}>
          <p style={{ fontSize: '0.85rem', marginBottom: '8px', textAlign: 'center' }}>Como foi revisar isso hoje?</p>
          <div style={{ display: 'flex', gap: '5px' }}>
            <button 
              onClick={() => handleReview('Hard')}
              disabled={loading}
              className="btn" 
              style={{ flex: 1, background: '#ff4d4d', color: 'white', border: 'none', opacity: loading ? 0.5 : 1 }}>
              Difícil (1d)
            </button>
            <button 
              onClick={() => handleReview('Medium')}
              disabled={loading}
              className="btn" 
              style={{ flex: 1, background: '#ffa502', color: 'white', border: 'none', opacity: loading ? 0.5 : 1 }}>
              Médio (3d)
            </button>
            <button 
              onClick={() => handleReview('Easy')}
              disabled={loading}
              className="btn" 
              style={{ flex: 1, background: '#2ecc71', color: 'white', border: 'none', opacity: loading ? 0.5 : 1 }}>
              Fácil ({problem.review_interval ? Math.ceil(problem.review_interval * 2.5) : 7}d)
            </button>
          </div>
        </div>
      </div>

      {/* --- O NOVO MODAL DE EDIÇÃO --- */}
      {isEditModalOpen && (
        <div className="modal-backdrop" style={{zIndex: 3000}} onClick={() => setIsEditModalOpen(false)}>
          <div className="modal-content" style={{maxWidth: '600px'}} onClick={(e) => e.stopPropagation()}>
             <div className="modal-header">
              <h3>Editar Anotação Feynman</h3>
              <button className="modal-close" onClick={() => setIsEditModalOpen(false)}>×</button>
            </div>
            
            <div style={{padding: '15px 0'}}>
              <textarea
                value={textToEdit}
                onChange={e => setTextToEdit(e.target.value)}
                placeholder="Sua explicação..."
                style={{
                  width: '100%', height: '200px', padding: '12px', 
                  borderRadius: '8px', border: '1px solid #ddd', fontFamily: 'inherit',
                  resize: 'vertical', fontSize: '1rem', lineHeight: '1.5'
                }}
                autoFocus
              />
              
              <div style={{display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '15px'}}>
                 <button 
                   onClick={() => setIsEditModalOpen(false)}
                   disabled={isSavingNote}
                   className="btn"
                   style={{background: '#f5f5f5', color: '#333', border:'1px solid #ddd'}}>
                   Cancelar
                 </button>
                 <button 
                  onClick={handleSaveEditedNote}
                  disabled={isSavingNote}
                  className="btn btn-primary">
                  {isSavingNote ? 'Salvando...' : 'Salvar Alterações'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}