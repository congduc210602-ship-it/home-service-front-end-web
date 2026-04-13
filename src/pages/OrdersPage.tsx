// src/pages/OrdersPage.tsx
import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Card, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Chip, CircularProgress, IconButton,
    Dialog, DialogTitle, DialogContent, DialogActions, Button, Divider, TextField, InputAdornment, Stack
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SearchIcon from '@mui/icons-material/Search';
import AssignmentLateIcon from '@mui/icons-material/AssignmentLate';
import { orderService } from '../services/orderService';

// Component: Tiêu đề cột chuẩn SaaS
const StyledTableHeadCell = ({ children, align = 'left' }: any) => (
    <TableCell align={align} sx={{
        color: '#637381', fontWeight: 700, textTransform: 'uppercase',
        fontSize: '0.75rem', letterSpacing: 1, bgcolor: '#F4F6F8',
        borderBottom: 'none', py: 2
    }}>
        {children}
    </TableCell>
);

const OrdersPage = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const [open, setOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<any>(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const data = await orderService.getOrders();
            setOrders(data || []);
        } catch (error) {
            console.error("Lỗi lấy danh sách đơn hàng:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDialog = (order: any) => {
        setSelectedOrder(order);
        setOpen(true);
    };

    const handleCloseDialog = () => {
        setOpen(false);
        setSelectedOrder(null);
    };

    // Style Status chuẩn SaaS Pastel
    const getStatusChip = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'pending':
                return <Chip label="Chờ nhận" sx={{ bgcolor: 'rgba(255, 171, 0, 0.16)', color: '#B78103', fontWeight: 700, borderRadius: 1.5, px: 0.5 }} size="small" />;
            case 'in_progress':
                return <Chip label="Đang làm" sx={{ bgcolor: 'rgba(0, 184, 217, 0.16)', color: '#006C9C', fontWeight: 700, borderRadius: 1.5, px: 0.5 }} size="small" />;
            case 'completed':
                return <Chip label="Hoàn thành" sx={{ bgcolor: 'rgba(34, 197, 94, 0.16)', color: '#16a34a', fontWeight: 700, borderRadius: 1.5, px: 0.5 }} size="small" />;
            case 'cancelled':
                return <Chip label="Đã hủy" sx={{ bgcolor: 'rgba(255, 86, 48, 0.16)', color: '#B71D18', fontWeight: 700, borderRadius: 1.5, px: 0.5 }} size="small" />;
            default:
                return <Chip label={status || 'Unknown'} sx={{ bgcolor: 'rgba(145, 158, 171, 0.16)', color: '#637381', fontWeight: 700, borderRadius: 1.5, px: 0.5 }} size="small" />;
        }
    };

    // Bộ lọc đơn hàng cục bộ
    const filteredOrders = orders.filter(o =>
        o.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.service_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(o.id).includes(searchTerm)
    );

    return (
        <Box sx={{ pb: 5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#212B36' }}>
                    Quản lý Đơn hàng
                </Typography>
            </Box>

            <Card elevation={0} sx={{ borderRadius: 4, boxShadow: '0 12px 24px -4px rgba(145, 158, 171, 0.16)', overflow: 'hidden', border: 'none' }}>
                {/* Thanh Tìm kiếm */}
                <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                    <TextField
                        fullWidth
                        placeholder="Tìm kiếm theo mã đơn, khách hàng hoặc dịch vụ..."
                        variant="outlined"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        sx={{
                            maxWidth: 480,
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 10, backgroundColor: '#F4F6F8', transition: 'all 0.3s',
                                '& fieldset': { border: 'none' },
                                '&:hover': { backgroundColor: '#DFE3E8' },
                                '&.Mui-focused': { backgroundColor: '#fff', boxShadow: '0 0 0 2px #212B36' }
                            }
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon sx={{ color: '#919EAB', ml: 1 }} />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>

                <Divider sx={{ borderStyle: 'dashed' }} />

                <Box sx={{ width: '100%', overflowX: 'auto' }}>
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 10 }}>
                            <CircularProgress sx={{ color: '#212B36' }} />
                        </Box>
                    ) : (
                        <TableContainer>
                            <Table sx={{ minWidth: 900 }}>
                                <TableHead>
                                    <TableRow>
                                        <StyledTableHeadCell>Mã Đơn</StyledTableHeadCell>
                                        <StyledTableHeadCell>Khách hàng</StyledTableHeadCell>
                                        <StyledTableHeadCell>Thợ nhận</StyledTableHeadCell>
                                        <StyledTableHeadCell>Dịch vụ</StyledTableHeadCell>
                                        <StyledTableHeadCell>Giá tiền</StyledTableHeadCell>
                                        <StyledTableHeadCell>Trạng thái</StyledTableHeadCell>
                                        <StyledTableHeadCell align="center">Chi tiết</StyledTableHeadCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredOrders.map((order) => (
                                        <TableRow key={order.id} hover sx={{ transition: 'all 0.2s', '& td': { borderBottom: '1px dashed rgba(145, 158, 171, 0.24)' } }}>
                                            <TableCell sx={{ color: '#919EAB', fontWeight: 600 }}>#{order.id}</TableCell>
                                            <TableCell sx={{ fontWeight: 600, color: '#212B36' }}>{order.customer_name}</TableCell>
                                            <TableCell sx={{ color: '#637381' }}>{order.worker_name || '—'}</TableCell>
                                            <TableCell sx={{ color: '#454F5B', fontWeight: 500 }}>{order.service_name}</TableCell>
                                            <TableCell sx={{ fontWeight: 600, color: '#212B36' }}>{order.total_price?.toLocaleString('vi-VN')} đ</TableCell>
                                            <TableCell>{getStatusChip(order.status)}</TableCell>
                                            <TableCell align="center">
                                                <IconButton
                                                    onClick={() => handleOpenDialog(order)}
                                                    sx={{
                                                        color: '#1877F2', bgcolor: 'rgba(24, 119, 242, 0.08)',
                                                        '&:hover': { bgcolor: 'rgba(24, 119, 242, 0.16)' }
                                                    }}
                                                >
                                                    <VisibilityIcon fontSize="small" />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {filteredOrders.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={7} align="center" sx={{ py: 10, border: 0 }}>
                                                <AssignmentLateIcon sx={{ fontSize: 64, color: '#DFE3E8', mb: 2 }} />
                                                <Typography variant="h6" sx={{ color: '#212B36', fontWeight: 700 }}>Không tìm thấy đơn hàng</Typography>
                                                <Typography variant="body2" sx={{ color: '#637381', mt: 1 }}>Thử thay đổi từ khóa tìm kiếm xem sao.</Typography>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </Box>
            </Card>

            {/* Popup Dialog Chi tiết Đơn hàng */}
            <Dialog
                open={open}
                onClose={handleCloseDialog}
                fullWidth
                maxWidth="md"
                PaperProps={{ sx: { borderRadius: 3, boxShadow: '0 24px 48px 0 rgba(33, 43, 54, 0.16)' } }}
            >
                <DialogTitle sx={{ fontWeight: 800, color: '#212B36', pb: 2 }}>
                    Chi tiết Đơn hàng <span style={{ color: '#919EAB' }}>#{selectedOrder?.id}</span>
                </DialogTitle>

                <DialogContent dividers sx={{ borderBottom: 'none', borderTop: '1px dashed rgba(145, 158, 171, 0.24)', py: 3 }}>
                    {selectedOrder && (
                        <Grid container spacing={4}>
                            {/* Cột trái: Khách hàng */}
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Typography variant="overline" sx={{ color: '#919EAB', fontWeight: 700, letterSpacing: 1 }}>
                                    Thông tin Khách hàng
                                </Typography>
                                <Stack spacing={1.5} sx={{ mt: 2 }}>
                                    <Typography variant="body2" sx={{ color: '#637381' }}>Khách hàng: <span style={{ color: '#212B36', fontWeight: 600 }}>{selectedOrder.customer_name}</span></Typography>
                                    <Typography variant="body2" sx={{ color: '#637381' }}>SĐT: <span style={{ color: '#212B36', fontWeight: 600 }}>{selectedOrder.phone || '0901234567'}</span></Typography>
                                    <Typography variant="body2" sx={{ color: '#637381' }}>Địa chỉ: <span style={{ color: '#212B36', fontWeight: 600 }}>{selectedOrder.address || 'Quận Thủ Đức, TP.HCM'}</span></Typography>
                                </Stack>
                            </Grid>

                            {/* Cột phải: Thợ */}
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Typography variant="overline" sx={{ color: '#919EAB', fontWeight: 700, letterSpacing: 1 }}>
                                    Thông tin Thợ thực hiện
                                </Typography>
                                <Stack spacing={1.5} sx={{ mt: 2 }}>
                                    <Typography variant="body2" sx={{ color: '#637381' }}>Thợ nhận: <span style={{ color: '#212B36', fontWeight: 600 }}>{selectedOrder.worker_name || 'Chưa có thợ'}</span></Typography>
                                    <Typography variant="body2" sx={{ color: '#637381' }}>SĐT Thợ: <span style={{ color: '#212B36', fontWeight: 600 }}>{selectedOrder.worker_phone || '—'}</span></Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Typography variant="body2" sx={{ color: '#637381' }}>Trạng thái:</Typography>
                                        {getStatusChip(selectedOrder.status)}
                                    </Box>
                                </Stack>
                            </Grid>

                            <Grid size={{ xs: 12 }}>
                                <Divider sx={{ borderStyle: 'dashed' }} />
                            </Grid>

                            {/* Dưới: Dịch vụ & Thanh toán */}
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Typography variant="overline" sx={{ color: '#919EAB', fontWeight: 700, letterSpacing: 1 }}>
                                    Chi tiết Dịch vụ
                                </Typography>
                                <Stack spacing={1.5} sx={{ mt: 2 }}>
                                    <Typography variant="body2" sx={{ color: '#637381' }}>Tên dịch vụ: <span style={{ color: '#212B36', fontWeight: 600 }}>{selectedOrder.service_name}</span></Typography>
                                    <Typography variant="body2" sx={{ color: '#637381' }}>Ngày hẹn: <span style={{ color: '#212B36', fontWeight: 600 }}>{selectedOrder.date || 'Hôm nay'}</span></Typography>
                                </Stack>
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <Typography variant="overline" sx={{ color: '#919EAB', fontWeight: 700, letterSpacing: 1 }}>
                                    Thanh toán
                                </Typography>
                                <Stack spacing={1.5} sx={{ mt: 2 }}>
                                    <Typography variant="body2" sx={{ color: '#637381' }}>Phương thức: <span style={{ color: '#212B36', fontWeight: 600 }}>{selectedOrder.payment_method || 'Tiền mặt (COD)'}</span></Typography>
                                    <Box sx={{ mt: 1, p: 2, bgcolor: '#F4F6F8', borderRadius: 2, display: 'inline-block' }}>
                                        <Typography variant="body2" sx={{ color: '#637381', mb: 0.5 }}>Tổng thanh toán</Typography>
                                        <Typography variant="h5" sx={{ color: '#FF5630', fontWeight: 800 }}>
                                            {selectedOrder.total_price?.toLocaleString('vi-VN')} VNĐ
                                        </Typography>
                                    </Box>
                                </Stack>
                            </Grid>
                        </Grid>
                    )}
                </DialogContent>

                <DialogActions sx={{ p: 3, pt: 1 }}>
                    <Button onClick={handleCloseDialog} variant="contained" sx={{ bgcolor: '#212B36', color: '#fff', borderRadius: 2, textTransform: 'none', fontWeight: 700, '&:hover': { bgcolor: '#454F5B' } }}>
                        Đóng cửa sổ
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default OrdersPage;