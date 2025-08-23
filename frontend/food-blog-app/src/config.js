export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:3000"; // Change this to your ngrok URL when using ngrok
export const IMAGE_BASE_URL = `${API_BASE_URL}/public/images`;
