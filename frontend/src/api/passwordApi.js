import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export const checkPassword = async (password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/check-password`, { password });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || error.response?.data?.message || error.message || 'Failed to check password');
  }
};

export const checkBulk = async (passwords) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/check-bulk`, { passwords });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || error.response?.data?.message || error.message || 'Failed to bulk check passwords');
  }
};

export const checkEmail = async (email) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/check-email`, { email });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || error.response?.data?.message || error.message || 'Failed to check email');
  }
};
