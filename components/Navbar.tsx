'use client'; 

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AuthButton from './AuthButton';
import { Brain } from 'lucide-react';
// Importa o módulo CSS que acabamos de criar
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
           <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" fill="#333"></path>
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

        {/* Login */}
        <div style={{ marginLeft: '10px', paddingLeft: '15px', borderLeft: '1px solid #eaeaea' }}>
            <AuthButton />
        </div>

      </nav>
    </header>
  );
}