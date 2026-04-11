import React from 'react';
import {
    Box, Drawer, List, ListItem, ListItemButton,
    ListItemIcon, ListItemText, AppBar, Toolbar,
    Typography, CssBaseline, Divider, IconButton
} from '@mui/material';
import {
    Dashboard as DashboardIcon,
    People,
    HomeRepairService,
    Logout
} from '@mui/icons-material';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

const drawerWidth = 260;

const AdminLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { text: 'Tổng quan', icon: <DashboardIcon />, path: '/' },
        { text: 'Khách hàng & Thợ', icon: <People />, path: '/users' },
        { text: 'Dịch vụ', icon: <HomeRepairService />, path: '/services' },
    ];

    const handleLogout = () => {
        // Xóa token và đá về trang Login
        localStorage.removeItem('adminToken');
        navigate('/login');
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />

            {/* 1. Thanh Header phía trên */}
            <AppBar
                position="fixed"
                sx={{
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                    backgroundColor: '#1976d2'
                }}
            >
                <Toolbar sx={{ justifyContent: 'space-between' }}>
                    <Typography variant="h6" noWrap component="div" fontWeight="bold">
                        HOME SERVICE - QUẢN TRỊ
                    </Typography>
                    <IconButton color="inherit" onClick={handleLogout} title="Đăng xuất">
                        <Logout />
                    </IconButton>
                </Toolbar>
            </AppBar>

            {/* 2. Thanh Menu bên trái (Sidebar) */}
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                        backgroundColor: '#f8f9fa'
                    },
                }}
            >
                <Toolbar /> {/* Khoảng trống để không bị Header đè */}
                <Box sx={{ overflow: 'auto', mt: 2 }}>
                    <List>
                        {menuItems.map((item) => (
                            <ListItem key={item.text} disablePadding>
                                <ListItemButton
                                    onClick={() => navigate(item.path)}
                                    selected={location.pathname === item.path}
                                    sx={{
                                        '&.Mui-selected': {
                                            backgroundColor: '#e3f2fd',
                                            borderRight: '4px solid #1976d2',
                                            '&:hover': { backgroundColor: '#e3f2fd' }
                                        },
                                        margin: '4px 8px',
                                        borderRadius: '8px'
                                    }}
                                >
                                    <ListItemText
                                        primary={item.text}
                                        sx={{
                                            // Tác động trực tiếp vào phần chữ primary bên trong component
                                            '& .MuiListItemText-primary': {
                                                fontWeight: location.pathname === item.path ? 'bold' : 500,
                                                fontSize: '0.95rem'
                                            }
                                        }}
                                    />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                    <Divider sx={{ my: 2 }} />
                </Box>
            </Drawer>

            {/* 3. Vùng chứa Nội dung chính */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    backgroundColor: '#f4f6f8',
                    minHeight: '100vh'
                }}
            >
                <Toolbar /> {/* Khoảng trống để nội dung bắt đầu dưới Header */}

                {/* CỰC KỲ QUAN TRỌNG: Thẻ Outlet này là nơi 
            Dashboard, UsersPage, ServicesPage sẽ được render vào.
        */}
                <Outlet />
            </Box>
        </Box>
    );
};

export default AdminLayout;