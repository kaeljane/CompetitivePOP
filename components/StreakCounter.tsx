'use client';

import { Flame } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function StreakCounter() {
  const [streak, setStreak] = useState(0);
  const [isActiveToday, setIsActiveToday] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStreak();
    
    // Ouve alterações no banco em tempo real (Se você resolver, atualiza na hora)
    const channel = supabase
      .channel('streak-updates')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'profiles' }, (payload: any) => {
        if (payload.new) {
            setStreak(payload.new.current_streak);
            checkIfActive(payload.new.last_solved_at);
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  async function fetchStreak() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('profiles')
      .select('current_streak, last_solved_at')
      .eq('id', user.id)
      .single();

    if (data) {
      setStreak(data.current_streak || 0);
      checkIfActive(data.last_solved_at);
    }
    setLoading(false);
  }

  function checkIfActive(lastDateString: string) {
    if (!lastDateString) return setIsActiveToday(false);
    
    // Cria datas comparáveis (ignorando horário, foco no dia local)
    const lastDate = new Date(lastDateString).toDateString();
    const today = new Date().toDateString();
    
    setIsActiveToday(lastDate === today);
  }

  if (loading) return null; // Não mostra nada enquanto carrega

  return (
    <div 
      className="streak-container"
      title={isActiveToday ? "🔥 Ofensiva ativa! Você é uma máquina!" : "⚠️ Resolva uma questão para não perder a ofensiva!"}
    >
      <style jsx>{`
        .streak-container {
          display: flex; align-items: center; gap: 6px;
          padding: 6px 12px; border-radius: 20px;
          border: 1px solid ${isActiveToday ? 'rgba(249, 115, 22, 0.3)' : 'var(--color-border)'};
          background-color: ${isActiveToday ? 'rgba(249, 115, 22, 0.1)' : 'var(--color-background)'};
          transition: all 0.3s ease;
          cursor: help;
        }
        .fire-icon {
          color: ${isActiveToday ? '#f97316' : 'var(--color-text-muted)'}; /* Laranja ou Cinza */
          filter: ${isActiveToday ? 'drop-shadow(0 0 4px #f97316)' : 'none'};
          animation: ${isActiveToday ? 'pulse 2s infinite' : 'none'};
        }
        .streak-count {
          font-weight: 700; font-family: monospace; font-size: 1rem;
          color: ${isActiveToday ? '#f97316' : 'var(--color-text-muted)'};
        }
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>

      <Flame size={20} className="fire-icon" fill={isActiveToday ? "currentColor" : "none"} />
      <span className="streak-count">{streak}</span>
    </div>
  );
}