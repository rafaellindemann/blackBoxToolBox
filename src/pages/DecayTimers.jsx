import { useState, useEffect } from "react";
import "./ConversorTek.css";

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

export default function DecayTimers() {
  const [bases, setBases] = useState([]);
  const [nome, setNome] = useState("");
  const [material, setMaterial] = useState("Thatch");
  const [modalIndex, setModalIndex] = useState(null);
  const [editNome, setEditNome] = useState("");
  const [editMaterial, setEditMaterial] = useState("Thatch");

  useEffect(() => {
    const salvas = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (salvas) setBases(salvas);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bases));
  }, [bases]);

  const addBase = () => {
    if (!nome) return;
    setBases([
      ...bases,
      {
        nome,
        material,
        ultimaVisita: new Date(),
      },
    ]);
    setNome("");
    setMaterial("Thatch");
  };

  const resetarBase = (index) => {
    const novaLista = [...bases];
    novaLista[index].ultimaVisita = new Date();
    setBases(novaLista);
  };

  const abrirEdicao = (index) => {
    setEditNome(bases[index].nome);
    setEditMaterial(bases[index].material);
    setModalIndex(index);
  };

  const salvarEdicao = () => {
    const novaLista = [...bases];
    novaLista[modalIndex].nome = editNome;
    novaLista[modalIndex].material = editMaterial;
    setBases(novaLista);
    setModalIndex(null);
  };

  const excluirBase = (index) => {
    if (confirm("Tem certeza que deseja excluir esta base?")) {
      const novaLista = bases.filter((_, i) => i !== index);
      setBases(novaLista);
    }
  };

  const calcularTempoRestanteMs = (base) => {
    const dias = DECAY_TIMES[base.material] || 0;
    const msPassados = new Date() - new Date(base.ultimaVisita);
    return dias * 24 * 60 * 60 * 1000 - msPassados;
  };

  const calcularTempoRestante = (base) => {
    const msRestantes = calcularTempoRestanteMs(base);
    if (msRestantes <= 0) return { texto: '⚠️ Expirada', cor: 'crimson' };
    const totalHoras = Math.floor(msRestantes / (1000 * 60 * 60));
    const diasRestantes = Math.floor(totalHoras / 24);
    const horasRestantes = totalHoras % 24;
    const cor = msRestantes < 24 * 60 * 60 * 1000 ? 'var(--cor-laranja)' : 'inherit';
    return { texto: `${diasRestantes}d ${horasRestantes}h`, cor };
  };

  const basesOrdenadas = [...bases].sort((a, b) => calcularTempoRestanteMs(a) - calcularTempoRestanteMs(b));

  return (
    <div className="conversor-container">
      <h1>⏳ Timer de Decay</h1>

      <section className="ferramenta">
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
          </div>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
            <input
              className="input-text"
              placeholder="Nome da base"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              style={{ flexGrow: 1, minWidth: "200px" }}
            />
            <button onClick={addBase}>Adicionar</button>
          </div>

        </div>
      </section>

      {bases.length > 0 && (
        <section className="ferramenta">
          <h2>Bases Cadastradas</h2>
          <table>
            <thead>
              <tr>
                <th style={{ textAlign: "center" }}>Nome</th>
                <th style={{ textAlign: "center" }}>Material</th>
                <th style={{ textAlign: "center" }}>Última Visita</th>
                <th style={{ textAlign: "center" }}>Tempo Restante</th>
                <th style={{ textAlign: "center" }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {basesOrdenadas.map((base, i) => {
                const tempo = calcularTempoRestante(base);
                return (
                  <tr key={i}>
                    <td style={{ textAlign: "center" }}>{base.nome}</td>
                    <td style={{ textAlign: "center" }}>{base.material}</td>
                    <td style={{ textAlign: "center" }}>{new Date(base.ultimaVisita).toLocaleString()}</td>
                    <td style={{ textAlign: "center", color: tempo.cor }}>{tempo.texto}</td>
                    <td style={{ textAlign: "center" }}>
                      <button onClick={() => resetarBase(i)}>🏠 Visitei</button>{" "}
                      <button onClick={() => abrirEdicao(i)}>✏️</button>{" "}
                      <button onClick={() => excluirBase(i)}>🗑️</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>
      )}

      {modalIndex !== null && (
        <div className="modal-config">
          <div className="modal-content">
            <h2>Editar Base</h2>
            <input
              className="input-text"
              value={editNome}
              onChange={(e) => setEditNome(e.target.value)}
              placeholder="Nome"
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
            </div>
            <div style={{ display: "flex", gap: "1rem" }}>
              <button onClick={salvarEdicao}>Salvar</button>
              <button onClick={() => setModalIndex(null)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

