// src/pages/ReviewsPage.tsx
import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Card, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, CircularProgress, IconButton, Rating,
    Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField,
    InputAdornment, Divider, Stack
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import { reviewService } from '../services/reviewService';

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

const ReviewsPage = () => {
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // State cho Dialog Tạo đánh giá
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        order_id: '',
        worker_id: '',
        rating: 5,
        comment: ''
    });

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        setLoading(true);
        try {
            const data = await reviewService.getReviews();
            setReviews(data || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!formData.order_id || !formData.worker_id || !formData.comment) {
            alert('Vui lòng nhập đầy đủ thông tin!');
            return;
        }

        try {
            const res = await reviewService.createReview(
                Number(formData.order_id),
                Number(formData.worker_id),
                formData.rating,
                formData.comment
            );
            alert('Backend trả về: ' + JSON.stringify(res));
            setOpen(false);
            setFormData({ order_id: '', worker_id: '', rating: 5, comment: '' });
            fetchReviews();
        } catch (error: any) {
            console.error(error);
            alert('Lỗi gọi API: ' + (error.response?.data?.detail || error.message));
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa đánh giá này không?')) {
            await reviewService.deleteReview(id);
            fetchReviews();
        }
    };

    // Bộ lọc nội bộ
    const filteredReviews = reviews.filter(r =>
        String(r.order_id).includes(searchTerm) ||
        r.comment?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Component: Empty State
    const EmptyState = () => (
        <TableRow>
            <TableCell colSpan={7} align="center" sx={{ py: 10, border: 0 }}>
                <StarOutlineIcon sx={{ fontSize: 64, color: '#DFE3E8', mb: 2 }} />
                <Typography variant="h6" sx={{ color: '#212B36', fontWeight: 700 }}>Chưa có đánh giá nào</Typography>
                <Typography variant="body2" sx={{ color: '#637381', mt: 1 }}>
                    Có vẻ như chưa có khách hàng nào để lại đánh giá, hoặc hãy thử tìm kiếm từ khóa khác.
                </Typography>
            </TableCell>
        </TableRow>
    );

    return (
        <Box sx={{ pb: 5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#212B36' }}>
                    Quản lý Đánh giá
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setOpen(true)}
                    sx={{
                        bgcolor: '#212B36', color: '#fff', px: 3, py: 1.2,
                        borderRadius: 2, textTransform: 'none', fontWeight: 700,
                        boxShadow: '0 8px 16px 0 rgba(33, 43, 54, 0.24)',
                        '&:hover': { bgcolor: '#454F5B', boxShadow: 'none' }
                    }}
                >
                    Test API Đánh Giá
                </Button>
            </Box>

            <Card elevation={0} sx={{ borderRadius: 4, boxShadow: '0 12px 24px -4px rgba(145, 158, 171, 0.16)', overflow: 'hidden', border: 'none' }}>

                {/* Thanh Toolbar Tìm kiếm */}
                <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                    <TextField
                        fullWidth
                        placeholder="Tìm kiếm theo mã đơn hoặc nội dung đánh giá..."
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

                {/* Bảng dữ liệu */}
                <Box sx={{ width: '100%', overflowX: 'auto' }}>
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 10 }}>
                            <CircularProgress sx={{ color: '#212B36' }} />
                        </Box>
                    ) : (
                        <TableContainer>
                            <Table sx={{ minWidth: 800 }}>
                                <TableHead>
                                    <TableRow>
                                        <StyledTableHeadCell>ID</StyledTableHeadCell>
                                        <StyledTableHeadCell>Mã Đơn</StyledTableHeadCell>
                                        <StyledTableHeadCell>Mã Thợ</StyledTableHeadCell>
                                        <StyledTableHeadCell>Đánh giá</StyledTableHeadCell>
                                        <StyledTableHeadCell>Nội dung</StyledTableHeadCell>
                                        <StyledTableHeadCell>Ngày tạo</StyledTableHeadCell>
                                        <StyledTableHeadCell align="center">Thao tác</StyledTableHeadCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredReviews.map((review) => (
                                        <TableRow key={review.id} hover sx={{ transition: 'all 0.2s', '& td': { borderBottom: '1px dashed rgba(145, 158, 171, 0.24)' } }}>
                                            <TableCell sx={{ color: '#919EAB', fontWeight: 600 }}>#{review.id}</TableCell>
                                            <TableCell sx={{ fontWeight: 600, color: '#212B36' }}>#{review.order_id}</TableCell>
                                            <TableCell sx={{ fontWeight: 600, color: '#212B36' }}>#{review.worker_id}</TableCell>
                                            <TableCell>
                                                <Rating value={review.rating} readOnly size="small" />
                                            </TableCell>
                                            <TableCell sx={{ maxWidth: 250 }}>
                                                <Typography variant="body2" sx={{ color: '#454F5B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={review.comment}>
                                                    {review.comment || '—'}
                                                </Typography>
                                            </TableCell>
                                            <TableCell sx={{ color: '#637381' }}>{review.created_at || '—'}</TableCell>
                                            <TableCell align="center">
                                                <IconButton
                                                    title="Xóa đánh giá vi phạm"
                                                    onClick={() => handleDelete(review.id)}
                                                    sx={{ color: '#FF5630', bgcolor: 'rgba(255, 86, 48, 0.08)', '&:hover': { bgcolor: 'rgba(255, 86, 48, 0.16)' } }}
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {filteredReviews.length === 0 && <EmptyState />}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </Box>
            </Card>

            {/* Popup Form Tạo Đánh Giá Test */}
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                fullWidth
                maxWidth="sm"
                PaperProps={{ sx: { borderRadius: 3, boxShadow: '0 24px 48px 0 rgba(33, 43, 54, 0.16)' } }}
            >
                <DialogTitle sx={{ fontWeight: 800, color: '#212B36', pb: 2 }}>
                    Tạo Đánh Giá Mới (Test API)
                </DialogTitle>
                <DialogContent dividers sx={{ borderBottom: 'none', borderTop: '1px dashed rgba(145, 158, 171, 0.24)' }}>
                    <Grid container spacing={3} sx={{ mt: 1 }}>
                        <Grid size={{ xs: 6 }}>
                            <TextField
                                fullWidth label="Mã Đơn (Order ID)" type="number"
                                value={formData.order_id} onChange={(e) => setFormData({ ...formData, order_id: e.target.value })}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                            />
                        </Grid>
                        <Grid size={{ xs: 6 }}>
                            <TextField
                                fullWidth label="Mã Thợ (Worker ID)" type="number"
                                value={formData.worker_id} onChange={(e) => setFormData({ ...formData, worker_id: e.target.value })}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <Typography component="legend" sx={{ color: '#637381', fontWeight: 600, mb: 1 }}>Chất lượng dịch vụ</Typography>
                            <Rating
                                value={formData.rating}
                                size="large"
                                onChange={(event, newValue) => setFormData({ ...formData, rating: newValue || 5 })}
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                fullWidth multiline rows={3} label="Nội dung đánh giá"
                                value={formData.comment} onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ p: 3, pt: 1 }}>
                    <Button onClick={() => setOpen(false)} sx={{ color: '#637381', fontWeight: 700, textTransform: 'none' }}>
                        Hủy bỏ
                    </Button>
                    <Button variant="contained" onClick={handleSave} sx={{ bgcolor: '#212B36', color: '#fff', borderRadius: 2, textTransform: 'none', fontWeight: 700, '&:hover': { bgcolor: '#454F5B' } }}>
                        Gửi Lên Backend
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ReviewsPage;