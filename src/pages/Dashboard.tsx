// src/pages/Dashboard.tsx
import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, CircularProgress, Alert } from '@mui/material';
import Grid from '@mui/material/Grid2'; // MUI v6
import PeopleIcon from '@mui/icons-material/People';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import BuildIcon from '@mui/icons-material/Build';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { adminService } from '../services/adminService';

const monthlyRevenueData = [
    { name: 'T1', revenue: 120 }, { name: 'T2', revenue: 210 },
    { name: 'T3', revenue: 180 }, { name: 'T4', revenue: 350 },
    { name: 'T5', revenue: 290 }, { name: 'T6', revenue: 420 },
];

// Bảng màu hiện đại cho Chart
const STATUS_COLORS = ['#FFAB00', '#00B8D9', '#22C55E']; // Chờ nhận - Đang làm - Hoàn thành

// Wrapper Card với hiệu ứng shadow hiện đại
const ProCard = ({ children, sx = {} }: any) => (
    <Card
        elevation={0}
        sx={{
            height: '100%',
            borderRadius: '20px', // Bo góc mềm mại hơn
            border: '1px solid rgba(145, 158, 171, 0.1)', // Viền mỏng tinh tế
            boxShadow: '0 8px 32px -4px rgba(145, 158, 171, 0.12)', // Đổ bóng mờ, rộng
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 12px 40px -4px rgba(145, 158, 171, 0.2)',
            },
            ...sx
        }}
    >
        {children}
    </Card>
);

// Component con để render thẻ KPI cho gọn code
const KpiCard = ({ title, value, icon, colorHex, bgHex, tooltip }: any) => (
    <ProCard>
        <CardContent sx={{ display: 'flex', alignItems: 'center', p: 2.5 }}> {/* Giảm padding một xíu để có thêm không gian */}
            <Box
                sx={{
                    width: 56, // Thu nhỏ khung icon lại một chút (từ 64 xuống 56)
                    height: 56,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 2, // Giảm khoảng cách giữa icon và chữ
                    background: `linear-gradient(135deg, ${bgHex} 0%, rgba(255,255,255,0) 100%)`,
                    backgroundColor: bgHex,
                    color: colorHex
                }}
            >
                {icon}
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}> {/* minWidth: 0 giúp flexbox xử lý text dài tốt hơn */}
                {/* ĐÃ XÓA noWrap: Cho phép chữ (ví dụ: Tổng Khách Hàng) tự rớt xuống 2 dòng nếu cần */}
                <Typography
                    sx={{ color: '#637381', fontWeight: 600, fontSize: '0.85rem', mb: 0.5, lineHeight: 1.2 }}
                >
                    {title}
                </Typography>
                {/* Giảm từ variant="h4" xuống "h5" để số nhỏ lại, hoặc bạn có thể giữ h4 nhưng xóa noWrap */}
                <Typography
                    variant="h5"
                    sx={{ fontWeight: 800, color: '#212B36', letterSpacing: '-0.02em' }}
                    title={tooltip}
                >
                    {value}
                </Typography>
            </Box>
        </CardContent>
    </ProCard>
);

