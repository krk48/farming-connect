import { useEffect, useState } from "react";
import {
  getExpertPosts,
  getFarmerPosts,
  deleteExpertPost,
  deleteFarmerPost,
} from "../utils/api.js";

export default function Admin() {
  const [expertPosts, setExpertPosts] = useState([]);
  const [farmerPosts, setFarmerPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const loadPosts = async () => {
    try {
      setIsLoading(true);
      const [experts, farmers] = await Promise.all([getExpertPosts(), getFarmerPosts()]);
      setExpertPosts(experts || []);
      setFarmerPosts(farmers || []);
    } catch (err) {
      setError("Failed to load posts");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleDeleteExpert = async (postId) => {
    if (!window.confirm("Delete this expert post?")) return;
    try {
      await deleteExpertPost(postId);
      setExpertPosts(expertPosts.filter((p) => p.id !== postId));
    } catch {
      setError("Failed to delete post");
    }
  };

  const handleDeleteFarmer = async (postId) => {
    if (!window.confirm("Delete this farmer post?")) return;
    try {
      await deleteFarmerPost(postId);
      setFarmerPosts(farmerPosts.filter((p) => p.id !== postId));
    } catch {
      setError("Failed to delete post");
    }
  };

  return (
    <div className="page">
      <div className="page-container">
        <section className="page-hero">
          <div className="hero-kicker">Admin Control Room</div>
          <h1 className="hero-title mt-4 text-4xl md:text-6xl">Moderation should feel operational, not chaotic.</h1>
          <p className="hero-subtitle mt-4 text-base md:text-lg">
            Review the entire publishing surface, spot weak content fast, and keep the ecosystem clean from
            one command layer.
          </p>

          <div className="metric-grid">
            <div className="metric-card">
              <div className="metric-label">Expert Posts</div>
              <div className="metric-value">{expertPosts.length}</div>
              <div className="metric-note">Guidance entries currently visible on the network.</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Farmer Posts</div>
              <div className="metric-value">{farmerPosts.length}</div>
              <div className="metric-note">Field updates currently visible across dashboards and public feed.</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">System State</div>
              <div className="metric-value">{isLoading ? "Syncing" : "Stable"}</div>
              <div className="metric-note">Moderation panel is connected to the live post API.</div>
            </div>
          </div>
        </section>

        <div className="dashboard-stack mt-6">
          {error && (
            <div className="surface panel border border-red-200 text-red-700 dark:border-red-900/40 dark:text-red-300">
              {error}
            </div>
          )}

          {isLoading && (
            <div className="surface panel">
              <p className="section-copy">Loading moderation queue...</p>
            </div>
          )}

          <section className="surface panel">
            <div className="section-title-row">
              <div>
                <div className="eyebrow">Expert Layer</div>
                <h2 className="section-title mt-3">Expert posts</h2>
                <p className="section-copy mt-2">
                  Review messaging, clarity, and quality of platform-wide guidance.
                </p>
              </div>
            </div>

            {expertPosts.length === 0 ? (
              <p className="section-copy">No expert posts found.</p>
            ) : (
              <div className="feed-grid">
                {expertPosts.map((item) => (
                  <article key={item.id} className="card post-card">
                    <div className="eyebrow w-fit">Expert</div>
                    <h3 className="mt-3 text-lg font-extrabold text-emerald-700">{item.title}</h3>
                    <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">{item.content}</p>
                    <div className="post-meta mt-4">
                      <span>By {item.username}</span>
                      <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                    </div>
                    <button onClick={() => handleDeleteExpert(item.id)} className="btn btn-danger mt-5 w-full md:w-fit">
                      Delete Expert Post
                    </button>
                  </article>
                ))}
              </div>
            )}
          </section>

          <section className="surface panel">
            <div className="section-title-row">
              <div>
                <div className="eyebrow">Farmer Layer</div>
                <h2 className="section-title mt-3">Farmer posts</h2>
                <p className="section-copy mt-2">
                  Moderate what the public and expert network will see from the field.
                </p>
              </div>
            </div>

            {farmerPosts.length === 0 ? (
              <p className="section-copy">No farmer posts found.</p>
            ) : (
              <div className="feed-grid">
                {farmerPosts.map((item) => (
                  <article key={item.id} className="card post-card">
                    {item.imageData && (
                      <img
                        src={item.imageData}
                        alt="Farmer post"
                        className="mb-4 w-full max-h-72 object-cover rounded-[18px]"
                      />
                    )}
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{item.caption}</p>
                    <div className="post-meta mt-4">
                      <span>By {item.username}</span>
                      <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                    </div>
                    <button onClick={() => handleDeleteFarmer(item.id)} className="btn btn-danger mt-5 w-full md:w-fit">
                      Delete Farmer Post
                    </button>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
