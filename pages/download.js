import { useState } from "react";

export default function DownloadInventario() {
  const [status, setStatus] = useState(null);

  const handleDownload = async () => {
    setStatus("⏳ Gerando arquivo...");

    try {
      const res = await fetch("https://n8n.iastec.servicos.ws/webhook/download_inventario");

      if (!res.ok) throw new Error("Erro ao gerar inventário");

      // resposta é TXT
      const txt = await res.text();

      // cria arquivo .txt e baixa no navegador
      const blob = new Blob([txt], { type: "text/plain;charset=utf-8" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "inventario.txt";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      setStatus("✅ Arquivo gerado com sucesso!");
    } catch (err) {
      console.error(err);
      setStatus("❌ Erro ao gerar inventário");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-12">
      <h1 className="text-2xl font-bold mb-6">📥 Download de Inventário</h1>

      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-full max-w-md text-center">
        <p className="mb-4">Clique no botão abaixo para gerar o inventário finalizado em TXT:</p>

        <button
          onClick={handleDownload}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow"
        >
          Baixar Inventário
        </button>

        {status && <p className="mt-4 text-sm">{status}</p>}
      </div>
    </div>
  );
}