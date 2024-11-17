import axios from 'axios'

export const api = axios.create({
    baseURL: 'https://stack-pg.onrender.com/api',
    withCredentials: true
})