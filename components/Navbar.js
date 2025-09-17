import Link from "next/link";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const { data: session } = useSession();

  const expirado =
    session?.user?.expiracao &&
    new Date(session.user.expiracao) < new Date();

  const toggleDropdown = (menu) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-blue-600 p-4 flex items-center justify-between shadow-lg">
      {/* Logo */}
      <div className="text-white font-bold text-lg">📦 App IasTec</div>

      {/* Menu desktop */}
      {session && !expirado && (
        <div className="hidden md:flex space-x-6 text-white items-center relative">
          <Link href="/" className="hover:underline">Home</Link>
          <Link href="/upload" className="hover:underline">Upload</Link>
          <Link href="/download" className="hover:underline">Download</Link>
          <Link href="/contagem" className="hover:underline">Inventário</Link>

          {/* Produtos */}
          <div className="relative group">
            <button className="hover:underline">Produtos ▾</button>
            <div className="absolute hidden group-hover:block bg-white text-black mt-2 rounded shadow-lg w-44">
              <Link href="/produtos" className="block px-4 py-2 hover:bg-gray-100">Cadastro Produto</Link>
              <Link href="/listar_produtos" className="block px-4 py-2 hover:bg-gray-100">Lista de Produtos</Link>
            </div>
          </div>

          {/* Compras */}
          <div className="relative group">
            <button className="hover:underline">Compras ▾</button>
            <div className="absolute hidden group-hover:block bg-white text-black mt-2 rounded shadow-lg w-44">
              <Link href="/compras" className="block px-4 py-2 hover:bg-gray-100">Nova Compra</Link>
              <Link href="/listar_compras" className="block px-4 py-2 hover:bg-gray-100">Lista de Compras</Link>
              <Link href="/entradas" className="block px-4 py-2 hover:bg-gray-100">Entradas</Link>
              <Link href="/estoque" className="block px-4 py-2 hover:bg-gray-100">Estoque</Link>
            </div>
          </div>

          {/* Comercial */}
          <div className="relative group">
            <button className="hover:underline">Comercial ▾</button>
            <div className="absolute hidden group-hover:block bg-white text-black mt-2 rounded shadow-lg w-44">
              <Link href="/orcamento" className="block px-4 py-2 hover:bg-gray-100">Orçamentos</Link>
              <Link href="/vendas" className="block px-4 py-2 hover:bg-gray-100">Vendas</Link>
            </div>
          </div>

          <Link href="/relatorios" className="hover:underline">Relatórios</Link>

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
          className="md:hidden text-white focus:outline-none text-xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      )}

      {/* Menu mobile */}
      {menuOpen && session && !expirado && (
        <div className="absolute top-full left-0 w-full bg-blue-700 flex flex-col text-white md:hidden z-50 shadow-lg">
          <Link href="/" onClick={() => setMenuOpen(false)} className="px-4 py-2 border-b">Home</Link>
          <Link href="/upload" onClick={() => setMenuOpen(false)} className="px-4 py-2 border-b">Upload</Link>
          <Link href="/download" onClick={() => setMenuOpen(false)} className="px-4 py-2 border-b">Download</Link>
          <Link href="/contagem" onClick={() => setMenuOpen(false)} className="px-4 py-2 border-b">Inventário</Link>

          {/* Dropdown Produtos */}
          <button
            onClick={() => toggleDropdown("produtos")}
            className="px-4 py-2 border-b text-left"
          >
            Produtos ▾
          </button>
          {openDropdown === "produtos" && (
            <div className="bg-blue-800">
              <Link href="/produtos" onClick={() => setMenuOpen(false)} className="block px-6 py-2 border-b">Cadastro Produto</Link>
              <Link href="/listar_produtos" onClick={() => setMenuOpen(false)} className="block px-6 py-2 border-b">Lista de Produtos</Link>
            </div>
          )}

          {/* Dropdown Compras */}
          <button
            onClick={() => toggleDropdown("compras")}
            className="px-4 py-2 border-b text-left"
          >
            Compras ▾
          </button>
          {openDropdown === "compras" && (
            <div className="bg-blue-800">
              <Link href="/compras" onClick={() => setMenuOpen(false)} className="block px-6 py-2 border-b">Nova Compra</Link>
              <Link href="/listar_compras" onClick={() => setMenuOpen(false)} className="block px-6 py-2 border-b">Lista de Compras</Link>
              <Link href="/entradas" onClick={() => setMenuOpen(false)} className="block px-6 py-2 border-b">Entradas</Link>
              <Link href="/estoque" onClick={() => setMenuOpen(false)} className="block px-6 py-2 border-b">Estoque</Link>
            </div>
          )}

          {/* Dropdown Comercial */}
          <button
            onClick={() => toggleDropdown("comercial")}
            className="px-4 py-2 border-b text-left"
          >
            Comercial ▾
          </button>
          {openDropdown === "comercial" && (
            <div className="bg-blue-800">
              <Link href="/orcamento" onClick={() => setMenuOpen(false)} className="block px-6 py-2 border-b">Orçamentos</Link>
              <Link href="/vendas" onClick={() => setMenuOpen(false)} className="block px-6 py-2 border-b">Vendas</Link>
            </div>
          )}

          <Link href="/relatorios" onClick={() => setMenuOpen(false)} className="px-4 py-2 border-b">Relatórios</Link>

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