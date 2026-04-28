import { useEffect, useState } from "react";
import { getExpertPosts, getFarmerPosts } from "../utils/api.js";

const META_KEY = "public_feed_meta";

function getFeedMeta() {
  try {
    return JSON.parse(localStorage.getItem(META_KEY)) || {};
  } catch {
    return {};
  }
}

function saveFeedMeta(meta) {
  localStorage.setItem(META_KEY, JSON.stringify(meta));
}

function getPostKey(item) {
  return `${item.type}-${item.id}`;
}

export default function PublicPage() {
  const [feed, setFeed] = useState([]);
  const [commentInputs, setCommentInputs] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const refresh = async () => {
    try {
      setIsLoading(true);
      const [expertPosts, farmerPosts] = await Promise.all([getExpertPosts(), getFarmerPosts()]);
      const meta = getFeedMeta();

      const normalizedExperts = (expertPosts || []).map((item) => {
        const key = `expert-${item.id}`;
        return {
          ...item,
          type: "expert",
          date: new Date(item.createdAt).toLocaleString(),
          likes: meta[key]?.likes || 0,
          comments: meta[key]?.comments || [],
        };
      });

      const normalizedFarmers = (farmerPosts || []).map((item) => {
        const key = `farmer-${item.id}`;
        return {
          ...item,
          type: "farmer",
          image: item.imageData,
          date: new Date(item.createdAt).toLocaleString(),
          likes: meta[key]?.likes || 0,
          comments: meta[key]?.comments || [],
        };
      });

      const combined = [...normalizedExperts, ...normalizedFarmers].sort(
        (a, b) => (b.createdAt || 0) - (a.createdAt || 0)
      );
      setFeed(combined);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleLike = (item) => {
    const meta = getFeedMeta();
    const key = getPostKey(item);
    meta[key] = {
      likes: (meta[key]?.likes || 0) + 1,
      comments: meta[key]?.comments || [],
    };
    saveFeedMeta(meta);
    refresh();
  };

  const handleCommentChange = (id, value) => {
    setCommentInputs((prev) => ({ ...prev, [id]: value }));
  };

  const handleCommentSubmit = (item) => {
    const text = (commentInputs[item.id] || "").trim();
    if (!text) return;

    const meta = getFeedMeta();
    const key = getPostKey(item);
    meta[key] = {
      likes: meta[key]?.likes || 0,
      comments: [
        ...(meta[key]?.comments || []),
        { text, date: new Date().toLocaleString() },
      ],
    };
    saveFeedMeta(meta);
    setCommentInputs((prev) => ({ ...prev, [item.id]: "" }));
    refresh();
  };

  const handleShare = (item) => {
    const text =
      item.type === "expert"
        ? `AGROVA Expert Post:\n${item.title}\n\n${item.content}`
        : `AGROVA Farmer Progress:\n${item.caption}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      alert("Post text copied to clipboard.");
    } else {
      alert("Copy not supported. Please copy manually.");
    }
  };

  return (
    <div className="page">
      <div className="page-container">
        <section className="page-hero">
          <div className="hero-kicker">Public Feed</div>
          <h1 className="hero-title mt-4 text-4xl md:text-6xl">Watch the entire ecosystem move in public.</h1>
          <p className="hero-subtitle mt-4 text-base md:text-lg">
            Browse farmer progress and expert guidance in one shared stream. Public users do not need an
            account to explore the network.
          </p>

          <div className="metric-grid">
            <div className="metric-card">
              <div className="metric-label">Visible Posts</div>
              <div className="metric-value">{feed.length}</div>
              <div className="metric-note">Combined farmer and expert posts in the public layer.</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Mode</div>
              <div className="metric-value">Open</div>
              <div className="metric-note">No login required for browsing the live feed.</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">State</div>
              <div className="metric-value">{isLoading ? "Syncing" : "Live"}</div>
              <div className="metric-note">Feed is sourced from the same backend as the dashboards.</div>
            </div>
          </div>
        </section>

        <section className="surface panel mt-6">
          <div className="section-title-row">
            <div>
              <div className="eyebrow">Community Stream</div>
              <h2 className="section-title mt-3">Latest public activity</h2>
              <p className="section-copy mt-2">
                Like, comment, and share entries while keeping the same visual language as the rest of Agrova.
              </p>
            </div>
          </div>

          {isLoading && <p className="section-copy mb-4">Loading feed...</p>}

          {feed.length === 0 ? (
            <p className="section-copy">No posts yet. Ask farmers and experts to share.</p>
          ) : (
            <div className="feed-grid">
              {feed.map((item) => (
                <article key={`${item.type}-${item.id}`} className="card post-card">
                  <div className="eyebrow w-fit">
                    {item.type === "expert" ? "Expert Post" : "Farmer Progress"}
                  </div>

                  {item.type === "expert" ? (
                    <>
                      <h2 className="mt-3 text-lg font-extrabold text-emerald-700">{item.title}</h2>
                      <p className="mt-2 text-sm text-gray-700 dark:text-gray-200">{item.content}</p>
                    </>
                  ) : (
                    <>
                      {item.image && (
                        <img
                          src={item.image}
                          alt="Farmer"
                          className="mt-3 w-full rounded-[18px] max-h-80 object-cover"
                        />
                      )}
                      <p className="mt-3 text-sm text-gray-800 dark:text-gray-200">{item.caption}</p>
                    </>
                  )}

                  <p className="post-meta mt-4">
                    <span>By {item.username}</span>
                    <span>{item.date}</span>
                  </p>

                  <div className="mt-4 flex items-center gap-4 text-sm">
                    <button onClick={() => handleLike(item)} className="soft-pill">
                      ♥ {item.likes || 0}
                    </button>
                    <button onClick={() => handleShare(item)} className="soft-pill">
                      Share
                    </button>
                  </div>

                  <div className="mt-4">
                    <div className="flex gap-2">
                      <input
                        value={commentInputs[item.id] || ""}
                        onChange={(e) => handleCommentChange(item.id, e.target.value)}
                        placeholder="Add a comment..."
                        className="flex-1 p-3"
                      />

                      <button onClick={() => handleCommentSubmit(item)} className="btn">
                        Post
                      </button>
                    </div>

                    {item.comments && item.comments.length > 0 && (
                      <div className="mt-3 space-y-2 text-sm max-h-32 overflow-y-auto">
                        {item.comments.map((c, i) => (
                          <div key={i} className="rounded-2xl bg-black/5 px-3 py-2 dark:bg-white/5">
                            <span className="font-semibold">User: </span>
                            <span>{c.text}</span>
                            <div className="text-[10px] text-gray-500">{c.date}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
