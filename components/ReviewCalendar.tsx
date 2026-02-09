'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

export default function ReviewCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [reviewCounts, setReviewCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  // Busca as revisões do mês atual
  useEffect(() => {
    async function fetchReviews() {
      setLoading(true);
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString();
      const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).toISOString();

      const { data, error } = await supabase
        .from('problems')
        .select('next_review_at')
        .gte('next_review_at', startOfMonth)
        .lte('next_review_at', endOfMonth)
        .eq('solved', true); // Apenas questões já resolvidas entram na revisão

      if (error) {
        console.error('Erro ao buscar revisões:', error);
      } else if (data) {
        // Agrupa por dia (YYYY-MM-DD)
        const counts: Record<string, number> = {};
        data.forEach((item: any) => {
          if (!item.next_review_at) return;
          const dateKey = item.next_review_at.split('T')[0];
          counts[dateKey] = (counts[dateKey] || 0) + 1;
        });
        setReviewCounts(counts);
      }
      setLoading(false);
    }

    fetchReviews();
  }, [currentDate]);

  // Navegação de Mês
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));

  // Geração do Grid do Calendário
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay(); // 0 = Domingo

  const days = [];
  // Espaços vazios antes do dia 1
  for (let i = 0; i < firstDayOfWeek; i++) {
    days.push(null);
  }
  // Dias do mês
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), i));
  }

  // Função para pegar a cor da bolinha baseada na quantidade
  const getDotColor = (count: number) => {
    if (count >= 10) return '#ef4444'; // Vermelho (Muitas)
    if (count >= 5) return '#f59e0b';  // Laranja (Médio)
    return '#22c55e';                  // Verde (Poucas)
  };

  const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

  return (
    <div className="calendar-widget">
      <style jsx>{`
        .calendar-widget {
          background-color: var(--color-widget-bg);
          border: 1px solid var(--color-border);
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
          min-height: 340px;
        }
        .header {
          display: flex; justify-content: space-between; align-items: center;
          margin-bottom: 1rem;
        }
        .header h3 { margin: 0; font-size: 1.1rem; color: var(--color-text); }
        .nav-btn {
          background: transparent; border: 1px solid var(--color-border);
          border-radius: 6px; padding: 4px; color: var(--color-text-muted);
          cursor: pointer; transition: all 0.2s;
          display: flex; align-items: center; justify-content: center;
        }
        .nav-btn:hover { background: var(--color-hover); color: var(--color-text); }
        
        .grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; }
        
        .weekday {
          text-align: center; font-size: 0.8rem; font-weight: 600;
          color: var(--color-text-muted); padding-bottom: 8px;
        }
        
        .day-cell {
          aspect-ratio: 1; /* Quadrado perfeito */
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          border-radius: 8px; font-size: 0.9rem; color: var(--color-text);
          position: relative; cursor: default;
          transition: background 0.2s;
        }
        .day-cell:hover:not(.empty) { background-color: var(--color-hover); }
        .day-cell.today { border: 1px solid var(--color-primary); font-weight: bold; color: var(--color-primary); }
        .day-cell.empty { pointer-events: none; }

        .dot-container {
          display: flex; gap: 2px; margin-top: 2px; height: 6px;
        }
        .dot {
          width: 6px; height: 6px; border-radius: 50%;
        }
        .review-count {
           font-size: 0.65rem; color: var(--color-text-muted); position: absolute; bottom: 2px;
        }
      `}</style>

      <div className="header">
        <h3>Previsão de Revisão</h3>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={prevMonth} className="nav-btn"><ChevronLeft size={16} /></button>
          <span style={{ fontSize: '0.95rem', fontWeight: 600, minWidth: '100px', textAlign: 'center', color: 'var(--color-text)' }}>
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </span>
          <button onClick={nextMonth} className="nav-btn"><ChevronRight size={16} /></button>
        </div>
      </div>

      <div className="grid">
        {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map(d => (
          <div key={d} className="weekday">{d}</div>
        ))}

        {days.map((date, i) => {
          if (!date) return <div key={i} className="day-cell empty" />;

          // Formata a data localmente para bater com a chave YYYY-MM-DD
          // Truque para evitar problemas de fuso horário ao converter para string
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          const dateKey = `${year}-${month}-${day}`;

          const count = reviewCounts[dateKey] || 0;
          const isToday = new Date().toDateString() === date.toDateString();

          return (
            <div key={i} className={`day-cell ${isToday ? 'today' : ''}`} title={count > 0 ? `${count} revisões` : ''}>
              <span>{date.getDate()}</span>
              
              {/* Bolinha de Revisão */}
              {count > 0 && (
                <div className="dot-container">
                   <div className="dot" style={{ backgroundColor: getDotColor(count) }} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}