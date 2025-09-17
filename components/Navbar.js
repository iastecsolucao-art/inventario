import Link from "next/link";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: session } = useSession();

  // 🔹 Verifica expiração
  const expirado =
    session?.user?.expiracao &&
    new Date(session.user.expiracao) < new Date();

  return (
    <nav className="bg-blue-600 p-4 flex items-center justify-between relative">
      <div className="text-white font-bold">📦 App IasTec</div>

      {/* Menu desktop */}
      {session && !expirado && (
        <div className="hidden md:flex space-x-6 text-white items-center">
          <Link href="/" className="hover:underline">Home</Link>
          <Link href="/upload" className="hover:underline">Upload</Link>
          <Link href="/download" className="hover:underline">Download</Link>
          <Link href="/contagem" className="hover:underline">Inventário</Link>
          <Link href="/produtos" className="hover:underline">Cadastro Produto</Link>
          <Link href="/listar_produtos" className="hover:underline">Lista de Produtos</Link>
          <Link href="/relatorios" className="hover:underline">Relatórios</Link>
          <Link href="/orcamento" className="hover:underline">Orçamentos</Link>
          <Link href="/vendas" className="hover:underline">Vendas</Link> {/* 🔹 novo */}
          <button
            onClick={() => signOut()}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
          >
            Sair
          </button>
        </div>
      )}

      {/* Botão mobile */}
      {session && !expirado && (
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      )}

      {/* Menu mobile */}
      {menuOpen && session && !expirado && (
        <div className="absolute top-full left-0 w-full bg-blue-700 flex flex-col text-white md:hidden z-50">
          <Link href="/" onClick={() => setMenuOpen(false)} className="px-4 py-2 border-b">Home</Link>
          <Link href="/upload" onClick={() => setMenuOpen(false)} className="px-4 py-2 border-b">Upload</Link>
          <Link href="/download" onClick={() => setMenuOpen(false)} className="px-4 py-2 border-b">Download</Link>
          <Link href="/contagem" onClick={() => setMenuOpen(false)} className="px-4 py-2 border-b">Inventário</Link>
          <Link href="/produtos" onClick={() => setMenuOpen(false)} className="px-4 py-2 border-b">Cadastro Produto</Link>
          <Link href="/listar_produtos" onClick={() => setMenuOpen(false)} className="px-4 py-2 border-b">Lista de Produtos</Link>
          <Link href="/relatorios" onClick={() => setMenuOpen(false)} className="px-4 py-2 border-b">Relatórios</Link>
          <Link href="/orcamento" onClick={() => setMenuOpen(false)} className="px-4 py-2 border-b">Orçamentos</Link>
          <Link href="/vendas" onClick={() => setMenuOpen(false)} className="px-4 py-2 border-b">Vendas</Link> {/* 🔹 novo */}
          <button
            onClick={() => { setMenuOpen(false); signOut(); }}
            className="px-4 py-2 text-left bg-red-500 hover:bg-red-600"
          >
            Sair
          </button>
        </div>
      )}
    </nav>
  );
}