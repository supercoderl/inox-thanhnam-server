import MainCard from "components/MainCard"
import {
    Box,
    IconButton,
    Link,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableFooter,
    TablePagination,
    TableRow,
    Tooltip,
    Chip,
    Button,
    Popover,
    OutlinedInput,
    FormControl,
    FormControlLabel,
    Radio,
    RadioGroup,
    Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { DeleteOutlined, EyeOutlined, MehOutlined, CaretDownOutlined, SearchOutlined, CalendarOutlined, SwapRightOutlined, CloseCircleOutlined } from '@ant-design/icons';
import CustomTableHead from "components/Table/CustomTableHead";
import { dateFormatterV1, dateFormatterV2 } from "utils/date";
import { formatCurrency } from "utils/currency";
import TableRowsLoader from "components/Table/TableRowsSkeleton";
import axiosInstance from "config/axios";
import { toast } from "react-toastify";
import ModalCustom from "components/Modal/Modal";
import Loading from "components/Loading";
import { DateRangeCalendar } from '@mui/x-date-pickers-pro/DateRangeCalendar';

function createData(orderID, userID, orderDate, totalAmount) {
    return { orderID, userID, orderDate, totalAmount };
}

const rows = [
    createData(84564564, '84564564', '19/02/2024', '12000'),
    createData(98764560, '98764560', '19/02/2024', '12000'),
    createData(84564569, '84564569', '19/02/2024', '12000'),
];

const headCells = [
    {
        id: 'orderID',
        align: 'center',
        disablePadding: false,
        label: 'STT'
    },
    {
        id: 'status',
        align: 'center',
        disablePadding: false,
        label: 'Trạng thái'
    },
    {
        id: 'userID',
        align: 'left',
        disablePadding: true,
        label: 'Người đặt'
    },
    {
        id: 'orderDate',
        align: 'center',
        disablePadding: false,
        label: 'Ngày đặt'
    },
    {
        id: 'totalAmount',
        align: 'left',
        disablePadding: false,
        label: 'Tổng tiền'
    },
    {
        id: 'actions',
        align: 'center',
        disablePadding: false,
        label: 'Chức năng'
    },
];

const Order = () => {
    const [page, setPage] = useState(0);
    const [order] = useState('asc');
    const [orderBy] = useState('orderID');
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [orders, setOrders] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openLoading, setOpenLoading] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [anchorElDate, setAnchorElDate] = useState(null);
    const [status, setStatus] = useState(0);
    const [searchText, setSearchText] = useState("");
    const navigate = useNavigate();
    const [dates, setDates] = useState([]);

    const open = Boolean(anchorEl);
    const openDate = Boolean(anchorElDate);
    const id = open ? 'simple-popover' : undefined;

    const handleOpen = async (item) => {
        setOpenLoading(true);
        if (item.status === 1) await updateStatus(item);
        await getOrderItems(item).then((result) => {
            if (!result) {
                toast.error("Lỗi hệ thống");
                return;
            }
            setTimeout(() => {
                setOpenLoading(false);
                navigate(`/application/order/review/${item.orderID}`, { state: { item: result } });
            }, 1000);
        });
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const getOrders = async () => {
        setLoading(true);
        await axiosInstance.get("Order/orders").then((response) => {
            const result = response.data;
            if (result && result.success) {
                setOrders(result.data);
            }
            // else toast.error(result.message);
        }).catch((error) => console.log(error)).finally(() => setTimeout(() => setLoading(false), 2000));
    }

    const getUsers = async () => {
        setLoading(true);
        await axiosInstance.get("User/users").then((response) => {
            const result = response.data;
            if (result && result.success) {
                setUsers(result.data);
            }
            // else toast.error(result.message);
        }).catch((error) => console.log(error)).finally(() => setTimeout(() => setLoading(false), 2000));
    };

    useEffect(() => {
        getOrders();
        getUsers();
    }, []);

    const updateStatus = async (item) => {
        const body = {
            orderID: item.orderID,
            userID: item.userID,
            orderDate: item.orderDate,
            totalAmount: item.totalAmount,
            status: 2,
            fullname: item.fullname,
            phone: item.phone,
            address: item.address
        };

        await axiosInstance.put(`Order/update-order/${item.orderID}`, body, null).then((response) => {
            const result = response.data;
            if (!result) return;
            else if (result.success) {
                getOrders();
            }
            else toast.error(result.message);
        }).catch((error) => { setOpenLoading(false); console.log(error); });
    }

    const getOrderItems = async (order) => {
        return await axiosInstance.get(`Order/get-order-item/${order.orderID}`).then((response) => {
            const result = response.data;
            if (!result) return null;
            else if (result.success) return {
                order,
                orderItems: result.data
            }
            else {
                toast.error(result.message);
                return null;
            }
        }).catch((error) => { setOpenLoading(false); console.log("Get OrderItems: ", error); return null; });
    }

    const handleFilter = async () => {
        const params = {
            text: searchText,
            status: status === 0 ? null : status,
            fromDate: dates.length === 0 ? null : dateFormatterV2(dates[0]?.$d, "YYYY-MM-DD"),
            toDate: dates.length === 0 ? null : dateFormatterV2(dates[1]?.$d, "YYYY-MM-DD")
        };
        setLoading(true);
        await axiosInstance.get("Order/orders", { params }).then((response) => {
            const result = response.data;
            if (result && result.success) {
                toast.success(result.message);
                setOrders(result.data);
            }
            else toast.error(result.message);
        }).catch((error) => console.log(error)).finally(() => setTimeout(() => setLoading(false), 2000));
    }

    const handleDeleteFilter = async () => {
        setSearchText("");
        setStatus(0);
        setDates([]);
        await getOrders();
    }

    return (
        <>
            <MainCard title="Danh sách đơn đặt hàng">
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box>
                        <OutlinedInput
                            id="outlined-adornment-password"
                            startAdornment={<SearchOutlined />}
                            endAdornment={
                                searchText != "" ?
                                    <IconButton edge="end" onClick={() => setSearchText("")}>
                                        <CloseCircleOutlined />
                                    </IconButton>
                                    :
                                    null
                            }
                            value={searchText}
                            placeholder="Tìm kiếm..."
                            size="small"
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                    </Box>
                    <Box>
                        <Button
                            className="filter"
                            variant="outlined"
                            sx={{ display: "flex", alignItems: "center" }}
                            aria-describedby={id}
                            onClick={(e) => setAnchorEl(e.currentTarget)}
                        >
                            <MehOutlined className="icon left" />
                            <span className="text">
                                {
                                    status === 1 ? "Chưa đọc" : status === 2 ? "Chưa xác nhận" : status === 3 ? "Đã xác nhận" : "Tất cả"
                                }
                            </span>
                            <CaretDownOutlined className="icon right" />
                        </Button>
                        <Popover
                            id={id}
                            open={open}
                            anchorEl={anchorEl}
                            onClose={() => setAnchorEl(null)}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                        >
                            <Box sx={{ padding: "0.75rem" }}>
                                <Typography variant="h6" sx={{ marginBottom: "0.5rem" }}>Trạng thái</Typography>
                                <OutlinedInput
                                    id="outlined-adornment-password"
                                    startAdornment={
                                        <SearchOutlined />
                                    }
                                    placeholder="Tìm kiếm..."
                                    size="small"
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                />
                                <Box sx={{ paddingBlock: "0.75rem" }}>
                                    <FormControl>
                                        <RadioGroup
                                            value={status}
                                            name="radio-buttons-group"
                                            onChange={(e) => {
                                                setStatus(Number(e.target.value));
                                            }}
                                        >
                                            <FormControlLabel value={3} control={<Radio />} label="Đã xác nhận" />
                                            <FormControlLabel value={2} control={<Radio />} label="Chưa xác nhận" />
                                            <FormControlLabel value={1} control={<Radio />} label="Chưa đọc" />
                                        </RadioGroup>
                                    </FormControl>
                                </Box>
                            </Box>
                        </Popover>
                    </Box>
                    <Box>
                        <Button
                            className="filter"
                            variant="outlined"
                            sx={{ display: "flex", alignItems: "center" }}
                            aria-describedby={id}
                            color="secondary"
                            onClick={(e) => setAnchorElDate(e.currentTarget)}
                        >
                            <CalendarOutlined className="icon left" />
                            <span className="text">{dateFormatterV2(dates[0]?.$d, "DD/MM")}</span>
                            <SwapRightOutlined />
                            <span className="text">{dateFormatterV2(dates[1]?.$d, "DD/MM")}</span>
                            <CaretDownOutlined className="icon right" />
                        </Button>
                        <Popover
                            id={id}
                            open={openDate}
                            anchorEl={anchorElDate}
                            onClose={() => setAnchorElDate(null)}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                        >
                            <DateRangeCalendar
                                value={dates}
                                onChange={(newValue) => {
                                    setDates(newValue)
                                }}
                            />
                        </Popover>
                    </Box>
                    <Box sx={{ marginLeft: "auto", gap: 1, display: "flex" }}>
                        <Button className="filter" onClick={handleDeleteFilter} variant="contained" color="secondary">
                            <span className="text">Xóa bộ lọc</span>
                        </Button>
                        <Button className="filter" onClick={handleFilter} variant="contained" color="success">
                            <span className="text">Hoàn thành lọc</span>
                        </Button>
                    </Box>
                </Box>
                <TableContainer
                    sx={{
                        width: '100%',
                        overflowX: 'auto',
                        position: 'relative',
                        display: 'block',
                        maxWidth: '100%',
                        '& td, & th': { whiteSpace: 'nowrap' }
                    }}
                >
                    <Table
                        aria-labelledby="tableTitle"
                        sx={{
                            '& .MuiTableCell-root:first-of-type': {
                                pl: 2
                            },
                            '& .MuiTableCell-root:last-of-type': {
                                pr: 3
                            }
                        }}
                    >
                        <CustomTableHead headCells={headCells} order={order} orderBy={orderBy} />
                        <TableBody>
                            {
                                loading ?
                                    <TableRowsLoader rowsNum={rowsPerPage} colsNum={headCells.length - 1} />
                                    :
                                    (rowsPerPage > 0
                                        ? orders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        : orders
                                    ).map((row, index) => (
                                        <React.Fragment key={row.orderID}>
                                            {
                                                row.status === 1 ?
                                                    <img
                                                        className="status"
                                                        src="https://cdn-icons-gif.flaticon.com/11186/11186848.gif"
                                                        alt=""
                                                        style={{ width: 30, height: 30, position: "absolute" }}
                                                    />
                                                    :
                                                    null
                                            }

                                            <TableRow
                                                hover
                                                role="checkbox"
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                tabIndex={-1}

                                            >
                                                <TableCell component="th" scope="row" align="center">
                                                    <Link color="secondary" component={RouterLink} to="">
                                                        {index + 1}
                                                    </Link>
                                                </TableCell>
                                                <TableCell component="th" scope="row" align="center">
                                                    {
                                                        row.status === 1 ?
                                                            <Chip label="Chưa đọc" color="error" /> :
                                                            row.status === 2 ?
                                                                <Chip label="Chưa xác nhận" color="secondary" /> :
                                                                <Chip label="Đã xác nhận" color="success" />
                                                    }
                                                </TableCell>
                                                <TableCell align="left">
                                                    {
                                                        users && users.length > 0 ?
                                                            users.find(x => x.userID === row.userID)?.lastname + " " +
                                                            users.find(x => x.userID === row.userID)?.firstname
                                                            :
                                                            "N/A"
                                                    }
                                                </TableCell>
                                                <TableCell align="center">{dateFormatterV1(row.orderDate)}</TableCell>
                                                <TableCell align="left">{formatCurrency(row.totalAmount)}</TableCell>
                                                <TableCell align="center">
                                                    <Box>
                                                        <Tooltip title="Xem đơn hàng" placement="top">
                                                            <IconButton aria-label="edit" onClick={() => handleOpen(row)}>
                                                                <EyeOutlined />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Xóa" placement="top">
                                                            <IconButton aria-label="delete">
                                                                <DeleteOutlined />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        </React.Fragment>
                                    ))
                            }
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TablePagination
                                    rowsPerPageOptions={[5, 10, 25, { label: 'Tất cả', value: -1 }]}
                                    colSpan={headCells.length}
                                    count={rows.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    SelectProps={{
                                        inputProps: {
                                            'aria-label': 'Đơn đặt hàng mỗi trang',
                                        },
                                        native: true,
                                    }}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                />
                            </TableRow>
                        </TableFooter>
                    </Table>
                </TableContainer>
            </MainCard>
            <ModalCustom
                open={openLoading}
                width={600}
                modalStyle={{ outline: "none", boxShadow: "none", color: "white", alignItems: "center", border: "none", background: "transparent" }}
            >
                <Loading />
            </ModalCustom>
        </>
    )
}

export default Order;