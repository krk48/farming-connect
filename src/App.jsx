import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/footer";
import Login from "./pages/login";

import Home from "./pages/home";
import Farmer from "./pages/farmer";
import Expert from "./pages/expert";
import PublicPage from "./pages/public";
import Admin from "./pages/admin";
import About from "./pages/about";

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const rawUser = localStorage.getItem("user");
    if (!rawUser) return;

    try {
      const user = JSON.parse(rawUser);
      if (user?.role) {
        setLoggedIn(true);
        setUserRole(user.role.toLowerCase());
      }
    } catch {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
  }, []);

  return (
    <Router>
      <div className="app-shell">
        <Navbar
          loggedIn={loggedIn}
          setLoggedIn={setLoggedIn}
          userRole={userRole}
          setUserRole={setUserRole}
        />

        <Routes>
          <Route path="/" element={<Home />} />

          <Route
            path="/login"
            element={<Login setLoggedIn={setLoggedIn} setUserRole={setUserRole} />}
          />

          <Route path="/farmer" element={<Farmer />} />
          <Route path="/expert" element={<Expert />} />
          <Route path="/public" element={<PublicPage />} />
          <Route path="/admin" element={<Admin />} />

          <Route path="/about" element={<About />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}
