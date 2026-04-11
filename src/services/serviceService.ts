import axios from 'axios';

const BASE_URL = 'http://localhost:8009';

export const serviceService = {
    getServices: async () => {
        // Backend của bạn dùng endpoint /services/search để lấy dữ liệu
        const response = await axios.get(`${BASE_URL}/services/search?q=`);
        return response.data;
    },

    createService: async (data: any) => {
        const payload = {
            name: data.name,
            category: data.category,
            description: data.description,
            base_price: parseFloat(data.base_price)
        };
        return await axios.post(`${BASE_URL}/services/`, payload);
    }
};