const Dashboard = () => {
    const [stats, setStats] = useState<any>(null);
    const [chartData, setChartData] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [statsData, ordersData] = await Promise.all([
                    adminService.getStats(),
                    adminService.getPendingOrders()
                ]);
                setStats(statsData);
                setChartData([
                    { name: 'Chờ nhận', value: ordersData.pending || 0, fill: STATUS_COLORS[0] },
                    { name: 'Đang làm', value: ordersData.in_progress || 0, fill: STATUS_COLORS[1] },
                    { name: 'Hoàn thành', value: ordersData.completed_today || 0, fill: STATUS_COLORS[2] }
                ]);
            } catch (err: any) {
                setError('Không thể kết nối đến máy chủ Backend.');
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 20 }}><CircularProgress sx={{ color: '#1877F2' }} /></Box>;

    const isPieEmpty = chartData.every(item => item.value === 0);
    const pieDataToRender = isPieEmpty ? [{ name: 'Chưa có đơn hàng', value: 1, fill: '#F4F6F8' }] : chartData;

    // Format tiền tệ rút gọn
    const formatMoney = (amount: number) => {
        if (!amount) return '0';
        if (amount >= 1000000) return `${(amount / 1000000).toLocaleString('vi-VN', { maximumFractionDigits: 1 })}M`;
        return amount.toLocaleString('vi-VN');
    };

    return (
        <Box sx={{ pb: 5, pt: 2, px: { xs: 2, md: 0 } }}>
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 4, color: '#212B36', letterSpacing: '-0.02em' }}>
                Tổng quan Hệ thống
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 4, borderRadius: 2 }}>{error}</Alert>}

            {stats && (
                <Grid container spacing={3}>
                    {/* --- DÒNG 1: 4 THẺ KPI --- */}
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <KpiCard
                            title="Tổng Khách Hàng"
                            value={stats.total_users?.toLocaleString('vi-VN')}
                            icon={<PeopleIcon sx={{ fontSize: 32 }} />}
                            colorHex="#1877F2"
                            bgHex="rgba(24, 119, 242, 0.12)"
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <KpiCard
                            title="Thợ Đối Tác"
                            value={stats.active_workers?.toLocaleString('vi-VN')}
                            icon={<BuildIcon sx={{ fontSize: 32 }} />}
                            colorHex="#B78103"
                            bgHex="rgba(255, 171, 0, 0.12)"
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <KpiCard
                            title="Tổng Đơn Dịch Vụ"
                            value={stats.total_orders?.toLocaleString('vi-VN')}
                            icon={<AssignmentIcon sx={{ fontSize: 32 }} />}
                            colorHex="#16a34a"
                            bgHex="rgba(34, 197, 94, 0.12)"
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <KpiCard
                            title="Doanh Thu Tháng"
                            value={formatMoney(stats.revenue_month)}
                            tooltip={stats.revenue_month?.toLocaleString('vi-VN')}
                            icon={<AttachMoneyIcon sx={{ fontSize: 32 }} />}
                            colorHex="#B71D18"
                            bgHex="rgba(255, 86, 48, 0.12)"
                        />
                    </Grid>

                    {/* --- DÒNG 2: BIỂU ĐỒ --- */}
                    <Grid size={{ xs: 12, md: 8 }}>
                        <ProCard sx={{ p: 3, pt: 4 }}>
                            <Typography variant="h6" sx={{ fontWeight: 700, color: '#212B36', mb: 4, px: 1 }}>
                                Doanh Thu 6 Tháng Gần Nhất
                            </Typography>
                            <Box sx={{ width: '100%', height: 360 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={monthlyRevenueData} margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
                                        {/* Định nghĩa Gradient cho cột */}
                                        <defs>
                                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#1877F2" stopOpacity={0.9} />
                                                <stop offset="95%" stopColor="#1877F2" stopOpacity={0.3} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#EDF2F7" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#637381', fontWeight: 600, fontSize: 13 }} dy={12} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#637381', fontWeight: 600, fontSize: 13 }} dx={-10} />
                                        <Tooltip
                                            cursor={{ fill: '#F4F6F8' }}
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 24px rgba(145, 158, 171, 0.2)', fontWeight: 700, color: '#212B36', padding: '12px 16px' }}
                                        />
                                        <Bar dataKey="revenue" fill="url(#colorRevenue)" radius={[6, 6, 0, 0]} barSize={36} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Box>
                        </ProCard>
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <ProCard sx={{ p: 3, pt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Typography variant="h6" sx={{ fontWeight: 700, color: '#212B36', width: '100%', textAlign: 'left', px: 1, mb: 2 }}>
                                Trạng Thái Đơn Hôm Nay
                            </Typography>
                            <Box sx={{ width: '100%', height: 360, mt: 2 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={pieDataToRender}
                                            cx="50%"
                                            cy="45%" // Kéo nhẹ biểu đồ lên để nhường chỗ cho Legend
                                            innerRadius="65%" // Làm vòng donut mỏng lại cho tinh tế
                                            outerRadius="85%"
                                            paddingAngle={3}
                                            dataKey="value"
                                            stroke="#ffffff" // Thêm viền trắng cắt giữa các slice
                                            strokeWidth={3}
                                        >
                                            {pieDataToRender.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.fill} />
                                            ))}
                                        </Pie>
                                        {!isPieEmpty && (
                                            <Tooltip
                                                itemStyle={{ fontWeight: 700 }}
                                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 24px rgba(145, 158, 171, 0.2)', fontWeight: 600, padding: '12px' }}
                                            />
                                        )}
                                        <Legend
                                            verticalAlign="bottom"
                                            height={40}
                                            iconType="circle"
                                            iconSize={10}
                                            wrapperStyle={{ fontSize: '0.875rem', fontWeight: 600, color: '#212B36', paddingTop: '20px' }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </Box>
                        </ProCard>
                    </Grid>
                </Grid>
            )}
        </Box>
    );
};


export default Dashboard;