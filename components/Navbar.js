import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center shadow">
      {/* Lado Esquerdo */}
      <div className="flex items-center gap-6">
        <Link href="/" className="font-bold text-lg">🚀 App de Inventário</Link>
        <Link href="/upload">📂 Upload</Link>
        {session && (
          <>
            <Link href="/contagem">📦 Inventário</Link>
            <Link href="/produtos">📝 Cadastro Produto</Link>
            <Link href="/listar_produtos">📋 Lista de Produtos</Link>
          </>
        )}
        {session?.user?.role === "admin" && (
          <Link href="/relatorios">📊 Relatórios</Link>
        )}
      </div>

      {/* Lado Direito */}
      <div>
        {!session ? (
          <button
            onClick={() => signIn("google")}
            className="bg-white text-blue-600 px-4 py-2 rounded shadow hover:bg-gray-200"
          >
            Login com Google
          </button>
        ) : (
          <div className="flex items-center gap-4">
            <span className="text-sm">Olá, {session.user.name}</span>
            <button
              onClick={() => signOut()}
              className="bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-600"
            >
              Sair
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}