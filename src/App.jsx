import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Navbar from "./components/Navbar";
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

  return (
    <Router>
      <Navbar loggedIn={loggedIn} setLoggedIn={setLoggedIn} />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login"
          element={<Login setLoggedIn={setLoggedIn} setUserRole={setUserRole}/>}
        />

        {/* Login redirects here but navbar won't show them */}
        <Route path="/farmer" element={<Farmer />} />
        <Route path="/expert" element={<Expert />} />
        <Route path="/public" element={<PublicPage />} />
        <Route path="/admin" element={<Admin />} />

        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
}
