'use client';

import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { supabase } from '../lib/supabaseClient'; 
import { GripVertical, Pencil, Trash2, Check, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast'; 

// --- NOVO COMPONENTE DO TOAST (Para gerenciar a animação) ---
const DeleteConfirmationToast = ({ t, onConfirm }: { t: any, onConfirm: () => void }) => {
  const [isExiting, setIsExiting] = useState(false);

  const handleCancel = () => {
    // 1. Ativa a animação de saída
    setIsExiting(true);
    // 2. Espera a animação terminar (300ms) antes de remover do DOM
    setTimeout(() => {
      toast.dismiss(t.id);
    }, 300);
  };

  return (
    <div className={`delete-toast-card ${isExiting ? 'animate-out' : 'animate-in'}`}>
      {/* Estilos CSS Inline para garantir o funcionamento nesse componente isolado */}
      <style jsx>{`
        .delete-toast-card {
          background: #ffffff;
          padding: 16px 20px;
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.15);
          border: 1px solid #f0f0f0;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          min-width: 260px;
          transform-origin: center;
        }

        /* Animação de Entrada (Suave) */
        .animate-in {
          animation: enterAnimation 0.3s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }

        /* Animação de Saída (Sobe para cima e desaparece) */
        .animate-out {
          animation: exitAnimation 0.3s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }

        @keyframes enterAnimation {
          from { opacity: 0; transform: translateY(10px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        @keyframes exitAnimation {
          from { opacity: 1; transform: translateY(0); }
          to { opacity: 0; transform: translateY(-20px); } /* Sobe 20px */
        }

        .toast-text { font-size: 0.95rem; color: #444; text-align: center; font-weight: 500; }
        
        .toast-actions { display: flex; gap: 10px; justify-content: center; width: 100%; }
        
        .btn-cancel {
          background: #f5f5f5; color: #333; border: 1px solid #e0e0e0;
          padding: 8px 16px; border-radius: 8px; cursor: pointer; font-weight: 600;
          transition: all 0.2s;
        }
        .btn-cancel:hover { background: #eeeeee; }

        .btn-confirm {
          background: #ff4d4d; color: white; border: none;
          padding: 8px 16px; border-radius: 8px; cursor: pointer; font-weight: 600;
          box-shadow: 0 4px 10px rgba(255, 77, 77, 0.3);
          transition: all 0.2s;
        }
        .btn-confirm:hover { background: #ff3333; transform: translateY(-1px); }
      `}</style>

      <span className="toast-text">Todas as questões serão perdidas.</span>
      <div className="toast-actions">
        <button onClick={handleCancel} className="btn-cancel">
          Cancelar
        </button>
        <button 
          onClick={() => {
            toast.dismiss(t.id);
            onConfirm();
          }} 
          className="btn-confirm"
        >
          Apagar
        </button>
      </div>
    </div>
  );
};

// --- SEU COMPONENTE PRINCIPAL ---
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

  // --- LÓGICA DE APAGAR ---
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Chama o Toast Customizado passando a lógica de confirmação
    toast.custom((t) => (
      <DeleteConfirmationToast 
        t={t} 
        onConfirm={async () => {
          const loadingToast = toast.loading('Apagando...');
          const { error } = await supabase.from('notebooks').delete().eq('id', notebook.id);
          toast.dismiss(loadingToast);
          
          if (error) {
            toast.error('Erro: ' + error.message);
          } else {
            toast.success('Caderno apagado!');
            // Idealmente use router.refresh() ou invalide o cache ao invés de reload total, 
            // mas mantive reload conforme seu código original
            window.location.reload(); 
          }
        }} 
      />
    ), { 
      duration: 5000, 
      position: 'top-center',
      // Removemos o estilo padrão daqui para controlar tudo dentro do componente DeleteConfirmationToast
      style: { background: 'transparent', boxShadow: 'none' } 
    });
  };

  // --- LÓGICA DE SALVAR ---
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
        .notebook-card-polished { display: flex; align-items: stretch; background: #ffffff; border: 1px solid #e1e4e8; border-radius: 12px; margin-bottom: 12px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.05); transition: all 0.2s ease; }
        .notebook-card-polished:hover { border-color: #0070f3; box-shadow: 0 4px 12px rgba(0,112,243,0.15); transform: translateY(-2px); }
        
        .drag-handle-zone { 
          padding: 0 12px; display: flex; align-items: center; cursor: grab; 
          color: #999; background: #f8f9fa; border-right: 1px solid #eee; transition: background 0.2s;
          touch-action: none; 
        }
        
        .drag-handle-zone:hover { background: #f0f0f0; color: #555; }
        .content-zone { flex: 1; padding: 16px; cursor: pointer; } 
        h4 { margin: 0 0 6px 0; color: #111; font-weight: 600; }
        p { margin: 0; color: #666; font-size: 0.9rem; }
        .meta-info { display: flex; gap: 12px; margin-top: 12px; font-size: 0.8rem; color: #888; }
        .actions-zone { display: flex; flex-direction: column; justify-content: center; padding: 8px; gap: 6px; background: #ffffff; border-left: 1px solid #f0f0f0; }
        .icon-button { background: transparent; border: none; cursor: pointer; padding: 8px; border-radius: 50%; color: #888; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
        .icon-button:hover { background: #f5f5f5; color: #333; }
        .icon-button.danger:hover { background: #fff0f0; color: #d32f2f; }
        .icon-button.success:hover { background: #e8f5e9; color: #2e7d32; }
        .edit-input { width: 100%; background: #fff; border: 1px solid #ddd; color: #333; padding: 8px; border-radius: 6px; outline: none; font-size: 0.95rem; }
        .edit-input:focus { border-color: #0070f3; box-shadow: 0 0 0 2px rgba(0,112,243,0.1); }
        .edit-input-title { font-weight: bold; margin-bottom: 8px; }
      `}</style>

      <div ref={setNodeRef} style={style} className="notebook-card-polished">
        <div 
          className="drag-handle-zone" 
          {...attributes} 
          {...listeners} 
          title="Segure aqui para arrastar"
          style={{ touchAction: 'none' }} 
        > 
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
              <div className="meta-info">
                <span>📚 {notebook.problems?.length || 0} questões</span>
                {notebook.problems?.some((p:any) => p.solved) && (
                  <span style={{color: '#2e7d32', fontWeight: 'bold', display:'flex', alignItems:'center', gap:'4px'}}> <Check size={14} /> {notebook.problems.filter((p:any) => p.solved).length} feitas </span>
                )}
              </div>
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