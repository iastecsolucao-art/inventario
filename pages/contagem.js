import { useState, useRef } from "react";

export default function ContagemSetor() {
  const [setor, setSetor] = useState("mesa");
  const [operador, setOperador] = useState("");
  const [loja, setLoja] = useState("");
  const [produtos, setProdutos] = useState([{ codigo_barra: "", descricao: "", quantidade: 1 }]);
  const [quantidadeLiberada, setQuantidadeLiberada] = useState(false);
  const [senha, setSenha] = useState("");
  const [totalSalvo, setTotalSalvo] = useState(0);
  const [totalPendente, setTotalPendente] = useState(0);
  const inputRefs = useRef([]);

  // 🔹 Atualiza total salvo no banco
  const atualizarTotaisDoBanco = async () => {
    try {
      const res = await fetch(`https://n8n.iastec.servicos.ws/webhook/total_setor?setor=${setor}`);
      const data = await res.json();
      setTotalSalvo(data.total || 0);
    } catch (err) {
      console.error("Erro ao buscar total no banco:", err);
    }
  };

  const addProduto = () => {
    const newProdutos = [...produtos, { codigo_barra: "", descricao: "", quantidade: 1 }];
    setProdutos(newProdutos);
    setTimeout(() => {
      const idx = newProdutos.length - 1;
      inputRefs.current[idx]?.focus();
    }, 100);
  };

  const removeProduto = (index) => {
    const newProdutos = produtos.filter((_, i) => i !== index);
    setProdutos(newProdutos);
  };

  const validarProduto = async (index) => {
    const codigo = produtos[index].codigo_barra;
    if (!codigo) return;

    try {
      const res = await fetch(
        `https://n8n.iastec.servicos.ws/webhook/buscar_produto?codigo_barra=${codigo}`
      );
      const data = await res.json();
      const newProdutos = [...produtos];

      if (data && data.descricao) {
        newProdutos[index].descricao = data.descricao;
      } else if (Array.isArray(data) && data.length > 0) {
        newProdutos[index].descricao = data[0].descricao;
      } else {
        newProdutos[index].descricao = "❌ Produto não cadastrado";
      }

      newProdutos[index].quantidade = 1;
      setProdutos(newProdutos);

      if (newProdutos[index].descricao !== "❌ Produto não cadastrado") {
        await atualizarTotaisDoBanco();

        const novosPendentes = newProdutos.filter(
          (p) => p.codigo_barra && p.descricao && !p.descricao.includes("❌")
        ).length;
        setTotalPendente(novosPendentes);

        addProduto();
      }
    } catch (err) {
      console.error("Erro:", err);
    }
  };

  const salvarItem = (index) => {
    validarProduto(index);
  };

  const liberarQuantidade = () => {
    if (senha === "iastec") {
      setQuantidadeLiberada(true);
    } else {
      alert("Senha incorreta!");
    }
    setSenha("");
  };

  // 🚀 Salvar Setor
  const salvarSetor = async () => {
    if (!operador.trim()) {
      alert("⚠️ Você precisa informar o operador antes de salvar.");
      return;
    }
    if (!loja.trim()) {
      alert("⚠️ Você precisa informar a loja antes de salvar.");
      return;
    }

    try {
      const respostas = await Promise.all(
        produtos
          .filter((p) => p.codigo_barra && !p.descricao.includes("❌"))
          .map((p) =>
            fetch("https://n8n.iastec.servicos.ws/webhook/salvar_setor", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                usuario: operador,
                loja,
                setor,
                codigo_barra: p.codigo_barra,
                descricao: p.descricao,
                quantidade: p.quantidade || 1,
                atualizado_em: new Date().toISOString(),
              }),
            }).then((res) => res.json())
          )
      );

      const limiteExcedido = respostas.find((r) => r.quantidade_maxima === "acima do limite");
      if (limiteExcedido) {
        alert("🚫 Quantidade acima do limite! Entre em contato pelo Chat para fazer a liberação, Digite : Licença e o nome da loja");
        return;
      }

      const erro = respostas.find((r) => r.status === "erro");
      if (erro) {
        alert("❌ Erro: " + erro.mensagem);
        return;
      }

      alert("✅ Setor salvo com sucesso!");
      setTotalSalvo(totalSalvo + totalPendente);
      setTotalPendente(0);

    } catch (err) {
      console.error(err);
      alert("❌ Erro ao salvar setor");
    }
  };

  // 🚀 Finalizar Setor
  const finalizarSetor = async () => {
    if (!operador.trim()) {
      alert("⚠️ Você precisa informar o operador antes de finalizar.");
      return;
    }
    if (!loja.trim()) {
      alert("⚠️ Você precisa informar a loja antes de finalizar.");
      return;
    }

    try {
      const respostas = await Promise.all(
        produtos
          .filter((p) => p.codigo_barra && !p.descricao.includes("❌"))
          .map((p) =>
            fetch("https://n8n.iastec.servicos.ws/webhook/finalizar_setor", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                usuario: operador,
                loja,
                setor,
                codigo_barra: p.codigo_barra,
                descricao: p.descricao,
                quantidade: p.quantidade || 1,
              }),
            }).then((res) => res.json())
          )
      );

      if (respostas.some((r) => r.quantidade_maxima === "acima do limite")) {
        alert("🚫 Quantidade acima do limite! Não é permitido finalizar.");
        return;
      }

      if (respostas.some((r) => r.status === "erro")) {
        alert(respostas.find((r) => r.status === "erro").mensagem);
      } else {
        alert("✅ Setor finalizado com sucesso!");
        setProdutos([{ codigo_barra: "", descricao: "", quantidade: 1 }]);
        setTotalSalvo(0);
        setTotalPendente(0);
      }
    } catch (err) {
      console.error(err);
      alert("❌ Erro ao finalizar setor");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8 px-2">
      <h1 className="text-2xl font-bold mb-4">📦 Inventário por Setor</h1>

      <div className="bg-white shadow-md rounded p-4 w-full max-w-5xl">
        {/* Inputs de cabeçalho */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <label>
            <span className="block text-gray-700 font-medium">📋 Nome do Setor</span>
            <input
              className="border rounded w-full p-2 mt-1"
              value={setor}
              onChange={(e) => setSetor(e.target.value)}
            />
          </label>
          <label>
            <span className="block text-gray-700 font-medium">👨 Operador</span>
            <input
              className="border rounded w-full p-2 mt-1"
              value={operador}
              onChange={(e) => setOperador(e.target.value)}
            />
          </label>
          <label>
            <span className="block text-gray-700 font-medium">🏬 Loja</span>
            <input
              className="border rounded w-full p-2 mt-1"
              value={loja}
              onChange={(e) => setLoja(e.target.value)}
            />
          </label>
        </div>

        {/* Totais */}
        <div className="mb-4 flex flex-col md:flex-row gap-4 text-lg font-semibold">
          <span className="text-green-700">✅ Total Salvo: {totalSalvo}</span>
          <span className="text-yellow-600">⏳ Pendente: {totalPendente}</span>
        </div>

        {/* Desktop - tabela */}
        <div className="hidden md:block">
          <table className="w-full mb-4 border text-sm">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className="px-2 py-1">Código de Barras</th>
                <th className="px-2 py-1">Descrição</th>
                {quantidadeLiberada && <th className="px-2 py-1">Quantidade</th>}
                <th className="px-2 py-1 text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {produtos.map((p, idx) => (
                <tr key={idx} className="border-b">
                  <td>
                    <input
                      ref={(el) => (inputRefs.current[idx] = el)}
                      value={p.codigo_barra}
                      onChange={(e) => {
                        const newProdutos = [...produtos];
                        newProdutos[idx].codigo_barra = e.target.value;
                        setProdutos(newProdutos);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          validarProduto(idx);
                        }
                      }}
                      className="border rounded p-2 w-full"
                    />
                  </td>
                  <td>
                    <input
                      value={p.descricao}
                      readOnly
                      className="border rounded p-2 w-full bg-gray-100 text-gray-700"
                    />
                  </td>
                  {quantidadeLiberada && (
                    <td>
                      <input
                        type="number"
                        value={p.quantidade}
                        onChange={(e) => {
                          const newProdutos = [...produtos];
                          newProdutos[idx].quantidade = e.target.value;
                          setProdutos(newProdutos);
                        }}
                        className="border rounded p-2 w-24"
                      />
                    </td>
                  )}
                  <td className="text-center flex gap-2 justify-center">
                    <button onClick={() => salvarItem(idx)} className="bg-yellow-400 text-black px-3 py-1 rounded hover:bg-yellow-500">💾</button>
                    <button onClick={() => removeProduto(idx)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile - cards */}
        <div className="md:hidden space-y-3">
          {produtos.map((p, idx) => (
            <div key={idx} className="border rounded p-3 bg-gray-50">
              <label className="block text-xs text-gray-600">Código de Barras</label>
              <input className="border rounded w-full p-2 mb-1"
                value={p.codigo_barra}
                onChange={(e) => {
                  const newProdutos = [...produtos];
                  newProdutos[idx].codigo_barra = e.target.value;
                  setProdutos(newProdutos);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    validarProduto(idx);
                  }
                }}
              />

              <label className="block text-xs text-gray-600">Descrição</label>
              <input className="border rounded w-full p-2 mb-1 bg-gray-100"
                value={p.descricao}
                readOnly
              />

              {quantidadeLiberada && (
                <>
                  <label className="block text-xs text-gray-600">Quantidade</label>
                  <input className="border rounded w-full p-2 mb-1"
                    type="number"
                    value={p.quantidade}
                    onChange={(e) => {
                      const newProdutos = [...produtos];
                      newProdutos[idx].quantidade = e.target.value;
                      setProdutos(newProdutos);
                    }}
                  />
                </>
              )}

              <div className="flex justify-end gap-2 mt-2">
                <button onClick={() => salvarItem(idx)} className="bg-yellow-400 text-black px-3 py-1 rounded hover:bg-yellow-500">💾</button>
                <button onClick={() => removeProduto(idx)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">🗑️</button>
              </div>
            </div>
          ))}
        </div>

        {/* Senha para liberar quantidade */}
        {!quantidadeLiberada && (
          <div className="flex items-center gap-2 my-4 flex-col md:flex-row">
            <input
              type="password"
              placeholder="Senha p/ liberar quantidade"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="border rounded p-2 w-full md:w-auto"
            />
            <button
              onClick={liberarQuantidade}
              className="bg-gray-700 text-white px-4 py-2 rounded w-full md:w-auto"
            >
              🔓 Liberar Quantidade
            </button>
          </div>
        )}

        {/* Botões finais */}
        <div className="flex flex-col md:flex-row justify-end gap-4 mt-6">
          <button onClick={salvarSetor} className="bg-yellow-400 px-6 py-2 rounded font-bold w-full md:w-auto">
            💾 Salvar Setor
          </button>
          <button onClick={finalizarSetor} className="bg-green-600 text-white px-6 py-2 rounded font-bold w-full md:w-auto">
            ✅ Finalizar Setor
          </button>
        </div>
      </div>
    </div>
  );
}