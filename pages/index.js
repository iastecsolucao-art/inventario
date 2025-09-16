import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";

export default function Home() {
  const { data: session } = useSession();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  // Função para login com credenciais
  async function handleCredLogin(e) {
    e.preventDefault();
    await signIn("credentials", {
      email,
      senha,
      redirect: true,
      callbackUrl: "/", // Redireciona para home após login
    });
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <main className="flex flex-col flex-1 items-center justify-center text-center px-6">
        {!session ? (
          <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 max-w-md">
            <h2 className="text-xl font-bold mb-4">Acesse sua conta</h2>

            {/* Botão login com Google */}
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
          <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 max-w-xl">
            <h2 className="text-xl font-bold mb-4">
              Bem-vindo ao Sistema, {session.user?.name || session.user?.email}
            </h2>

            <p className="text-gray-700 mb-4">
              Você está logado como:{" "}
              <span className="font-semibold">{session.user?.role || "user"}</span>
            </p>

            {/* Mostra menus diferentes por role */}
            {session.user?.role === "admin" ? (
              <div>
                <a
                  href="/admin"
                  className="block bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded mb-2"
                >
                  Painel Admin
                </a>
                <a
                  href="/contagem"
                  className="block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
                >
                  Inventário
                </a>
              </div>
            ) : (
              <a
                href="/contagem"
                className="block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
              >
                Inventário
              </a>
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