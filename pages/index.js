import { useSession, signIn, signOut } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <main className="flex flex-col flex-1 items-center justify-center text-center px-6">
        {!session ? (
          <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 max-w-md">
            <h2 className="text-xl font-bold mb-4">Acesse sua conta</h2>
            <button
              onClick={() => signIn("google")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
            >
              Entrar com Google
            </button>
          </div>
        ) : (
          <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 max-w-xl">
            <h2 className="text-xl font-bold mb-4">Bem-vindo ao Sistema</h2>
            <p className="text-gray-700">
              O App de Inventário permite cadastrar produtos, fazer contagens,
              gerar relatórios e exportar seus dados 📊.  
              Use o menu acima para navegar entre as funcionalidades.
            </p>
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