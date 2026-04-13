// src/services/adminService.ts
import axiosClient from '../utils/axiosClient';

const BASE_URL = 'http://localhost:5173/api/admin-service';

export const adminService = {
    getStats: async () => {
        const response = await axiosClient.get(`${BASE_URL}/admin/stats`);
        return response.data;
    },
    // BỔ SUNG HÀM NÀY ĐỂ LẤY DỮ LIỆU BIỂU ĐỒ THẬT
    getPendingOrders: async () => {
        const response = await axiosClient.get(`${BASE_URL}/admin/orders/pending`);
        return response.data;
    }
};