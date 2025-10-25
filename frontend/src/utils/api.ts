import axios from 'axios';

const baseURL = 'https://habitron-api.onrender.com/api';
const api = axios.create({
    baseURL,
    withCredentials: true,
});
export default api;
