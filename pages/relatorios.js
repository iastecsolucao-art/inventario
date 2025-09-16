import { useSession } from "next-auth/react";

export default function Relatorios() {
  const { data: session } = useSession();

  // Protege a rota: só admin acessa
  if (!session) return <p className="p-6 text-red-500">⚠️ Você precisa estar logado</p>;
  if (session.user.role !== "admin") return <p className="p-6 text-red-500">🔒 Acesso restrito ao admin</p>;

  // Aqui você pode futuramente buscar relatórios do n8n/Postgres
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-8">
      <div className="bg-white shadow rounded-lg p-6 w-full max-w-3xl">
        <h1 className="text-2xl font-bold mb-4">📊 Relatórios de Inventário</h1>
        <p className="text-gray-600">Aqui serão exibidos os relatórios carregados do banco.</p>

        <table className="mt-6 w-full border-collapse">
          <thead>
            <tr className="bg-blue-100">
              <th className="border px-4 py-2 text-left">Produto</th>
              <th className="border px-4 py-2 text-left">Quantidade</th>
              <th className="border px-4 py-2 text-left">Data</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border px-4 py-2">Exemplo: Coca-Cola 350ml</td>
              <td className="border px-4 py-2">120</td>
              <td className="border px-4 py-2">15/09/2025</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}