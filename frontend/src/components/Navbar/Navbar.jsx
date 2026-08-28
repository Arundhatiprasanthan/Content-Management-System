import { FiBell, FiBookOpen, FiSearch, FiUser } from "react-icons/fi";
import { LuLayoutDashboard } from "react-icons/lu";
import { NavLink } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <div className="navbar-container">
      <div className="logo">
        <div className="logo-icon-box">
          <FiBookOpen />
        </div>
        <h2>Lumen</h2>
      </div>
      <div className="navigation-link">
        <NavLink
          to="/home"
          className={({ isActive }) =>
            `navigation-button ${isActive ? "active" : ""}`
          }
        >
          <LuLayoutDashboard />
          <span>Home</span>
        </NavLink>

        <NavLink
          to="/browse"
          className={({ isActive }) =>
            `navigation-button ${isActive ? "active" : ""}`
          }
        >
          <FiSearch />
          <span>Browse</span>
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `navigation-button ${isActive ? "active" : ""}`
          }
        >
          <FiUser />
          <span>Profile</span>
        </NavLink>
      </div>
      <div className="user-info">
        <span>Lena Kaufmann(Reader)</span>
        <FiBell />
        <div className="user-avatar">LK</div>
      </div>
    </div>
  );
}
export default Navbar;
