import axios from 'axios';
import AuthService from 'services/auth';

const axiosInstance = axios.create({
    baseURL: `${process.env.REACT_APP_BASE_URL}/api/`,
});

axiosInstance.interceptors.request.use(
    config => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

const refreshToken = async () => {
    try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axiosInstance.post('Auth/refresh-token', { refreshToken });
        const newToken = response.data.data.token;
        const newRefreshToken = response.data.data.refreshToken;

        AuthService.saveAccessToken(newToken.accessToken);
        AuthService.saveRefreshToken(newRefreshToken.refreshToken);

        return newToken.accessToken;
    } catch (error) {
        console.log('Error refreshing token:', error);
        throw error;
    }
};

axiosInstance.interceptors.response.use(
    response => {
        return response;
    },
    async error => {
        const originalRequest = error.config;
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const accessToken = await refreshToken();
                console.log(accessToken);
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return axios(originalRequest);
            } catch (error) {
                console.log("Error retrying request after token refresh: ", error);
                throw error;
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;