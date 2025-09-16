import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-blue-600 p-4 flex items-center justify-between relative">
      <div className="text-white font-bold">📦 App de Inventário</div>

      {/* Menu desktop */}
      <div className="hidden md:flex space-x-6 text-white">
        <Link href="/" className="hover:underline">Home</Link> {/* 👈 novo */}
        <Link href="/upload" className="hover:underline">Upload</Link>
        <Link href="/download" className="hover:underline">Download</Link>
        <Link href="/contagem" className="hover:underline">Inventário</Link>
        <Link href="/produtos" className="hover:underline">Cadastro Produto</Link>
        <Link href="/lista" className="hover:underline">Lista de Produtos</Link>
        <Link href="/relatorios" className="hover:underline">Relatórios</Link>
      </div>

      {/* Botão mobile */}
      <button
        className="md:hidden text-white focus:outline-none"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        ☰
      </button>

      {/* Menu mobile */}
      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-blue-700 flex flex-col text-white md:hidden z-50">
          <Link href="/" onClick={() => setMenuOpen(false)} className="px-4 py-2 border-b">Home</Link>
          <Link href="/upload" onClick={() => setMenuOpen(false)} className="px-4 py-2 border-b">Upload</Link>
          <Link href="/download" onClick={() => setMenuOpen(false)} className="px-4 py-2 border-b">Download</Link>
          <Link href="/contagem" onClick={() => setMenuOpen(false)} className="px-4 py-2 border-b">Inventário</Link>
          <Link href="/produtos" onClick={() => setMenuOpen(false)} className="px-4 py-2 border-b">Cadastro Produto</Link>
          <Link href="/lista" onClick={() => setMenuOpen(false)} className="px-4 py-2 border-b">Lista de Produtos</Link>
          <Link href="/relatorios" onClick={() => setMenuOpen(false)} className="px-4 py-2">Relatórios</Link>
        </div>
      )}
    </nav>
  );
}