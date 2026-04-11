import axios from 'axios';

const WORKER_URL = 'http://localhost:8003';

export const userService = {
    // Lấy danh sách thợ và gán thêm role 'worker'
    getWorkers: async () => {
        const response = await axios.get(`${WORKER_URL}/worker/list`);
        return response.data.map((w: any) => ({
            ...w,
            role: 'worker'
        }));
    },

    // Lấy danh sách khách hàng (Dữ liệu mẫu)
    getCustomers: async () => {
        return [
            { id: 1, full_name: 'Nguyễn Văn A', phone: '0912345678', role: 'customer' },
            { id: 2, full_name: 'Trần Thị B', phone: '0987654321', role: 'customer' },
        ];
    },

    // Gọi API phê duyệt thợ
    approveWorker: async (workerId: string) => {
        const response = await axios.put(`${WORKER_URL}/admin/workers/${workerId}/approve`);
        return response.data;
    }
};