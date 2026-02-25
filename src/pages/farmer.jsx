import { useState } from "react";
import {
  addFarmerPost,
  getFarmerPosts,
  getExpertPosts,
} from "../utils/storage.js";

export default function Farmer() {
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState("");

  const farmerPosts = getFarmerPosts().sort((a, b) => b.id - a.id);
  const expertPosts = getExpertPosts().sort((a, b) => b.id - a.id);

  const uploadImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setImage(ev.target.result);
    reader.readAsDataURL(file);
  };

  const share = () => {
    if (!image || !caption.trim()) {
      alert("Select an image and write a caption.");
      return;
    }
    addFarmerPost({ image, caption: caption.trim() });
    setImage(null);
    setCaption("");
    alert("Your farming progress is shared!");
    window.location.reload();
  };

  return (
    <div className="page px-6 md:px-12 py-8">
      <h1 className="text-3xl md:text-4xl font-bold text-emerald-600 mb-2">
        Farmer Dashboard
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Share your farm progress & learn from experts.
      </p>

      {/* Upload section */}
      <div className="card max-w-2xl mb-10">
        <h2 className="text-lg font-semibold mb-3">
          Upload Crop Progress 📸
        </h2>
        <input
          type="file"
          accept="image/*"
          onChange={uploadImage}
          className="w-full p-2 border rounded mb-3 bg-white dark:bg-slate-900"
        />
        {image && (
          <img
            src={image}
            alt="Preview"
            className="rounded-xl mb-3 max-h-72 object-cover w-full"
          />
        )}
        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          rows={3}
          placeholder="Describe growth stage, seeds, water, issues..."
          className="w-full p-2.5 border rounded mb-3 bg-white dark:bg-slate-900"
        />
        <button onClick={share} className="btn btn-primary w-full md:w-auto">
          Share Update
        </button>
      </div>

      {/* Farmer posts */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">
          Your Uploaded Progress
        </h2>
        {farmerPosts.length === 0 ? (
          <p className="text-gray-500">
            No posts yet. Upload your first crop image above.
          </p>
        ) : (
          <div className="grid md:grid-cols-2 gap-5">
            {farmerPosts.map((p) => (
              <div key={p.id} className="card">
                <img
                  src={p.image}
                  alt="Crop"
                  className="rounded-xl max-h-72 w-full object-cover mb-2"
                />
                <p className="font-medium">{p.caption}</p>
                <p className="text-[11px] text-gray-500 mt-1">{p.date}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Expert posts for Farmer */}
      <section>
        <h2 className="text-xl font-semibold mb-3">
          Latest Expert Guidance 📘
        </h2>
        {expertPosts.length === 0 ? (
          <p className="text-gray-500">
            No expert posts yet. Ask experts to share some tips!
          </p>
        ) : (
          <div className="grid md:grid-cols-2 gap-5">
            {expertPosts.map((p) => (
              <div key={p.id} className="card">
                <h3 className="font-semibold text-emerald-700 mb-1">
                  {p.title}
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {p.content}
                </p>
                <p className="text-[11px] text-gray-500 mt-1">{p.date}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
