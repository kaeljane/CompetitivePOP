import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Esse cliente cria os cookies automaticamente no navegador!
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)