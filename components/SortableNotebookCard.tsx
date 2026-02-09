'use client';

import React, { useState, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { supabase } from '../lib/supabaseClient'; 
import { GripVertical, Pencil, Trash2, Check, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast'; 

// --- BARRA DE PROGRESSO ---
const ProgressBar = ({ total, solved }: { total: number, solved: number }) => {
  const [width, setWidth] = useState(0);
  const percentage = total > 0 ? Math.round((solved / total) * 100) : 0;

  useEffect(() => {
    const timer = setTimeout(() => setWidth(percentage), 100);
    return () => clearTimeout(timer);
  }, [percentage]);

  let fillColor = '#ef4444'; 
  if (percentage >= 100) fillColor = '#22c55e'; 
  else if (percentage >= 50) fillColor = '#eab308'; 

  return (
    <div className="progress-wrapper">
      <style jsx>{`
        .progress-wrapper { margin-top: 12px; width: 100%; }
        /* CORREÇÃO: Cor do texto do header */
        .progress-header { display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--color-text-muted); margin-bottom: 4px; font-weight: 600; }
        /* CORREÇÃO: Fundo da barra agora é dinâmico (escuro no dark mode) */
        .progress-track { width: 100%; height: 6px; background: var(--color-background); border-radius: 99px; overflow: hidden; }
        .progress-fill { 
          height: 100%; 
          border-radius: 99px; 
          transition: width 1s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.5s ease;
          background-image: linear-gradient(45deg,rgba(255,255,255,0.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,0.15) 50%,rgba(255,255,255,0.15) 75%,transparent 75%,transparent);
          background-size: 1rem 1rem;
        }
      `}</style>
      
      <div className="progress-header">
        <span>{percentage === 100 ? '🎉 Completo!' : percentage > 0 ? 'Em progresso' : 'Começar'}</span>
        <span>{percentage}%</span>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${width}%`, backgroundColor: fillColor }} />
      </div>
    </div>
  );
};

// --- TOAST DE DELETAR ---
const DeleteConfirmationToast = ({ t, onConfirm }: { t: any, onConfirm: () => void }) => {
  const [isExiting, setIsExiting] = useState(false);

  const handleCancel = () => {
    setIsExiting(true);
    setTimeout(() => { toast.dismiss(t.id); }, 300);
  };

  return (
    <div className={`delete-toast-card ${isExiting ? 'animate-out' : 'animate-in'}`}>
      <style jsx>{`
        .delete-toast-card {
          /* CORREÇÃO: Fundo e borda dinâmicos */
          background: var(--color-widget-bg);
          padding: 16px 20px;
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.15);
          border: 1px solid var(--color-border);
          display: flex; flex-direction: column; align-items: center; gap: 12px; min-width: 260px;
        }
        .animate-in { animation: enterAnimation 0.3s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
        .animate-out { animation: exitAnimation 0.3s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
        @keyframes enterAnimation { from { opacity: 0; transform: translateY(10px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes exitAnimation { from { opacity: 1; transform: translateY(0); } to { opacity: 0; transform: translateY(-20px); } }
        
        .toast-text { font-size: 0.95rem; color: var(--color-text); text-align: center; font-weight: 500; }
        .toast-actions { display: flex; gap: 10px; justify-content: center; width: 100%; }
        
        .btn-cancel { 
          background: var(--color-background); 
          color: var(--color-text); 
          border: 1px solid var(--color-border); 
          padding: 8px 16px; border-radius: 8px; cursor: pointer; font-weight: 600; transition: all 0.2s; 
        }
        .btn-cancel:hover { filter: brightness(0.9); }
        .btn-confirm { background: #ff4d4d; color: white; border: none; padding: 8px 16px; border-radius: 8px; cursor: pointer; font-weight: 600; box-shadow: 0 4px 10px rgba(255, 77, 77, 0.3); transition: all 0.2s; }
        .btn-confirm:hover { background: #ff3333; transform: translateY(-1px); }
      `}</style>
      <span className="toast-text">Todas as questões serão perdidas.</span>
      <div className="toast-actions">
        <button onClick={handleCancel} className="btn-cancel">Cancelar</button>
        <button onClick={() => { toast.dismiss(t.id); onConfirm(); }} className="btn-confirm">Apagar</button>
      </div>
    </div>
  );
};

// --- CARD PRINCIPAL ---
export function SortableNotebookCard({ notebook, onClick }: any) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(notebook.title);
  const [desc, setDesc] = useState(notebook.description || '');

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: notebook.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 999 : 1,
    position: 'relative' as 'relative',
  };

  const totalProblems = notebook.problems?.length || 0;
  const solvedProblems = notebook.problems?.filter((p: any) => p.solved).length || 0;

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast.custom((t) => (
      <DeleteConfirmationToast 
        t={t} 
        onConfirm={async () => {
          const loadingToast = toast.loading('Apagando...');
          const { error } = await supabase.from('notebooks').delete().eq('id', notebook.id);
          toast.dismiss(loadingToast);
          if (error) { toast.error('Erro: ' + error.message); } 
          else { toast.success('Caderno apagado!'); window.location.reload(); }
        }} 
      />
    ), { duration: 5000, position: 'top-center', style: { background: 'transparent', boxShadow: 'none' } });
  };

  const handleSave = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const savePromise = async () => {
      const { error } = await supabase.from('notebooks').update({ title, description: desc }).eq('id', notebook.id);
      if (error) throw new Error(error.message);
    };
    await toast.promise(savePromise(), {
      loading: 'Salvando...',
      success: () => { setIsEditing(false); router.refresh(); return 'Salvo!'; },
      error: (err: any) => `Erro: ${err.message}`,
    });
  };

  const handleCancelEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setTitle(notebook.title);
    setDesc(notebook.description);
    setIsEditing(false);
  };

  return (
    <>
      <style jsx>{`
        /* CORREÇÃO: Usando variáveis de cor para tudo */
        .notebook-card-polished { 
          display: flex; align-items: stretch; 
          background: var(--color-widget-bg); 
          border: 1px solid var(--color-border); 
          border-radius: 12px; margin-bottom: 12px; overflow: hidden; 
          box-shadow: 0 2px 4px rgba(0,0,0,0.05); transition: all 0.2s ease; 
        }
        .notebook-card-polished:hover { border-color: var(--color-primary); box-shadow: 0 4px 12px rgba(0,0,0,0.1); transform: translateY(-2px); }
        
        .drag-handle-zone { 
          padding: 0 12px; display: flex; align-items: center; cursor: grab; 
          color: var(--color-text-muted); 
          background: var(--color-background); /* Fundo escuro no dark mode */
          border-right: 1px solid var(--color-border); 
          transition: background 0.2s; touch-action: none; 
        }
        .drag-handle-zone:hover { background: var(--color-hover); color: var(--color-text); }
        
        .content-zone { flex: 1; padding: 16px; cursor: pointer; display: flex; flex-direction: column; } 
        
        h4 { margin: 0 0 6px 0; color: var(--color-text); font-weight: 600; font-size: 1.1rem; }
        p { margin: 0; color: var(--color-text-muted); font-size: 0.9rem; flex-grow: 1; }
        
        .meta-info { display: flex; gap: 12px; margin-top: 8px; font-size: 0.8rem; color: var(--color-text-muted); }
        
        .actions-zone { 
          display: flex; flex-direction: column; justify-content: center; padding: 8px; gap: 6px; 
          background: var(--color-widget-bg); 
          border-left: 1px solid var(--color-border); 
        }
        
        .icon-button { background: transparent; border: none; cursor: pointer; padding: 8px; border-radius: 50%; color: var(--color-text-muted); display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
        .icon-button:hover { background: var(--color-hover); color: var(--color-text); }
        .icon-button.danger:hover { background: rgba(220, 53, 69, 0.1); color: #d32f2f; }
        .icon-button.success:hover { background: rgba(40, 167, 69, 0.1); color: #2e7d32; }
        
        /* Inputs de Edição no Dark Mode */
        .edit-input { 
          width: 100%; 
          background: var(--color-background); 
          border: 1px solid var(--color-border); 
          color: var(--color-text); 
          padding: 8px; border-radius: 6px; outline: none; font-size: 0.95rem; 
        }
        .edit-input:focus { border-color: var(--color-primary); }
        .edit-input-title { font-weight: bold; margin-bottom: 8px; }
      `}</style>

      <div ref={setNodeRef} style={style} className="notebook-card-polished">
        <div className="drag-handle-zone" {...attributes} {...listeners} title="Segure aqui para arrastar" style={{ touchAction: 'none' }}> 
          <GripVertical size={20} /> 
        </div>

        <div className="content-zone" onClick={(e) => { if (!isEditing && onClick) onClick(e); }}>
          {isEditing ? (
            <div onClick={(e) => e.stopPropagation()}>
              <input value={title} onChange={e => setTitle(e.target.value)} className="edit-input edit-input-title" autoFocus placeholder="Nome"/>
              <input value={desc} onChange={e => setDesc(e.target.value)} className="edit-input" placeholder="Descrição..."/>
            </div>
          ) : (
            <>
              <h4>{title}</h4>
              <p>{desc || 'Sem descrição'}</p>
              <ProgressBar total={totalProblems} solved={solvedProblems} />
            </>
          )}
        </div>
        <div className="actions-zone">
          {isEditing ? (
            <> <button onClick={handleSave} className="icon-button success"><Check size={18}/></button> <button onClick={handleCancelEdit} className="icon-button danger"><X size={18}/></button> </>
          ) : (
            <> <button onClick={(e) => { e.stopPropagation(); setIsEditing(true); }} className="icon-button"><Pencil size={18}/></button> <button onClick={handleDelete} className="icon-button danger"><Trash2 size={18}/></button> </>
          )}
        </div>
      </div>
    </>
  );
}