import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login({ setLoggedIn, setUserRole }) {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("farmer");

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (!userId || !password) {
      alert("Enter ID and Password first!");
      return;
    }

    setLoggedIn(true);
    setUserRole(userType);

    // FINAL REDIRECT (THIS IS THE LINE YOU ASKED FOR) 👇
    navigate("/" + userType);

    // Clear inputs after redirect
    setUserId("");
    setPassword("");
    setUserType("farmer");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#04b4d4] to-[#26c56a]">

      <div className="bg-white/90 backdrop-blur-xl shadow-xl p-10 rounded-2xl w-96 border border-white/30">

        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-6">AGROVA LOGIN</h2>

        <form onSubmit={handleLogin} className="space-y-5">

          <input type="text" placeholder="User ID"
            className="w-full p-3 rounded-xl border border-gray-300"
            value={userId} onChange={(e)=>setUserId(e.target.value)}
          />

          <input type="password" placeholder="Password"
            className="w-full p-3 rounded-xl border border-gray-300"
            value={password} onChange={(e)=>setPassword(e.target.value)}
          />

          {/* LOGIN AS ROLE TOGGLE */}
          <div className="grid grid-cols-4 gap-2">
            {["farmer","expert","public","admin"].map(t=>(
              <button type="button" key={t} onClick={()=>setUserType(t)}
                className={`py-2 rounded-lg text-xs font-semibold ${
                  userType===t ? "bg-green-600 text-white":"bg-gray-200 text-gray-700"
                }`}>
                {t}
              </button>
            ))}
          </div>

          <button type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded-xl text-lg font-semibold mt-3">
            Login
          </button>
        </form>

      </div>
    </div>
  );
}
