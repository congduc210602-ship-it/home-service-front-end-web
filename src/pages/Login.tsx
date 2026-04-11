// src/pages/Login.tsx
import React, { useState,     } from 'react';
import { Box, Card, CardContent, Typography, TextField, Button, Alert, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

const Login = () => {
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!phone || !password) {
            setError('Vui lòng nhập đầy đủ số điện thoại và mật khẩu');
            return;
        }

        setIsLoading(true);
        try {
            const response = await authService.login(phone, password);

            // Ở hệ thống quản trị, ta nên kiểm tra thêm role có phải admin không (nếu backend có trả về)
            if (response.role !== 'admin') {
                setError('Tài khoản này không có quyền truy cập trang quản trị!');
                setIsLoading(false);
                return;
            }

            // Lưu token vào localStorage của trình duyệt
            localStorage.setItem('adminToken', response.access_token);

            // Chuyển hướng vào trang Dashboard
            navigate('/');
        } catch (err: any) {
            const errorMsg = err.response?.data?.detail || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.';
            setError(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box
            sx={{
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f4f6f8'
            }}
        >
            <Card sx={{ maxWidth: 400, width: '100%', padding: 2, boxShadow: 3 }}>
                <CardContent>
                    <Typography variant="h5" component="h1" gutterBottom sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                        Quản trị viên Đăng nhập
                    </Typography>

                    <Box component="form" onSubmit={handleLogin} sx={{ mt: 2 }}>
                        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                        <TextField
                            fullWidth
                            label="Số điện thoại"
                            variant="outlined"
                            margin="normal"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            disabled={isLoading}
                        />

                        <TextField
                            fullWidth
                            label="Mật khẩu"
                            type="password"
                            variant="outlined"
                            margin="normal"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isLoading}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            size="large"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={isLoading}
                        >
                            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Đăng nhập'}
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
};

export default Login;