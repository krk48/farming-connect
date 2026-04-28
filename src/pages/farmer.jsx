import { useState, useEffect } from "react";
import {
  getFarmerPosts,
  getFarmerPostsByUser,
  getExpertPosts,
  createFarmerPost,
  deleteFarmerPost,
  getCurrentUser,
} from "../utils/api.js";

export default function Farmer() {
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState("");
  const [myFarmerPosts, setMyFarmerPosts] = useState([]);
  const [expertPosts, setExpertPosts] = useState([]);
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
      const [farmerData, expertData] = await Promise.all([
        currentUser ? getFarmerPostsByUser(currentUser.id) : getFarmerPosts(),
        getExpertPosts(),
      ]);
      setMyFarmerPosts(farmerData || []);
      setExpertPosts(expertData || []);
    } catch {
      setError("Failed to load posts");
    } finally {
      setIsLoading(false);
    }
  };

  const uploadImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setImage(ev.target.result);
    reader.readAsDataURL(file);
  };

  const share = async () => {
    if (!image || !caption.trim()) {
      setError("Select an image and write a caption.");
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
      await createFarmerPost(image, caption.trim());
      setSuccessMsg("Your farming progress is now visible across Agrova.");
      setImage(null);
      setCaption("");
      await loadPosts();
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to share post");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Delete this post?")) return;

    try {
      await deleteFarmerPost(postId);
      setMyFarmerPosts(myFarmerPosts.filter((p) => p.id !== postId));
    } catch {
      setError("Failed to delete post");
    }
  };

  return (
    <div className="page">
      <div className="page-container">
        <section className="page-hero">
          <div className="hero-kicker">Farmer Workspace</div>
          <h1 className="hero-title mt-4 text-4xl md:text-6xl">Document the field like it matters.</h1>
          <p className="hero-subtitle mt-4 text-base md:text-lg">
            Capture crop progress, make issues visible early, and keep expert guidance close to your actual
            growing timeline.
          </p>

          <div className="metric-grid">
            <div className="metric-card">
              <div className="metric-label">Your Updates</div>
              <div className="metric-value">{myFarmerPosts.length}</div>
              <div className="metric-note">Tracked crop progress posts from your account.</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Expert Signals</div>
              <div className="metric-value">{expertPosts.length}</div>
              <div className="metric-note">Guidance posts available for immediate reference.</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Status</div>
              <div className="metric-value">{isLoading ? "Live" : "Ready"}</div>
              <div className="metric-note">Your dashboard is synced with the shared platform feed.</div>
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
                  <div className="eyebrow">Publish Update</div>
                  <h2 className="section-title mt-3">Upload crop progress</h2>
                  <p className="section-copy mt-2">
                    Show images, explain what changed, and give experts context they can actually respond to.
                  </p>
                </div>
              </div>

              <div className="content-grid">
                <input type="file" accept="image/*" onChange={uploadImage} className="w-full p-3" />

                {image && (
                  <img
                    src={image}
                    alt="Preview"
                    className="w-full rounded-[22px] max-h-80 object-cover border border-emerald-900/10"
                  />
                )}

                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  rows={5}
                  placeholder="Describe growth stage, pests, watering, weather shifts, or anything experts should notice."
                  className="w-full p-3"
                />

                <div className="pill-row">
                  <span className="soft-pill">Growth timeline</span>
                  <span className="soft-pill">Image-first context</span>
                  <span className="soft-pill">Cross-role visibility</span>
                </div>

                <button
                  onClick={share}
                  disabled={isLoading}
                  className={`btn w-full md:w-fit ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {isLoading ? "Sharing..." : "Share Field Update"}
                </button>
              </div>
            </section>

            <section className="surface panel">
              <div className="section-title-row">
                <div>
                  <div className="eyebrow">Your Feed</div>
                  <h2 className="section-title mt-3">Your uploaded progress</h2>
                </div>
              </div>

              {myFarmerPosts.length === 0 ? (
                <p className="section-copy">No posts yet. Publish your first crop update above.</p>
              ) : (
                <div className="feed-grid">
                  {myFarmerPosts.map((p) => (
                    <article key={p.id} className="card post-card">
                      {p.imageData && (
                        <img
                          src={p.imageData}
                          alt="Crop"
                          className="mb-4 rounded-[18px] max-h-72 w-full object-cover"
                        />
                      )}
                      <p className="font-semibold text-base">{p.caption}</p>
                      <div className="post-meta mt-3">
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
          </div>

          <div className="dashboard-stack">
            <section className="surface panel">
              <div className="section-title-row">
                <div>
                  <div className="eyebrow">Guidance Layer</div>
                  <h2 className="section-title mt-3">Latest expert guidance</h2>
                  <p className="section-copy mt-2">
                    Keep these recommendations near your own field journal so action is easy.
                  </p>
                </div>
              </div>

              {expertPosts.length === 0 ? (
                <p className="section-copy">No expert posts yet. Ask experts to publish practical guidance.</p>
              ) : (
                <div className="content-grid">
                  {expertPosts.map((p) => (
                    <article key={p.id} className="card post-card">
                      <div className="eyebrow w-fit">Expert Note</div>
                      <h3 className="mt-3 text-lg font-extrabold text-emerald-700">{p.title}</h3>
                      <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">{p.content}</p>
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
