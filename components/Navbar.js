import { useState, useEffect } from "react";
import Link from "next/link";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  // fecha o menu quando rolar
  useEffect(() => {
    const handleScroll = () => setMenuOpen(false);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClickLink = () => setMenuOpen(false);

  return (
    <nav className="bg-blue-600 p-4 flex items-center justify-between relative">
      <div className="text-white font-bold">📦 App de Inventário</div>

      {/* Desktop Menu */}
      <div className="hidden md:flex space-x-6 text-white">
        <Link href="/upload" className="hover:underline">Upload</Link>
        <Link href="/download" className="hover:underline">Download</Link>
        <Link href="/inventario" className="hover:underline">Inventário</Link>
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

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-blue-700 flex flex-col text-white md:hidden z-50">
          <Link href="/upload" onClick={handleClickLink} className="px-4 py-2 border-b border-blue-500">Upload</Link>
          <Link href="/download" onClick={handleClickLink} className="px-4 py-2 border-b border-blue-500">Download</Link>
          <Link href="/inventario" onClick={handleClickLink} className="px-4 py-2 border-b border-blue-500">Inventário</Link>
          <Link href="/produtos" onClick={handleClickLink} className="px-4 py-2 border-b border-blue-500">Cadastro Produto</Link>
          <Link href="/lista" onClick={handleClickLink} className="px-4 py-2 border-b border-blue-500">Lista de Produtos</Link>
          <Link href="/relatorios" onClick={handleClickLink} className="px-4 py-2">Relatórios</Link>
        </div>
      )}
    </nav>
  );
}