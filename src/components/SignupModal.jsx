import { useState } from "react";
import { signup } from "../utils/api";

export default function SignupModal({ open, onClose, onOpenLogin }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("FARMER");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (!fullName || !email || !username || !password) {
      setError("All fields are required");
      return;
    }

    setLoading(true);

    try {
      const response = await signup(username, password, email, fullName, role);
      if (response.token) {
        setFullName("");
        setEmail("");
        setUsername("");
        setPassword("");
        setRole("FARMER");
        onClose();
      } else {
        setError(response.message || "Signup failed");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4">
      <div className="auth-card">
        <div className="eyebrow w-fit">Create Account</div>
        <h3 className="auth-title mt-4 text-[#163021] dark:text-white">Join Agrova</h3>

        {error && (
          <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-700 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="mt-5 space-y-4">
          <input placeholder="Full Name" className="w-full p-3" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          <input placeholder="Username" className="w-full p-3" value={username} onChange={(e) => setUsername(e.target.value)} />
          <input placeholder="Email" type="email" className="w-full p-3" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input placeholder="Password" type="password" className="w-full p-3" value={password} onChange={(e) => setPassword(e.target.value)} />

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-200">Select Role</label>
            <div className="space-y-2">
              {[
                ["FARMER", "Farmer - Sell crops and publish field progress"],
                ["EXPERT", "Expert - Share guidance and agricultural insight"],
                ["ADMIN", "Admin - Manage and moderate the platform"],
              ].map(([value, label]) => (
                <label key={value} className="flex items-center gap-3 rounded-2xl border border-black/5 bg-black/[0.02] p-3 dark:border-white/10 dark:bg-white/[0.03]">
                  <input
                    type="radio"
                    name="role"
                    value={value}
                    checked={role === value}
                    onChange={(e) => setRole(e.target.value)}
                    className="h-4 w-4"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{label}</span>
                </label>
              ))}
            </div>
            <p className="auth-copy mt-2 text-sm">
              Public browsing does not require an account. Open the public page directly to explore posts.
            </p>
          </div>

          <div className="mt-5 flex gap-3">
            <button type="submit" disabled={loading} className={`btn flex-1 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}>
              {loading ? "Creating..." : "Create Account"}
            </button>
            <button type="button" onClick={onClose} className="btn btn-secondary flex-1">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
