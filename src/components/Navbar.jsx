import { Link, useNavigate } from "react-router-dom";
import { Sun, Moon } from "lucide-react";
import { useState } from "react";

export default function Navbar({ loggedIn, setLoggedIn }) {
  const [dark, setDark] = useState(false);
  const navigate = useNavigate();

  const toggleTheme = () => {
    setDark(!dark);
    document.documentElement.classList.toggle("dark");
  };

  const logout = () => {
    setLoggedIn(false);
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 flex items-center justify-between px-10 shadow-md bg-white dark:bg-[#0f172a] text-black dark:text-white z-50">

      <h1 className="font-extrabold text-2xl text-green-600 cursor-pointer"
          onClick={()=> navigate("/")}>
        AGROVA
      </h1>

      {/* 🔥 Final Navbar – Only these tabs allowed */}
      <div className="flex gap-6 text-[15px] font-medium">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>

        {!loggedIn && <Link to="/login">Login</Link>}
        {loggedIn && <button onClick={logout}>Logout</button>}
      </div>

      <button onClick={toggleTheme} className="p-2 rounded-full">
        {dark ? <Sun size={22}/> : <Moon size={22}/>}
      </button>
    </nav>
  );
}
