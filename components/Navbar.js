import { useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";

export default function Navbar({ session }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-blue-600 text-white fixed top-0 w-full shadow-md z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-14">
          {/* Logo → se logado, leva para Inventário */}
          <Link 
            href={session ? "/contagem" : "/"} 
            className="font-bold text-lg flex items-center gap-1"
          >
            📦 App de Inventário
          </Link>

          {/* Menu desktop */}
          <div className="hidden md:flex gap-6">
            <Link href="/upload">Upload</Link>
            <Link href="/contagem">Inventário</Link>
            <Link href="/produtos">Cadastro Produto</Link>
            <Link href="/listar_produtos">Lista de Produtos</Link>
            <Link href="/relatorios">Relatórios</Link>
          </div>

          <div className="flex items-center gap-3">
            {/* Nome do usuário logado */}
            {session && (
              <span className="hidden md:block font-medium">
                👤 Logado como <b>{session.user?.name}</b>
              </span>
            )}

            {/* Botão sair */}
            {session && (
              <button
                onClick={() => signOut()}
                className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
              >
                Sair
              </button>
            )}
          </div>

          {/* Botão hamburguer no mobile */}
          <button
            className="md:hidden text-2xl ml-2"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      {menuOpen && (
        <div className="md:hidden bg-blue-700 px-4 pb-3 space-y-2">
          {session && (
            <p className="text-sm py-1">👤 {session.user?.name}</p>
          )}
          <Link href="/upload" className="block">Upload</Link>
          <Link href="/contagem" className="block">Inventário</Link>
          <Link href="/produtos" className="block">Cadastro Produto</Link>
          <Link href="/listar_produtos" className="block">Lista de Produtos</Link>
          <Link href="/relatorios" className="block">Relatórios</Link>
        </div>
      )}
    </nav>
  );
}