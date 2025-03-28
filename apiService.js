
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/shorten';  // Adjust to correct backend URL

// Function to shorten URL
export const shortenURL = async (token, originalUrl, customCode) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/shorten/`,  // No extra "/shorten/" here
      {
        original_url: originalUrl,
        custom_code: customCode,
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,  // Ensure token is correctly passed
          'Content-Type': 'application/json', // Explicitly define content type
        },
      }
    );
    return response.data;  // Return the shortened URL response data
  } catch (error) {
    console.error('Error shortening URL:', error.response?.data || error.message);
    throw error;  // Optionally handle the error as needed
  }
};