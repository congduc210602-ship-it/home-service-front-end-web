// src/utils/axiosClient.ts
import axios from 'axios';

const axiosClient = axios.create({
    headers: {
        'Content-Type': 'application/json',
    },
});

// 1. Can thiệp trước khi gửi API (Gắn Token)
axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// 2. Can thiệp khi nhận kết quả từ Backend (Xử lý lỗi 401)
axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Token sai hoặc hết hạn -> Xóa token cũ và đuổi về trang Login
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default axiosClient;