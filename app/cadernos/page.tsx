// 1. Mudamos a importação para o novo arquivo que sabe ler cookies
import { createClient } from "../../lib/supabaseServer"; 
import NotebookList from "../../components/NotebookList";

export const revalidate = 0;
export const dynamic = 'force-dynamic';

const CODEFORCES_TAGS = [
  "None", "implementation", "math", "greedy", "dp", "data structures",
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
  // 2. Inicializamos o cliente autenticado
  const supabase = await createClient();

  // O resto da lógica continua igual, mas agora o banco sabe que é VOCÊ!
  const { data: notebooks } = await supabase
    .from('notebooks')
    .select('*, problems(*)')
    .order('position', { ascending: true })
    .order('created_at', { foreignTable: 'problems', ascending: true });

  return (
    <NotebookList 
      notebooks={notebooks || []} 
      allTags={CODEFORCES_TAGS} 
    />
  );
}