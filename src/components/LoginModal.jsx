import { useState } from "react";
import { login } from "../utils/api";

function createCaptcha() {
  const left = Math.floor(Math.random() * 9) + 1;
  const right = Math.floor(Math.random() * 9) + 1;
  return {
    prompt: `${left} + ${right}`,
    answer: String(left + right),
  };
}

export default function LoginModal({ open, onClose, onOpenSignup, onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("FARMER");
  const [captcha, setCaptcha] = useState(createCaptcha);
  const [captchaInput, setCaptchaInput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!username || !password || !role) {
      setError("Username, password, and role are required");
      return;
    }

    if (captchaInput.trim() !== captcha.answer) {
      setError("Captcha is incorrect. Please try again.");
      setCaptchaInput("");
      setCaptcha(createCaptcha());
      return;
    }

    setLoading(true);

    try {
      const response = await login(username, password, role);
      if (response.token) {
        setUsername("");
        setPassword("");
        setRole("FARMER");
        setCaptchaInput("");
        setCaptcha(createCaptcha());
        onClose();
        onLoginSuccess?.();
      } else {
        setError(response.message || "Login failed");
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4">
      <div className="auth-card">
        <div className="eyebrow w-fit">Login Modal</div>
        <h3 className="auth-title mt-4 text-[#163021] dark:text-white">Log In</h3>

        {error && (
          <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-700 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="mt-5 space-y-4">
          <input placeholder="Username" className="w-full p-3" value={username} onChange={(e) => setUsername(e.target.value)} required />
          <input placeholder="Password" type="password" className="w-full p-3" value={password} onChange={(e) => setPassword(e.target.value)} required />

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-200">Login As</label>
            <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full p-3" required>
              <option value="FARMER">Farmer</option>
              <option value="EXPERT">Expert</option>
              <option value="ADMIN">Admin</option>
            </select>
            <p className="auth-copy mt-2 text-sm">
              Public users can browse directly from the public page without logging in.
            </p>
          </div>

          <div className="rounded-[20px] border border-emerald-900/10 bg-black/[0.02] p-4 dark:border-white/10 dark:bg-white/[0.03]">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">Captcha Check</p>
                <p className="auth-copy text-sm">Solve the challenge to continue.</p>
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

          <button type="submit" disabled={loading} className={`btn w-full ${loading ? "opacity-50 cursor-not-allowed" : ""}`}>
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-300">
          Don&apos;t have an account?{" "}
          <button
            onClick={() => {
              onClose();
              onOpenSignup?.();
            }}
            className="font-semibold text-emerald-700 dark:text-emerald-300"
          >
            Sign Up
          </button>
        </div>

        <button onClick={onClose} className="btn btn-secondary mt-4 w-full">
          Cancel
        </button>
      </div>
    </div>
  );
}
