// src/services/reviewService.ts
import axiosClient from '../utils/axiosClient';

const BASE_URL = 'http://localhost:5173/api/review-service';

export const reviewService = {
    // 1. Lấy danh sách (Để tạm mảng rỗng vì backend chưa có API GET)
    getReviews: async () => {
        return [];
    },

    // 2. TẠO DỮ LIỆU BẰNG API THẬT
    createReview: async (orderId: number, workerId: number, rating: number, comment: string) => {
        // Gửi qua params vì FastAPI backend đang nhận Query Parameters
        const response = await axiosClient.post(`${BASE_URL}/review/create`, null, {
            params: {
                order_id: orderId,
                worker_id: workerId,
                rating: rating,
                comment: comment
            }
        });
        return response.data;
    },

    // 3. Xóa (Giữ chỗ)
    deleteReview: async (reviewId: number) => {
        return { message: "Giữ chỗ chờ API" };
    }
};