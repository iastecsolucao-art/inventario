import { useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";

export default function Navbar({ session }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-blue-600 text-white fixed top-0 w-full shadow-md z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-14">
          {/* Logo */}
          <Link href="/" className="font-bold text-lg flex items-center gap-1">
            📦 App de Inventário
          </Link>

          {/* Menu desktop */}
          <div className="hidden md:flex gap-6">
            <Link href="/upload">Upload</Link>
            <Link href="/contagem">Inventário</Link>
            <Link href="/produtos">Cadastro Produto</Link>
            <Link href="/listar_produtos">Lista de Produtos</Link>
          </div>

          {/* Botão sair */}
          {session && (
            <button
              onClick={() => signOut()}
              className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
            >
              Sair
            </button>
          )}

          {/* Botão hamburguer no mobile */}
          <button
            className="md:hidden text-2xl"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      {menuOpen && (
        <div className="md:hidden bg-blue-700 px-4 pb-3 space-y-2">
          <Link href="/upload" className="block">Upload</Link>
          <Link href="/contagem" className="block">Inventário</Link>
          <Link href="/produtos" className="block">Cadastro Produto</Link>
          <Link href="/listar_produtos" className="block">Lista de Produtos</Link>
        </div>
      )}
    </nav>
  );
}