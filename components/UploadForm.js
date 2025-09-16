import { useState } from "react";
import { uploadFile } from "../utils/api";

export default function UploadForm() {
  const [tipo, setTipo] = useState("produto");
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);

  const handleUpload = async () => {
    if (!file) {
      alert("Escolha um arquivo!");
      return;
    }

    try {
      const res = await uploadFile(file, tipo);
      setResult(res);
    } catch (err) {
      console.error("Erro no upload:", err);
      alert("Erro ao enviar arquivo!");
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto border rounded shadow-md bg-white">
      <h2 className="text-xl font-bold mb-3">Upload de Cadastros</h2>

      <select
        className="border p-2 w-full mb-3"
        onChange={(e) => setTipo(e.target.value)}
        value={tipo}
      >
        <option value="produto">Produtos</option>
        <option value="usuario">Usuários</option>
        <option value="contagem">Contagem</option>
      </select>

      <input
        type="file"
        accept=".csv,.xlsx,.txt"
        className="mb-3"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
          }
        }}
      />

      <button
        onClick={handleUpload}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Enviar
      </button>

      {result && (
        <pre className="bg-gray-100 mt-4 p-2 text-xs whitespace-pre-wrap">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}
