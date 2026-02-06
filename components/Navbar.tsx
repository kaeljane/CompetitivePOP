'use client'; 

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AuthButton from './AuthButton'; // <--- 1. IMPORTAÇÃO NOVA

export default function Navbar() {
  const pathname = usePathname(); 

  return (
    <header className="app-header">
      
      {/* Logo (Mantido Igual) */}
      <Link href="/" style={{ textDecoration: 'none' }}>
        <div className="logo-container" style={{ cursor: 'pointer' }}>
          <svg className="hamburger-icon" viewBox="0 0 24 24">
            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path>
          </svg>
          <div className="logo-text">
            <span style={{ color: 'var(--color-primary)' }}>Competitive</span>POP
          </div>
        </div>
      </Link>

      <nav className="nav-links" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        
        {/* Botão Dashboard */}
        <Link href="/">
          <button 
            className={`nav-button ${pathname === '/' ? 'active' : ''}`}
          >
            Dashboard
          </button>
        </Link>

        {/* Botão Cadernos */}
        <Link href="/cadernos">
          <button 
            className={`nav-button ${pathname === '/cadernos' ? 'active' : ''}`}
          >
            Cadernos
          </button>
        </Link>

        {/* --- 2. ÁREA DE LOGIN (NOVO) --- */}
        {/* Adicionei uma margem e uma borda para separar visualmente */}
        <div style={{ marginLeft: '15px', paddingLeft: '15px', borderLeft: '1px solid rgba(255,255,255,0.2)' }}>
            <AuthButton />
        </div>

      </nav>
    </header>
  );
}