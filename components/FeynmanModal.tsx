'use client';

import { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react'; 

interface FeynmanModalProps {
  problem: any;
  onClose: () => void;
  onConfirm: (difficulty: 'Easy' | 'Medium' | 'Hard', text: string) => void;
}

export default function FeynmanModal({ problem, onClose, onConfirm }: FeynmanModalProps) {
  const [explanation, setExplanation] = useState('');
  const [isClosing, setIsClosing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 200);
  };

  const handleConfirmClick = (difficulty: 'Easy' | 'Medium' | 'Hard') => {
    if (!explanation.trim()) {
      alert("Por favor, digite algo no Método Feynman.");
      return;
    }
    setIsClosing(true);
    setTimeout(() => {
      onConfirm(difficulty, explanation);
    }, 200);
  };

  return (
    <div className={`modal-backdrop ${isClosing ? 'fade-out' : 'fade-in'}`} onClick={handleClose}>
      <style jsx>{`
        .modal-backdrop {
          position: fixed; top: 0; left: 0; width: 100%; height: 100%;
          background: rgba(0,0,0,0.5); z-index: 2000;
          display: flex; align-items: center; justify-content: center;
          padding: 20px;
        }
        .modal-content-animated {
          /* CORRIGIDO: Fundo agora usa a variável do tema */
          background: var(--color-widget-bg); 
          width: 100%; max-width: 500px;
          border-radius: 12px; padding: 20px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.2);
          transform: scale(0.95); opacity: 0;
        }

        .fade-in { animation: fadeIn 0.2s forwards; }
        .fade-in .modal-content-animated { animation: popIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

        .fade-out { animation: fadeOut 0.2s forwards; }
        .fade-out .modal-content-animated { animation: popOut 0.2s forwards; }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }

        @keyframes popIn {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes popOut {
          from { opacity: 1; transform: scale(1); }
          to { opacity: 0; transform: scale(0.95) translateY(10px); }
        }

        .btn-option {
          flex: 1; padding: 12px; border-radius: 8px; border: none;
          color: white; font-weight: bold; cursor: pointer;
          transition: transform 0.1s;
        }
        .btn-option:active { transform: scale(0.96); }
      `}</style>

      <div className="modal-content-animated" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          {/* CORRIGIDO: Cor do título */}
          <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--color-text)' }}>🎉 Concluir: {problem.title}</h3>
          <button onClick={handleClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
            {/* CORRIGIDO: Cor do ícone X */}
            <X size={24} color="var(--color-text-muted)" />
          </button>
        </div>

        {/* CORRIGIDO: Cor do texto da pergunta */}
        <p style={{ marginBottom: '8px', fontWeight: 600, color: 'var(--color-text-muted)' }}>Método Feynman (Explique para aprender):</p>
        <textarea
          ref={textareaRef}
          value={explanation}
          onChange={(e) => setExplanation(e.target.value)}
          placeholder="Explique a solução com suas palavras..."
          style={{
            width: '100%', height: '120px', padding: '12px',
            borderRadius: '8px', fontFamily: 'inherit',
            fontSize: '1rem', resize: 'vertical', marginBottom: '20px',
            /* CORRIGIDO: Cores do campo de texto */
            backgroundColor: 'var(--color-background)',
            color: 'var(--color-text)',
            border: '1px solid var(--color-border)',
          }}
        />

        {/* CORRIGIDO: Cor do texto da pergunta */}
        <p style={{ marginBottom: '10px', fontWeight: 600, color: 'var(--color-text-muted)' }}>Como foi a dificuldade?</p>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => handleConfirmClick('Hard')} className="btn-option" style={{ background: '#ff4d4d' }}>
            Difícil (1 dia)
          </button>
          <button onClick={() => handleConfirmClick('Medium')} className="btn-option" style={{ background: '#ffa502' }}>
            Médio (3 dias)
          </button>
          <button onClick={() => handleConfirmClick('Easy')} className="btn-option" style={{ background: '#2ecc71' }}>
            Fácil (7 dias)
          </button>
        </div>
      </div>
    </div>
  );
}