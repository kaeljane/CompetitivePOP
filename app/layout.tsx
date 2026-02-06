import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar"; 
import { Toaster } from "react-hot-toast"; // <--- 1. Importação Adicionada

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });

export const metadata: Metadata = {
  title: "CompetitivePOP",
  description: "Dashboard de Programação Competitiva",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body className={inter.className}>
        
        {/* 2. O Toaster fica aqui, no topo, para cobrir tudo */}
        <Toaster 
          position="top-center" 
          reverseOrder={false}
          toastOptions={{
            // Estilo padrão (fundo escuro, texto branco)
            style: {
              background: '#333',
              color: '#fff',
              borderRadius: '8px',
              padding: '12px 16px',
            },
            // Estilo específico para Sucesso (Verde)
            success: {
              style: {
                background: '#edf7ed',
                color: '#1e4620',
                border: '1px solid #c8e6c9',
              },
              iconTheme: {
                primary: '#4caf50',
                secondary: '#fff',
              },
            },
            // Estilo específico para Erro (Vermelho)
            error: {
              style: {
                background: '#fdeded',
                color: '#5f2120',
                border: '1px solid #f5c6cb',
              },
              iconTheme: {
                primary: '#f44336',
                secondary: '#fff',
              },
            },
          }}
        />

        <div id="app">
          <Navbar />
          {children}
        </div>
      </body>
    </html>
  );
}