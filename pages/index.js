import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";

export default function Home() {
  const { data: session } = useSession();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  // 🔹 Login manual
  async function handleCredLogin(e) {
    e.preventDefault();
    await signIn("credentials", {
      email,
      senha,
      redirect: true,
      callbackUrl: "/", // Redireciona para home após login
    });
  }

  // 🔹 Formatar data
  function formatDate(dateString) {
    if (!dateString) return null;
    const d = new Date(dateString);
    return d.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  const expirado =
    session?.user?.expiracao &&
    new Date(session.user.expiracao) < new Date();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <main className="flex flex-col flex-1 items-center justify-center text-center px-6">
        {!session ? (
          // 🔹 Tela de login
          <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 max-w-md">
            <h2 className="text-xl font-bold mb-4">Acesse sua conta</h2>

            <button
              onClick={() => signIn("google")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded w-full mb-4"
            >
              Entrar com Google
            </button>

            <div className="text-gray-500 my-3">ou</div>

            {/* Formulário login manual */}
            <form onSubmit={handleCredLogin} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full border rounded px-3 py-2"
                required
              />
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Senha"
                className="w-full border rounded px-3 py-2"
                required
              />
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded w-full"
              >
                Entrar
              </button>
            </form>
          </div>
        ) : (
          // 🔹 Tela após login
          <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 max-w-xl">
            <h2 className="text-2xl font-bold mb-4">
              👋 Bem-vindo, {session.user?.name || session.user?.email}
            </h2>

            {/* Papel (role) */}
            <p className="text-gray-700 mb-2">
              Perfil:{" "}
              <span className="font-semibold">{session.user?.role || "Usuário"}</span>
            </p>

            {/* Data de expiração */}
            {session.user?.expiracao && (
              <p
                className={`mb-4 ${
                  expirado ? "text-red-600 font-bold" : "text-gray-600"
                }`}
              >
                Expira em:{" "}
                <span>{formatDate(session.user.expiracao)}</span>
              </p>
            )}

            {/* Se expirado → alerta */}
            {expirado ? (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                Sua conta expirou ❌<br />
                Entre em contato com o administrador para renovação.
              </div>
            ) : (
              <div className="space-y-3">
                {/* Dashboard */}
                <Link
                  href="/dashboard"
                  className="block bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded"
                >
                  📊 Acessar Dashboard
                </Link>

                {/* Links específicos */}
                {session.user?.role === "admin" && (
                  <Link
                    href="/admin"
                    className="block bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded"
                  >
                    Painel Admin
                  </Link>
                )}
                <Link
                  href="/contagem"
                  className="block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
                >
                  Inventário
                </Link>
              </div>
            )}

            {/* Botão sair */}
            <button
              onClick={() => signOut()}
              className="mt-6 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded"
            >
              Sair
            </button>
          </div>
        )}
      </main>

      <footer className="w-full bg-gray-200 text-center py-4 text-sm text-gray-600">
        iastec 2025 - versão 1
      </footer>
    </div>
  );
}