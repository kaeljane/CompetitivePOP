import { createClient } from "../../lib/supabaseServer";
import Link from "next/link";
import ReviewCard from "../../components/ReviewCard"; // <--- Importamos o novo componente

export const revalidate = 0; // Garante que a página sempre busque dados novos

export default async function RevisaoPage() {
  const supabase = await createClient();
  const now = new Date().toISOString();

  // Busca questões resolvidas (solved=true) ONDE a data de revisão é MENOR ou IGUAL a agora.
  const { data: reviews } = await supabase
    .from('problems')
    .select('*, notebooks(title)') // Traz o título do caderno junto
    .eq('solved', true)
    .lte('next_review_at', now)
    .order('next_review_at', { ascending: true });

  return (
    <>
      <div id="page-header-container">
        <div className="page-header">
          <h2>Revisão Espaçada</h2>
          <p style={{color: '#666', marginTop: '4px'}}>
            {reviews && reviews.length > 0 
              ? `${reviews.length} questões precisam da sua atenção hoje.` 
              : "Tudo limpo por hoje!"}
          </p>
        </div>
      </div>

      <div className="container" style={{ display: 'block' }}>
        {reviews && reviews.length > 0 ? (
          <div className="notebook-grid">
            {/* Aqui renderizamos o componente inteligente para cada questão */}
            {reviews.map((prob) => (
              <ReviewCard key={prob.id} problem={prob} />
            ))}
          </div>
        ) : (
          // Tela de "Tudo Limpo"
          <div style={{textAlign: 'center', padding: '60px 20px', color: '#888'}}>
            <div style={{fontSize: '3rem', marginBottom: '10px'}}>🎉</div>
            <h3>Tudo em dia!</h3>
            <p>Você revisou todas as pendências. Ótimo trabalho!</p>
            <Link href="/cadernos">
              <button className="btn btn-primary" style={{marginTop: '20px'}}>
                Voltar aos Cadernos
              </button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}