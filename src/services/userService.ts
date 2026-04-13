// src/services/userService.ts
import axiosClient from '../utils/axiosClient';

const WORKER_URL = 'http://localhost:5173/api/worker-service';
const ADMIN_URL = 'http://localhost:5173/api/admin-service';

export const userService = {
    // 1. Lấy danh sách Khách hàng (Có hỗ trợ lọc giả lập trong lúc chờ API)
    getCustomers: async (keyword: string = '') => {
        const mockCustomers = [
            { id: 1, full_name: 'Nguyễn Văn A', phone: '0912345678', created_at: '2026-04-10' },
            { id: 2, full_name: 'Trần Thị B', phone: '0987654321', created_at: '2026-04-11' },
            { id: 3, full_name: 'Lê Hoàng C', phone: '0909112233', created_at: '2026-04-11' },
            { id: 4, full_name: 'Phạm Đức D', phone: '0911222333', created_at: '2026-04-12' },
        ];

        if (keyword) {
            const lowerKeyword = keyword.toLowerCase();
            return mockCustomers.filter(c =>
                c.full_name.toLowerCase().includes(lowerKeyword) ||
                c.phone.includes(keyword)
            );
        }
        return mockCustomers;
    },

    // 2. Lấy danh sách Thợ (Gọi thẳng API của backend, truyền từ khóa q vào cho Elasticsearch hứng)
    getWorkers: async (keyword: string = '') => {
        try {
            // Khi có keyword, Axios sẽ tự gọi: GET /worker/list?q=keyword
            const response = await axiosClient.get(`${WORKER_URL}/worker/list`, {
                params: { q: keyword }
            });
            return response.data;
        } catch (error) {
            console.error("Lỗi lấy danh sách thợ", error);
            return [];
        }
    },

    // 3. Admin duyệt Thợ
    approveWorker: async (workerId: string | number) => {
        const response = await axiosClient.put(`${WORKER_URL}/admin/workers/${workerId}/approve`);
        return response.data;
    }
};