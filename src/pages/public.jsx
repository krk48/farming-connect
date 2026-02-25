import { useEffect, useState } from "react";
import {
  getExpertPosts,
  getFarmerPosts,
  likePost,
  commentOnPost,
} from "../utils/storage.js";

export default function PublicPage() {
  const [feed, setFeed] = useState([]);
  const [commentInputs, setCommentInputs] = useState({});

  const refresh = () => {
    const exp = getExpertPosts();
    const farm = getFarmerPosts();
    const combined = [...exp, ...farm].sort((a, b) => b.id - a.id);
    setFeed(combined);
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleLike = (item) => {
    likePost(item.type, item.id);
    refresh();
  };

  const handleCommentChange = (id, value) => {
    setCommentInputs((prev) => ({ ...prev, [id]: value }));
  };

  const handleCommentSubmit = (item) => {
    const text = (commentInputs[item.id] || "").trim();
    if (!text) return;
    commentOnPost(item.type, item.id, text);
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
    <div className="page px-6 md:px-12 py-8">
      <h1 className="text-3xl md:text-4xl font-bold text-purple-600 mb-2">
        Community Feed
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Explore expert tips & farmer updates. Like, comment and share.
      </p>

      <div className="grid gap-6">
        {feed.length === 0 ? (
          <p className="text-gray-500">
            No posts yet. Ask farmers and experts to share.
          </p>
        ) : (
          feed.map((item) => (
            <div key={item.id} className="card space-y-3">
              {/* Badge */}
              <div className="text-xs uppercase tracking-wide text-gray-500 flex items-center gap-2">
                {item.type === "expert" ? (
                  <>
                    <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                    <span>Expert Post</span>
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 bg-amber-500 rounded-full" />
                    <span>Farmer Progress</span>
                  </>
                )}
              </div>

              {/* Content */}
              {item.type === "expert" ? (
                <>
                  <h2 className="text-lg font-semibold text-emerald-700">
                    {item.title}
                  </h2>
                  <p className="text-sm text-gray-700 dark:text-gray-200">
                    {item.content}
                  </p>
                </>
              ) : (
                <>
                  <img
                    src={item.image}
                    alt="Farmer"
                    className="w-full rounded-xl max-h-80 object-cover"
                  />
                  <p className="text-sm text-gray-800 dark:text-gray-200 mt-1">
                    {item.caption}
                  </p>
                </>
              )}

              <p className="text-[11px] text-gray-500">{item.date}</p>

              {/* Actions */}
              <div className="flex items-center gap-4 text-sm">
                <button
                  onClick={() => handleLike(item)}
                  className="flex items-center gap-1 text-red-500"
                >
                  <span>❤️</span>
                  <span>{item.likes || 0} likes</span>
                </button>

                <button
                  onClick={() => handleShare(item)}
                  className="flex items-center gap-1 text-sky-500"
                >
                  <span>↗</span>
                  <span>Share</span>
                </button>
              </div>

              {/* Comments */}
              <div className="mt-2">
                <div className="flex gap-2">
                  <input
                    value={commentInputs[item.id] || ""}
                    onChange={(e) =>
                      handleCommentChange(item.id, e.target.value)
                    }
                    placeholder="Add a comment..."
                    className="flex-1 p-2 text-sm border rounded bg-white dark:bg-slate-900"
                  />
                  <button
                    onClick={() => handleCommentSubmit(item)}
                    className="px-3 py-1 text-xs rounded bg-sky-600 text-white"
                  >
                    Post
                  </button>
                </div>

                {item.comments && item.comments.length > 0 && (
                  <div className="mt-3 space-y-1 text-sm max-h-32 overflow-y-auto">
                    {item.comments.map((c, i) => (
                      <div key={i}>
                        <span className="font-semibold">User: </span>
                        <span>{c.text}</span>
                        <div className="text-[10px] text-gray-500">
                          {c.date}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
