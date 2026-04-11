// src/services/adminService.ts
import axios from 'axios';

// Theo docker-compose, admin-service chạy ở cổng 8008
const BASE_URL = 'http://localhost:8008';

export const adminService = {
    getStats: async () => {
        const token = localStorage.getItem('adminToken');
        const response = await axios.get(`${BASE_URL}/admin/stats`, {
            headers: {
                Authorization: token ? `Bearer ${token}` : '',
            },
        });
        return response.data;
    },
};