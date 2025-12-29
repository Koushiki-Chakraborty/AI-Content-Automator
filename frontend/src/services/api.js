import axios from 'axios';

const api = axios.create({
  baseURL: '/api', // Proxy will handle this or we can set full URL
  timeout: 10000,
});

export const fetchArticles = async () => {
  try {
    const response = await api.get('/articles');
    return response.data;
  } catch (error) {
    console.error("Error fetching articles:", error);
    throw error;
  }
};

export const fetchArticleById = async (id) => {
  try {
    const response = await api.get(`/articles/${id}`); // Assuming backend supports this
    return response.data;
  } catch (error) {
    console.error(`Error fetching article ${id}:`, error);
    throw error;
  }
};

export default api;
