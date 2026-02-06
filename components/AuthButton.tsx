'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function AuthButton() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    // 1. Checa se já tem alguém logado ao carregar
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };
    checkUser();

    // 2. O VIGIA: Fica observando se alguém entra ou sai
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);

      // --- A MÁGICA ACONTECE AQUI ---
      // Se o usuário ACABOU de entrar ('SIGNED_IN') ou sair ('SIGNED_OUT'),
      // forçamos o Next.js a recarregar os dados da página (Dashboard).
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
        router.refresh(); 
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const handleLogin = async () => {
    // Pega a URL atual para garantir que volta pro lugar certo
    const siteUrl = window.location.origin;
    
    await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: { 
        redirectTo: `${siteUrl}/auth/callback` 
      },
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    // O router.refresh() lá em cima vai lidar com a atualização da tela
  };

  if (!user) {
    // Versão Deslogado
    return (
      <button 
        onClick={handleLogin}
        style={{ 
          background: '#24292e', 
          color: 'white', 
          border: 'none', 
          padding: '8px 16px', 
          borderRadius: '20px',
          cursor: 'pointer',
          fontWeight: 'bold',
          fontSize: '0.9rem',
          display: 'flex', alignItems: 'center', gap: '8px'
        }}
      >
        <svg height="20" viewBox="0 0 16 16" width="20" fill="white"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path></svg>
        Entrar
      </button>
    );
  }

  // Versão Logado
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
      <img 
        src={user.user_metadata.avatar_url} 
        alt="Perfil" 
        title={`Logado como ${user.user_metadata.user_name}`}
        style={{ width: '36px', height: '36px', borderRadius: '50%', border: '2px solid #28a745' }}
      />
      <button 
        onClick={handleLogout}
        style={{ background: 'none', border: 'none', color: '#ff4d4d', cursor: 'pointer', fontWeight: 'bold' }}
      >
        Sair
      </button>
    </div>
  );
}