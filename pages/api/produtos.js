import { useState } from "react";

export default function CadastroProduto() {
  const [form, setForm] = useState({
    codigo_barra: "",
    descricao: "",
    empresa_id: ""
  });

  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("salvando...");

    try {
      // se estiver usando API interna Next.js (pages/api/produtos.js)
      const res = await fetch("/api/produtos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Erro ao cadastrar produto");

      setStatus("Produto cadastrado com sucesso ✅");
      setForm({ codigo_barra: "", descricao: "", empresa_id: "" });
    } catch (err) {
      console.error(err);
      setStatus("❌ Erro ao salvar o produto");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-12">
      <h1 className="text-2xl font-bold mb-6">📦 Cadastrar Produto</h1>

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-full max-w-md">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Código de Barras
          </label>
          <input
            name="codigo_barra"
            value={form.codigo_barra}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="7891234567890"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Descrição
          </label>
          <input
            name="descricao"
            value={form.descricao}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Ex: Coca-Cola 350ml"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Empresa ID
          </label>
          <input
            name="empresa_id"
            value={form.empresa_id}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="1"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
        >
          Salvar
        </button>

        {status && (
          <p className="mt-4 text-center text-sm text-gray-700">{status}</p>
        )}
      </form>
    </div>
  );
}