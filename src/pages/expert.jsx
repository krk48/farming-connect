import { useState, useEffect } from "react";
import {
  createExpertPost,
  getExpertPostsByUser,
  getExpertPosts,
  deleteExpertPost,
  getFarmerPosts,
  getCurrentUser,
} from "../utils/api.js";

export default function Expert() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [myExpertPosts, setMyExpertPosts] = useState([]);
  const [allExpertPosts, setAllExpertPosts] = useState([]);
  const [farmerPosts, setFarmerPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const currentUser = getCurrentUser();

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setIsLoading(true);
      const [userPosts, allExpertPostsData, farmerPostsData] = await Promise.all([
        currentUser ? getExpertPostsByUser(currentUser.id) : [],
        getExpertPosts(),
        getFarmerPosts(),
      ]);
      setMyExpertPosts(userPosts || []);
      setAllExpertPosts(allExpertPostsData || []);
      setFarmerPosts(farmerPostsData || []);
    } catch (err) {
      setError("Failed to load posts");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const publish = async () => {
    if (!title.trim() || !content.trim()) {
      setError("Title and content are required");
      return;
    }

    if (!currentUser) {
      setError("Please log in first");
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      setSuccessMsg("");
      await createExpertPost(title.trim(), content.trim());
      setSuccessMsg("Your guidance is now live across Agrova.");
      setTitle("");
      setContent("");
      await loadPosts();
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to publish post");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Delete this post?")) return;

    try {
      await deleteExpertPost(postId);
      setMyExpertPosts(myExpertPosts.filter((p) => p.id !== postId));
      setAllExpertPosts(allExpertPosts.filter((p) => p.id !== postId));
    } catch {
      setError("Failed to delete post");
    }
  };

  return (
    <div className="page">
      <div className="page-container">
        <section className="page-hero">
          <div className="hero-kicker">Expert Console</div>
          <h1 className="hero-title mt-4 text-4xl md:text-6xl">Turn knowledge into visible field guidance.</h1>
          <p className="hero-subtitle mt-4 text-base md:text-lg">
            Publish recommendations that farmers can use immediately, then monitor real field updates in the
            same workspace.
          </p>

          <div className="metric-grid">
            <div className="metric-card">
              <div className="metric-label">Your Posts</div>
              <div className="metric-value">{myExpertPosts.length}</div>
              <div className="metric-note">Guidance notes published from your expert account.</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Network Guidance</div>
              <div className="metric-value">{allExpertPosts.length}</div>
              <div className="metric-note">Total expert posts visible across the platform.</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Farmer Signals</div>
              <div className="metric-value">{farmerPosts.length}</div>
              <div className="metric-note">Recent farmer updates available to review.</div>
            </div>
          </div>
        </section>

        <div className="dashboard-grid">
          <div className="dashboard-stack">
            {error && (
              <div className="surface panel border border-red-200 text-red-700 dark:border-red-900/40 dark:text-red-300">
                {error}
              </div>
            )}

            {successMsg && (
              <div className="surface panel border border-emerald-200 text-emerald-700 dark:border-emerald-900/40 dark:text-emerald-300">
                {successMsg}
              </div>
            )}

            <section className="surface panel">
              <div className="section-title-row">
                <div>
                  <div className="eyebrow">Publish Guidance</div>
                  <h2 className="section-title mt-3">Create an expert post</h2>
                  <p className="section-copy mt-2">
                    Keep it specific, practical, and immediately useful for field decisions.
                  </p>
                </div>
              </div>

              <div className="content-grid">
                <input
                  className="w-full p-3"
                  placeholder="Write a sharp, specific title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />

                <textarea
                  className="w-full p-3 h-36"
                  placeholder="Explain what farmers should do, what to watch for, and why it matters."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />

                <div className="pill-row">
                  <span className="soft-pill">Actionable advice</span>
                  <span className="soft-pill">Cross-platform visibility</span>
                  <span className="soft-pill">Farmer-facing clarity</span>
                </div>

                <button
                  onClick={publish}
                  disabled={isLoading}
                  className={`btn w-full md:w-fit ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {isLoading ? "Publishing..." : "Publish Guidance"}
                </button>
              </div>
            </section>

            <section className="surface panel">
              <div className="section-title-row">
                <div>
                  <div className="eyebrow">Owned By You</div>
                  <h2 className="section-title mt-3">Your expert posts</h2>
                </div>
              </div>

              {myExpertPosts.length === 0 ? (
                <p className="section-copy">You have not published any expert posts yet.</p>
              ) : (
                <div className="feed-grid">
                  {myExpertPosts.map((p) => (
                    <article key={p.id} className="card post-card">
                      <h3 className="text-lg font-extrabold text-emerald-700">{p.title}</h3>
                      <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">{p.content}</p>
                      <div className="post-meta mt-4">
                        <span>By {p.username}</span>
                        <span>{new Date(p.createdAt).toLocaleDateString()}</span>
                      </div>
                      <button onClick={() => handleDeletePost(p.id)} className="action-link mt-4">
                        Remove Post
                      </button>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </div>

          <div className="dashboard-stack">
            <section className="surface panel">
              <div className="section-title-row">
                <div>
                  <div className="eyebrow">Platform Feed</div>
                  <h2 className="section-title mt-3">All expert posts</h2>
                </div>
              </div>

              {allExpertPosts.length === 0 ? (
                <p className="section-copy">No expert posts yet.</p>
              ) : (
                <div className="content-grid">
                  {allExpertPosts.map((p) => (
                    <article key={p.id} className="card post-card">
                      <h3 className="text-lg font-extrabold text-emerald-700">{p.title}</h3>
                      <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">{p.content}</p>
                      <div className="post-meta mt-4">
                        <span>By {p.username}</span>
                        <span>{new Date(p.createdAt).toLocaleDateString()}</span>
                      </div>
                      {currentUser?.id === p.userId && (
                        <button onClick={() => handleDeletePost(p.id)} className="action-link mt-4">
                          Remove Post
                        </button>
                      )}
                    </article>
                  ))}
                </div>
              )}
            </section>

            <section className="surface panel">
              <div className="section-title-row">
                <div>
                  <div className="eyebrow">Field Reality</div>
                  <h2 className="section-title mt-3">Farmer progress updates</h2>
                  <p className="section-copy mt-2">
                    Review the visual context behind the questions and conditions on the ground.
                  </p>
                </div>
              </div>

              {farmerPosts.length === 0 ? (
                <p className="section-copy">No farmer posts yet.</p>
              ) : (
                <div className="content-grid">
                  {farmerPosts.map((p) => (
                    <article key={p.id} className="card post-card">
                      {p.imageData && (
                        <img
                          src={p.imageData}
                          alt="Crop"
                          className="mb-4 rounded-[18px] max-h-72 w-full object-cover"
                        />
                      )}
                      <p className="font-semibold text-base text-gray-800 dark:text-gray-200">{p.caption}</p>
                      <div className="post-meta mt-4">
                        <span>By {p.username}</span>
                        <span>{new Date(p.createdAt).toLocaleDateString()}</span>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
