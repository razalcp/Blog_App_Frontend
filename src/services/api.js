import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
  updateProfile: (userData) => api.put('/auth/update', userData),
};

export const blogAPI = {
  createBlog: (blogData) => api.post('/blogs', blogData),
  getBlogs: (params) => api.get('/blogs', { params }),
  getBlogById: (id) => api.get(`/blogs/${id}`),
  updateBlog: (id, blogData) => api.put(`/blogs/${id}`, blogData),
  deleteBlog: (id) => api.delete(`/blogs/${id}`),
  getMyBlogs: (params) => api.get('/blogs/my', { params }),
};

export const categoryAPI = {
  getCategories: () => api.get('/categories'),
  getCategoryById: (id) => api.get(`/categories/${id}`),
  createCategory: (categoryData) => api.post('/categories', categoryData),
  updateCategory: (id, categoryData) => api.put(`/categories/${id}`, categoryData),
  deleteCategory: (id) => api.delete(`/categories/${id}`),
};

export const commentAPI = {
  createComment: (commentData) => api.post('/comments', commentData),
  getCommentsByBlog: (blogId, params) => api.get(`/comments/blog/${blogId}`, { params }),
  updateComment: (id, commentData) => api.put(`/comments/${id}`, commentData),
  deleteComment: (id) => api.delete(`/comments/${id}`),
  likeComment: (id) => api.post(`/comments/${id}/like`),
};

export const likeAPI = {
  toggleLike: (likeData) => api.post('/likes', likeData),
  getBlogLikes: (blogId) => api.get(`/likes/blog/${blogId}`),
  getUserLikeStatus: (blogId) => api.get(`/likes/blog/${blogId}/status`),
};

export const adminAPI = {
  getDashboardStats: () => api.get('/admin/dashboard/stats'),
  getAllUsers: () => api.get('/admin/users'),
  getUserById: (id) => api.get(`/admin/users/${id}`),
  updateUser: (id, userData) => api.put(`/admin/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getAllBlogs: (params) => api.get('/admin/blogs', { params }),
  deleteBlog: (id) => api.delete(`/admin/blogs/${id}`),
};

export default api;
