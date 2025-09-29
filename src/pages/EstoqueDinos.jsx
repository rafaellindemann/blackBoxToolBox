import { useEffect, useState } from "react";
import "./ConversorTek.css";

const STORAGE_KEY = "estoqueDinos";

export default function EstoqueDinos() {
  const [dinos, setDinos] = useState([]);
  const [modoCard, setModoCard] = useState(true);
  const [editando, setEditando] = useState(null);
  const [filtro, setFiltro] = useState("");
  const [form, setForm] = useState({ nome: "", level: 0, macho: 0, femea: 0, descricao: "", credito: "", notas: "", imagem: "", tag: "" });

  useEffect(() => {
    const salvo = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (salvo) setDinos(salvo);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dinos));
  }, [dinos]);

  const limpar = () => setForm({ nome: "", level: 0, macho: 0, femea: 0, descricao: "", credito: "", notas: "", imagem: "", tag: "" });

  const salvar = () => {
    if (!form.nome) return alert("Informe o nome do dino");
    const novo = { ...form, level: parseInt(form.level), macho: parseInt(form.macho), femea: parseInt(form.femea) };
    const copia = [...dinos];
    if (editando !== null) {
      copia[editando] = novo;
    } else {
      copia.push(novo);
    }
    setDinos(copia);
    setEditando(null);
    limpar();
  };

  const editar = (index) => {
    setForm(dinos[index]);
    setEditando(index);
  };

  const excluir = (index) => {
    if (confirm("Excluir este dino?")) {
      setDinos(dinos.filter((_, i) => i !== index));
    }
  };

  const exportar = () => {
    const blob = new Blob([JSON.stringify(dinos, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "estoque-dinos.json";
    link.click();
  };

  const importar = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target.result);
        if (Array.isArray(json)) setDinos(json);
      } catch {
        alert("Erro ao importar JSON");
      }
    };
    reader.readAsText(file);
  };

  const listaFiltrada = dinos.filter((d) => d.nome.toLowerCase().includes(filtro.toLowerCase()));

  return (
    <div className="conversor-container">
      <h1>📦 Estoque de Dinos</h1>

      <section className="ferramenta">
        <h2>{editando !== null ? "Editar Dino" : "Adicionar Dino"}</h2>
        <div className="conversor-direto">
          <input className="input-text" placeholder="Nome" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} />
          <input className="input-number" type="number" placeholder="Level" value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })} />
          <input className="input-number" type="number" placeholder="Machos" value={form.macho} onChange={(e) => setForm({ ...form, macho: e.target.value })} />
          <input className="input-number" type="number" placeholder="Fêmeas" value={form.femea} onChange={(e) => setForm({ ...form, femea: e.target.value })} />
        </div>
        <div className="conversor-direto">
          <input className="input-text" placeholder="Imagem (URL)" value={form.imagem} onChange={(e) => setForm({ ...form, imagem: e.target.value })} style={{ flexGrow: 1 }} />
        </div>
        <div className="conversor-direto">
          <input className="input-text" placeholder="Descrição" value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} style={{ flexGrow: 1 }} />
          <input className="input-text" placeholder="Crédito" value={form.credito} onChange={(e) => setForm({ ...form, credito: e.target.value })} />
          <input className="input-text" placeholder="Notas" value={form.notas} onChange={(e) => setForm({ ...form, notas: e.target.value })} />
        </div>
        <div className="conversor-direto">
          <input className="input-text" placeholder="Badge (opcional ex: Clone, Reprodutor)" value={form.tag} onChange={(e) => setForm({ ...form, tag: e.target.value })} />
        </div>
        <div className="conversor-direto">
          <button onClick={salvar}>{editando !== null ? "Salvar" : "Adicionar"}</button>
          <button onClick={limpar}>Limpar</button>
          <button onClick={exportar}>Exportar JSON</button>
          <label className="btn-config">
            Importar JSON
            <input type="file" onChange={importar} style={{ display: "none" }} />
          </label>
          <button onClick={() => setModoCard(!modoCard)}>
            Modo: {modoCard ? "Cards" : "Tabela"}
          </button>
        </div>
      </section>

      <section className="ferramenta">
        <h2>Catálogo</h2>
        <input
          className="input-text"
          placeholder="🔍 Buscar por nome"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          style={{ width: "100%", maxWidth: 400, marginBottom: "1rem" }}
        />

        {modoCard ? (
          <div className="item-grid">
            {listaFiltrada.map((dino, i) => (
              <div key={i} style={{ background: "#222", border: "1px solid var(--cor-borda)", padding: "1rem", borderRadius: "8px", width: "220px" }}>
                {dino.imagem && <img src={dino.imagem} alt={dino.nome} style={{ width: "100%", borderRadius: "6px" }} />}
                <h3>{dino.nome} (Lv {dino.level})</h3>
                <p>♂ {dino.macho} / ♀ {dino.femea}</p>
                {dino.tag && <span style={{ background: "var(--cor-laranja)", color: "black", padding: "2px 6px", borderRadius: "6px", fontSize: "0.75rem" }}>{dino.tag}</span>}
                <p>{dino.descricao}</p>
                <small><i>{dino.credito}</i></small><br />
                <small>{dino.notas}</small>
                <div style={{ marginTop: "0.5rem" }}>
                  <button onClick={() => editar(i)}>✏️</button>{" "}
                  <button onClick={() => excluir(i)}>🗑️</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Level</th>
                <th>♂</th>
                <th>♀</th>
                <th>Descrição</th>
                <th>Crédito</th>
                <th>Notas</th>
                <th>Tag</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {listaFiltrada.map((dino, i) => (
                <tr key={i}>
                  <td>{dino.nome}</td>
                  <td>{dino.level}</td>
                  <td>{dino.macho}</td>
                  <td>{dino.femea}</td>
                  <td>{dino.descricao}</td>
                  <td>{dino.credito}</td>
                  <td>{dino.notas}</td>
                  <td>{dino.tag}</td>
                  <td>
                    <button onClick={() => editar(i)}>✏️</button>{" "}
                    <button onClick={() => excluir(i)}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}


// import { useEffect, useState } from "react";
// import "./ConversorTek.css";

// const STORAGE_KEY = "estoqueDinos";

// export default function EstoqueDinos() {
//   const [dinos, setDinos] = useState([]);
//   const [modoCard, setModoCard] = useState(true);
//   const [editando, setEditando] = useState(null);
//   const [form, setForm] = useState({ nome: "", level: 0, macho: 0, femea: 0, descricao: "", credito: "", notas: "", imagem: "" });

//   useEffect(() => {
//     const salvo = JSON.parse(localStorage.getItem(STORAGE_KEY));
//     if (salvo) setDinos(salvo);
//   }, []);

//   useEffect(() => {
//     localStorage.setItem(STORAGE_KEY, JSON.stringify(dinos));
//   }, [dinos]);

//   const limpar = () => setForm({ nome: "", level: 0, macho: 0, femea: 0, descricao: "", credito: "", notas: "", imagem: "" });

//   const salvar = () => {
//     if (!form.nome) return alert("Informe o nome do dino");
//     const novo = { ...form, level: parseInt(form.level), macho: parseInt(form.macho), femea: parseInt(form.femea) };
//     const copia = [...dinos];
//     if (editando !== null) {
//       copia[editando] = novo;
//     } else {
//       copia.push(novo);
//     }
//     setDinos(copia);
//     setEditando(null);
//     limpar();
//   };

//   const editar = (index) => {
//     setForm(dinos[index]);
//     setEditando(index);
//   };

//   const excluir = (index) => {
//     if (confirm("Excluir este dino?")) {
//       setDinos(dinos.filter((_, i) => i !== index));
//     }
//   };

//   const exportar = () => {
//     const blob = new Blob([JSON.stringify(dinos, null, 2)], { type: "application/json" });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement("a");
//     link.href = url;
//     link.download = "estoque-dinos.json";
//     link.click();
//   };

//   const importar = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     const reader = new FileReader();
//     reader.onload = (e) => {
//       try {
//         const json = JSON.parse(e.target.result);
//         if (Array.isArray(json)) setDinos(json);
//       } catch {
//         alert("Erro ao importar JSON");
//       }
//     };
//     reader.readAsText(file);
//   };

//   return (
//     <div className="conversor-container">
//       <h1>📦 Estoque de Dinos</h1>

//       <section className="ferramenta">
//         <h2>{editando !== null ? "Editar Dino" : "Adicionar Dino"}</h2>
//         <div className="conversor-direto">
//           <input className="input-text" placeholder="Nome" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} />
//           <input className="input-number" type="number" placeholder="Level" value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })} />
//           <input className="input-number" type="number" placeholder="Machos" value={form.macho} onChange={(e) => setForm({ ...form, macho: e.target.value })} />
//           <input className="input-number" type="number" placeholder="Fêmeas" value={form.femea} onChange={(e) => setForm({ ...form, femea: e.target.value })} />
//         </div>
//         <div className="conversor-direto">
//           <input className="input-text" placeholder="Imagem (URL)" value={form.imagem} onChange={(e) => setForm({ ...form, imagem: e.target.value })} style={{ flexGrow: 1 }} />
//         </div>
//         <div className="conversor-direto">
//           <input className="input-text" placeholder="Descrição" value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} style={{ flexGrow: 1 }} />
//           <input className="input-text" placeholder="Crédito" value={form.credito} onChange={(e) => setForm({ ...form, credito: e.target.value })} />
//           <input className="input-text" placeholder="Notas" value={form.notas} onChange={(e) => setForm({ ...form, notas: e.target.value })} />
//         </div>
//         <div className="conversor-direto">
//           <button onClick={salvar}>{editando !== null ? "Salvar" : "Adicionar"}</button>
//           <button onClick={limpar}>Limpar</button>
//           <button onClick={exportar}>Exportar JSON</button>
//           <label className="btn-config">
//             Importar JSON
//             <input type="file" onChange={importar} style={{ display: "none" }} />
//           </label>
//           <button onClick={() => setModoCard(!modoCard)}>
//             Modo: {modoCard ? "Cards" : "Tabela"}
//           </button>
//         </div>
//       </section>

//       <section className="ferramenta">
//         <h2>Catálogo</h2>
//         {modoCard ? (
//           <div className="item-grid">
//             {dinos.map((dino, i) => (
//               <div key={i} style={{ background: "#222", border: "1px solid var(--cor-borda)", padding: "1rem", borderRadius: "8px", width: "220px" }}>
//                 {dino.imagem && <img src={dino.imagem} alt={dino.nome} style={{ width: "100%", borderRadius: "6px" }} />}
//                 <h3>{dino.nome} (Lv {dino.level})</h3>
//                 <p>♂ {dino.macho} / ♀ {dino.femea}</p>
//                 <p>{dino.descricao}</p>
//                 <small><i>{dino.credito}</i></small><br />
//                 <small>{dino.notas}</small>
//                 <div style={{ marginTop: "0.5rem" }}>
//                   <button onClick={() => editar(i)}>✏️</button>{" "}
//                   <button onClick={() => excluir(i)}>🗑️</button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <table>
//             <thead>
//               <tr>
//                 <th>Nome</th>
//                 <th>Level</th>
//                 <th>♂</th>
//                 <th>♀</th>
//                 <th>Descrição</th>
//                 <th>Crédito</th>
//                 <th>Notas</th>
//                 <th>Ações</th>
//               </tr>
//             </thead>
//             <tbody>
//               {dinos.map((dino, i) => (
//                 <tr key={i}>
//                   <td>{dino.nome}</td>
//                   <td>{dino.level}</td>
//                   <td>{dino.macho}</td>
//                   <td>{dino.femea}</td>
//                   <td>{dino.descricao}</td>
//                   <td>{dino.credito}</td>
//                   <td>{dino.notas}</td>
//                   <td>
//                     <button onClick={() => editar(i)}>✏️</button>{" "}
//                     <button onClick={() => excluir(i)}>🗑️</button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </section>
//     </div>
//   );
// }
