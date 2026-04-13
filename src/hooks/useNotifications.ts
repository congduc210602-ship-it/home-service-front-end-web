// src/hooks/useNotifications.ts
import { useState, useEffect } from 'react';

export const useNotifications = (userId: string) => {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        if (!userId) return;

        // Kết nối tới cổng notification-service của đồng nghiệp bạn
        const socket = new WebSocket(`ws://localhost:8005/ws/${userId}`);

        socket.onopen = () => {
            console.log("✅ Đã kết nối chuông thông báo Real-time");
        };

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            // Thêm thông báo mới vào đầu danh sách
            setNotifications(prev => [{
                ...data,
                id: Date.now(),
                isRead: false,
                time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
            }, ...prev]);
            setUnreadCount(prev => prev + 1);
        };

        socket.onclose = () => console.log("🔴 Ngắt kết nối thông báo");

        return () => socket.close();
    }, [userId]);

    const markAllAsRead = () => {
        setUnreadCount(0);
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    };

    return { notifications, unreadCount, markAllAsRead };
};