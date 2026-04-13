// src/services/orderService.ts
import axiosClient from '../utils/axiosClient';

const BASE_URL = 'http://localhost:5173/api/order-service';

export const orderService = {
    getOrders: async () => {
        // Tạm thời comment lại gọi API thật vì Backend chưa có endpoint GET /orders
        /*
        try {
            const response = await axiosClient.get(`${BASE_URL}/orders`);
            return response.data;
        } catch (error) {
            console.error("Lỗi lấy danh sách đơn hàng", error);
            return [];
        }
        */

        // Trả về dữ liệu ảo (Mock data) để test giao diện
        // Dữ liệu này bám sát cấu trúc của OrderItem trong database
        return [
            {
                id: 101,
                customer_name: 'Nguyễn Văn A',
                worker_name: 'Thợ 1',
                service_name: 'Sửa máy tính tại nhà',
                total_price: 200000,
                status: 'pending'
            },
            {
                id: 102,
                customer_name: 'Trần Thị B',
                worker_name: 'Thợ 2',
                service_name: 'Vệ sinh máy lạnh',
                total_price: 150000,
                status: 'in_progress'
            },
            {
                id: 103,
                customer_name: 'Lê Hoàng C',
                worker_name: 'Thợ 3',
                service_name: 'Sửa điện',
                total_price: 100000,
                status: 'completed'
            },
            {
                id: 104,
                customer_name: 'Phạm Văn D',
                worker_name: '', // Đơn bị hủy nên không có thợ
                service_name: 'Sửa ống nước',
                total_price: 120000,
                status: 'cancelled'
            }
        ];
    }
};