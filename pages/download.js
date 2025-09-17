import { useState, useEffect } from "react";

export default function DownloadInventario() {
  const [contagens, setContagens] = useState([]);
  const [status, setStatus] = useState(null);
  const [selecionados, setSelecionados] = useState([]);
  const [filtros, setFiltros] = useState({});
  const [aba, setAba] = useState("detalhado"); // ["detalhado","loja","setor","loja_setor"]

  const carregar = async (tipo) => {
    let url = "/api/contagem_finalizada";
    if (tipo === "loja") url += "?group=loja";
    if (tipo === "setor") url += "?group=setor";
    if (tipo === "loja_setor") url += "?group=loja_setor";

    try {
      const res = await fetch(url);
      const data = await res.json();
      if (res.ok) setContagens(data);
    } catch (err) {
      console.error("Erro ao carregar contagens", err);
    }
  };

  useEffect(() => {
    carregar(aba);
    setSelecionados([]);
    setFiltros({});
  }, [aba]);

  const toggleSelecionado = (key) => {
    setSelecionados((prev) =>
      prev.includes(key) ? prev.filter((x) => x !== key) : [...prev, key]
    );
  };

  const selecionarTodos = () => {
    const todosIds = contagens.map(
      (c) =>
        c.id ||
        c.loja ||
        c.setor ||
        (c.loja && c.setor ? `${c.loja}|${c.setor}` : "")
    );
    if (selecionados.length === todosIds.length) {
      setSelecionados([]);
    } else {
      setSelecionados(todosIds);
    }
  };

  // 🔹 Exportar TXT em formato codigo,quantidade
  const exportarTXT = async () => {
    if (!selecionados || selecionados.length === 0) {
      alert("Selecione algum registro!");
      return;
    }
    setStatus("⏳ Gerando TXT...");
    try {
      let url = `/api/exportar_contagem?ids=${selecionados.join(",")}`;
      let filename = "contagens.txt";

      if (aba === "loja") {
        url = `/api/exportar_contagem?group=loja&ids=${selecionados.join(",")}`;
        filename =
          selecionados.length === 1
            ? `estoque_loja_${selecionados[0]}.txt`
            : "estoque_lojas.txt";
      }
      if (aba === "setor") {
        url = `/api/exportar_contagem?group=setor&ids=${selecionados.join(",")}`;
        filename =
          selecionados.length === 1
            ? `estoque_setor_${selecionados[0]}.txt`
            : "estoque_setores.txt";
      }
      if (aba === "loja_setor") {
        url = `/api/exportar_contagem?group=loja_setor&ids=${selecionados.join(
          ","
        )}`;
        filename =
          selecionados.length === 1
            ? `estoque_${selecionados[0].replace("|", "_")}.txt`
            : "estoque_loja_setor.txt";
      }
      if (aba === "detalhado") {
        filename =
          selecionados.length === 1
            ? `contagem_${selecionados[0]}.txt`
            : "contagens.txt";
      }

      const res = await fetch(url);
      if (!res.ok) throw new Error("Erro exportando");
      const txt = await res.text();

      const blob = new Blob([txt], { type: "text/plain;charset=utf-8" });
      const urlBlob = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = urlBlob;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(urlBlob);

      setStatus(`✅ Arquivo ${filename} gerado com sucesso!`);
    } catch (err) {
      console.error(err);
      setStatus("❌ Erro ao exportar TXT!");
    }
  };

  // 🔹 Filtragem
  const contagensFiltradas = contagens.filter((c) =>
    Object.entries(filtros).every(([coluna, valor]) =>
      valor
        ? String(c[coluna] ?? "").toLowerCase().includes(valor.toLowerCase())
        : true
    )
  );

return (
  <div className="p-2 sm:p-6 bg-gray-100 min-h-screen">
    <h1 className="text-lg sm:text-2xl font-bold mb-4 sm:mb-6 text-center sm:text-left">
      📥 Download de Estoques Finalizados
    </h1>

    {/* Abas */}
    <div className="flex flex-wrap gap-2 sm:gap-4 mb-4 justify-center sm:justify-start">
      <button
        onClick={() => setAba("detalhado")}
        className={`px-3 sm:px-4 py-1 sm:py-2 rounded text-sm sm:text-base ${
          aba === "detalhado" ? "bg-blue-600 text-white" : "bg-gray-200"
        }`}
      >
        Detalhado
      </button>
      <button
        onClick={() => setAba("loja")}
        className={`px-3 sm:px-4 py-1 sm:py-2 rounded text-sm sm:text-base ${
          aba === "loja" ? "bg-blue-600 text-white" : "bg-gray-200"
        }`}
      >
        Por Loja
      </button>
      <button
        onClick={() => setAba("setor")}
        className={`px-3 sm:px-4 py-1 sm:py-2 rounded text-sm sm:text-base ${
          aba === "setor" ? "bg-blue-600 text-white" : "bg-gray-200"
        }`}
      >
        Por Setor
      </button>
      <button
        onClick={() => setAba("loja_setor")}
        className={`px-3 sm:px-4 py-1 sm:py-2 rounded text-sm sm:text-base ${
          aba === "loja_setor" ? "bg-blue-600 text-white" : "bg-gray-200"
        }`}
      >
        Por Loja/Setor
      </button>
    </div>

    {/* Tabela responsiva */}
    <div className="bg-white shadow-md rounded p-2 sm:p-4 overflow-x-auto">
      <table className="w-full text-xs sm:text-sm border">
        <thead className="bg-gray-200 text-gray-700">
          <tr>
            <th className="p-1 sm:p-2">
              <input
                type="checkbox"
                checked={
                  selecionados.length === contagensFiltradas.length &&
                  contagensFiltradas.length > 0
                }
                onChange={selecionarTodos}
              />
            </th>
            {/* ... resto das colunas iguais */}
          </tr>
        </thead>
        <tbody>
          {contagensFiltradas.map((c, idx) => {
            const key =
              c.id ||
              (aba === "loja_setor" && c.loja && c.setor
                ? `${c.loja}|${c.setor}`
                : c.loja || c.setor);

            return (
              <tr
                key={idx}
                className="text-center border hover:bg-gray-50 text-xs sm:text-sm"
              >
                <td className="p-1 sm:p-2">
                  <input
                    type="checkbox"
                    checked={selecionados.includes(key)}
                    onChange={() => toggleSelecionado(key)}
                  />
                </td>
                {/* ... resto das células */}
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Botão exportar */}
      <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-2">
        <button
          onClick={exportarTXT}
          className="bg-green-600 text-white px-4 py-2 rounded shadow w-full sm:w-auto"
        >
          Exportar Selecionados
        </button>
        {status && (
          <p className="text-xs sm:text-sm text-center sm:text-left">{status}</p>
        )}
      </div>
    </div>
  </div>


  );
}