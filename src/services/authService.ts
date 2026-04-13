// src/services/authService.ts
import axiosClient from '../utils/axiosClient';

const BASE_URL = 'http://localhost:5173/api/auth-service';

export const authService = {
    login: async (phone: string, password: string) => {
        const response = await axiosClient.post(`${BASE_URL}/auth/login/password`, {
            phone,
            password
        });
        return response.data;
    },
    
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        window.location.href = '/login';
    }
};