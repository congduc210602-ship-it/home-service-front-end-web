import React, { useEffect, useState } from 'react';
import {
    Box, Typography, Paper, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Chip, CircularProgress,
    Tab, Tabs, IconButton, Dialog, DialogTitle, DialogContent,
    DialogActions, Button, Divider, Stack
} from '@mui/material';
import { Visibility, Block, CheckCircle } from '@mui/icons-material';
import { userService } from '../services/userService';

const UsersPage = () => {
    const [tabValue, setTabValue] = useState(0);
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // State quản lý Modal chi tiết
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [openDetail, setOpenDetail] = useState(false);

    const fetchData = async (type: number) => {
        setLoading(true);
        try {
            if (type === 0) {
                const data = await userService.getCustomers();
                setUsers(data);
            } else {
                const data = await userService.getWorkers();
                setUsers(data || []);
            }
        } catch (error) {
            console.error("Lỗi lấy dữ liệu:", error);
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(tabValue);
    }, [tabValue]);

    const handleOpenDetail = (user: any) => {
        setSelectedUser(user);
        setOpenDetail(true);
    };

    const handleApprove = async () => {
        if (!selectedUser || !selectedUser.worker_id) return;
        try {
            await userService.approveWorker(selectedUser.worker_id);
            alert("Đã phê duyệt thợ thành công!");
            setOpenDetail(false);
            fetchData(1); // Tải lại danh sách thợ
        } catch (error) {
            alert("Lỗi khi phê duyệt thợ hoặc thợ đã được duyệt trước đó.");
        }
    };

    return (
        <Box>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
                Quản lý Người dùng
            </Typography>

            <Paper sx={{ mb: 3 }}>
                <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} indicatorColor="primary" textColor="primary">
                    <Tab label="Khách hàng" />
                    <Tab label="Thợ đối tác" />
                </Tabs>
            </Paper>

            <TableContainer component={Paper} elevation={2}>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Table sx={{ minWidth: 650 }}>
                        <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold' }}>Họ và tên</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Số điện thoại</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Vai trò</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Trạng thái</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }} align="center">Hành động</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.length > 0 ? users.map((user, index) => (
                                <TableRow key={index} hover>
                                    <TableCell>{user.full_name || 'N/A'}</TableCell>
                                    <TableCell>{user.phone}</TableCell>
                                    <TableCell sx={{ textTransform: 'capitalize' }}>
                                        {user.role === 'worker' ? 'Thợ' : 'Khách hàng'}
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={user.is_approved ? "Đã duyệt" : "Chờ duyệt"}
                                            color={user.is_approved ? "success" : "warning"}
                                            size="small"
                                            variant="outlined"
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <IconButton color="primary" onClick={() => handleOpenDetail(user)}>
                                            <Visibility fontSize="small" />
                                        </IconButton>
                                        <IconButton color="error">
                                            <Block fontSize="small" />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">Không có dữ liệu</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                )}
            </TableContainer>

            {/* MODAL CHI TIẾT NGƯỜI DÙNG */}
            <Dialog open={openDetail} onClose={() => setOpenDetail(false)} fullWidth maxWidth="sm">
                <DialogTitle sx={{ fontWeight: 'bold', backgroundColor: '#f8f9fa' }}>
                    Chi tiết {selectedUser?.role === 'worker' ? 'Thợ đối tác' : 'Khách hàng'}
                </DialogTitle>
                <DialogContent dividers>
                    {selectedUser && (
                        <Stack spacing={2} sx={{ mt: 1 }}>
                            <Box>
                                <Typography variant="caption" color="textSecondary">Họ và tên</Typography>
                                <Typography variant="body1" fontWeight="bold">{selectedUser.full_name || 'N/A'}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="caption" color="textSecondary">Số điện thoại</Typography>
                                <Typography variant="body1">{selectedUser.phone}</Typography>
                            </Box>

                            {selectedUser.role === 'worker' && (
                                <>
                                    <Divider />
                                    <Box>
                                        <Typography variant="caption" color="textSecondary">Kỹ năng chuyên môn</Typography>
                                        <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                            {selectedUser.skills && selectedUser.skills.length > 0 ? (
                                                selectedUser.skills.map((skill: string, i: number) => (
                                                    <Chip key={i} label={skill} size="small" color="primary" variant="outlined" />
                                                ))
                                            ) : (
                                                <Typography variant="body2">Chưa cập nhật kỹ năng</Typography>
                                            )}
                                        </Box>
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" color="textSecondary">Đánh giá trung bình</Typography>
                                        <Typography variant="body1" sx={{ color: '#fbc02d', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                                            ⭐ {selectedUser.rating?.toFixed(1) || '5.0'} / 5.0
                                        </Typography>
                                    </Box>
                                </>
                            )}
                        </Stack>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setOpenDetail(false)} variant="contained" color="inherit">Đóng</Button>
                    {selectedUser?.role === 'worker' && (
                        <Button
                            variant="contained"
                            color="success"
                            startIcon={<CheckCircle />}
                            onClick={handleApprove}
                            disabled={selectedUser.is_approved}
                        >
                            {selectedUser.is_approved ? "Đã xác minh" : "Phê duyệt thợ"}
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default UsersPage;