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
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">
        📥 Download de Estoques Finalizados
      </h1>

      {/* Abas */}
      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setAba("detalhado")}
          className={`px-4 py-2 rounded ${
            aba === "detalhado" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Detalhado
        </button>
        <button
          onClick={() => setAba("loja")}
          className={`px-4 py-2 rounded ${
            aba === "loja" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Por Loja
        </button>
        <button
          onClick={() => setAba("setor")}
          className={`px-4 py-2 rounded ${
            aba === "setor" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Por Setor
        </button>
        <button
          onClick={() => setAba("loja_setor")}
          className={`px-4 py-2 rounded ${
            aba === "loja_setor" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Por Loja/Setor
        </button>
      </div>

      {/* Tabela */}
      <div className="bg-white shadow-md rounded p-4 overflow-x-auto">
        <table className="w-full border">
          <thead className="bg-gray-200">
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={
                    selecionados.length === contagensFiltradas.length &&
                    contagensFiltradas.length > 0
                  }
                  onChange={selecionarTodos}
                />
              </th>

              {/* Detalhado */}
              {aba === "detalhado" &&
                [
                  "id",
                  "loja",
                  "setor",
                  "usuario",
                  "finalizado_em",
                  "quantidade",
                  "nome",
                ].map((col) => (
                  <th key={col} className="px-2 py-1 border">
                    <div className="flex flex-col">
                      <span>{col}</span>
                      <input
                        placeholder="Filtrar"
                        value={filtros[col] || ""}
                        onChange={(e) =>
                          setFiltros({ ...filtros, [col]: e.target.value })
                        }
                        className="text-xs border p-1 mt-1"
                      />
                    </div>
                  </th>
                ))}

              {/* Loja */}
              {aba === "loja" &&
                ["loja", "total_registros", "quantidade_total"].map((col) => (
                  <th key={col} className="px-2 py-1 border">
                    <div className="flex flex-col">
                      <span>{col}</span>
                      <input
                        placeholder="Filtrar"
                        value={filtros[col] || ""}
                        onChange={(e) =>
                          setFiltros({ ...filtros, [col]: e.target.value })
                        }
                        className="text-xs border p-1 mt-1"
                      />
                    </div>
                  </th>
                ))}

              {/* Setor */}
              {aba === "setor" &&
                ["setor", "total_registros", "quantidade_total"].map((col) => (
                  <th key={col} className="px-2 py-1 border">
                    <div className="flex flex-col">
                      <span>{col}</span>
                      <input
                        placeholder="Filtrar"
                        value={filtros[col] || ""}
                        onChange={(e) =>
                          setFiltros({ ...filtros, [col]: e.target.value })
                        }
                        className="text-xs border p-1 mt-1"
                      />
                    </div>
                  </th>
                ))}

              {/* Loja/Setor */}
              {aba === "loja_setor" &&
                ["loja", "setor", "total_registros", "quantidade_total"].map(
                  (col) => (
                    <th key={col} className="px-2 py-1 border">
                      <div className="flex flex-col">
                        <span>{col}</span>
                        <input
                          placeholder="Filtrar"
                          value={filtros[col] || ""}
                          onChange={(e) =>
                            setFiltros({ ...filtros, [col]: e.target.value })
                          }
                          className="text-xs border p-1 mt-1"
                        />
                      </div>
                    </th>
                  )
                )}
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
                <tr key={idx} className="text-center border">
                  <td>
                    <input
                      type="checkbox"
                      checked={selecionados.includes(key)}
                      onChange={() => toggleSelecionado(key)}
                    />
                  </td>
                  {aba === "detalhado" && (
                    <>
                      <td>{c.id}</td>
                      <td>{c.loja}</td>
                      <td>{c.setor}</td>
                      <td>{c.usuario}</td>
                      <td>
                        {new Date(c.finalizado_em).toLocaleDateString()}
                      </td>
                      <td>{c.quantidade}</td>
                      <td>{c.nome}</td>
                    </>
                  )}
                  {aba === "loja" && (
                    <>
                      <td>{c.loja}</td>
                      <td>{c.total_registros}</td>
                      <td>{c.quantidade_total}</td>
                    </>
                  )}
                  {aba === "setor" && (
                    <>
                      <td>{c.setor}</td>
                      <td>{c.total_registros}</td>
                      <td>{c.quantidade_total}</td>
                    </>
                  )}
                  {aba === "loja_setor" && (
                    <>
                      <td>{c.loja}</td>
                      <td>{c.setor}</td>
                      <td>{c.total_registros}</td>
                      <td>{c.quantidade_total}</td>
                    </>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="mt-4 flex justify-between items-center">
          <button
            onClick={exportarTXT}
            className="bg-green-600 text-white px-4 py-2 rounded shadow"
          >
            Exportar Selecionados
          </button>
          {status && <p className="text-sm">{status}</p>}
        </div>
      </div>
    </div>
  );
}