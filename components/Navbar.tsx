'use client'; 

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AuthButton from './AuthButton';
import { Brain } from 'lucide-react';
import ThemeToggle from './ThemeToggle'; // <--- 1. IMPORTAÇÃO NOVA
import styles from './Navbar.module.css';

export default function Navbar() {
  const pathname = usePathname(); 

  // Função para aplicar a classe 'active' se a rota bater
  const getLinkClass = (path: string) => {
    return pathname === path 
      ? `${styles.navItem} ${styles.active}` 
      : styles.navItem;
  };

  return (
    <header className={styles.header}>
      
      {/* 1. LOGO */}
      <Link href="/" className={styles.logoLink}>
        <svg className="hamburger-icon" viewBox="0 0 24 24" width="24" height="24">
           {/* 2. CORREÇÃO: fill="currentColor" faz o ícone ficar branco no escuro e preto no claro */}
           <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" fill="currentColor"></path>
        </svg>
        <div className={styles.logoText}>
          <span className={styles.highlight}>Competitive</span>POP
        </div>
      </Link>

      {/* 2. MENU */}
      <nav className={styles.navLinks}>
        
        {/* Dashboard */}
        <Link href="/" className={getLinkClass('/')}>
          Dashboard
        </Link>

        {/* Cadernos */}
        <Link href="/cadernos" className={getLinkClass('/cadernos')}>
          Cadernos
        </Link>

        {/* Revisão */}
        <Link href="/revisao" className={getLinkClass('/revisao')}>
          <Brain size={18} /> 
          Revisão
        </Link>

        {/* 3. NOVO: Botão de Tema (Lua/Sol) */}
        <div style={{ marginLeft: '5px' }}>
          <ThemeToggle />
        </div>

        {/* Login */}
        {/* 4. CORREÇÃO: Borda usando variável para não ficar "branca demais" no escuro */}
        <div style={{ marginLeft: '10px', paddingLeft: '15px', borderLeft: '1px solid var(--color-border)' }}>
            <AuthButton />
        </div>

      </nav>
    </header>
  );
}