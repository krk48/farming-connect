import { NavLink, useNavigate } from "react-router-dom";
import { Sprout, Sun, Moon, LogOut } from "lucide-react";
import { useEffect, useState } from "react";

export default function Navbar({ loggedIn, setLoggedIn, userRole, setUserRole }) {
  const [dark, setDark] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldUseDark = storedTheme ? storedTheme === "dark" : prefersDark;

    setDark(shouldUseDark);
    document.documentElement.classList.toggle("dark", shouldUseDark);
  }, []);

  const toggleTheme = () => {
    setDark((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle("dark", next);
      localStorage.setItem("theme", next ? "dark" : "light");
      return next;
    });
  };

  const logout = () => {
    setLoggedIn(false);
    setUserRole("");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const navItems = [
    { to: "/", label: "Home", end: true },
    { to: "/about", label: "About" },
    { to: "/public", label: "Public Feed" },
  ];

  return (
    <nav className="nav-shell">
      <button
        type="button"
        className="nav-brand cursor-pointer flex items-center gap-2 bg-transparent border-0 p-0"
        onClick={() => navigate("/")}
      >
        <Sprout size={26} />
        <span>AGROVA</span>
      </button>

      <div className="nav-links">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            {item.label}
          </NavLink>
        ))}
        {!loggedIn && (
          <NavLink to="/login" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
            Login
          </NavLink>
        )}
      </div>

      <div className="nav-actions">
        {loggedIn && userRole && <span className="nav-role">{userRole}</span>}
        {loggedIn && (
          <button type="button" onClick={logout} className="nav-link active flex items-center gap-2 border-0 bg-transparent">
            <LogOut size={16} />
            Logout
          </button>
        )}
        <button type="button" onClick={toggleTheme} className="theme-toggle">
          {dark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </nav>
  );
}
