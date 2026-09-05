import { useMemo, useState } from "react";
import {
  TEKGRAM_BOSSES,
  TEKGRAM_COLUMNS,
  TEKGRAMS,
} from "../data/tekgramsData";
import "./Tekgrams.css";

const SOURCE_URL = "https://ark.wiki.gg/pt-br/wiki/Table_of_Tekgrams";

const normalizarBusca = (texto) =>
  texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

const menorDificuldadeNoBoss = (tekgram, boss) => {
  const indices = boss.columns
    .map((columnId, index) => (tekgram.unlocks.includes(columnId) ? index : null))
    .filter((index) => index !== null);

  return indices.length ? Math.min(...indices) : Infinity;
};

export default function Tekgrams() {
  const [bossSelecionado, setBossSelecionado] = useState(null);
  const [tekgramSelecionado, setTekgramSelecionado] = useState(null);
  const [filtroBoss, setFiltroBoss] = useState("");
  const [filtroTekgram, setFiltroTekgram] = useState("");

  const bossesOrdenados = useMemo(() => {
    const filtro = normalizarBusca(filtroBoss);
    let lista = TEKGRAM_BOSSES.filter((boss) =>
      normalizarBusca(boss.name).includes(filtro)
    );

    if (!tekgramSelecionado) return lista;

    const tekgram = TEKGRAMS.find((item) => item.id === tekgramSelecionado);
    if (!tekgram) return lista;

    return [...lista].sort((a, b) => {
      const diffA = menorDificuldadeNoBoss(tekgram, a);
      const diffB = menorDificuldadeNoBoss(tekgram, b);

      if (diffA !== diffB) return diffA - diffB;
      return TEKGRAM_BOSSES.findIndex((boss) => boss.id === a.id) -
        TEKGRAM_BOSSES.findIndex((boss) => boss.id === b.id);
    });
  }, [tekgramSelecionado, filtroBoss]);

  const colunasOrdenadas = useMemo(
    () =>
      bossesOrdenados.flatMap((boss) =>
        boss.columns
          .map((columnId) => TEKGRAM_COLUMNS.find((col) => col.id === columnId))
          .filter(Boolean)
      ),
    [bossesOrdenados]
  );

  const tekgramsOrdenados = useMemo(() => {
    const filtro = normalizarBusca(filtroTekgram);
    let lista = TEKGRAMS.filter((tekgram) =>
      normalizarBusca(tekgram.name).includes(filtro)
    );

    if (!bossSelecionado) return lista;

    const boss = TEKGRAM_BOSSES.find((item) => item.id === bossSelecionado);
    if (!boss) return lista;

    return [...lista].sort((a, b) => {
      const diffA = menorDificuldadeNoBoss(a, boss);
      const diffB = menorDificuldadeNoBoss(b, boss);

      if (diffA !== diffB) return diffA - diffB;
      return a.originalIndex - b.originalIndex;
    });
  }, [bossSelecionado, filtroTekgram]);

  const resetarOrdenacao = () => {
    setBossSelecionado(null);
    setTekgramSelecionado(null);
  };

  const bossTemTekgramSelecionado = (boss) => {
    if (!tekgramSelecionado) return false;
    const tekgram = TEKGRAMS.find((item) => item.id === tekgramSelecionado);
    return tekgram?.unlocks.some((columnId) => boss.columns.includes(columnId));
  };

  return (
    <div className="tekgrams-container">
      <header className="tekgrams-header">
        <div>
          <h1>⚙️ Tekgrams</h1>
          <p>
            Clique em um boss para trazer os Tekgrams dele para cima. Clique em um
            Tekgram para trazer à esquerda os bosses que o liberam.
          </p>
        </div>
        <a href={SOURCE_URL} target="_blank" rel="noreferrer" className="tekgrams-source">
          Fonte: ARK Wiki ↗
        </a>
      </header>

      <section className="tekgrams-toolbar">
        <label>
          <span>Buscar Tekgram</span>
          <input
            value={filtroTekgram}
            onChange={(e) => setFiltroTekgram(e.target.value)}
            placeholder="Ex.: Tek Teleporter"
          />
        </label>

        <label>
          <span>Buscar Boss</span>
          <input
            value={filtroBoss}
            onChange={(e) => setFiltroBoss(e.target.value)}
            placeholder="Ex.: Dragon"
          />
        </label>

        <div className="tekgrams-selection-summary">
          <div>
            <span>Boss selecionado</span>
            <strong>
              {TEKGRAM_BOSSES.find((boss) => boss.id === bossSelecionado)?.name || "—"}
            </strong>
          </div>
          <div>
            <span>Tekgram selecionado</span>
            <strong>
              {TEKGRAMS.find((tekgram) => tekgram.id === tekgramSelecionado)?.name || "—"}
            </strong>
          </div>
        </div>

        <button
          type="button"
          className="tekgrams-reset"
          onClick={resetarOrdenacao}
          disabled={!bossSelecionado && !tekgramSelecionado}
        >
          ↺ Restaurar ordem
        </button>
      </section>

      <section className="tekgrams-card">
        <div className="tekgrams-table-wrap">
          <table className="tekgrams-table">
            <thead>
              <tr className="boss-row">
                <th className="sticky-name tekgram-label-head" rowSpan="2">
                  Tekgram
                </th>
                {bossesOrdenados.map((boss) => (
                  <th
                    key={boss.id}
                    colSpan={boss.columns.length}
                    className={`boss-head ${
                      bossSelecionado === boss.id ? "selected" : ""
                    } ${bossTemTekgramSelecionado(boss) ? "matches-row" : ""}`}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setBossSelecionado((atual) =>
                          atual === boss.id ? null : boss.id
                        )
                      }
                      title={`Ordenar Tekgrams por ${boss.name}`}
                    >
                      {boss.name}
                    </button>
                  </th>
                ))}
              </tr>

              <tr className="difficulty-row">
                {colunasOrdenadas.map((coluna) => (
                  <th key={coluna.id} title={coluna.difficultyLabel}>
                    {coluna.difficulty === "S" ? "S" : coluna.difficulty}
                  </th>
                ))}
              </tr>

              <tr className="meta-row required-row">
                <th className="sticky-name">Nível exigido</th>
                {colunasOrdenadas.map((coluna) => (
                  <td key={coluna.id}>{coluna.requiredLevel || "—"}</td>
                ))}
              </tr>

              <tr className="meta-row element-row">
                <th className="sticky-name">Element</th>
                {colunasOrdenadas.map((coluna) => (
                  <td key={coluna.id}>{coluna.element ?? "—"}</td>
                ))}
              </tr>
            </thead>

            <tbody>
              {tekgramsOrdenados.map((tekgram) => {
                const selecionado = tekgramSelecionado === tekgram.id;
                return (
                  <tr key={tekgram.id} className={selecionado ? "selected-row" : ""}>
                    <th className="sticky-name tekgram-name-cell">
                      <button
                        type="button"
                        onClick={() =>
                          setTekgramSelecionado((atual) =>
                            atual === tekgram.id ? null : tekgram.id
                          )
                        }
                        title={`Ordenar bosses que liberam ${tekgram.name}`}
                      >
                        {tekgram.name}
                      </button>
                    </th>

                    {colunasOrdenadas.map((coluna) => {
                      const libera = tekgram.unlocks.includes(coluna.id);
                      return (
                        <td
                          key={coluna.id}
                          className={libera ? "unlocks" : ""}
                          title={
                            libera
                              ? `${coluna.boss} — ${coluna.difficultyLabel}`
                              : undefined
                          }
                        >
                          {libera ? "✓" : ""}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {tekgramsOrdenados.length === 0 && (
          <div className="tekgrams-empty">Nenhum Tekgram encontrado.</div>
        )}
      </section>

      <p className="tekgrams-note">
        Dificuldades maiores de um mesmo boss também concedem os Tekgrams das
        dificuldades anteriores.
      </p>
    </div>
  );
}
