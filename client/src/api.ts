/// <reference types="vite/client" />
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000/api';

// Add token to requests
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle expired tokens globally
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Only auto-logout if we had a token (i.e., user was logged in)
      const token = localStorage.getItem('token');
      if (token) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.reload();
      }
    }
    return Promise.reject(error);
  }
);

export const login = async (credentials: any) => {
  const response = await axios.post(`${API_URL}/auth/login`, credentials);
  return response.data;
};

export const register = async (userData: any) => {
  const response = await axios.post(`${API_URL}/auth/register`, userData);
  return response.data;
};

export const getQuestions = async (userId?: number) => {
  const response = await axios.get(`${API_URL}/questions${userId ? `?userId=${userId}` : ''}`);
  return response.data;
};

export const updateProgress = async (id: number, status: string) => {
  const response = await axios.post(`${API_URL}/questions/${id}/progress`, { status });
  return response.data;
};

export const addQuestion = async (data: any) => {
  const response = await axios.post(`${API_URL}/questions`, data);
  return response.data;
};

export const likeQuestion = async (id: number) => {
  const response = await axios.post(`${API_URL}/questions/${id}/like`);
  return response.data;
};

export const markAsAsked = async (id: number) => {
  const response = await axios.post(`${API_URL}/questions/${id}/asked`);
  return response.data;
};

// --- Notes API ---
export const getNotes = async (questionId: number) => {
  const response = await axios.get(`${API_URL}/questions/${questionId}/notes`);
  return response.data;
};

export const addNote = async (questionId: number, note_text: string) => {
  const response = await axios.post(`${API_URL}/questions/${questionId}/notes`, { note_text });
  return response.data;
};

export const editNote = async (noteId: number, note_text: string) => {
  const response = await axios.put(`${API_URL}/notes/${noteId}`, { note_text });
  return response.data;
};

export const deleteNote = async (noteId: number) => {
  const response = await axios.delete(`${API_URL}/notes/${noteId}`);
  return response.data;
};

// --- AI API ---
export const generateAIAnswer = async (question: string) => {
  const response = await axios.post(`${API_URL}/ai/generate`, { question });
  return response.data;
};

// --- ADMIN USER MANAGEMENT ---
export const getUsers = async () => {
  const response = await axios.get(`${API_URL}/admin/users`);
  return response.data;
};

export const approveUser = async (userId: string) => {
  const response = await axios.post(`${API_URL}/admin/users/${userId}/approve`);
  return response.data;
};

export const deleteUser = async (userId: string) => {
  const response = await axios.delete(`${API_URL}/admin/users/${userId}`);
  return response.data;
};

export const updateUserRole = async (userId: string, role: 'user' | 'admin') => {
  const response = await axios.post(`${API_URL}/admin/users/${userId}/role`, { role });
  return response.data;
};

export const getAiRoadmap = async (category: string) => {
  const response = await axios.post(`${API_URL}/ai/roadmap`, { category });
  return response.data;
};

export const getRoadmap = async (category: string) => {
  const response = await axios.get(`${API_URL}/roadmaps/${category}`);
  return response.data;
};

export const saveRoadmap = async (data: any) => {
  const response = await axios.post(`${API_URL}/roadmaps`, data);
  return response.data;
};

export const deleteRoadmap = async (category: string) => {
  const response = await axios.delete(`${API_URL}/roadmaps/${category}`);
  return response.data;
};

export const deleteCurriculum = async (category: string) => {
  const response = await axios.delete(`${API_URL}/questions/category/${category}`);
  return response.data;
};

// --- DSA API ---
export const getDSABoard = async () => {
  const response = await axios.get(`${API_URL}/dsa`);
  return response.data;
};

export const addDSASection = async (data: { name: string }) => {
  const response = await axios.post(`${API_URL}/dsa/sections`, data);
  return response.data;
};

export const addDSAQuestion = async (data: { section_id: string, title: string, level: string, link: string }) => {
  const response = await axios.post(`${API_URL}/dsa/questions`, data);
  return response.data;
};

export const updateDSAProgress = async (id: string, status: string) => {
  const response = await axios.put(`${API_URL}/dsa/questions/${id}/progress`, { status });
  return response.data;
};

// --- TOPICS API ---
export const getTopics = async () => {
  const response = await axios.get(`${API_URL}/topics`);
  return response.data;
};

export const addTopic = async (name: string) => {
  const response = await axios.post(`${API_URL}/topics`, { name });
  return response.data;
};

export const deleteTopic = async (name: string) => {
  const response = await axios.delete(`${API_URL}/topics/${name}`);
  return response.data;
};
