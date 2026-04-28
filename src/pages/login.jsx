import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../utils/api";
import SignupModal from "../components/SignupModal";

function createCaptcha() {
  const left = Math.floor(Math.random() * 9) + 1;
  const right = Math.floor(Math.random() * 9) + 1;
  return {
    prompt: `${left} + ${right}`,
    answer: String(left + right),
  };
}

export default function Login({ setLoggedIn, setUserRole }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [captcha, setCaptcha] = useState(createCaptcha);
  const [captchaInput, setCaptchaInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSignup, setShowSignup] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Enter username and password first.");
      return;
    }

    if (captchaInput.trim() !== captcha.answer) {
      setError("Captcha is incorrect. Please try again.");
      setCaptchaInput("");
      setCaptcha(createCaptcha());
      return;
    }

    setIsLoading(true);

    try {
      const response = await login(username, password);

      if (response.token && response.user) {
        setLoggedIn(true);
        setUserRole(response.user.role.toLowerCase());
        navigate("/" + response.user.role.toLowerCase());
        setUsername("");
        setPassword("");
        setCaptchaInput("");
        setCaptcha(createCaptcha());
      } else {
        setError(response.message || "Login failed");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-stage">
      <div className="auth-card">
        <div className="eyebrow w-fit">Secure Access</div>
        <h1 className="auth-title mt-4 text-[#163021] dark:text-white">Enter Agrova</h1>
        <p className="auth-copy mt-3">
          Log in to continue into your farmer, expert, or admin workspace.
        </p>

        {error && (
          <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-700 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <input
            type="text"
            placeholder="Username"
            className="w-full p-3"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="rounded-[20px] border border-emerald-900/10 bg-black/[0.02] p-4 dark:border-white/10 dark:bg-white/[0.03]">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">Captcha Check</p>
                <p className="auth-copy text-sm">Solve this quick challenge before logging in.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setCaptcha(createCaptcha());
                  setCaptchaInput("");
                }}
                className="soft-pill"
              >
                Refresh
              </button>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="soft-pill text-base font-extrabold">{captcha.prompt} = ?</div>
              <input
                type="text"
                inputMode="numeric"
                placeholder="Answer"
                className="flex-1 p-3"
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`btn w-full ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {isLoading ? "Logging in..." : "Enter Dashboard"}
          </button>
        </form>

        <div className="mt-5 flex flex-wrap gap-3">
          <button type="button" onClick={() => navigate("/public")} className="btn btn-secondary">
            Browse Public Feed
          </button>
          <button type="button" onClick={() => setShowSignup(true)} className="btn">
            Create Account
          </button>
        </div>
      </div>

      <SignupModal open={showSignup} onClose={() => setShowSignup(false)} onOpenLogin={() => {}} />
    </div>
  );
}
