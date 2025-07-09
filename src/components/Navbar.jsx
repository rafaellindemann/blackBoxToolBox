import { Link } from "react-router-dom"
import './Navbar.css'
function Navbar() {
  return (
    <nav className="navbar">
        <img src="/box.svg" alt="" />
        <Link to="/" className="linkNavbar">Conversor Tek</Link>
        <Link to="/imprinttimers" className="linkNavbar">Imprint Timers</Link>
        <img src="/box.svg" alt="" />
    </nav>
  )
}

export default Navbar
