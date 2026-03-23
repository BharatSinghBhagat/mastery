import axios from 'axios';

const API_URL = 'http://127.0.0.1:5000/api';

// Add token to requests
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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
