import axios from 'axios';

const baseURL = process.env.NODE_ENV === "production"
    ? "https://habitron-api.onrender.com/api"
    : "http://localhost:3000/api" 

const api = axios.create({
    baseURL,
    withCredentials: true,
});
export default api;
