    import React, { useEffect, useState } from 'react';
    import {
        Box, Typography, Paper, Table, TableBody, TableCell,
        TableContainer, TableHead, TableRow, Button, Chip,
        IconButton, Dialog, DialogTitle, DialogContent,
        DialogActions, TextField, Grid, MenuItem, CircularProgress
    } from '@mui/material';
    import { Add, Edit, Delete } from '@mui/icons-material';
    import { serviceService } from '../services/serviceService';

    const categories = ['Sửa chữa', 'Vệ sinh', 'Điện lạnh', 'Lắp đặt', 'Điện nước'];

    const ServicesPage = () => {
        const [services, setServices] = useState<any[]>([]);
        const [loading, setLoading] = useState(true);
        const [open, setOpen] = useState(false);
        const [formData, setFormData] = useState({ name: '', description: '', base_price: '', category: 'Sửa chữa' });

        const fetchServices = async () => {
            setLoading(true);
            try {
                const data = await serviceService.getServices();
                setServices(data || []);
            } catch (error) { console.error(error); }
            finally { setLoading(false); }
        };

        useEffect(() => { fetchServices(); }, []);

        const handleSave = async () => {
            try {
                await serviceService.createService(formData);
                setOpen(false);
                setFormData({ name: '', description: '', base_price: '', category: 'Sửa chữa' });
                fetchServices();
            } catch (error) { alert("Lỗi kết nối Backend cổng 8009"); }
        };

        return (
            <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                    <Typography variant="h5" fontWeight="bold">Quản lý Dịch vụ</Typography>
                    <Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)}>Thêm dịch vụ</Button>
                </Box>

                <TableContainer component={Paper} elevation={3}>
                    {loading ? <Box sx={{ p: 5, textAlign: 'center' }}><CircularProgress /></Box> : (
                        <Table>
                            <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                                <TableRow>
                                    <TableCell>Tên dịch vụ</TableCell>
                                    <TableCell>Phân loại</TableCell>
                                    <TableCell>Giá cơ bản</TableCell>
                                    <TableCell align="center">Thao tác</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {services.map((s) => (
                                    <TableRow key={s.id}>
                                        <TableCell><b>{s.name}</b></TableCell>
                                        <TableCell><Chip label={s.category} size="small" /></TableCell>
                                        <TableCell>{s.base_price?.toLocaleString()}đ</TableCell>
                                        <TableCell align="center">
                                            <IconButton color="primary"><Edit /></IconButton>
                                            <IconButton color="error"><Delete /></IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </TableContainer>

                <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
                    <DialogTitle>Tạo dịch vụ mới</DialogTitle>
                    <DialogContent dividers>
                        <Grid container spacing={2} sx={{ mt: 1 }}>
                            <Grid item xs={12}><TextField fullWidth label="Tên dịch vụ" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} /></Grid>
                            <Grid item xs={6}><TextField select fullWidth label="Loại" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>{categories.map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)}</TextField></Grid>
                            <Grid item xs={6}><TextField fullWidth label="Giá (VNĐ)" type="number" value={formData.base_price} onChange={(e) => setFormData({ ...formData, base_price: e.target.value })} /></Grid>
                            <Grid item xs={12}><TextField fullWidth multiline rows={3} label="Mô tả" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} /></Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions sx={{ p: 2 }}><Button onClick={() => setOpen(false)}>Hủy</Button><Button onClick={handleSave} variant="contained">Lưu</Button></DialogActions>
                </Dialog>
            </Box>
        );
    };

    export default ServicesPage;