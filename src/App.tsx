// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';

import Dashboard from './pages/Dashboard';

import ServicesPage from './pages/ServicesPage';
import UsersPage from './pages/UsersPage';
import OrdersPage from './pages/OrdersPage';
import ReviewsPage from './pages/ReviewsPage';
import LoginPage from './pages/LoginPage';
import TransactionsPage from './pages/TransactionsPage';

import type { JSX } from '@emotion/react/jsx-runtime';

// Component kiểm tra quyền (Cổng an ninh)
const PrivateRoute = ({ children }: { children: JSX.Element }) => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    // Nếu không có token hoặc không phải admin, đá về trang /login
    if (!token || role !== 'admin') {
        return <Navigate to="/login" replace />;
    }
    return children;
};

function App() {
    return (
        <Router>
            <Routes>
                {/* Trang đăng nhập (Ai cũng vào được) */}
                <Route path="/login" element={<LoginPage />} />

                {/* Các trang Admin (Bị khóa bởi PrivateRoute) */}
                <Route path="/" element={<PrivateRoute><AdminLayout /></PrivateRoute>}>
                    <Route index element={<Dashboard />} />
                    <Route path="users" element={<UsersPage />} />
                    <Route path="services" element={<ServicesPage />} />
                    <Route path="orders" element={<OrdersPage />} />
                    <Route path="reviews" element={<ReviewsPage />} />
                    <Route path="transactions" element={<TransactionsPage />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;