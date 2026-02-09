import { createClient } from "../../lib/supabaseServer";
import Link from "next/link";
import ReviewCard from "../../components/ReviewCard"; 
import ReviewCalendar from "../../components/ReviewCalendar";
import { Trophy } from "lucide-react"; 

export const revalidate = 0; 

export default async function RevisaoPage() {
  const supabase = await createClient();
  const now = new Date().toISOString();

  // 1. Busca questões pendentes para revisar HOJE
  const { data: reviews } = await supabase
    .from('problems')
    .select('*, notebooks(title)') 
    .eq('solved', true)
    .lte('next_review_at', now)
    .order('next_review_at', { ascending: true });

  // 2. CORREÇÃO AQUI:
  // Em vez de contar quantas questões existem (.count), 
  // chamamos a função RPC que SOMA o contador de revisões de cada uma.
  const { data: totalReviewsSum } = await supabase.rpc('get_total_reviews_sum');

  return (
    <div style={{ padding: '0 2rem', maxWidth: '1600px', margin: '0 auto' }}>
      
      {/* CABEÇALHO */}
      <div style={{ padding: '2rem 0', borderBottom: '1px solid var(--color-border)', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.8rem', color: 'var(--color-text)' }}>Revisão Espaçada</h2>
        <p style={{ color: 'var(--color-text-muted)', marginTop: '4px' }}>
            {reviews && reviews.length > 0 
              ? `Você tem ${reviews.length} cartões para revisar hoje.` 
              : "Nenhuma revisão pendente para agora."}
        </p>
      </div>

      {/* LAYOUT GRID */}
      <div className="review-page-grid">
        <style>{`
          .review-page-grid {
            display: grid;
            grid-template-columns: 1fr 340px; 
            gap: 2rem;
            align-items: start;
            width: 100%;
          }

          .right-sidebar {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
            position: sticky;
            top: 2rem;
          }

          /* Widget Azul com Troféu */
          .stats-widget {
            background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
            border-radius: 12px;
            padding: 1.5rem;
            color: white;
            box-shadow: 0 10px 25px -5px rgba(59, 130, 246, 0.5);
            display: flex;
            align-items: center;
            justify-content: space-between;
          }

          .empty-state {
            background-color: var(--color-widget-bg);
            border: 1px solid var(--color-border);
            border-radius: 12px;
            padding: 4rem 2rem;
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 400px;
          }

          @media (max-width: 1000px) {
            .review-page-grid { grid-template-columns: 1fr; }
            .right-sidebar { position: static; }
          }
        `}</style>

        {/* --- COLUNA ESQUERDA --- */}
        <div className="main-content">
          {reviews && reviews.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {reviews.map((prob) => (
                <ReviewCard key={prob.id} problem={prob} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--color-text)' }}>Tudo em dia!</h3>
              <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
                Você zerou suas pendências. Aproveite para descansar ou adiantar matéria.
              </p>
              <Link href="/cadernos">
                <button className="btn btn-primary" style={{ padding: '0.8rem 2rem' }}>
                  Explorar Cadernos
                </button>
              </Link>
            </div>
          )}
        </div>

        {/* --- COLUNA DIREITA --- */}
        <aside className="right-sidebar">
          
          {/* WIDGET CORRIGIDO */}
          <div className="stats-widget">
            <div>
              <p style={{ fontSize: '0.9rem', opacity: 0.9, marginBottom: '4px' }}>Total</p>
              {/* Agora mostra a soma acumulada (deve ser 0 inicialmente) */}
              <h2 style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: 1 }}>{totalReviewsSum || 0}</h2>
              <p style={{ fontSize: '0.85rem', opacity: 0.9, fontWeight: 500 }}>Revisões Feitas</p>
            </div>
            <Trophy size={48} style={{ opacity: 0.2 }} />
          </div>

          <ReviewCalendar />

        </aside>

      </div>
    </div>
  );
}