// src/pages/UsersPage.tsx
import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Card, Tabs, Tab, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Chip, Button, CircularProgress,
    TextField, InputAdornment, Avatar, Stack
} from '@mui/material';

import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import SearchIcon from '@mui/icons-material/Search';
import PersonOffIcon from '@mui/icons-material/PersonOff';

import { userService } from '../services/userService';

// --- Hàm phụ trợ: Sinh màu Avatar ---
const stringToColor = (string: string) => {
    let hash = 0;
    for (let i = 0; i < string.length; i += 1) hash = string.charCodeAt(i) + ((hash << 5) - hash);
    let color = '#';
    for (let i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
    }
    return color;
};

const stringAvatar = (name: string) => {
    if (!name) return { sx: { bgcolor: '#919EAB' }, children: 'U' };
    const nameParts = name.trim().split(' ');
    const initial = nameParts.length > 1 ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}` : nameParts[0][0];
    return {
        sx: {
            bgcolor: stringToColor(name),
            width: 48,
            height: 48,
            fontSize: '1.1rem',
            fontWeight: 700,
            boxShadow: 'inset 0 0 0 2px rgba(255,255,255,0.2)'
        },
        children: initial.toUpperCase(),
    };
};

const UsersPage = () => {
    const [tabIndex, setTabIndex] = useState(0);
    const [customers, setCustomers] = useState<any[]>([]);
    const [workers, setWorkers] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async (keyword: string = '') => {
        setLoading(true);
        try {
            const [customerData, workerData] = await Promise.all([
                userService.getCustomers(keyword),
                userService.getWorkers(keyword)
            ]);
            setCustomers(customerData);
            setWorkers(workerData);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabIndex(newValue);
    };

    const handleApproveWorker = async (workerId: string | number) => {
        try {
            await userService.approveWorker(workerId);
            fetchData(searchTerm);
        } catch (error) {
            alert('Lỗi khi duyệt thợ. Vui lòng kiểm tra lại kết nối.');
        }
    };

    const handleSearch = () => {
        fetchData(searchTerm.trim());
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSearch();
    };

    // --- Component: Giao diện khi không có dữ liệu ---
    const EmptyState = ({ message }: { message: string }) => (
        <TableRow>
            <TableCell colSpan={5} align="center" sx={{ py: 10, border: 0 }}>
                <PersonOffIcon sx={{ fontSize: 64, color: '#DFE3E8', mb: 2 }} />
                <Typography variant="h6" sx={{ color: '#212B36', fontWeight: 700 }}>Không tìm thấy kết quả</Typography>
                <Typography variant="body2" sx={{ color: '#637381', mt: 1 }}>{message}</Typography>
            </TableCell>
        </TableRow>
    );

    // --- Component: Style Tiêu đề Bảng ---
    const StyledTableHeadCell = ({ children, align = 'left' }: any) => (
        <TableCell align={align} sx={{
            color: '#637381',
            fontWeight: 700,
            textTransform: 'uppercase',
            fontSize: '0.75rem',
            letterSpacing: 1,
            bgcolor: '#F4F6F8',
            borderBottom: 'none',
            py: 2
        }}>
            {children}
        </TableCell>
    );

    return (
        <Box sx={{ pb: 5 }}>
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 4, color: '#212B36' }}>
                Quản lý Người dùng
            </Typography>

            <Card
                elevation={0}
                sx={{
                    borderRadius: 4,
                    boxShadow: '0 12px 24px -4px rgba(145, 158, 171, 0.16)', // Bóng đổ cao cấp
                    overflow: 'hidden',
                    border: 'none'
                }}
            >
                {/* --- KHU VỰC TABS CHUẨN HIỆN ĐẠI --- */}
                <Box sx={{ bgcolor: '#F9FAFB', borderBottom: '1px solid rgba(145, 158, 171, 0.16)', px: 2 }}>
                    <Tabs
                        value={tabIndex}
                        onChange={handleTabChange}
                        sx={{
                            '& .MuiTab-root': {
                                fontWeight: 600,
                                fontSize: '0.95rem',
                                textTransform: 'none',
                                minHeight: 64,
                                color: '#637381',
                                mr: 2
                            },
                            '& .Mui-selected': { color: '#212B36 !important' },
                            '& .MuiTabs-indicator': { backgroundColor: '#212B36', height: 3, borderTopLeftRadius: 3, borderTopRightRadius: 3 }
                        }}
                    >
                        <Tab label="Khách hàng" />
                        <Tab label="Thợ đối tác" />
                    </Tabs>
                </Box>

                {/* --- KHU VỰC TOOLBAR & SEARCH --- */}
                <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                    <TextField
                        fullWidth
                        placeholder="Tìm kiếm theo tên hoặc số điện thoại..."
                        variant="outlined"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyPress={handleKeyPress}
                        sx={{
                            maxWidth: 480,
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 10, // Bo tròn dạng viên thuốc
                                backgroundColor: '#F4F6F8',
                                transition: 'all 0.3s',
                                '& fieldset': { border: 'none' }, // Xóa viền đen xấu xí
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
                    <Button
                        variant="contained"
                        onClick={handleSearch}
                        sx={{
                            px: 3, py: 1.5,
                            borderRadius: 10,
                            textTransform: 'none',
                            fontWeight: 700,
                            boxShadow: 'none',
                            bgcolor: '#212B36',
                            '&:hover': { bgcolor: '#454F5B' }
                        }}
                    >
                        Tìm kiếm
                    </Button>
                </Box>

                {/* --- KHU VỰC BẢNG (TABLE) --- */}
                <Box sx={{ width: '100%', overflowX: 'auto' }}>
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 10 }}>
                            <CircularProgress sx={{ color: '#212B36' }} />
                        </Box>
                    ) : (
                        <TableContainer>
                            <Table sx={{ minWidth: 800 }}>
                                {tabIndex === 0 ? (
                                    <>
                                        <TableHead>
                                            <TableRow>
                                                <StyledTableHeadCell>ID</StyledTableHeadCell>
                                                <StyledTableHeadCell>Khách hàng</StyledTableHeadCell>
                                                <StyledTableHeadCell>Liên hệ</StyledTableHeadCell>
                                                <StyledTableHeadCell>Ngày tham gia</StyledTableHeadCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {customers.map((c) => (
                                                <TableRow key={c.id} hover sx={{ transition: 'all 0.2s', '& td': { borderBottom: '1px dashed rgba(145, 158, 171, 0.24)' } }}>
                                                    <TableCell sx={{ color: '#919EAB', fontWeight: 600 }}>#{c.id}</TableCell>
                                                    <TableCell>
                                                        <Stack direction="row" alignItems="center" spacing={2.5}>
                                                            <Avatar {...stringAvatar(c.full_name)} />
                                                            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#212B36', fontSize: '0.95rem' }}>
                                                                {c.full_name}
                                                            </Typography>
                                                        </Stack>
                                                    </TableCell>
                                                    <TableCell sx={{ color: '#454F5B', fontWeight: 500 }}>{c.phone}</TableCell>
                                                    <TableCell sx={{ color: '#637381' }}>{c.created_at}</TableCell>
                                                </TableRow>
                                            ))}
                                            {customers.length === 0 && <EmptyState message="Thử đổi từ khóa tìm kiếm hoặc làm mới trang." />}
                                        </TableBody>
                                    </>
                                ) : (
                                    <>
                                        <TableHead>
                                            <TableRow>
                                                <StyledTableHeadCell>ID</StyledTableHeadCell>
                                                <StyledTableHeadCell>Thợ đối tác</StyledTableHeadCell>
                                                <StyledTableHeadCell>Kỹ năng chuyên môn</StyledTableHeadCell>
                                                <StyledTableHeadCell>Trạng thái</StyledTableHeadCell>
                                                <StyledTableHeadCell align="center">Thao tác</StyledTableHeadCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {workers.map((w) => (
                                                <TableRow key={w.id} hover sx={{ transition: 'all 0.2s', '& td': { borderBottom: '1px dashed rgba(145, 158, 171, 0.24)' } }}>
                                                    <TableCell sx={{ color: '#919EAB', fontWeight: 600 }}>#{w.id}</TableCell>
                                                    <TableCell>
                                                        <Stack direction="row" alignItems="center" spacing={2.5}>
                                                            <Avatar {...stringAvatar(w.full_name)} />
                                                            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#212B36', fontSize: '0.95rem' }}>
                                                                {w.full_name}
                                                            </Typography>
                                                        </Stack>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="body2" sx={{ color: '#637381', maxWidth: 200, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                            {w.skills || 'Chưa cập nhật'}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        {w.is_approved ? (
                                                            <Chip label="Đã duyệt" sx={{ bgcolor: 'rgba(34, 197, 94, 0.16)', color: '#16a34a', fontWeight: 700, borderRadius: 1.5, px: 1 }} size="small" />
                                                        ) : (
                                                            <Chip label="Chờ duyệt" sx={{ bgcolor: 'rgba(245, 158, 11, 0.16)', color: '#d97706', fontWeight: 700, borderRadius: 1.5, px: 1 }} size="small" />
                                                        )}
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        {!w.is_approved && (
                                                            <Button
                                                                variant="contained"
                                                                size="small"
                                                                startIcon={<CheckCircleOutlineIcon />}
                                                                onClick={() => handleApproveWorker(w.id)}
                                                                sx={{
                                                                    bgcolor: '#22C55E',
                                                                    color: '#fff',
                                                                    boxShadow: '0 8px 16px 0 rgba(34, 197, 94, 0.24)', // Bóng đổ glow màu xanh
                                                                    '&:hover': { bgcolor: '#16a34a', boxShadow: 'none' },
                                                                    borderRadius: 1.5,
                                                                    textTransform: 'none',
                                                                    fontWeight: 700
                                                                }}
                                                            >
                                                                Duyệt Hồ Sơ
                                                            </Button>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                            {workers.length === 0 && <EmptyState message="Không có thợ nào khớp với từ khóa của bạn." />}
                                        </TableBody>
                                    </>
                                )}
                            </Table>
                        </TableContainer>
                    )}
                </Box>
            </Card>
        </Box>
    );
};

export default UsersPage;