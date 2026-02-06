'use client';

import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { supabase } from '../lib/supabaseClient'; 
import { GripVertical, Pencil, Trash2, Check, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function SortableNotebookCard({ notebook, onClick }: any) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState(notebook.title);
  const [desc, setDesc] = useState(notebook.description || '');

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: notebook.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
    zIndex: isDragging ? 999 : 1,
    position: 'relative' as 'relative',
    touchAction: 'none',
  };

  // --- AÇÕES ---
  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Tem certeza? Isso apagará o caderno e todas as questões dele.')) return;
    setLoading(true);
    const { error } = await supabase.from('notebooks').delete().eq('id', notebook.id);
    if (error) alert('Erro: ' + error.message);
    else window.location.reload();
  };

  const handleSave = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setLoading(true);
    const { error } = await supabase.from('notebooks').update({ title, description: desc }).eq('id', notebook.id);
    if (error) { alert('Erro: ' + error.message); setLoading(false); } 
    else { setIsEditing(false); setLoading(false); router.refresh(); }
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setTitle(notebook.title);
    setDesc(notebook.description);
    setIsEditing(false);
  };

  return (
    <>
      <style jsx>{`
        /* Design Clean (Light Mode) */
        .notebook-card-polished {
          display: flex;
          align-items: stretch;
          background: #ffffff; /* Fundo Branco */
          border: 1px solid #e1e4e8; /* Borda cinza suave */
          border-radius: 12px;
          margin-bottom: 12px;
          overflow: hidden;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05); /* Sombra leve */
          transition: all 0.2s ease;
        }
        .notebook-card-polished:hover {
          border-color: #0070f3; /* Azul ao passar o mouse */
          box-shadow: 0 4px 12px rgba(0,112,243,0.15); /* Sombra azulada */
          transform: translateY(-2px); /* Efeito de elevação */
        }

        /* Zona 1: Handle (Arrastar) */
        .drag-handle-zone {
          padding: 0 12px;
          display: flex;
          align-items: center;
          cursor: grab;
          color: #999;
          background: #f8f9fa; /* Cinza bem clarinho */
          border-right: 1px solid #eee;
          transition: background 0.2s;
        }
        .drag-handle-zone:hover {
          background: #f0f0f0;
          color: #555;
        }
        .drag-handle-zone:active { cursor: grabbing; }

        /* Zona 2: Conteúdo */
        .content-zone {
          flex: 1;
          padding: 16px;
          cursor: pointer;
        }

        /* Títulos e Textos */
        h4 { margin: 0 0 6px 0; color: #111; font-weight: 600; }
        p { margin: 0; color: #666; font-size: 0.9rem; }
        .meta-info { display: flex; gap: 12px; margin-top: 12px; font-size: 0.8rem; color: #888; }

        /* Zona 3: Ações */
        .actions-zone {
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 8px;
          gap: 6px;
          background: #ffffff;
          border-left: 1px solid #f0f0f0;
        }

        /* Botões Redondos */
        .icon-button {
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 8px;
          border-radius: 50%;
          color: #888;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }
        .icon-button:hover { background: #f5f5f5; color: #333; }
        
        /* Cores Específicas de Ação */
        .icon-button.danger:hover { background: #fff0f0; color: #d32f2f; }
        .icon-button.success:hover { background: #e8f5e9; color: #2e7d32; }

        /* Inputs de Edição (Estilo Clean) */
        .edit-input {
          width: 100%; 
          background: #fff; 
          border: 1px solid #ddd; 
          color: #333; 
          padding: 8px; 
          border-radius: 6px; 
          outline: none;
          font-size: 0.95rem;
        }
        .edit-input:focus { border-color: #0070f3; box-shadow: 0 0 0 2px rgba(0,112,243,0.1); }
        .edit-input-title { font-weight: bold; margin-bottom: 8px; }
      `}</style>

      <div
        ref={setNodeRef}
        style={style}
        className="notebook-card-polished"
      >
        {/* --- ZONA 1: ALÇA (Grip) --- */}
        <div className="drag-handle-zone" {...attributes} {...listeners} title="Segure aqui para arrastar">
          <GripVertical size={20} />
        </div>

        {/* --- ZONA 2: CONTEÚDO --- */}
        <div 
          className="content-zone"
          onClick={(e) => { if (!isEditing && onClick) onClick(e); }}
        >
          {isEditing ? (
            <div onClick={(e) => e.stopPropagation()}>
              <input 
                value={title} onChange={e => setTitle(e.target.value)} 
                className="edit-input edit-input-title" autoFocus placeholder="Nome do Caderno"
              />
              <input 
                value={desc} onChange={e => setDesc(e.target.value)} 
                className="edit-input" placeholder="Descrição..."
              />
            </div>
          ) : (
            <>
              <h4>{title}</h4>
              <p>{desc || 'Sem descrição'}</p>
              
              <div className="meta-info">
                <span>📚 {notebook.problems?.length || 0} questões</span>
                {notebook.problems?.some((p:any) => p.solved) && (
                  <span style={{color: '#2e7d32', fontWeight: 'bold', display:'flex', alignItems:'center', gap:'4px'}}>
                    <Check size={14} /> 
                    {notebook.problems.filter((p:any) => p.solved).length} feitas
                  </span>
                )}
              </div>
            </>
          )}
        </div>

        {/* --- ZONA 3: AÇÕES --- */}
        <div className="actions-zone">
          {isEditing ? (
            <>
              <button onClick={handleSave} className="icon-button success" title="Confirmar"> 
                <Check size={18} /> 
              </button>
              <button onClick={handleCancel} className="icon-button danger" title="Cancelar"> 
                <X size={18} /> 
              </button>
            </>
          ) : (
            <>
              <button onClick={(e) => { e.stopPropagation(); setIsEditing(true); }} className="icon-button" title="Editar"> 
                <Pencil size={18} /> 
              </button>
              <button onClick={handleDelete} className="icon-button danger" title="Excluir"> 
                <Trash2 size={18} /> 
              </button>
            </>
          )}
        </div>

      </div>
    </>
  );
}