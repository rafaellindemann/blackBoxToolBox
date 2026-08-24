import { useEffect, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import "./StatusMix.css";

const STORAGE_KEY = "statusMixState";

const STATUS = [
  { key: "vida", label: "Vida" },
  { key: "dano", label: "Dano" },
  { key: "estamina", label: "Estamina" },
  { key: "velocidade", label: "Velocidade" },
  { key: "peso", label: "Peso" },
  { key: "oxigenio", label: "Oxigênio" },
  { key: "comida", label: "Comida" },
];

const FORM_VAZIO = {
  especie: "",
  nome: "",
  genero: "Macho",
  vida: "",
  dano: "",
  estamina: "",
  velocidade: "",
  peso: "",
  oxigenio: "",
  comida: "",
};

const normalizarNumero = (valor) => {
  if (valor === "" || valor === null || valor === undefined) return null;
  const numero = Number(String(valor).replace(",", "."));
  return Number.isFinite(numero) ? numero : null;
};

const formatarStatus = (valor) => {
  if (valor === null || valor === undefined) return "—";
  return Number.isInteger(valor)
    ? valor.toLocaleString("pt-BR")
    : valor.toLocaleString("pt-BR", { maximumFractionDigits: 2 });
};

const calcularNivel = (dino) =>
  STATUS.reduce((soma, { key }) => soma + (normalizarNumero(dino[key]) ?? 0), 0) + 1;

export default function StatusMix() {
  const [especies, setEspecies] = useState([]);
  const [dinos, setDinos] = useState([]);
  const [form, setForm] = useState(FORM_VAZIO);
  const [especieFiltro, setEspecieFiltro] = useState("");
  const [modalEspecie, setModalEspecie] = useState(false);
  const [novaEspecie, setNovaEspecie] = useState("");
  const [editandoId, setEditandoId] = useState(null);

  useEffect(() => {
    try {
      const salvo = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (!salvo) return;

      const especiesSalvas = Array.isArray(salvo.especies) ? salvo.especies : [];
      const dinosSalvos = Array.isArray(salvo.dinos) ? salvo.dinos : [];

      setEspecies(especiesSalvas);
      setDinos(dinosSalvos);

      const primeira = salvo.especieFiltro || especiesSalvas[0] || "";
      setEspecieFiltro(primeira);
      setForm((prev) => ({ ...prev, especie: especiesSalvas[0] || "" }));
    } catch {
      console.warn("Não foi possível carregar os dados do Status Mix.");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ especies, dinos, especieFiltro })
    );
  }, [especies, dinos, especieFiltro]);

  useEffect(() => {
    if (!form.especie && especies.length > 0) {
      setForm((prev) => ({ ...prev, especie: especies[0] }));
    }
    if (!especieFiltro && especies.length > 0) {
      setEspecieFiltro(especies[0]);
    }
  }, [especies, form.especie, especieFiltro]);

  const dinosFiltrados = useMemo(
    () => dinos.filter((dino) => dino.especie === especieFiltro),
    [dinos, especieFiltro]
  );

  const melhoresStatus = useMemo(() => {
    const resultado = {};

    STATUS.forEach(({ key }) => {
      const valoresValidos = dinosFiltrados
        .map((dino) => ({ dino, valor: normalizarNumero(dino[key]) }))
        .filter(({ valor }) => valor !== null);

      if (valoresValidos.length === 0) {
        resultado[key] = { valor: null, dinos: [] };
        return;
      }

      const maior = Math.max(...valoresValidos.map(({ valor }) => valor));
      resultado[key] = {
        valor: maior,
        dinos: valoresValidos
          .filter(({ valor }) => valor === maior)
          .map(({ dino }) => dino.nome),
      };
    });

    return resultado;
  }, [dinosFiltrados]);

  const nivelPerfeito = useMemo(
    () =>
      STATUS.reduce(
        (soma, { key }) => soma + (melhoresStatus[key]?.valor ?? 0),
        0
      ) + 1,
    [melhoresStatus]
  );

  const nivelForm = useMemo(() => {
    const preenchidos = STATUS.every(
      ({ key }) => form[key] !== "" && normalizarNumero(form[key]) !== null
    );
    return preenchidos ? calcularNivel(form) : null;
  }, [form]);

  const alterarForm = (campo, valor) => {
    setForm((prev) => ({ ...prev, [campo]: valor }));
  };

  const limparForm = (especie = form.especie) => {
    setForm({ ...FORM_VAZIO, especie });
    setEditandoId(null);
  };

  const salvarDino = () => {
    if (!form.especie || !form.nome.trim()) {
      alert("Informe a espécie e o nome do dino.");
      return;
    }

    const statsInvalidos = STATUS.some(
      ({ key }) => form[key] === "" || normalizarNumero(form[key]) === null
    );

    if (statsInvalidos) {
      alert("Preencha os 7 status com valores numéricos.");
      return;
    }

    const statsNormalizados = STATUS.reduce(
      (acc, { key }) => ({ ...acc, [key]: normalizarNumero(form[key]) }),
      {}
    );

    const dados = {
      ...form,
      nome: form.nome.trim(),
      ...statsNormalizados,
      nivel: calcularNivel(statsNormalizados),
    };

    if (editandoId) {
      setDinos((prev) =>
        prev.map((dino) => (dino.id === editandoId ? { ...dino, ...dados } : dino))
      );
    } else {
      setDinos((prev) => [...prev, { id: uuidv4(), ...dados }]);
    }

    setEspecieFiltro(form.especie);
    limparForm(form.especie);
  };

  const editarDino = (dino) => {
    setForm({
      especie: dino.especie,
      nome: dino.nome,
      genero: dino.genero,
      ...STATUS.reduce((acc, { key }) => ({ ...acc, [key]: dino[key] }), {}),
    });
    setEditandoId(dino.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const excluirDino = (id) => {
    if (!confirm("Excluir este dino do Status Mix?")) return;
    setDinos((prev) => prev.filter((dino) => dino.id !== id));
    if (editandoId === id) limparForm();
  };

  const adicionarEspecie = () => {
    const nome = novaEspecie.trim();
    if (!nome) return;

    const jaExiste = especies.some(
      (especie) => especie.toLowerCase() === nome.toLowerCase()
    );

    if (jaExiste) {
      alert("Essa espécie já está cadastrada.");
      return;
    }

    const novasEspecies = [...especies, nome].sort((a, b) =>
      a.localeCompare(b, "pt-BR")
    );

    setEspecies(novasEspecies);
    setForm((prev) => ({ ...prev, especie: nome }));
    setEspecieFiltro(nome);
    setNovaEspecie("");
    setModalEspecie(false);
  };

  const removerEspecie = () => {
    if (!especieFiltro) return;
    const temDinos = dinos.some((dino) => dino.especie === especieFiltro);

    if (temDinos) {
      alert("Exclua os dinos desta espécie antes de remover a espécie.");
      return;
    }

    if (!confirm(`Remover a espécie ${especieFiltro}?`)) return;

    const novas = especies.filter((especie) => especie !== especieFiltro);
    setEspecies(novas);
    setEspecieFiltro(novas[0] || "");
    setForm((prev) => ({ ...prev, especie: novas[0] || "" }));
  };

  const exportarJsonClipboard = async () => {
    const dados = {
      versao: 1,
      exportedAt: new Date().toISOString(),
      especies,
      dinos,
      especieFiltro,
    };

    try {
      await navigator.clipboard.writeText(JSON.stringify(dados, null, 2));
      alert("JSON do Status Mix copiado para a área de transferência!");
    } catch {
      alert("Não foi possível acessar a área de transferência. Verifique a permissão do navegador.");
    }
  };

  const importarJsonClipboard = async () => {
    try {
      const texto = await navigator.clipboard.readText();
      const dados = JSON.parse(texto);

      if (!dados || !Array.isArray(dados.especies) || !Array.isArray(dados.dinos)) {
        throw new Error("Formato inválido");
      }

      const especiesImportadas = dados.especies
        .filter((especie) => typeof especie === "string" && especie.trim())
        .map((especie) => especie.trim());

      const dinosImportados = dados.dinos.map((dino) => {
        if (
          !dino ||
          typeof dino !== "object" ||
          typeof dino.especie !== "string" ||
          typeof dino.nome !== "string"
        ) {
          throw new Error("Dino inválido");
        }

        const stats = STATUS.reduce((acc, { key }) => {
          const valor = normalizarNumero(dino[key]);
          if (valor === null) throw new Error(`Status inválido: ${key}`);
          acc[key] = valor;
          return acc;
        }, {});

        return {
          ...dino,
          id: dino.id || uuidv4(),
          especie: dino.especie.trim(),
          nome: dino.nome.trim(),
          genero: dino.genero === "Fêmea" ? "Fêmea" : "Macho",
          ...stats,
          nivel: calcularNivel(stats),
        };
      });

      const especiesDosDinos = dinosImportados.map((dino) => dino.especie);
      const especiesFinais = [...new Set([...especiesImportadas, ...especiesDosDinos])]
        .sort((a, b) => a.localeCompare(b, "pt-BR"));

      const filtroImportado =
        typeof dados.especieFiltro === "string" &&
        especiesFinais.includes(dados.especieFiltro)
          ? dados.especieFiltro
          : especiesFinais[0] || "";

      if (
        !confirm(
          `Importar ${dinosImportados.length} dino(s) e ${especiesFinais.length} espécie(s)? Isso substituirá os dados atuais do Status Mix.`
        )
      ) {
        return;
      }

      setEspecies(especiesFinais);
      setDinos(dinosImportados);
      setEspecieFiltro(filtroImportado);
      setForm({ ...FORM_VAZIO, especie: filtroImportado });
      setEditandoId(null);

      alert("Dados importados com sucesso!");
    } catch {
      alert("Não foi possível importar. A área de transferência não contém um JSON válido do Status Mix.");
    }
  };

  const moverDino = (id, direcao) => {
    setDinos((prev) => {
      const indicesDaEspecie = prev
        .map((dino, index) => (dino.especie === especieFiltro ? index : -1))
        .filter((index) => index !== -1);

      const posicaoNaEspecie = indicesDaEspecie.findIndex(
        (index) => prev[index].id === id
      );
      const novaPosicao = posicaoNaEspecie + direcao;

      if (
        posicaoNaEspecie === -1 ||
        novaPosicao < 0 ||
        novaPosicao >= indicesDaEspecie.length
      ) {
        return prev;
      }

      const indexAtual = indicesDaEspecie[posicaoNaEspecie];
      const indexDestino = indicesDaEspecie[novaPosicao];
      const novaLista = [...prev];

      [novaLista[indexAtual], novaLista[indexDestino]] = [
        novaLista[indexDestino],
        novaLista[indexAtual],
      ];

      return novaLista;
    });
  };

  const ehMelhorStatus = (dino, key) => {
    const melhor = melhoresStatus[key]?.valor;
    const valor = normalizarNumero(dino[key]);
    return melhor !== null && valor === melhor;
  };

  return (
    <div className="statusmix-container">
      <div className="statusmix-header">
        <div>
          <h1>🧬 Status Mix</h1>
          <p>
            Cadastre seus dinos e descubra a combinação ideal de stats para cada espécie.
          </p>
        </div>
      </div>

      <section className="statusmix-card cadastro-card">
        <div className="section-title-row">
          <div>
            <h2>{editandoId ? "Editar Dino" : "Cadastrar Dino"}</h2>
            <p>Use os valores que você acompanha na sua linhagem.</p>
          </div>
          {editandoId && (
            <button className="btn-secundario" onClick={() => limparForm()}>
              Cancelar edição
            </button>
          )}
        </div>

        <div className="cadastro-grid cadastro-identidade">
          <label>
            <span>Espécie</span>
            <div className="species-picker">
              <select
                value={form.especie}
                onChange={(e) => alterarForm("especie", e.target.value)}
              >
                <option value="">Selecione...</option>
                {especies.map((especie) => (
                  <option key={especie} value={especie}>
                    {especie}
                  </option>
                ))}
              </select>
              <button
                type="button"
                className="btn-plus"
                title="Adicionar espécie"
                onClick={() => setModalEspecie(true)}
              >
                +
              </button>
            </div>
          </label>

          <label>
            <span>Nome</span>
            <input
              value={form.nome}
              onChange={(e) => alterarForm("nome", e.target.value)}
              placeholder="Ex.: Thor"
            />
          </label>

          <label>
            <span>Gênero</span>
            <select
              value={form.genero}
              onChange={(e) => alterarForm("genero", e.target.value)}
            >
              <option>Macho</option>
              <option>Fêmea</option>
            </select>
          </label>
        </div>

        <div className="stats-form-grid">
          {STATUS.map(({ key, label }) => (
            <label key={key}>
              <span>{label}</span>
              <input
                type="number"
                step="any"
                min="0"
                value={form[key]}
                onChange={(e) => alterarForm(key, e.target.value)}
                placeholder="0"
              />
            </label>
          ))}
        </div>

        <div className="nivel-preview">
          <span>Nível calculado</span>
          <strong>{nivelForm === null ? "—" : formatarStatus(nivelForm)}</strong>
          <small>Soma dos 7 status + 1</small>
        </div>

        <div className="form-actions">
          <button className="btn-principal" onClick={salvarDino}>
            {editandoId ? "Salvar alterações" : "Adicionar dino"}
          </button>
        </div>
      </section>

      <section className="statusmix-card filtro-card">
        <div className="section-title-row">
          <div>
            <h2>Mix por espécie</h2>
            <p>Escolha uma espécie para montar o melhor conjunto disponível.</p>
          </div>
          <div className="filter-controls">
            <select
              value={especieFiltro}
              onChange={(e) => setEspecieFiltro(e.target.value)}
            >
              <option value="">Selecione uma espécie...</option>
              {especies.map((especie) => (
                <option key={especie} value={especie}>
                  {especie}
                </option>
              ))}
            </select>
            <button
              className="btn-icone-perigo"
              onClick={removerEspecie}
              title="Remover espécie vazia"
              disabled={!especieFiltro}
            >
              🗑️
            </button>
          </div>
        </div>
      </section>

      <section className="statusmix-card transferencia-card">
        <div className="section-title-row">
          <div>
            <h2>Importar / Exportar</h2>
            <p>Copie toda a coleção como JSON ou restaure dados copiados anteriormente.</p>
          </div>
          <div className="clipboard-actions">
            <button
              type="button"
              className="btn-secundario"
              onClick={exportarJsonClipboard}
              title="Copiar JSON para a área de transferência"
            >
              📋 Exportar JSON
            </button>
            <button
              type="button"
              className="btn-secundario"
              onClick={importarJsonClipboard}
              title="Importar JSON da área de transferência"
            >
              📥 Importar JSON
            </button>
          </div>
        </div>
      </section>

      {especieFiltro && dinosFiltrados.length > 0 && (
        <>
          <section className="statusmix-card perfect-card">
            <div className="perfect-heading">
              <div>
                <span className="eyebrow">MELHOR COMBINAÇÃO DISPONÍVEL</span>
                <h2>🏆 {especieFiltro} perfeito</h2>
              </div>
              <div className="perfect-count">
                {dinosFiltrados.length} dino{dinosFiltrados.length !== 1 ? "s" : ""} analisado{dinosFiltrados.length !== 1 ? "s" : ""}
              </div>
            </div>

            <div className="perfect-stats-grid">
              <article className="perfect-stat perfect-level">
                <span className="perfect-label">Nível</span>
                <strong>{formatarStatus(nivelPerfeito)}</strong>
                <small>Soma dos melhores status + 1</small>
              </article>
              {STATUS.map(({ key, label }) => {
                const melhor = melhoresStatus[key];
                return (
                  <article className="perfect-stat" key={key}>
                    <span className="perfect-label">{label}</span>
                    <strong>{formatarStatus(melhor.valor)}</strong>
                    <small title={melhor.dinos.join(", ")}>
                      {melhor.dinos.length > 0 ? melhor.dinos.join(" • ") : "Sem dado"}
                    </small>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="statusmix-card lista-card">
            <div className="section-title-row">
              <div>
                <h2>Dinos cadastrados</h2>
                <p>Stats em destaque são os escolhidos para formar o dino perfeito.</p>
              </div>
            </div>

            <div className="table-wrap">
              <table className="statusmix-table">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Gênero</th>
                    <th>Nível</th>
                    {STATUS.map(({ key, label }) => (
                      <th key={key}>{label}</th>
                    ))}
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {dinosFiltrados.map((dino, index) => (
                    <tr key={dino.id}>
                      <td className="dino-name">{dino.nome}</td>
                      <td>{dino.genero}</td>
                      <td className="dino-level">{formatarStatus(calcularNivel(dino))}</td>
                      {STATUS.map(({ key }) => (
                        <td
                          key={key}
                          className={ehMelhorStatus(dino, key) ? "stat-winner" : ""}
                          title={
                            ehMelhorStatus(dino, key)
                              ? "Este stat entra no dino perfeito"
                              : undefined
                          }
                        >
                          {formatarStatus(normalizarNumero(dino[key]))}
                          {ehMelhorStatus(dino, key) && <span className="winner-mark">★</span>}
                        </td>
                      ))}
                      <td>
                        <div className="row-actions">
                          <button
                            onClick={() => moverDino(dino.id, -1)}
                            title="Mover para cima"
                            disabled={index === 0}
                          >
                            ↑
                          </button>
                          <button
                            onClick={() => moverDino(dino.id, 1)}
                            title="Mover para baixo"
                            disabled={index === dinosFiltrados.length - 1}
                          >
                            ↓
                          </button>
                          <button onClick={() => editarDino(dino)} title="Editar">
                            ✏️
                          </button>
                          <button onClick={() => excluirDino(dino.id)} title="Excluir">
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}

      {especieFiltro && dinosFiltrados.length === 0 && (
        <section className="statusmix-card empty-state">
          <span>🦖</span>
          <h2>Nenhum dino cadastrado</h2>
          <p>Cadastre um {especieFiltro} acima para começar a montar o mix.</p>
        </section>
      )}

      {!especieFiltro && (
        <section className="statusmix-card empty-state">
          <span>🧬</span>
          <h2>Crie sua primeira espécie</h2>
          <p>Use o botão + no cadastro para iniciar sua coleção.</p>
        </section>
      )}

      {modalEspecie && (
        <div className="statusmix-modal-backdrop" onMouseDown={() => setModalEspecie(false)}>
          <div className="statusmix-modal" onMouseDown={(e) => e.stopPropagation()}>
            <h2>Nova espécie</h2>
            <p>Ela ficará disponível tanto no cadastro quanto no filtro.</p>
            <input
              autoFocus
              value={novaEspecie}
              onChange={(e) => setNovaEspecie(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && adicionarEspecie()}
              placeholder="Ex.: Rex"
            />
            <div className="modal-actions">
              <button className="btn-secundario" onClick={() => setModalEspecie(false)}>
                Cancelar
              </button>
              <button className="btn-principal" onClick={adicionarEspecie}>
                Adicionar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
