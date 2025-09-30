import { useContext, useState } from "react";
import { GlobalContext } from "../contexts/GlobalContext";
import "./ConversorTek.css";

export default function EstoqueDinos() {
  const { estoqueDinos = [] } = useContext(GlobalContext);
  const [modo, setModo] = useState("cards");
  const [filtro, setFiltro] = useState("");
  const [badgeFiltro, setBadgeFiltro] = useState("");
  const [apenasBebe, setApenasBebe] = useState(false);

  const listaFiltrada = estoqueDinos.filter((dino) => {
    const nomeOk = dino.nome.toLowerCase().includes(filtro.toLowerCase());
    const badgeOk = badgeFiltro ? (dino.tag?.toLowerCase() === badgeFiltro.toLowerCase()) : true;
    const bebeOk = apenasBebe ? dino.apenasBebe === true : true;
    return nomeOk && badgeOk && bebeOk;
  });

  return (
    <div className="conversor-container">
      <h1>📦 Estoque de Dinos</h1>

      <section className="ferramenta">
        <div className="conversor-direto" style={{ flexWrap: "wrap", justifyContent: "center" }}>
          <input
            className="input-text"
            placeholder="🔍 Buscar por nome"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            style={{ maxWidth: 300 }}
          />

          <input
            className="input-text"
            placeholder="🎯 Filtrar por badge (ex: clone)"
            value={badgeFiltro}
            onChange={(e) => setBadgeFiltro(e.target.value)}
            style={{ maxWidth: 200 }}
          />

          <label style={{ marginLeft: "1rem" }}>
            <input
              type="checkbox"
              checked={apenasBebe}
              onChange={(e) => setApenasBebe(e.target.checked)}
            /> Apenas bebê 👶
          </label>

          <div style={{ marginLeft: "2rem" }}>
            <label>
              <input
                type="radio"
                name="modo"
                value="cards"
                checked={modo === "cards"}
                onChange={(e) => setModo(e.target.value)}
              /> Cards
            </label>
            <label style={{ marginLeft: "1rem" }}>
              <input
                type="radio"
                name="modo"
                value="tabela"
                checked={modo === "tabela"}
                onChange={(e) => setModo(e.target.value)}
              /> Tabela
            </label>
          </div>
        </div>
      </section>

      <section className="ferramenta">
        {modo === "cards" ? (
          <div className="flex-cards">
            {listaFiltrada.map((dino, i) => (
              <div key={i} style={{ background: "#222", border: "1px solid var(--cor-borda)", padding: "1rem", borderRadius: "8px", width: "220px" }}>
                {dino.imagem && <img src={dino.imagem} alt={dino.nome} style={{ width: "100%", borderRadius: "6px" }} />}
                <h3>{dino.nome} (Lv {dino.level})</h3>
                <p>♂ {dino.macho} / ♀ {dino.femea}</p>
                {dino.tag && <span style={{ background: "var(--cor-laranja)", color: "black", padding: "2px 6px", borderRadius: "6px", fontSize: "0.75rem" }}>{dino.tag}</span>}
                {dino.apenasBebe && <span title="Apenas bebê"> 👶</span>}
                <p>{dino.descricao}</p>
                <small><i>{dino.credito}</i></small><br />
                <small>{dino.notas}</small>
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
                <th>Bebê</th>
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
                  <td>{dino.apenasBebe ? "👶" : ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}



// import { useContext, useState } from "react";
// import { GlobalContext } from "../contexts/GlobalContext";
// import "./ConversorTek.css";

// export default function EstoqueDinos() {
//   const { estoqueDinos = [] } = useContext(GlobalContext);
//   const [modo, setModo] = useState("cards");
//   const [filtro, setFiltro] = useState("");
//   const [badgeFiltro, setBadgeFiltro] = useState("");

//   const listaFiltrada = estoqueDinos.filter((dino) => {
//     const nomeOk = dino.nome.toLowerCase().includes(filtro.toLowerCase());
//     const badgeOk = badgeFiltro ? (dino.tag?.toLowerCase() === badgeFiltro.toLowerCase()) : true;
//     return nomeOk && badgeOk;
//   });

//   return (
//     <div className="conversor-container">
//       <h1>📦 Estoque de Dinos</h1>

//       <section className="ferramenta">
//         <div className="conversor-direto" style={{ flexWrap: "wrap", justifyContent: "center" }}>
//           <input
//             className="input-text"
//             placeholder="🔍 Buscar por nome"
//             value={filtro}
//             onChange={(e) => setFiltro(e.target.value)}
//             style={{ maxWidth: 300 }}
//           />

//           <input
//             className="input-text"
//             placeholder="🎯 Filtrar por badge (ex: clone)"
//             value={badgeFiltro}
//             onChange={(e) => setBadgeFiltro(e.target.value)}
//             style={{ maxWidth: 200 }}
//           />

//           <div style={{ marginLeft: "2rem" }}>
//             <label>
//               <input
//                 type="radio"
//                 name="modo"
//                 value="cards"
//                 checked={modo === "cards"}
//                 onChange={(e) => setModo(e.target.value)}
//               /> Cards
//             </label>
//             <label style={{ marginLeft: "1rem" }}>
//               <input
//                 type="radio"
//                 name="modo"
//                 value="tabela"
//                 checked={modo === "tabela"}
//                 onChange={(e) => setModo(e.target.value)}
//               /> Tabela
//             </label>
//           </div>
//         </div>
//       </section>

//       <section className="ferramenta">
//         {modo === "cards" ? (
//           <div className="flex-cards">
//             {listaFiltrada.map((dino, i) => (
//               <div key={i} style={{ background: "#222", border: "1px solid var(--cor-borda)", padding: "1rem", borderRadius: "8px", width: "220px" }}>
//                 {dino.imagem && <img src={dino.imagem} alt={dino.nome} style={{ width: "100%", borderRadius: "6px" }} />}
//                 <h3>{dino.nome} (Lv {dino.level})</h3>
//                 <p>♂ {dino.macho} / ♀ {dino.femea}</p>
//                 {dino.tag && <span style={{ background: "var(--cor-laranja)", color: "black", padding: "2px 6px", borderRadius: "6px", fontSize: "0.75rem" }}>{dino.tag}</span>}
//                 <p>{dino.descricao}</p>
//                 <small><i>{dino.credito}</i></small><br />
//                 <small>{dino.notas}</small>
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
//                 <th>Tag</th>
//               </tr>
//             </thead>
//             <tbody>
//               {listaFiltrada.map((dino, i) => (
//                 <tr key={i}>
//                   <td>{dino.nome}</td>
//                   <td>{dino.level}</td>
//                   <td>{dino.macho}</td>
//                   <td>{dino.femea}</td>
//                   <td>{dino.descricao}</td>
//                   <td>{dino.credito}</td>
//                   <td>{dino.notas}</td>
//                   <td>{dino.tag}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </section>
//     </div>
//   );
// }
