import { useEffect, useState } from "react";
import {
  getExpertPosts,
  getFarmerPosts,
  deletePost,
} from "../utils/storage.js";

export default function Admin() {
  const [experts, setExperts] = useState([]);
  const [farmers, setFarmers] = useState([]);

  const refresh = () => {
    setExperts(getExpertPosts());
    setFarmers(getFarmerPosts());
  };

  useEffect(() => {
    refresh();
  }, []);

  const remove = (type, id) => {
    deletePost(type, id);
    refresh();
  };

  return (
    <div className="page px-6 md:px-12 py-8">
      <h1 className="text-3xl md:text-4xl font-bold text-red-600 mb-2">
        Admin Dashboard
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Moderate expert & farmer posts from a single panel.
      </p>

      {/* Expert posts */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Expert Posts</h2>
        {experts.length === 0 ? (
          <p className="text-gray-500">No expert posts found.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-5">
            {experts.map((item) => (
              <div key={item.id} className="card relative">
                <h3 className="font-semibold text-emerald-700 mb-1">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {item.content}
                </p>
                <p className="text-[11px] text-gray-500 mt-1">
                  {item.date}
                </p>
                <button
                  onClick={() => remove("expert", item.id)}
                  className="absolute top-3 right-3 text-[11px] bg-red-600 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Farmer posts */}
      <section>
        <h2 className="text-xl font-semibold mb-3">Farmer Posts</h2>
        {farmers.length === 0 ? (
          <p className="text-gray-500">No farmer posts found.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-5">
            {farmers.map((item) => (
              <div key={item.id} className="card relative">
                <img
                  src={item.image}
                  alt="Farmer post"
                  className="w-full max-h-60 object-cover rounded mb-2"
                />
                <p className="text-sm text-gray-800 dark:text-gray-200">
                  {item.caption}
                </p>
                <p className="text-[11px] text-gray-500 mt-1">
                  {item.date}
                </p>
                <button
                  onClick={() => remove("farmer", item.id)}
                  className="absolute top-3 right-3 text-[11px] bg-red-600 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
