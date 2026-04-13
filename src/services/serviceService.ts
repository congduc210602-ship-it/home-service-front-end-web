// src/services/serviceService.ts
import axiosClient from '../utils/axiosClient';

const BASE_URL = 'http://localhost:5173/api/service-management';

export const serviceService = {
    getServices: async () => {
        const response = await axiosClient.get(`${BASE_URL}/services/`);
        return response.data.data;
    },

    createService: async (data: any) => {
        const payload = {
            name: data.name,
            category: data.category,
            description: data.description,
            base_price: parseFloat(data.base_price)
        };
        return await axiosClient.post(`${BASE_URL}/services/`, payload);
    },

    // 🌟 THÊM HÀM SỬA VÀO ĐÂY
    updateService: async (serviceId: number, data: any) => {
        const payload = {
            name: data.name,
            category: data.category,
            description: data.description,
            base_price: parseFloat(data.base_price)
        };
        // Gọi API PUT /services/{service_id} của Backend
        return await axiosClient.put(`${BASE_URL}/services/${serviceId}`, payload);
    },

    deleteService: async (serviceId: number) => {
        const response = await axiosClient.delete(`${BASE_URL}/services/${serviceId}`);
        return response.data;
    }
};