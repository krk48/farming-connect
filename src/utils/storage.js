// src/utils/storage.js

const EXPERT_KEY = "expert_posts";
const FARMER_KEY = "farmer_posts";

function getArray(key) {
  try {
    const data = JSON.parse(localStorage.getItem(key));
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function saveArray(key, arr) {
  localStorage.setItem(key, JSON.stringify(arr));
}

// ---------- Expert ----------
export function getExpertPosts() {
  return getArray(EXPERT_KEY);
}

export function addExpertPost({ title, content, date }) {
  const posts = getExpertPosts();
  posts.push({
    id: Date.now(),
    type: "expert",
    title,
    content,
    date: date || new Date().toLocaleString(),
    likes: 0,
    comments: [],
  });
  saveArray(EXPERT_KEY, posts);
}

// ---------- Farmer ----------
export function getFarmerPosts() {
  return getArray(FARMER_KEY);
}

export function addFarmerPost({ image, caption, date }) {
  const posts = getFarmerPosts();
  posts.push({
    id: Date.now(),
    type: "farmer",
    image,
    caption,
    date: date || new Date().toLocaleString(),
    likes: 0,
    comments: [],
  });
  saveArray(FARMER_KEY, posts);
}

// ---------- Common actions ----------
export function likePost(type, id) {
  const key = type === "expert" ? EXPERT_KEY : FARMER_KEY;
  const posts = getArray(key);
  const idx = posts.findIndex((p) => p.id === id);
  if (idx === -1) return;
  posts[idx].likes = (posts[idx].likes || 0) + 1;
  saveArray(key, posts);
}

export function commentOnPost(type, id, text) {
  if (!text) return;
  const key = type === "expert" ? EXPERT_KEY : FARMER_KEY;
  const posts = getArray(key);
  const idx = posts.findIndex((p) => p.id === id);
  if (idx === -1) return;

  if (!Array.isArray(posts[idx].comments)) posts[idx].comments = [];

  posts[idx].comments.push({
    text,
    date: new Date().toLocaleString(),
  });

  saveArray(key, posts);
}

export function deletePost(type, id) {
  const key = type === "expert" ? EXPERT_KEY : FARMER_KEY;
  const posts = getArray(key);
  const filtered = posts.filter((p) => p.id !== id);
  saveArray(key, filtered);
}
