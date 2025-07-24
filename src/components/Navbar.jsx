import { Link } from "react-router-dom"
import './Navbar.css'

function Navbar() {
  return (
    <nav className="navbar">
        <h2>Black Box Toolbox</h2>
        <img src="/box.svg" alt="" />
        <div>
          <Link to="/" className="linkNavbar">Conversor Tek</Link>
          <Link to="/pagador" className="linkNavbar">Pagador Tek</Link>
          <Link to="/tradutor" className="linkNavbar">Tradutor Tek</Link>
          {/* <Link to="/imprinttimers" className="linkNavbar">Imprint Timers</Link> */}
        </div>
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
