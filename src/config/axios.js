import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:5112/api/',
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

axiosInstance.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        if (error.response && error.response.status === 401) {
            // JWT hết hạn hoặc không hợp lệ, xử lý lỗi ở đây (ví dụ: điều hướng đến trang đăng nhập)
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;