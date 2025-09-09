import axios from "axios";

const baseURL =
    import.meta.env.MODE === 'development'
        ? '/api/' // dev com proxy
        : 'https://vetor-api.micaelfarias.com/api/'; // produção

const api = axios.create({
    baseURL,
});

// Função auxiliar para pegar o valor de um cookie
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

// Interceptor para adicionar o token de acesso no cabeçalho
api.interceptors.request.use(
    config => {
        const accessToken = getCookie('access');
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// Interceptor de refresh automático
api.interceptors.response.use(
    res => res,
    async err => {
        const originalRequest = err.config;
        if (err.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                // Pega o refresh token do cookie
                const refreshToken = getCookie('refresh');

                // Envia a requisição de refresh com o refresh token
                const resp = await api.post("/token/refresh/", { refresh: refreshToken });
                document.cookie = `access=${resp.data.access}; path=/; max-age=3600;`;
                // Tenta a requisição original novamente
                return api(originalRequest);
            } catch {
                // Falha no refresh, rejeita o erro para a aplicação
                return Promise.reject(err);
            }
        }
        return Promise.reject(err);
    }
);

export async function login(username, password) {
    try {
        const resp = await api.post("token/", { username, password });
        console.log(resp.data);

        // Salva os cookies manualmente
        document.cookie = `access=${resp.data.access}; path=/; max-age=3600;`; // 1 hora
        document.cookie = `refresh=${resp.data.refresh}; path=/; max-age=86400;`; // 24 horas

    } catch (error) {
        console.error("Erro no login:", error.response?.data || error);
        throw error;
    }
}


export function logout() {
    // Você não precisa mais do `document.cookie` para deletar, o backend pode fazer isso
    // com uma requisição para a sua view `LogoutView`
}

export default api;