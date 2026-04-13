// src/layouts/AdminLayout.tsx
import React, { useState } from 'react';
import {
    Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
    AppBar, Toolbar, Typography, CssBaseline, Divider, IconButton, Badge,
    Menu, MenuItem, Tooltip, Stack, Chip
} from '@mui/material';
import {
    Dashboard as DashboardIcon, People, HomeRepairService, Logout,
    Assignment as AssignmentIcon, Star as StarIcon, Notifications as NotificationsIcon,
    Circle as CircleIcon, AccountBalanceWallet as AccountBalanceWalletIcon
} from '@mui/icons-material';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useNotifications } from '../hooks/useNotifications';

const drawerWidth = 260;

const AdminLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Giả lập Admin ID để nhận thông báo
    const adminId = "admin_01";
    const { notifications, unreadCount, markAllAsRead } = useNotifications(adminId);

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleOpenNotif = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
    const handleCloseNotif = () => {
        setAnchorEl(null);
        markAllAsRead();
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/login');
    };

    const menuItems = [
        { text: 'Tổng quan', icon: <DashboardIcon />, path: '/' },
        { text: 'Khách hàng & Thợ', icon: <People />, path: '/users' },
        { text: 'Dịch vụ', icon: <HomeRepairService />, path: '/services' },
        { text: 'Đơn hàng', icon: <AssignmentIcon />, path: '/orders' },
        { text: 'Giao dịch', icon: <AccountBalanceWalletIcon />, path: '/transactions' },
        { text: 'Đánh giá', icon: <StarIcon />, path: '/reviews' },
    ];

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            {/* 1. THANH HEADER PHÍA TRÊN */}
            <AppBar
                position="fixed"
                sx={{
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(8px)',
                    color: '#212B36',
                    boxShadow: '0px 1px 2px 0px rgba(145, 158, 171, 0.16)'
                }}
            >
                <Toolbar sx={{ justifyContent: 'space-between' }}>
                    {/* ✅ ĐÃ CẬP NHẬT: Click để về Dashboard */}
                    <Typography
                        variant="h6"
                        noWrap
                        sx={{
                            fontWeight: 800,
                            cursor: 'pointer', // Hiện bàn tay khi di chuột vào
                            userSelect: 'none',
                            transition: 'opacity 0.2s',
                            '&:hover': { opacity: 0.7 } // Hiệu ứng mờ nhẹ khi hover
                        }}
                        onClick={() => navigate('/')} // Điều hướng về Dashboard
                    >
                        TYD ADMIN PANEL
                    </Typography>

                    <Stack direction="row" spacing={1}>
                        <Tooltip title="Thông báo mới">
                            <IconButton color="inherit" onClick={handleOpenNotif}>
                                <Badge badgeContent={unreadCount} color="error">
                                    <NotificationsIcon />
                                </Badge>
                            </IconButton>
                        </Tooltip>

                        <IconButton color="inherit" onClick={handleLogout} title="Đăng xuất">
                            <Logout />
                        </IconButton>
                    </Stack>
                </Toolbar>
            </AppBar>

            {/* Menu thông báo xổ xuống */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleCloseNotif}
                PaperProps={{ sx: { width: 320, borderRadius: 3, mt: 1.5, boxShadow: '0 8px 32px rgba(0,0,0,0.1)' } }}
            >
                <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Thông báo</Typography>
                    {unreadCount > 0 && <Chip label={`${unreadCount} mới`} size="small" color="primary" sx={{ height: 20, fontSize: '0.7rem' }} />}
                </Box>
                <Divider />
                <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
                    {notifications.length === 0 ? (
                        <Box sx={{ p: 3, textAlign: 'center' }}>
                            <Typography variant="body2" color="textSecondary">Chưa có thông báo nào</Typography>
                        </Box>
                    ) : (
                        notifications.map((n) => (
                            <MenuItem key={n.id} onClick={handleCloseNotif} sx={{ py: 1.5, borderBottom: '1px dashed #eee', whiteSpace: 'normal' }}>
                                <Stack spacing={0.5}>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        {!n.isRead && <CircleIcon sx={{ fontSize: 8, color: '#1877F2' }} />}
                                        <Typography variant="body2" sx={{ fontWeight: n.isRead ? 400 : 700 }}>
                                            {n.message}
                                        </Typography>
                                    </Stack>
                                    <Typography variant="caption" color="textSecondary">{n.time}</Typography>
                                </Stack>
                            </MenuItem>
                        ))
                    )}
                </Box>
            </Menu>

            {/* 2. THANH MENU BÊN TRÁI (SIDEBAR) */}
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                        backgroundColor: '#F9FAFB',
                        borderRight: '1px dashed rgba(145, 158, 171, 0.24)'
                    }
                }}
            >
                <Toolbar />
                <Box sx={{ overflow: 'auto', mt: 2 }}>
                    <List>
                        {menuItems.map((item) => (
                            <ListItem key={item.text} disablePadding>
                                <ListItemButton
                                    onClick={() => navigate(item.path)}
                                    selected={location.pathname === item.path}
                                    sx={{
                                        '&.Mui-selected': { backgroundColor: 'rgba(24, 119, 242, 0.08)', color: '#1877F2', '& .MuiListItemIcon-root': { color: '#1877F2' } },
                                        margin: '4px 16px',
                                        borderRadius: '8px',
                                        color: '#637381'
                                    }}
                                >
                                    <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>{item.icon}</ListItemIcon>
                                    <ListItemText
                                        primary={item.text}
                                        sx={{ '& .MuiListItemText-primary': { fontWeight: location.pathname === item.path ? 'bold' : 500, fontSize: '0.95rem' } }}
                                    />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                    
                </Box>
            </Drawer>

            {/* 3. VÙNG NỘI DUNG CHÍNH */}
            <Box component="main" sx={{ flexGrow: 1, p: 3, backgroundColor: '#f4f6f8', minHeight: '100vh' }}>
                <Toolbar />
                <Outlet />
            </Box>
        </Box>
    );
};

export default AdminLayout;