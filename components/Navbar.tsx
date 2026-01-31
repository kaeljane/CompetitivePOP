'use client'; // Necessário para saber em qual página estamos

import Link from 'next/link';
import { usePathname } from 'next/navigation'; // Hook para pegar a URL atual

export default function Navbar() {
  const pathname = usePathname(); // Ex: "/" ou "/cadernos"

  return (
    <header className="app-header">
      
      {/* Detalhe Extra: Clicar no Logo agora leva para o Dashboard (Home) */}
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

      <nav className="nav-links" style={{ display: 'flex', gap: '10px' }}>
        
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

      </nav>
    </header>
  );
}