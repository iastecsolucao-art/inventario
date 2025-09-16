import { signIn } from "next-auth/react";

export default function Home() {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-100">
      {/* Header fixo */}
      <header className="w-full fixed top-0 bg-blue-600 p-4 text-white font-bold text-lg text-center shadow">
        📦 App de Inventário
      </header>

      {/* Conteúdo central */}
      <div className="bg-white shadow-lg rounded p-8 mt-16 w-80 text-center">
        <h1 className="text-xl font-bold mb-4">Acesse sua conta</h1>
        <button
          onClick={() => signIn("google")}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
        >
          Entrar com Google
        </button>
      </div>
    </div>
  );
}