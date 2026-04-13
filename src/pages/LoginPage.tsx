// src/pages/LoginPage.tsx
import React, { useState } from 'react';
import { Box, Card, Typography, TextField, Button, InputAdornment, IconButton, CircularProgress } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

const LoginPage = () => {
    const navigate = useNavigate();
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const data = await authService.login(phone, password);
            
            // Nếu API trả về thành công, lưu token vào trình duyệt
            localStorage.setItem('token', data.access_token);
            localStorage.setItem('role', data.role);
            
            // Cửa sổ Admin chỉ dành cho admin
            if (data.role !== 'admin') {
                setError('Tài khoản của bạn không có quyền truy cập Admin Panel!');
                localStorage.clear();
            } else {
                // Đăng nhập thành công, bay thẳng vào Dashboard
                navigate('/');
            }
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Sai số điện thoại hoặc mật khẩu!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ 
            minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', 
            backgroundColor: '#f4f6f8' 
        }}>
            <Card elevation={0} sx={{ p: 5, width: '100%', maxWidth: 420, borderRadius: 4, boxShadow: '0 12px 24px rgba(145,158,171,0.16)' }}>
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Box sx={{ backgroundColor: '#1877F2', width: 60, height: 60, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', mb: 2 }}>
                        <LockOutlinedIcon sx={{ color: '#fff', fontSize: 30 }} />
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#212B36' }}>
                        TYD Branding Admin
                    </Typography>
                    <Typography color="textSecondary" variant="body2" sx={{ mt: 1 }}>
                        Vui lòng đăng nhập để quản trị hệ thống
                    </Typography>
                </Box>

                <form onSubmit={handleLogin}>
                    <TextField
                        fullWidth
                        label="Số điện thoại"
                        variant="outlined"
                        margin="normal"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                    />
                    <TextField
                        fullWidth
                        label="Mật khẩu"
                        type={showPassword ? 'text' : 'password'}
                        variant="outlined"
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />

                    {error && (
                        <Typography color="error" variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
                            {error}
                        </Typography>
                    )}

                    <Button
                        fullWidth
                        size="large"
                        type="submit"
                        variant="contained"
                        sx={{ mt: 3, mb: 2, py: 1.5, borderRadius: 2, fontWeight: 'bold', fontSize: '1rem', backgroundColor: '#1877F2' }}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : 'ĐĂNG NHẬP'}
                    </Button>
                </form>
            </Card>
        </Box>
    );
};

export default LoginPage;