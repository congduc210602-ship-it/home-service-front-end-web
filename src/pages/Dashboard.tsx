// src/pages/Dashboard.tsx
import React, { useEffect, useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    CircularProgress,
    Alert
} from '@mui/material';
// ✅ Đã sửa thành Grid chuẩn
import Grid from '@mui/material/Grid';
import { People, Assignment, AttachMoney, Build } from '@mui/icons-material';
import { adminService } from '../services/adminService';

const Dashboard = () => {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await adminService.getStats();
                setStats(data);
            } catch (err: any) {
                console.log("Lỗi gọi API, dùng dữ liệu mẫu tạm thời", err);
                setStats({
                    total_users: 154,
                    active_workers: 42,
                    total_orders: 890,
                    revenue_month: 12500000
                });
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h5" sx={{ mb: 4, fontWeight: 700 }}>
                Tổng quan Hệ thống
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

            <Grid container spacing={3}>
                {/* ✅ Đã chuyển xs, sm, md vào trong prop size */}
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card elevation={2} sx={{ height: '100%' }}>
                        <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box sx={{
                                backgroundColor: '#e3f2fd',
                                p: 1.5,
                                borderRadius: '50%',
                                mr: 2
                            }}>
                                <People color="primary" fontSize="large" />
                            </Box>
                            <Box>
                                <Typography color="textSecondary" variant="subtitle2">
                                    Khách hàng
                                </Typography>
                                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                    {stats?.total_users || stats?.totalUsers || 0}
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card elevation={2} sx={{ height: '100%' }}>
                        <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box sx={{
                                backgroundColor: '#fff3e0',
                                p: 1.5,
                                borderRadius: '50%',
                                mr: 2
                            }}>
                                <Build color="warning" fontSize="large" />
                            </Box>
                            <Box>
                                <Typography color="textSecondary" variant="subtitle2">
                                    Thợ Đối tác
                                </Typography>
                                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                    {stats?.active_workers || stats?.totalWorkers || 0}
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card elevation={2} sx={{ height: '100%' }}>
                        <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box sx={{
                                backgroundColor: '#e8f5e9',
                                p: 1.5,
                                borderRadius: '50%',
                                mr: 2
                            }}>
                                <Assignment color="success" fontSize="large" />
                            </Box>
                            <Box>
                                <Typography color="textSecondary" variant="subtitle2">
                                    Đơn dịch vụ
                                </Typography>
                                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                    {stats?.total_orders || stats?.totalOrders || 0}
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card elevation={2} sx={{ height: '100%' }}>
                        <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box sx={{
                                backgroundColor: '#fce4ec',
                                p: 1.5,
                                borderRadius: '50%',
                                mr: 2
                            }}>
                                <AttachMoney color="error" fontSize="large" />
                            </Box>
                            <Box>
                                <Typography color="textSecondary" variant="subtitle2">
                                    Doanh thu (VNĐ)
                                </Typography>
                                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                    {(stats?.revenue_month || stats?.revenue || 0).toLocaleString('vi-VN')}
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

// ✅ Bắt buộc phải có dòng này ở cuối file
export default Dashboard;