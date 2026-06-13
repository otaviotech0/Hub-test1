import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Calendar,
  CheckSquare,
  Timer,
  FileText,
  Settings,
  LogOut,
} from "lucide-react";
import "../style/Layout.css";

export default function Layout({ user, setUser }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <div className="apple-dashboard-container">
      <aside className="apple-sidebar">
        <div className="sidebar-logo">
          <span className="logo-text">Hub de Estudantes</span>
        </div>

        <nav className="sidebar-nav">
          <NavLink
            to="/"
            end
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          >
            <LayoutDashboard className="nav-icon" size={20} />
            <span>Início</span>
          </NavLink>

          <NavLink
            to="/calendario"
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          >
            <Calendar className="nav-icon" size={20} />
            <span>Calendário</span>
          </NavLink>

          <NavLink
            to="/tarefas"
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          >
            <CheckSquare className="nav-icon" size={20} />
            <span>Tarefas</span>
          </NavLink>

          <NavLink
            to="/foco"
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          >
            <Timer className="nav-icon" size={20} />
            <span>Sessões de Foco</span>
          </NavLink>

          <NavLink
            to="/notes"
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          >
            <FileText className="nav-icon" size={20} />
            <span>Notas</span>
          </NavLink>

          <NavLink
            to="/settings"
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          >
            <Settings className="nav-icon" size={20} />
            <span>Configurações</span>
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          {user?.username && (
            <p className="sidebar-user">{user.username}</p>
          )}
          <button type="button" className="btn-logout" onClick={handleLogout}>
            <LogOut size={18} />
            Sair
          </button>
        </div>
      </aside>

      <div className="main-content-wrapper">
        <Outlet />
      </div>
    </div>
  );
}
