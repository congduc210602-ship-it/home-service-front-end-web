// src/pages/TransactionsPage.tsx
import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Card, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Chip, CircularProgress,
    TextField, InputAdornment, Button, Divider, Stack
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import SearchIcon from '@mui/icons-material/Search';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { paymentService } from '../services/paymentService';

const StyledTableHeadCell = ({ children, align = 'left' }: any) => (
    <TableCell align={align} sx={{
        color: '#637381', fontWeight: 700, textTransform: 'uppercase',
        fontSize: '0.75rem', letterSpacing: 1, bgcolor: '#F4F6F8',
        borderBottom: 'none', py: 2
    }}>
        {children}
    </TableCell>
);

const TransactionsPage = () => {
    const [transactions, setTransactions] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async (keyword: string = '') => {
        setLoading(true);
        try {
            const [transData, statsData] = await Promise.all([
                paymentService.getTransactions(keyword),
                paymentService.getRevenueStats()
            ]);
            setTransactions(transData || []);
            setStats(statsData);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => fetchData(searchTerm.trim());
    const handleKeyPress = (e: React.KeyboardEvent) => { if (e.key === 'Enter') handleSearch(); };

    // Format ngày giờ từ ISO sang chuỗi dễ đọc
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('vi-VN', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    // Style cho Cổng thanh toán (VNPAY / COD)
    const getMethodChip = (method: string) => {
        switch (method?.toUpperCase()) {
            case 'VNPAY': return <Chip label="VNPay" sx={{ bgcolor: 'rgba(24, 119, 242, 0.16)', color: '#1877F2', fontWeight: 700 }} size="small" />;
            case 'COD': return <Chip label="Tiền mặt (COD)" sx={{ bgcolor: 'rgba(255, 171, 0, 0.16)', color: '#B78103', fontWeight: 700 }} size="small" />;
            default: return <Chip label={method} size="small" />;
        }
    };

    // Style cho Trạng thái (success / pending / failed)
    const getStatusChip = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'success': return <Chip label="Thành công" sx={{ bgcolor: 'rgba(34, 197, 94, 0.16)', color: '#16a34a', fontWeight: 700, borderRadius: 1.5 }} size="small" />;
            case 'pending': return <Chip label="Đang chờ xử lý" sx={{ bgcolor: 'rgba(0, 184, 217, 0.16)', color: '#006C9C', fontWeight: 700, borderRadius: 1.5 }} size="small" />;
            case 'failed': return <Chip label="Thất bại" sx={{ bgcolor: 'rgba(255, 86, 48, 0.16)', color: '#B71D18', fontWeight: 700, borderRadius: 1.5 }} size="small" />;
            default: return <Chip label={status} size="small" />;
        }
    };

    const EmptyState = () => (
        <TableRow>
            <TableCell colSpan={7} align="center" sx={{ py: 10, border: 0 }}>
                <ReceiptLongIcon sx={{ fontSize: 64, color: '#DFE3E8', mb: 2 }} />
                <Typography variant="h6" sx={{ color: '#212B36', fontWeight: 700 }}>Không tìm thấy giao dịch</Typography>
                <Typography variant="body2" sx={{ color: '#637381', mt: 1 }}>Hãy thử nhập mã đơn hàng khác xem sao.</Typography>
            </TableCell>
        </TableRow>
    );

    return (
        <Box sx={{ pb: 5 }}>
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 4, color: '#212B36' }}>
                Lịch sử Thanh toán
            </Typography>

            {/* Khối Thống kê Doanh thu (Gọi từ API thật) */}
            {stats && stats.status === "success" && (
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Card elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid rgba(145, 158, 171, 0.16)', bgcolor: 'rgba(34, 197, 94, 0.04)' }}>
                            <Stack direction="row" alignItems="center" spacing={2}>
                                <Box sx={{ bgcolor: 'rgba(34, 197, 94, 0.16)', p: 1.5, borderRadius: '50%' }}><AccountBalanceWalletIcon sx={{ color: '#16a34a' }} /></Box>
                                <Box>
                                    <Typography variant="subtitle2" color="textSecondary">Tổng Doanh Thu</Typography>
                                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#212B36' }}>
                                        {stats.total_revenue?.toLocaleString('vi-VN')} đ
                                    </Typography>
                                </Box>
                            </Stack>
                        </Card>
                    </Grid>
                </Grid>
            )}

            <Card elevation={0} sx={{ borderRadius: 4, boxShadow: '0 12px 24px -4px rgba(145, 158, 171, 0.16)', border: 'none' }}>

                <Box sx={{ p: 3, display: 'flex', gap: 2 }}>
                    <TextField
                        fullWidth placeholder="Tìm kiếm mã Đơn hàng (Order UUID)..." variant="outlined"
                        value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onKeyPress={handleKeyPress}
                        sx={{ maxWidth: 480, '& .MuiOutlinedInput-root': { borderRadius: 10, bgcolor: '#F4F6F8', '& fieldset': { border: 'none' } } }}
                        InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#919EAB', ml: 1 }} /></InputAdornment> }}
                    />
                    <Button variant="contained" onClick={handleSearch} sx={{ px: 3, borderRadius: 10, textTransform: 'none', fontWeight: 700, bgcolor: '#212B36', boxShadow: 'none' }}>
                        Tìm kiếm
                    </Button>
                </Box>

                <Divider sx={{ borderStyle: 'dashed' }} />

                <Box sx={{ width: '100%', overflowX: 'auto' }}>
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 10 }}><CircularProgress sx={{ color: '#212B36' }} /></Box>
                    ) : (
                        <TableContainer>
                            <Table sx={{ minWidth: 900 }}>
                                <TableHead>
                                    <TableRow>
                                        <StyledTableHeadCell>Mã GD Hệ thống</StyledTableHeadCell>
                                        <StyledTableHeadCell>Mã Đơn hàng (Order UUID)</StyledTableHeadCell>
                                        <StyledTableHeadCell>Số tiền</StyledTableHeadCell>
                                        <StyledTableHeadCell>Phương thức</StyledTableHeadCell>
                                        <StyledTableHeadCell>Mã giao dịch đối tác</StyledTableHeadCell>
                                        <StyledTableHeadCell>Trạng thái</StyledTableHeadCell>
                                        <StyledTableHeadCell>Thời gian</StyledTableHeadCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {transactions.map((t) => (
                                        <TableRow key={t.id} hover sx={{ '& td': { borderBottom: '1px dashed rgba(145, 158, 171, 0.24)' } }}>
                                            <TableCell sx={{ color: '#919EAB', fontWeight: 600 }}>#{t.id}</TableCell>
                                            <TableCell sx={{ fontWeight: 700, color: '#212B36' }}>{t.order_uuid}</TableCell>
                                            <TableCell sx={{ fontWeight: 800, color: '#16a34a' }}>
                                                +{t.amount?.toLocaleString('vi-VN')} đ
                                            </TableCell>
                                            <TableCell>{getMethodChip(t.payment_method)}</TableCell>
                                            <TableCell sx={{ color: '#637381' }}>{t.transaction_code || '—'}</TableCell>
                                            <TableCell>{getStatusChip(t.status)}</TableCell>
                                            <TableCell sx={{ color: '#637381' }}>{formatDate(t.created_at)}</TableCell>
                                        </TableRow>
                                    ))}
                                    {transactions.length === 0 && <EmptyState />}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </Box>
            </Card>
        </Box>
    );
};

export default TransactionsPage;