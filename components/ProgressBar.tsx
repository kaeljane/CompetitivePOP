'use client';

import React, { useEffect, useState } from 'react';

interface ProgressBarProps {
  total: number;
  solved: number;
}

export default function ProgressBar({ total, solved }: ProgressBarProps) {
  const [width, setWidth] = useState(0);

  // Calcula a porcentagem segura (evita divisão por zero)
  const percentage = total > 0 ? Math.round((solved / total) * 100) : 0;

  // Anima a barra ao carregar
  useEffect(() => {
    // Pequeno delay para o olho humano perceber a animação subindo
    const timer = setTimeout(() => setWidth(percentage), 100);
    return () => clearTimeout(timer);
  }, [percentage]);

  // Define a cor baseada no progresso (Gamificação visual)
  const getColor = () => {
    if (percentage === 100) return '#4ade80'; // Verde Sucesso (Tailwind green-400)
    if (percentage >= 50) return '#facc15';   // Amarelo Ouro (Tailwind yellow-400)
    return '#f87171';                         // Vermelho Suave (Tailwind red-400)
  };

  return (
    <div className="progress-container">
      <style jsx>{`
        .progress-container {
          width: 100%;
          margin-top: 12px;
        }
        
        .header {
          display: flex;
          justify-content: space-between;
          font-size: 0.75rem;
          color: #666;
          margin-bottom: 4px;
          font-weight: 600;
        }

        .bar-bg {
          width: 100%;
          height: 8px;
          background-color: #e5e7eb; /* Cinza claro */
          border-radius: 99px;
          overflow: hidden;
          position: relative;
        }

        .bar-fill {
          height: 100%;
          background-color: ${getColor()};
          border-radius: 99px;
          transition: width 1s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.5s ease;
          position: relative;
          
          /* O SEGREDO DA ANIMAÇÃO (SHIMMER) */
          background-image: linear-gradient(
            45deg, 
            rgba(255,255,255,0.15) 25%, 
            transparent 25%, 
            transparent 50%, 
            rgba(255,255,255,0.15) 50%, 
            rgba(255,255,255,0.15) 75%, 
            transparent 75%, 
            transparent
          );
          background-size: 20px 20px;
          animation: moveStripes 1s linear infinite;
        }

        @keyframes moveStripes {
          from { background-position: 0 0; }
          to { background-position: 20px 0; }
        }
      `}</style>

      <div className="header">
        <span>
          {percentage === 100 ? '🎉 Completo!' : 
           percentage >= 50 ? '🔥 Continue assim!' : 
           '🚀 Vamos começar'}
        </span>
        <span>{percentage}% ({solved}/{total})</span>
      </div>

      <div className="bar-bg">
        <div 
          className="bar-fill" 
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}