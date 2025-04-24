import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const fetchDocuments = async ({ page = 1, search = '', sortField = 'id', sortOrder = 'ASC' }) => {
  try {
    const response = await api.get('/documents', {
      params: {
        page,
        search,
        sortField,
        sortOrder,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching documents:', error);
    throw error;
  }
};

export const fetchDocumentById = async (id) => {
  try {
    const response = await api.get(`/documents/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching document:', error);
    throw error;
  }
};

export default api;
