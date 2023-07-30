import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
})

const token = localStorage.getItem("token")

api.interceptors.request.use(config => {
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  } else {
    delete config.headers.Authorization
  }

  return config
})

export default api
