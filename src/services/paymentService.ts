// src/services/paymentService.ts
import axiosClient from '../utils/axiosClient';

const BASE_URL = '/api/payment-service';

export const paymentService = {
    // Tạm thời dùng Mock Data vì Backend chưa có API GET /admin/transactions
    getTransactions: async (keyword: string = '') => {
        // Mô phỏng cấu trúc bảng Transaction trong Database của đồng nghiệp bạn
        const mockTransactions = [
            { id: 1, order_uuid: "ORD-1A2B3C", amount: 500000, payment_method: "VNPAY", status: "success", transaction_code: "VNP-998877", created_at: "2026-04-12T08:30:00Z" },
            { id: 2, order_uuid: "ORD-X9Y8Z7", amount: 150000, payment_method: "COD", status: "success", transaction_code: "COD-W12-1681234567", created_at: "2026-04-12T09:15:00Z" },
            { id: 3, order_uuid: "ORD-M4N5P6", amount: 300000, payment_method: "VNPAY", status: "pending", transaction_code: null, created_at: "2026-04-12T10:00:00Z" },
            { id: 4, order_uuid: "ORD-Q7R8S9", amount: 1200000, payment_method: "VNPAY", status: "failed", transaction_code: "VNP-ERR-001", created_at: "2026-04-11T14:45:00Z" },
        ];

        if (keyword) {
            const lowerKeyword = keyword.toLowerCase();
            return mockTransactions.filter(t =>
                t.order_uuid.toLowerCase().includes(lowerKeyword) ||
                t.payment_method.toLowerCase().includes(lowerKeyword)
            );
        }
        return mockTransactions;
    },

    // Gọi API thật từ Backend (Đồng nghiệp đã viết hàm này)
    getRevenueStats: async () => {
        try {
            const response = await axiosClient.get(`${BASE_URL}/admin/revenue/stats`);
            return response.data;
        } catch (error) {
            console.error("Lỗi lấy thống kê doanh thu", error);
            return null;
        }
    }
};