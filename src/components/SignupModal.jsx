export default function SignupModal({ open, onClose, onOpenLogin }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl w-full max-w-md p-6">
        <h3 className="text-xl font-bold mb-4">Sign up</h3>
        <input placeholder="Full name" className="w-full p-3 border rounded mb-3" />
        <input placeholder="Email" className="w-full p-3 border rounded mb-3" />
        <input placeholder="Password" type="password" className="w-full p-3 border rounded mb-4" />
        <div className="flex gap-3">
          <button className="flex-1 bg-green-600 text-white py-2 rounded" onClick={onClose}>Create account</button>
          <button className="flex-1 border py-2 rounded" onClick={() => { onClose(); onOpenLogin?.(); }}>Log in</button>
        </div>
        <button className="mt-4 text-sm text-gray-500" onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}
