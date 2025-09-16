import { useEffect, useState } from "react";
import { utils, writeFile } from "xlsx"; // biblioteca para Excel
import { Bar } from "react-chartjs-2";   // biblioteca de gráficos

import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend
} from "chart.js";
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Relatorios() {
  const [dados, setDados] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDados() {
      try {
        const res = await fetch("https://n8n.iastec.servicos.ws/webhook/relatorios");
        const data = await res.json();

        // descompacta os json
        const lista = Array.isArray(data) ? data.map(d => d.json || d) : [data];
        setDados(lista);
      } catch (err) {
        console.error("Erro:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchDados();
  }, []);

  // Exportar para Excel
  const exportarExcel = () => {
    const ws = utils.json_to_sheet(dados);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Relatorios");
    writeFile(wb, "relatorio_inventario.xlsx");
  };

  // Preparar dados para gráfico
  const chartData = {
    labels: dados.map(d => `${d.loja} - ${d.setor}`),
    datasets: [
      {
        label: "Total de Itens",
        data: dados.map(d => d.total_itens),
        backgroundColor: "rgba(37, 99, 235, 0.7)"
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-16 px-4">
      <h1 className="text-2xl font-bold mb-6 text-center">📊 Relatórios de Inventário</h1>

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <div className="max-w-5xl mx-auto">
          {/* Tabela */}
          <div className="bg-white shadow rounded mb-6 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="px-4 py-2 text-left">Loja</th>
                  <th className="px-4 py-2 text-left">Setor</th>
                  <th className="px-4 py-2 text-left">Total de Itens</th>
                </tr>
              </thead>
              <tbody>
                {dados.map((d, i) => (
                  <tr key={i} className="border-b">
                    <td className="px-4 py-2">{d.loja}</td>
                    <td className="px-4 py-2">{d.setor}</td>
                    <td className="px-4 py-2 font-semibold">{d.total_itens}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Botão Excel */}
          <div className="flex justify-end mb-6">
            <button
              onClick={exportarExcel}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              📥 Exportar Excel
            </button>
          </div>

          {/* Gráfico */}
          <div className="bg-white shadow rounded p-4">
            <Bar data={chartData} />
          </div>
        </div>
      )}
    </div>
  );
}