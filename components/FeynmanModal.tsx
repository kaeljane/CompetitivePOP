'use client';

import { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react'; // Certifique-se de ter importado ou use SVG

interface FeynmanModalProps {
  problem: any;
  onClose: () => void;
  onConfirm: (difficulty: 'Easy' | 'Medium' | 'Hard', text: string) => void;
}

export default function FeynmanModal({ problem, onClose, onConfirm }: FeynmanModalProps) {
  // Estado local: SÓ este componente renderiza ao digitar
  const [explanation, setExplanation] = useState('');
  const [isClosing, setIsClosing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Foco automático ao abrir
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  // Função para fechar com animação
  const handleClose = () => {
    setIsClosing(true);
    // Espera a animação de saída (200ms) terminar antes de remover do DOM
    setTimeout(() => {
      onClose();
    }, 200);
  };

  // Função ao confirmar
  const handleConfirmClick = (difficulty: 'Easy' | 'Medium' | 'Hard') => {
    if (!explanation.trim()) {
      alert("Por favor, digite algo no Método Feynman.");
      return;
    }
    // 1. Inicia animação de saída
    setIsClosing(true);
    
    // 2. Aguarda animação e manda os dados para o pai
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
          background: white; width: 100%; max-width: 500px;
          border-radius: 12px; padding: 20px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.2);
          transform: scale(0.95); opacity: 0;
        }

        /* Animações de Entrada */
        .fade-in { animation: fadeIn 0.2s forwards; }
        .fade-in .modal-content-animated { animation: popIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

        /* Animações de Saída */
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
          <h3 style={{ margin: 0, fontSize: '1.2rem' }}>🎉 Concluir: {problem.title}</h3>
          <button onClick={handleClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
            <X size={24} color="#666" />
          </button>
        </div>

        <p style={{ marginBottom: '8px', fontWeight: 600, color: '#444' }}>Método Feynman (Explique para aprender):</p>
        <textarea
          ref={textareaRef}
          value={explanation}
          onChange={(e) => setExplanation(e.target.value)}
          placeholder="Explique a solução com suas palavras..."
          style={{
            width: '100%', height: '120px', padding: '12px',
            borderRadius: '8px', border: '1px solid #ddd', fontFamily: 'inherit',
            fontSize: '1rem', resize: 'vertical', marginBottom: '20px'
          }}
        />

        <p style={{ marginBottom: '10px', fontWeight: 600, color: '#444' }}>Como foi a dificuldade?</p>
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