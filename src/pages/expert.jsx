import { useState } from "react";
import { addExpertPost, getExpertPosts } from "../utils/storage.js";

export default function Expert() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const posts = getExpertPosts().sort((a, b) => b.id - a.id);

  const publish = () => {
    if (!title.trim() || !content.trim()) {
      alert("Title & content required.");
      return;
    }
    addExpertPost({ title: title.trim(), content: content.trim() });
    setTitle("");
    setContent("");
    alert("Expert post published!");
    window.location.reload();
  };

  return (
    <div className="page px-6 md:px-12 py-8">
      <h1 className="text-3xl md:text-4xl font-bold text-sky-600 mb-2">
        Expert Panel
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Share high-quality guidance for farmers.
      </p>

      <div className="card max-w-2xl mb-8">
        <input
          className="w-full p-2.5 border rounded mb-3 bg-white dark:bg-slate-900"
          placeholder="Post title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="w-full p-2.5 border rounded mb-3 bg-white dark:bg-slate-900 h-32"
          placeholder="Write your expert advice..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button onClick={publish} className="btn btn-primary">
          Publish
        </button>
      </div>

      <h2 className="text-xl font-semibold mb-3">Your Published Posts</h2>
      {posts.length === 0 ? (
        <p className="text-gray-500">No posts yet.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {posts.map((p) => (
            <div key={p.id} className="card">
              <h3 className="font-semibold text-emerald-700 mb-1">
                {p.title}
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {p.content}
              </p>
              <p className="mt-2 text-[11px] text-gray-500">{p.date}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
