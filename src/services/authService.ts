// src/services/authService.ts
import axios from 'axios';

// Đổi cổng từ 8000 sang 8001 cho khớp với docker-compose
const BASE_URL = 'http://localhost:8001';

export const authService = {
    login: async (phone: string, password: string) => {
        const response = await axios.post(`${BASE_URL}/auth/login/password`, {
            phone,
            password,
        });
        return response.data;
    },
};