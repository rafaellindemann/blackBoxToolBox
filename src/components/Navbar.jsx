import { Link } from "react-router-dom"
import { useState, useContext } from "react"
import { GlobalContext } from "../contexts/GlobalContext";
import './Navbar.css'
import { FaCog } from "react-icons/fa";

function Navbar() {
    const {
      tekValue,
      setTekValue,
      cotacoes,
      setCotacoes,
      visiveis,
      toggleVisibilidade,
      resetarTudo,
    } = useContext(GlobalContext);
    const [modalAberto, setModalAberto] = useState(false);
  return (
    <nav className="navbar">
        <h2>Black Box Toolbox</h2>
        <img src="/box.svg" alt="" />
        <div>
          <Link to="/" className="linkNavbar">Conversor Tek</Link>
          <Link to="/pagador" className="linkNavbar">Pagador Tek</Link>
          <Link to="/tradutor" className="linkNavbar">Tradutor Tek</Link>
          <Link to="/decaytimers" className="linkNavbar">Decay Timers</Link>
          {/* <Link to="/imprinttimers" className="linkNavbar">Imprint Timers</Link> */}
         <button onClick={() => setModalAberto(true)} className="btn-config">
           <FaCog />
         </button>
        </div>
        {modalAberto && (
          <div className="modal-config">
            <div className="modal-content">
              <h2>Escolha os itens visíveis</h2>
              <div className="item-grid">
                {cotacoes.map((item) => (
                  <button
                    key={item.nome}
                    onClick={() => toggleVisibilidade(item.nome)}
                    className={visiveis[item.nome] ? "ativo" : "inativo"}
                  >
                    {visiveis[item.nome] ? item.nome : <s>{item.nome}</s>}
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button onClick={resetarTudo} className="btn-fechar">Resetar Tudo</button>
                <button onClick={() => setModalAberto(false)} className="btn-fechar">Fechar</button>
              </div>
            </div>
          </div>
        )}
    </nav>
  )
}

export default Navbar



// import { Link } from "react-router-dom"
// import './Navbar.css'
// function Navbar() {
//   return (
//     <nav className="navbar">
//         <h2>Black Box Toolbox</h2>
//         <img src="/box.svg" alt="" />
//         <div>
//           <Link to="/" className="linkNavbar">Conversor Tek</Link>
//           {/* <Link to="/imprinttimers" className="linkNavbar">Imprint Timers</Link> */}
//         </div>
//         {/* <img src="/box.svg" alt="" /> */}
//     </nav>
//   )
// }

// export default Navbar
