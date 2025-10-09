import React, { useState } from "react";
import { BrowserRouter, Routes, Route, useNavigate, Navigate } from "react-router-dom";
import "./App.css";

/* ---------- LOGIN PAGE ---------- */
function LoginPage({ setRoleGlobal }) {
  const [role, setRole] = useState("");
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (id === "123" && password === "123") {
      if (!role) { alert("Select a role!"); return; }
      setRoleGlobal(role);
      sessionStorage.setItem("role", role);
      switch (role) {
        case "user": navigate("/home"); break;
        case "admin": navigate("/admin"); break;
        case "farmer": navigate("/farmer"); break;
        case "expert": navigate("/expert"); break;
        case "public": navigate("/public"); break;
        default: alert("Invalid role!");
      }
    } else {
      alert("Invalid ID or Password!");
    }
  };

  return (
    <div className="login-page">
      <h1>🌾 FEDF-PS17 Login</h1>
      <div className="login-form">
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="">-- Select Role --</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
          <option value="farmer">Farmer</option>
          <option value="expert">Agricultural Expert</option>
          <option value="public">Public</option>
        </select>
        <input type="text" placeholder="Enter ID" value={id} onChange={(e)=>setId(e.target.value)} />
        <input type="password" placeholder="Enter Password" value={password} onChange={(e)=>setPassword(e.target.value)} />
        <button onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
}

/* ---------- PROTECTED ROUTE ---------- */
function ProtectedRoute({ children, allowedRole }) {
  const role = sessionStorage.getItem("role");
  if (role !== allowedRole) {
    return <Navigate to="/" replace />;
  }
  return children;
}

/* ---------- DASHBOARDS ---------- */
function HomePage({ posts }) {
  return (
    <div className="app">
      <h2>🏠 User Page</h2>
      <p>Welcome User! Explore farming resources and content below.</p>
      <h3>Posts:</h3>
      <div className="posts">
        {posts.map((p,i)=><div key={i} className="card">
          <h4>{p.title}</h4>
          <p>{p.desc}</p>
        </div>)}
      </div>
    </div>
  );
}

function AdminPage({ posts, setPosts }) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");

  const addPost = () => {
    if (title && desc) {
      setPosts([...posts, { title, desc }]);
      setTitle(""); setDesc("");
    }
  };

  return (
    <div className="app">
      <h2>👨‍💼 Admin Dashboard</h2>
      <p>Manage platform content, oversee interactions, and ensure accuracy.</p>
      <div className="admin-form">
        <input placeholder="Title" value={title} onChange={(e)=>setTitle(e.target.value)} />
        <textarea placeholder="Description" value={desc} onChange={(e)=>setDesc(e.target.value)} />
        <button onClick={addPost}>Add Post</button>
      </div>
      <h3>All Posts:</h3>
      <div className="posts">
        {posts.map((p,i)=><div key={i} className="card">
          <h4>{p.title}</h4>
          <p>{p.desc}</p>
        </div>)}
      </div>
    </div>
  );
}

function FarmerPage({ posts }) {
  const [readPosts, setReadPosts] = useState([]);
  const markRead = (index) => setReadPosts([...readPosts, index]);

  return (
    <div className="app">
      <h2>🚜 Farmer Dashboard</h2>
      <p>Access resources, connect with sectors, and participate in initiatives.</p>
      <h3>Latest Posts:</h3>
      <div className="posts">
        {posts.map((p,i)=><div key={i} className={`card ${readPosts.includes(i)?"read":""}`}>
          <h4>{p.title}</h4>
          <p>{p.desc}</p>
          {!readPosts.includes(i)&&<button onClick={()=>markRead(i)}>Mark as Read</button>}
        </div>)}
      </div>
    </div>
  );
}

function ExpertPage({ posts, setPosts }) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");

  const addGuidance = () => {
    if (title && desc) {
      setPosts([...posts, { title, desc }]);
      setTitle(""); setDesc("");
    }
  };

  return (
    <div className="app">
      <h2>🌱 Expert Dashboard</h2>
      <p>Provide guidance, create educational content, and support farmers’ needs.</p>
      <div className="admin-form">
        <input placeholder="Title" value={title} onChange={(e)=>setTitle(e.target.value)} />
        <textarea placeholder="Description" value={desc} onChange={(e)=>setDesc(e.target.value)} />
        <button onClick={addGuidance}>Add Guidance</button>
      </div>
      <h3>Submitted Guidance:</h3>
      <div className="posts">
        {posts.map((p,i)=><div key={i} className="card">
          <h4>{p.title}</h4>
          <p>{p.desc}</p>
        </div>)}
      </div>
    </div>
  );
}

function PublicPage({ posts }) {
  const [likes, setLikes] = useState([]);
  const toggleLike = (index) => {
    setLikes(likes.includes(index)? likes.filter(i=>i!==index) : [...likes,index]);
  };

  return (
    <div className="app">
      <h2>👥 Public Dashboard</h2>
      <p>Explore content, learn about farming, and engage in discussions.</p>
      <h3>Posts to Explore:</h3>
      <div className="posts">
        {posts.map((p,i)=><div key={i} className="card">
          <h4>{p.title}</h4>
          <p>{p.desc}</p>
          <button onClick={()=>toggleLike(i)}>{likes.includes(i)?"❤️ Liked":"🤍 Like"}</button>
        </div>)}
      </div>
    </div>
  );
}

/* ---------- MAIN APP ---------- */
export default function App() {
  const [roleGlobal, setRoleGlobal] = useState(sessionStorage.getItem("role")||"");
  const [posts, setPosts] = useState([]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage setRoleGlobal={setRoleGlobal} />} />
        <Route path="/home" element={<ProtectedRoute allowedRole="user"><HomePage posts={posts} /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute allowedRole="admin"><AdminPage posts={posts} setPosts={setPosts} /></ProtectedRoute>} />
        <Route path="/farmer" element={<ProtectedRoute allowedRole="farmer"><FarmerPage posts={posts} /></ProtectedRoute>} />
        <Route path="/expert" element={<ProtectedRoute allowedRole="expert"><ExpertPage posts={posts} setPosts={setPosts} /></ProtectedRoute>} />
        <Route path="/public" element={<ProtectedRoute allowedRole="public"><PublicPage posts={posts} /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}
