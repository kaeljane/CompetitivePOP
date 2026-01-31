import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar"; 

// Configuração da fonte Inter que seu CSS pede
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
        {/* Adicionamos o ID="app" que seu CSS exige para o layout funcionar */}
        <div id="app">
          <Navbar />
          {children}
        </div>
      </body>
    </html>
  );
}