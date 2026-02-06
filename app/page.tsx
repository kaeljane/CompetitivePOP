import { createClient } from "../lib/supabaseServer"; // <--- Importando do NOVO arquivo
import TopicChart from "../components/TopicChart";

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export default async function Home() {
  // 1. Cria o cliente Supabase usando a nova biblioteca
  const supabase = await createClient();

  // 2. Busca os dados (igual antes)
  const { data: notebooks } = await supabase.from('notebooks').select('id');
  const { data: problems } = await supabase.from('problems').select('tags');

  const totalNotebooks = notebooks?.length || 0;
  const totalProblems = problems?.length || 0;
  
  let mostCommonTag = "N/A";
  if (problems && problems.length > 0) {
    const counts: Record<string, number> = {};
    problems.forEach(p => p.tags?.forEach((t: string) => counts[t] = (counts[t] || 0) + 1));
    mostCommonTag = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b, "N/A");
  }

  return (
    <>
      <div id="page-header-container">
        <div className="page-header">
          <h2>Dashboard de Performance</h2>
        </div>
      </div>

      <div className="container">
        
        {/* Área Principal: GRÁFICO */}
        <main>
           <div className="widget">
             <h3>Análise de Tópicos (Weakness Panel)</h3>
             <p style={{marginBottom: '1rem', color: '#666'}}>Contagem de tags de todos os seus cadernos</p>
             <div className="chart-container">
               <TopicChart problems={problems || []} />
             </div>
          </div>
        </main>

        {/* Sidebar: ESTATÍSTICAS RÁPIDAS */}
        <aside>
          <div className="widget quick-stats">
            <h3>Estatísticas Rápidas</h3>
            
            <div className="stat-item">
              <span className="stat-value">{totalNotebooks}</span>
              <span className="stat-label">Cadernos Criados</span>
            </div>
            
            <div className="stat-item">
              <span className="stat-value">{totalProblems}</span>
              <span className="stat-label">Questões Salvas</span>
            </div>
            
            <div className="stat-item">
              <span className="stat-value" style={{ textTransform: 'uppercase' }}>{mostCommonTag}</span>
              <span className="stat-label">Tag Mais Comum</span>
            </div>
          </div>
        </aside>
        
      </div>
    </>
  );
}