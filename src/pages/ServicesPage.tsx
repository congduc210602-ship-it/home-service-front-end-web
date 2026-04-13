// src/pages/ServicesPage.tsx
import React, { useEffect, useState } from 'react';
import {
    Box, Typography, Paper, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Button, Chip,
    IconButton, Dialog, DialogTitle, DialogContent,
    DialogActions, TextField, MenuItem, CircularProgress,
    Card, Stack, InputAdornment, Divider
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { Add, Edit, Delete } from '@mui/icons-material';
import SearchIcon from '@mui/icons-material/Search';
import HomeRepairServiceIcon from '@mui/icons-material/HomeRepairService';
import { serviceService } from '../services/serviceService';

const categories = ['Sửa chữa', 'Vệ sinh', 'Điện lạnh', 'Lắp đặt', 'Điện nước'];

// Hàm phụ trợ: Lấy màu sắc riêng cho từng loại dịch vụ
const getCategoryColor = (category: string) => {
    switch (category) {
        case 'Sửa chữa': return { bg: 'rgba(24, 119, 242, 0.16)', text: '#1877F2' }; // Xanh dương
        case 'Vệ sinh': return { bg: 'rgba(84, 214, 44, 0.16)', text: '#229A16' };  // Xanh lá
        case 'Điện lạnh': return { bg: 'rgba(0, 184, 217, 0.16)', text: '#006C9C' };  // Xanh ngọc
        case 'Lắp đặt': return { bg: 'rgba(255, 171, 0, 0.16)', text: '#B78103' };    // Vàng cam
        case 'Điện nước': return { bg: 'rgba(142, 51, 255, 0.16)', text: '#5119B7' }; // Tím
        default: return { bg: 'rgba(145, 158, 171, 0.16)', text: '#637381' };         // Xám
    }
};

interface ServiceFormData {
    id?: number;
    name: string;
    description: string;
    base_price: number | '';
    category: string;
}

const initialFormState: ServiceFormData = {
    name: '',
    description: '',
    base_price: '',
    category: 'Sửa chữa'
};

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

const ServicesPage = () => {
    const [services, setServices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const [open, setOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<ServiceFormData>(initialFormState);

    const fetchServices = async () => {
        setLoading(true);
        try {
            const data = await serviceService.getServices();
            setServices(data || []);
        } catch (error) {
            console.error("Lỗi tải danh sách:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    const handleOpenAdd = () => {
        setIsEditing(false);
        setFormData(initialFormState);
        setOpen(true);
    };

    const handleOpenEdit = (service: any) => {
        setIsEditing(true);
        setFormData({
            id: service.id,
            name: service.name,
            description: service.description,
            base_price: service.base_price,
            category: service.category
        });
        setOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa dịch vụ này không?')) {
            try {
                await serviceService.deleteService(id);
                fetchServices();
            } catch (error) {
                alert("Lỗi khi xóa dịch vụ. Vui lòng kiểm tra lại kết nối.");
            }
        }
    };

    const handleSave = async () => {
        if (!formData.name || formData.base_price === '') {
            alert('Vui lòng nhập tên và giá dịch vụ');
            return;
        }
        try {
            if (isEditing && formData.id) {
                await serviceService.updateService(formData.id, formData);
            } else {
                await serviceService.createService(formData);
            }
            setOpen(false);
            setFormData(initialFormState);
            fetchServices();
        } catch (error: any) {
            alert(`Lỗi lưu dữ liệu: ${error.message}`);
        }
    };

    // Lọc dịch vụ theo ô tìm kiếm
    const filteredServices = services.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Box sx={{ pb: 5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#212B36' }}>
                    Quản lý Dịch vụ
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={handleOpenAdd}
                    sx={{
                        bgcolor: '#212B36', color: '#fff', px: 3, py: 1.2,
                        borderRadius: 2, textTransform: 'none', fontWeight: 700,
                        boxShadow: '0 8px 16px 0 rgba(33, 43, 54, 0.24)',
                        '&:hover': { bgcolor: '#454F5B', boxShadow: 'none' }
                    }}
                >
                    Thêm Dịch vụ
                </Button>
            </Box>

            <Card elevation={0} sx={{ borderRadius: 4, boxShadow: '0 12px 24px -4px rgba(145, 158, 171, 0.16)', overflow: 'hidden', border: 'none' }}>
                {/* Thanh Toolbar Tìm kiếm */}
                <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                    <TextField
                        fullWidth
                        placeholder="Tìm kiếm dịch vụ hoặc phân loại..."
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
                            <Table sx={{ minWidth: 800 }}>
                                <TableHead>
                                    <TableRow>
                                        <StyledTableHeadCell>ID</StyledTableHeadCell>
                                        <StyledTableHeadCell>Tên dịch vụ</StyledTableHeadCell>
                                        <StyledTableHeadCell>Phân loại</StyledTableHeadCell>
                                        <StyledTableHeadCell>Giá cơ bản</StyledTableHeadCell>
                                        <StyledTableHeadCell align="center">Thao tác</StyledTableHeadCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredServices.map((s) => {
                                        const colorTheme = getCategoryColor(s.category);
                                        return (
                                            <TableRow key={s.id} hover sx={{ transition: 'all 0.2s', '& td': { borderBottom: '1px dashed rgba(145, 158, 171, 0.24)' } }}>
                                                <TableCell sx={{ color: '#919EAB', fontWeight: 600 }}>#{s.id}</TableCell>
                                                <TableCell>
                                                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#212B36', fontSize: '0.95rem' }}>
                                                        {s.name}
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ color: '#637381', mt: 0.5, maxWidth: 300, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                        {s.description || 'Không có mô tả'}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={s.category}
                                                        size="small"
                                                        sx={{ bgcolor: colorTheme.bg, color: colorTheme.text, fontWeight: 700, borderRadius: 1.5, px: 1 }}
                                                    />
                                                </TableCell>
                                                <TableCell sx={{ fontWeight: 600, color: '#212B36' }}>
                                                    {Number(s.base_price).toLocaleString('vi-VN')} đ
                                                </TableCell>
                                                <TableCell align="center">
                                                    <IconButton sx={{ color: '#1877F2', bgcolor: 'rgba(24, 119, 242, 0.08)', mr: 1, '&:hover': { bgcolor: 'rgba(24, 119, 242, 0.16)' } }} onClick={() => handleOpenEdit(s)}>
                                                        <Edit fontSize="small" />
                                                    </IconButton>
                                                    <IconButton sx={{ color: '#FF5630', bgcolor: 'rgba(255, 86, 48, 0.08)', '&:hover': { bgcolor: 'rgba(255, 86, 48, 0.16)' } }} onClick={() => handleDelete(s.id)}>
                                                        <Delete fontSize="small" />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                    {filteredServices.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={5} align="center" sx={{ py: 10, border: 0 }}>
                                                <HomeRepairServiceIcon sx={{ fontSize: 64, color: '#DFE3E8', mb: 2 }} />
                                                <Typography variant="h6" sx={{ color: '#212B36', fontWeight: 700 }}>Không tìm thấy dịch vụ</Typography>
                                                <Typography variant="body2" sx={{ color: '#637381', mt: 1 }}>Hãy thử thay đổi từ khóa tìm kiếm hoặc thêm dịch vụ mới.</Typography>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </Box>
            </Card>

            {/* Popup Thêm/Sửa Dịch vụ */}
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                fullWidth
                maxWidth="sm"
                PaperProps={{ sx: { borderRadius: 3, boxShadow: '0 24px 48px 0 rgba(33, 43, 54, 0.16)' } }}
            >
                <DialogTitle sx={{ fontWeight: 800, color: '#212B36', pb: 2 }}>
                    {isEditing ? 'Chỉnh sửa dịch vụ' : 'Tạo dịch vụ mới'}
                </DialogTitle>
                <DialogContent dividers sx={{ borderBottom: 'none', borderTop: '1px dashed rgba(145, 158, 171, 0.24)' }}>
                    <Grid container spacing={3} sx={{ mt: 1 }}>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                fullWidth label="Tên dịch vụ"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                            />
                        </Grid>
                        <Grid size={{ xs: 6 }}>
                            <TextField
                                select fullWidth label="Phân loại"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                            >
                                {categories.map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)}
                            </TextField>
                        </Grid>
                        <Grid size={{ xs: 6 }}>
                            <TextField
                                fullWidth label="Giá cơ bản (VNĐ)" type="number"
                                value={formData.base_price}
                                onChange={(e) => setFormData({ ...formData, base_price: e.target.value === '' ? '' : Number(e.target.value) })}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                fullWidth multiline rows={4} label="Mô tả chi tiết"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ p: 3, pt: 1 }}>
                    <Button onClick={() => setOpen(false)} sx={{ color: '#637381', fontWeight: 700, textTransform: 'none' }}>
                        Hủy bỏ
                    </Button>
                    <Button onClick={handleSave} variant="contained" sx={{ bgcolor: '#212B36', color: '#fff', borderRadius: 2, textTransform: 'none', fontWeight: 700, '&:hover': { bgcolor: '#454F5B' } }}>
                        {isEditing ? 'Cập nhật' : 'Tạo mới'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ServicesPage;