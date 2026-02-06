import { supabase } from "../../lib/supabaseClient";
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
  // --- MUDANÇA IMPORTANTE AQUI ---
  // Trocamos .order('created_at', ...) por .order('position', { ascending: true })
  // Isso garante que o site obedeça a ordem que você salvou ao arrastar.
  const { data: notebooks } = await supabase
    .from('notebooks')
    .select('*, problems(*)')
    .order('position', { ascending: true }); 

  return (
    <NotebookList 
      notebooks={notebooks || []} 
      allTags={CODEFORCES_TAGS} 
    />
  );
}