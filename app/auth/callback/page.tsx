'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabaseClient'; // Verifique se o caminho está certo

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    // O Supabase JS já faz a mágica de pegar o código da URL.
    // Nós só precisamos jogar o usuário para dentro do site.
    router.replace('/'); 
  }, [router]);

  return (
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: '#111',
      color: '#fff' 
    }}>
      <h2>Conectando com GitHub... 🚀</h2>
    </div>
  );
}