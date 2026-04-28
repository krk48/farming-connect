import axios from 'axios';

function stripTrailingSlash(value) {
  return value.replace(/\/+$/, '');
}

function resolveApiBaseUrl() {
  const explicitApiUrl = import.meta.env.VITE_API_URL?.trim();
  if (explicitApiUrl) {
    return stripTrailingSlash(explicitApiUrl);
  }

  const apiOrigin = import.meta.env.VITE_API_ORIGIN?.trim();
  if (apiOrigin) {
    return `${stripTrailingSlash(apiOrigin)}/api`;
  }

  return 'http://localhost:8080/api';
}

const API_BASE_URL = resolveApiBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ========== Authentication ==========

export async function signup(username, password, email, fullName, role) {
  const response = await api.post('/auth/signup', {
    username,
    password,
    email,
    fullName,
    role,
  });
  return response.data;
}

export async function login(username, password, role) {
  const payload = {
    username,
    password,
  };

  if (role) {
    payload.role = role;
  }

  const response = await api.post('/auth/login', payload);
  
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    localStorage.setItem('role', response.data.user?.role?.toLowerCase?.() || '');
  }
  
  return response.data;
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

export function getCurrentUser() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

export function getToken() {
  return localStorage.getItem('token');
}

// ========== Farmer Posts ==========

export async function getFarmerPosts() {
  try {
    const response = await api.get('/farmer-posts');
    return response.data || [];
  } catch (error) {
    console.error('Error fetching farmer posts:', error);
    return [];
  }
}

export async function getFarmerPostsByUser(userId) {
  try {
    const response = await api.get(`/farmer-posts/user/${userId}`);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching user farmer posts:', error);
    return [];
  }
}

export async function createFarmerPost(imageData, caption) {
  try {
    const response = await api.post('/farmer-posts', {
      imageData,
      caption,
    });
    return response.data;
  } catch (error) {
    console.error('Error creating farmer post:', error);
    throw error;
  }
}

export async function deleteFarmerPost(postId) {
  try {
    await api.delete(`/farmer-posts/${postId}`);
  } catch (error) {
    console.error('Error deleting farmer post:', error);
    throw error;
  }
}

// ========== Expert Posts ==========

export async function getExpertPosts() {
  try {
    const response = await api.get('/expert-posts');
    return response.data || [];
  } catch (error) {
    console.error('Error fetching expert posts:', error);
    return [];
  }
}

export async function getExpertPostsByUser(userId) {
  try {
    const response = await api.get(`/expert-posts/user/${userId}`);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching user expert posts:', error);
    return [];
  }
}

export async function createExpertPost(title, content) {
  try {
    const response = await api.post('/expert-posts', {
      title,
      content,
    });
    return response.data;
  } catch (error) {
    console.error('Error creating expert post:', error);
    throw error;
  }
}

export async function deleteExpertPost(postId) {
  try {
    await api.delete(`/expert-posts/${postId}`);
  } catch (error) {
    console.error('Error deleting expert post:', error);
    throw error;
  }
}

export default api;
