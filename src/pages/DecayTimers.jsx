import { useState, useEffect } from "react";
import "./ConversorTek.css";
import { v4 as uuidv4 } from "uuid";

const DECAY_TIMES = {
  Thatch: 4,
  Wood: 8,
  Adobe: 8,
  Stone: 12,
  Greenhouse: 15,
  Metal: 16,
  Tek: 20,
};

const STORAGE_KEY = "decayBases";
const LAST_EXPORT_KEY = "decayBases_lastExport";
const LAST_IMPORT_KEY = "decayBases_lastImport";
const GITHUB_DECAY_URL =
  "https://raw.githubusercontent.com/rafaellindemann/blackBoxToolBox/main/src/data/decayTimers.json";

export default function DecayTimers() {
  const [bases, setBases] = useState([]);
  const [nome, setNome] = useState("");
  const [material, setMaterial] = useState("Metal");
  const [diasPersonalizados, setDiasPersonalizados] = useState("");
  const [mapa, setMapa] = useState("");
  const [modalId, setModalId] = useState(null);
  const [editNome, setEditNome] = useState("");
  const [editMaterial, setEditMaterial] = useState("Metal");
  const [editDiasPersonalizados, setEditDiasPersonalizados] = useState("");
  const [editMapa, setEditMapa] = useState("");
  const [filtros, setFiltros] = useState({});
  const [ultimaImportacao, setUltimaImportacao] = useState(null);
  const [jsonOriginal, setJsonOriginal] = useState(null);

  useEffect(() => {
    const salvas = JSON.parse(localStorage.getItem(STORAGE_KEY));
    const importTime = localStorage.getItem(LAST_IMPORT_KEY);
    if (salvas) setBases(salvas);
    if (importTime) setUltimaImportacao(new Date(importTime));
    setJsonOriginal(JSON.stringify(salvas));
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bases));
  }, [bases]);

  const dadosAlterados = JSON.stringify(bases) !== jsonOriginal;

  const obterDiasDecay = (base) => {
    if (base.material === "Personalizado") {
      const dias = Number(base.diasPersonalizados);
      return Number.isFinite(dias) && dias > 0 ? dias : 0;
    }
    return DECAY_TIMES[base.material] || 0;
  };

  const normalizarBasesImportadas = (array) =>
    array.map((b) => ({
      ...b,
      id: b.id || uuidv4(),
      diasPersonalizados:
        b.material === "Personalizado" && b.diasPersonalizados !== undefined
          ? Number(b.diasPersonalizados)
          : b.diasPersonalizados ?? null,
    }));

  const aplicarImportacao = (json, origem = "JSON") => {
    const array = Array.isArray(json) ? json : json.bases;
    if (!Array.isArray(array)) {
      throw new Error("Formato inválido");
    }

    const corrigido = normalizarBasesImportadas(array);

    if (
      !confirm(
        `Carregar ${corrigido.length} base(s) de ${origem}? Isso substituirá os dados atuais.`
      )
    ) {
      return false;
    }

    setBases(corrigido);

    const dataImportacao =
      !Array.isArray(json) && typeof json.exportedAt === "string"
        ? new Date(json.exportedAt)
        : new Date();

    setUltimaImportacao(dataImportacao);
    localStorage.setItem(LAST_IMPORT_KEY, dataImportacao.toISOString());
    setJsonOriginal(JSON.stringify(corrigido));
    return true;
  };

  const addBase = () => {
    if (!nome || !mapa) return;

    if (
      material === "Personalizado" &&
      (!diasPersonalizados || Number(diasPersonalizados) <= 0)
    ) {
      alert("Informe uma quantidade válida de dias para o decay personalizado.");
      return;
    }
    if (bases.some((b) => b.nome.toLowerCase() === nome.toLowerCase())) {
      alert("Já existe uma base com esse nome.");
      return;
    }
    const novaBase = {
      id: uuidv4(),
      nome,
      material,
      diasPersonalizados:
        material === "Personalizado" ? Number(diasPersonalizados) : null,
      map: mapa,
      ultimaVisita: new Date(),
    };
    const novaLista = [...bases, novaBase];
    setBases(novaLista);
    setNome("");
    setMapa("");
    setMaterial("Metal");
    setDiasPersonalizados("");
  };

  const exportar = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      bases,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "bases-decay.json";
    link.click();
    setJsonOriginal(JSON.stringify(bases));
    localStorage.setItem(LAST_EXPORT_KEY, new Date().toISOString());
  };

  const importar = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evento) => {
      try {
        const json = JSON.parse(evento.target.result);
        aplicarImportacao(json, "arquivo");
      } catch {
        alert("Erro ao importar JSON");
      } finally {
        e.target.value = "";
      }
    };
    reader.readAsText(file);
  };

  const carregarDoGithub = async () => {
    try {
      const resposta = await fetch(`${GITHUB_DECAY_URL}?t=${Date.now()}`, {
        cache: "no-store",
      });

      if (!resposta.ok) {
        throw new Error(`GitHub respondeu com status ${resposta.status}`);
      }

      const json = await resposta.json();
      const importado = aplicarImportacao(json, "GitHub");

      if (importado) {
        alert("Save de decay carregado do GitHub com sucesso!");
      }
    } catch (erro) {
      console.error("Erro ao carregar decayTimers.json do GitHub:", erro);
      alert("Não foi possível carregar o decayTimers.json do GitHub.");
    }
  };

  const copiarJson = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      bases,
    };
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    alert("JSON copiado para a área de transferência!");
    setJsonOriginal(JSON.stringify(bases));
    localStorage.setItem(LAST_EXPORT_KEY, new Date().toISOString());
  };

  const colarJson = async () => {
    try {
      const texto = await navigator.clipboard.readText();
      const json = JSON.parse(texto);
      aplicarImportacao(json, "área de transferência");
    } catch {
      alert("Erro ao colar JSON");
    }
  };

  const resetarBase = (id) => {
    const novaLista = bases.map((base) =>
      base.id === id ? { ...base, ultimaVisita: new Date() } : base
    );
    setBases(novaLista);
  };

  const abrirEdicao = (id) => {
    const base = bases.find((b) => b.id === id);
    if (base) {
      setEditNome(base.nome);
      setEditMaterial(base.material);
      setEditDiasPersonalizados(base.diasPersonalizados ?? "");
      setEditMapa(base.map);
      setModalId(id);
    }
  };

  const salvarEdicao = () => {
    if (
      editMaterial === "Personalizado" &&
      (!editDiasPersonalizados || Number(editDiasPersonalizados) <= 0)
    ) {
      alert("Informe uma quantidade válida de dias para o decay personalizado.");
      return;
    }

    if (
      bases.some(
        (b) => b.nome.toLowerCase() === editNome.toLowerCase() && b.id !== modalId
      )
    ) {
      alert("Já existe uma base com esse nome.");
      return;
    }
    const novaLista = bases.map((base) =>
      base.id === modalId
        ? {
            ...base,
            nome: editNome,
            material: editMaterial,
            diasPersonalizados:
              editMaterial === "Personalizado"
                ? Number(editDiasPersonalizados)
                : null,
            map: editMapa,
          }
        : base
    );
    setBases(novaLista);
    setModalId(null);
  };

  const excluirBase = (id) => {
    if (confirm("Tem certeza que deseja excluir esta base?")) {
      const novaLista = bases.filter((base) => base.id !== id);
      setBases(novaLista);
    }
  };

  const toggleMapa = (map) => {
    setFiltros((prev) => ({ ...prev, [map]: !prev[map] }));
  };

  const mostrarTodos = () => {
    const novo = {};
    mapasUnicos.forEach((m) => (novo[m] = true));
    setFiltros(novo);
  };

  const esconderTodos = () => {
    const novo = {};
    mapasUnicos.forEach((m) => (novo[m] = false));
    setFiltros(novo);
  };

  const calcularTempoRestanteMs = (base) => {
    const dias = obterDiasDecay(base);
    const msPassados = new Date() - new Date(base.ultimaVisita);
    return dias * 24 * 60 * 60 * 1000 - msPassados;
  };

  const calcularTempoRestante = (base) => {
    const msRestantes = calcularTempoRestanteMs(base);
    if (msRestantes <= 0) return { texto: "⚠️ Expirada", cor: "crimson" };
    const totalHoras = Math.floor(msRestantes / (1000 * 60 * 60));
    const diasRestantes = Math.floor(totalHoras / 24);
    const horasRestantes = totalHoras % 24;
    const cor = msRestantes < 24 * 60 * 60 * 1000 ? "var(--cor-laranja)" : "inherit";
    return { texto: `${diasRestantes}d ${horasRestantes}h`, cor };
  };

  const mapasUnicos = [...new Set(bases.map((b) => b.map))];
  const filtradas = bases.filter((b) => filtros[b.map] ?? true);
  const basesOrdenadas = [...filtradas].sort(
    (a, b) => calcularTempoRestanteMs(a) - calcularTempoRestanteMs(b)
  );

  return (
    <div className="conversor-container">
      <h1>⏳ Timer de Decay</h1>

      {/* Formulário */}
      <section className="ferramenta" >
        <h2>Adicionar Base</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {Object.keys(DECAY_TIMES).map((mat) => (
              <label key={mat} style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                <input
                  type="radio"
                  name="material"
                  value={mat}
                  checked={material === mat}
                  onChange={() => setMaterial(mat)}
                />
                {mat} ({DECAY_TIMES[mat]}d)
              </label>
            ))}
            <label style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
              <input
                type="radio"
                name="material"
                value="Personalizado"
                checked={material === "Personalizado"}
                onChange={() => setMaterial("Personalizado")}
              />
              Personalizado
            </label>

            {material === "Personalizado" && (
              <label style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                <input
                  className="input-text"
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={diasPersonalizados}
                  onChange={(e) => setDiasPersonalizados(e.target.value)}
                  placeholder="Dias"
                  style={{ width: "85px" }}
                />
                dias
              </label>
            )}
          </div>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
            <input
              className="input-text"
              placeholder="Nome da base"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              style={{ flexGrow: 1 }}
            />
            <input
              className="input-text"
              placeholder="ID do mapa"
              value={mapa}
              onChange={(e) => setMapa(e.target.value)}
              style={{ width: "100px" }}
            />
            <button onClick={addBase}>Adicionar</button>
          </div>
        </div>
      </section>

      {/* Import / Export + Filtros */}
      <section className="ferramenta" style={{ display: "flex", gap: "2rem", flexWrap: "wrap"}}>
        <div>
          <h2>Importar / Exportar</h2>
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <button
              onClick={exportar}
              title="Exportar JSON para arquivo"
              className={dadosAlterados ? "pulsar" : ""}
            >
              💾
            </button>
            <label className="btn-config" title="Importar JSON de arquivo">
              📂
              <input type="file" onChange={importar} style={{ display: "none" }} />
            </label>
            <button
              onClick={copiarJson}
              title="Copiar JSON para área de transferência"
              className={dadosAlterados ? "pulsar" : ""}
            >
              📋
            </button>
            <button onClick={colarJson} title="Colar JSON da área de transferência">📥</button>
            <button
              onClick={carregarDoGithub}
              title="Carregar decayTimers.json do GitHub"
            >
              ☁️
            </button>
          </div>
          <p style={{ fontSize: "0.8rem", color: "gray" }}>
            Última importação: {ultimaImportacao?.toLocaleString() || "-"}
          </p>
        </div>

        <div>
          <h2>Filtros</h2>
          <div className="item-grid">
            {mapasUnicos.map((m) => (
              <button
                key={m}
                onClick={() => toggleMapa(m)}
                style={{ textDecoration: filtros[m] === false ? "line-through" : "none" }}
              >
                {m}
              </button>
            ))}
            <button onClick={mostrarTodos}>Mostrar Todos</button>
            <button onClick={esconderTodos}>Ocultar Todos</button>
          </div>
        </div>
      </section>

      {/* Tabela de Bases */}
      {basesOrdenadas.length > 0 && (
        <section className="ferramenta">
          <h2>Bases Cadastradas</h2>
          <table>
            <thead>
              <tr>
                <th>Mapa</th>
                <th>Nome</th>
                <th>Material</th>
                <th>Última Visita</th>
                <th>Tempo Restante</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {basesOrdenadas.map((base) => {
                const tempo = calcularTempoRestante(base);
                return (
                  <tr key={base.id}>
                    <td>{base.map}</td>
                    <td>{base.nome}</td>
                    <td>
                      {base.material === "Personalizado"
                        ? `Personalizado (${obterDiasDecay(base)}d)`
                        : base.material}
                    </td>
                    <td>{new Date(base.ultimaVisita).toLocaleString()}</td>
                    <td style={{ color: tempo.cor }}>{tempo.texto}</td>
                    <td>
                      <button onClick={() => resetarBase(base.id)}>🏠</button>
                      <button onClick={() => abrirEdicao(base.id)}>✏️</button>
                      <button onClick={() => excluirBase(base.id)}>🗑️</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>
      )}

      {/* Modal */}
      {modalId !== null && (
        <div className="modal-config">
          <div className="modal-content">
            <h2>Editar Base</h2>
            <input
              className="input-text"
              value={editNome}
              onChange={(e) => setEditNome(e.target.value)}
              placeholder="Nome"
            />
            <input
              className="input-text"
              value={editMapa}
              onChange={(e) => setEditMapa(e.target.value)}
              placeholder="ID do mapa"
            />
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {Object.keys(DECAY_TIMES).map((mat) => (
                <label key={mat} style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                  <input
                    type="radio"
                    name="editMaterial"
                    value={mat}
                    checked={editMaterial === mat}
                    onChange={() => setEditMaterial(mat)}
                  />
                  {mat} ({DECAY_TIMES[mat]}d)
                </label>
              ))}
              <label style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                <input
                  type="radio"
                  name="editMaterial"
                  value="Personalizado"
                  checked={editMaterial === "Personalizado"}
                  onChange={() => setEditMaterial("Personalizado")}
                />
                Personalizado
              </label>

              {editMaterial === "Personalizado" && (
                <label style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                  <input
                    className="input-text"
                    type="number"
                    min="0.1"
                    step="0.1"
                    value={editDiasPersonalizados}
                    onChange={(e) => setEditDiasPersonalizados(e.target.value)}
                    placeholder="Dias"
                    style={{ width: "85px" }}
                  />
                  dias
                </label>
              )}
            </div>
            <div style={{ display: "flex", gap: "1rem" }}>
              <button onClick={salvarEdicao}>Salvar</button>
              <button onClick={() => setModalId(null)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
