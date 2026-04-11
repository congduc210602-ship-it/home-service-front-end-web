// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import Login from './pages/Login'; // Import trang Login vừa tạo
import { Typography } from '@mui/material';
import type { JSX } from '@emotion/react/jsx-runtime';
import Dashboard from './pages/Dashboard';
import UsersPage from './pages/UsersPage';
import ServicesPage from './pages/ServicesPage';


// Hàm bảo vệ Route: Nếu chưa có token thì bắt quay lại trang Login
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem('adminToken');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Route không cần bảo vệ */}
        <Route path="/login" element={<Login />} />

        {/* Các Route cần đăng nhập mới vào được */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="services" element={<ServicesPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;