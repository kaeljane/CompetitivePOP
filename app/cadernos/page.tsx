import { supabase } from "../../lib/supabaseClient";
import NotebookList from "../../components/NotebookList";

export const revalidate = 0;
export const dynamic = 'force-dynamic';

const CODEFORCES_TAGS = [
  "implementation", "math", "greedy", "dp", "data structures",
  "brute force", "constructive algorithms", "graphs", "sortings",
  "binary search", "dfs and similar", "trees", "strings",
  "number theory", "combinatorics", "geometry", "bitmasks",
  "two pointers", "dsu", "shortest paths", "probabilities",
  "divide and conquer", "hashing", "games", "flows",
  "interactive", "matrices", "string suffix structures",
  "fft", "graph matchings", "ternary search",
  "expression parsing", "meet-in-the-middle", "2-sat",
  "chinese remainder theorem", "schedules"
];

export default async function NotebooksPage() {
  // Busca cadernos E suas questões
  const { data: notebooks } = await supabase
    .from('notebooks')
    .select('*, problems(*)')
    .order('created_at', { ascending: false });

  // Renderiza o componente "inteligente" que tem a pesquisa
  return (
    <NotebookList 
      notebooks={notebooks || []} 
      allTags={CODEFORCES_TAGS} 
    />
  );
}