import { Link } from "react-router-dom"
import './Navbar.css'
function Navbar() {
  return (
    <nav className="navbar">
        <h2>Black Box Toolbox</h2>
        <img src="/box.svg" alt="" />
        <Link to="/" className="linkNavbar">Conversor Tek</Link>
        <Link to="/imprinttimers" className="linkNavbar">Imprint Timers</Link>
        {/* <img src="/box.svg" alt="" /> */}
    </nav>
  )
}

export default Navbar
