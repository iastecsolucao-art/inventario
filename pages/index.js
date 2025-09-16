import { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Home() {
  const { data: session, status } = useSession();
  const [file, setFile] = useState(null);
  const [resposta, setResposta] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("tipo", "produto");
    formData.append("file", file);

    const res = await fetch("https://n8n.iastec.servicos.ws/webhook/upload", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    setResposta(data);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* NAVBAR */}
      <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center shadow">
        <h1 className="text-xl font-bold">🚀 App de Inventário</h1>
        <div>
          {!session && (
            <button
              onClick={() => signIn("google")}
              className="bg-white text-blue-600 px-4 py-2 rounded shadow hover:bg-gray-200"
            >
              Login com Google
            </button>
          )}
          {session && (
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

      {/* CONTEÚDO PRINCIPAL */}
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold mb-4">📂 Upload de Arquivos</h2>

          {!session ? (
            <p className="text-red-500">
              ⚠️ Você precisa estar logado para enviar arquivos.
            </p>
          ) : (
            <form onSubmit={handleSubmit}>
              <input
                type="file"
                accept=".csv"
                onChange={(e) => setFile(e.target.files[0])}
                className="mb-4 w-full border rounded px-3 py-2"
              />
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-700"
              >
                Enviar CSV
              </button>
            </form>
          )}

          {resposta && (
            <div className="mt-6 bg-gray-900 text-green-400 p-4 rounded text-sm overflow-auto">
              <pre>{JSON.stringify(resposta, null, 2)}</pre>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}