import axios from 'axios';

const baseURL = 'http://localhost:3000/api';
const api = axios.create({
    baseURL,
    withCredentials: true,
});
export default api;
