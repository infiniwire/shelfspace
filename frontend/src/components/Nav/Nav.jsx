import { Link, useNavigate } from "react-router-dom";
import "./Nav.css";

function Nav() {
  const navigate = useNavigate();

  async function handleLogout() {
    await fetch("/api/logout", { method: "POST" });
    navigate("/login");
  }

  return (
    <nav className="app-nav">
      <Link to="/library" className="app-nav-brand">ShelfSpace</Link>
      <div className="app-nav-links">
        <Link to="/library">My Library</Link>
        <button onClick={handleLogout} className="app-nav-logout">Log out</button>
      </div>
    </nav>
  );
}

export default Nav;