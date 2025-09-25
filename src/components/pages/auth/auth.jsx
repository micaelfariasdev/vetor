import axios from 'axios';
import { toggleLoading } from '../../utils';

const api = axios.create({
  baseURL: 'https://vetor-api.micaelfarias.com/api/',
});

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

// refresh isolado
const refreshApi = axios.create({
  baseURL: 'https://vetor-api.micaelfarias.com/api/',
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// request interceptor
api.interceptors.request.use((config) => {
  toggleLoading('ativar');
  const token = getCookie('access');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// response interceptor
api.interceptors.response.use(
  (res) => {
    toggleLoading('desativar'); // desativa quando resposta chegou
    return res;
  },
  async (err) => {
    toggleLoading('desativar');
    const originalRequest = err.config;

    if (originalRequest.url.includes('/token/refresh/')) {
      return Promise.reject(err);
    }

    if (err.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = 'Bearer ' + token;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = getCookie('refresh');
        if (!refreshToken){
          window.location.href('/login')
        }
        const resp = await refreshApi.post('/token/refresh/', {
          refresh: refreshToken,
        });

        const newAccess = resp.data.access;
        document.cookie = `access=${newAccess}; path=/; max-age=3600; SameSite=None; Secure`;

        api.defaults.headers.common.Authorization = `Bearer ${newAccess}`;
        processQueue(null, newAccess);

        originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        return api(originalRequest);
      } catch (error) {
        processQueue(error, null);
        document.cookie = 'access=; path=/; max-age=0';
        document.cookie = 'refresh=; path=/; max-age=0';
        localStorage.removeItem('auth');

        // 🔴 não redireciona aqui
        return Promise.reject(error);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(err);
  }
);

export async function login(username, password) {
  const resp = await api.post('token/', { username, password });

  document.cookie = `access=${resp.data.access}; path=/; max-age=3600; SameSite=None; Secure`;
  document.cookie = `refresh=${resp.data.refresh}; path=/; max-age=604800; SameSite=None; Secure`;

  api.defaults.headers.common['Authorization'] = `Bearer ${resp.data.access}`;

  return resp.data; // só retorna os tokens
}

export async function logout() {
  window.location.href = '/login';
  document.cookie = 'access=; path=/; max-age=0';
  document.cookie = 'refresh=; path=/; max-age=0';
  localStorage.removeItem('auth');
}

export default api;
