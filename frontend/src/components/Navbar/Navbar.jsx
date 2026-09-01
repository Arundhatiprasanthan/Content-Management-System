import { FiBell, FiBookOpen, FiSearch, FiUser, FiEdit3 } from "react-icons/fi";
import { LuLayoutDashboard } from "react-icons/lu";
import { NavLink, Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();

  return (
    <div className="navbar-container">
      <Link to="/home" className="logo" style={{ textDecoration: "none", color: "inherit" }}>
        <div className="logo-icon-box">
          <FiBookOpen />
        </div>
        <h2>Lumen</h2>
      </Link>
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
          to="/author/article"
          className={({ isActive }) =>
            `navigation-button ${isActive ? "active" : ""}`
          }
        >
          <FiEdit3 />
          <span>Write</span>
        </NavLink>

        <NavLink
          to="/home"
          className={({ isActive }) =>
            `navigation-button ${isActive ? "active" : ""}`
          }
        >
          <FiUser />
          <span>Profile</span>
        </NavLink>
      </div>
      <div className="user-info">
        <select 
          defaultValue="reader"
          style={{
            background: "transparent",
            border: "1px solid #1c171422",
            borderRadius: "6px",
            padding: "4px 8px",
            fontFamily: "inherit",
            fontSize: "14px",
            color: "#1c1714",
            cursor: "pointer"
          }}
          onChange={(e) => {
            if (e.target.value === "author") {
              navigate("/author/article");
            } else {
              navigate("/home");
            }
          }}
        >
          <option value="reader">Lena Kaufmann (reader)</option>
          <option value="author">Priya Mehta (author)</option>
        </select>
        <FiBell style={{ cursor: "pointer", fontSize: "18px" }} />
        <div className="user-avatar">LK</div>
      </div>
    </div>
  );
}
export default Navbar;
