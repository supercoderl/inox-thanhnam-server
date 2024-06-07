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
    OutlinedInput,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { DeleteOutlined, EyeOutlined, SearchOutlined, CloseCircleOutlined, CaretDownOutlined, SortAscendingOutlined, SortDescendingOutlined, FilterOutlined, ReloadOutlined, ExportOutlined } from '@ant-design/icons';
import CustomTableHead from "components/Table/CustomTableHead";
import { dateFormatterV1 } from "utils/date";
import { formatCurrency } from "utils/currency";
import TableRowsLoader from "components/Table/TableRowsSkeleton";
import axiosInstance from "config/axios";
import { toast } from "react-toastify";
import Loading from "components/Loading";
import OrderFilter from "./order-forms/OrderFilter";
import MenuExport from "components/MenuExport";
import MenuSort from "components/MenuSort";
import { status } from "utils/status";
import { getCustomerName, getCustomerPhone } from "utils/text";
import { Avatar, Typography } from "../../../node_modules/@mui/material/index";
import nodata from "../../assets/images/icons/nodata.png";

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
        id: 'phone',
        align: 'left',
        disablePadding: true,
        label: 'Số điện thoại'
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
    const [searchText, setSearchText] = useState("");
    const navigate = useNavigate();

    const [anchorElExport, setAnchorElExport] = useState(null);
    const [anchorElSort, setAnchorElSort] = useState(null);
    const [anchorElFilter, setAnchorElFilter] = useState(null);
    const [filterObject, setFilterObject] = useState({
        orderDateFrom: null,
        orderDateTo: null,
        totalMin: 0,
        totalMax: null,
        status: -1
    });
    const [sort, setSort] = useState({
        sortType: null,
        sortFrom: "descending"
    });
    const openMenuExport = Boolean(anchorElExport);
    const openMenuSort = Boolean(anchorElSort);
    const openFilter = Boolean(anchorElFilter);

    const handleOpen = async (item) => {
        setOpenLoading(true);
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
        await axiosInstance.get("Order/orders", {
            params: {
                ...filterObject,
                ...sort,
                isZeroStatus: false,
                searchText,
            }
        }).then((response) => {
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
    }, [sort]);

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

    return (
        <>
            <MainCard title="Danh sách đơn đặt hàng">
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <OutlinedInput
                            id="outlined-adornment-password"
                            startAdornment={<SearchOutlined onClick={getOrders} />}
                            endAdornment={
                                searchText != "" ?
                                    <IconButton edge="end" onClick={() => setSearchText("")}>
                                        <CloseCircleOutlined />
                                    </IconButton>
                                    :
                                    null
                            }
                            value={searchText}
                            onChange={e => setSearchText(e.target.value)}
                            placeholder="Tìm người đặt.."
                            size="small"
                            onKeyPress={event => {
                                event.key === 'Enter' && getOrders();
                            }}
                        />
                        <Button variant="outlined" startIcon={<FilterOutlined />} sx={{
                            '.MuiButton-startIcon > *:nth-of-type(1)': {
                                fontSize: 14
                            }
                        }} onClick={(e) => setAnchorElFilter(e.currentTarget)}>
                            Lọc
                        </Button>
                        <Button variant="outlined" endIcon={<CaretDownOutlined />} sx={{
                            '.MuiButton-endIcon > *:nth-of-type(1)': {
                                fontSize: 14
                            }
                        }} onClick={(e) => setAnchorElSort(e.currentTarget)}>
                            Sắp xếp
                        </Button>
                        {
                            sort.sortFrom === "descending"
                                ?
                                <IconButton onClick={() => {
                                    setSort({ ...sort, sortFrom: "ascending" });
                                }}>
                                    <SortDescendingOutlined />
                                </IconButton>
                                :
                                <IconButton onClick={() => {
                                    setSort({ ...sort, sortFrom: "descending" });
                                }}>
                                    <SortAscendingOutlined />
                                </IconButton>
                        }
                    </Box>
                    <Box>
                        <Tooltip title="Reload">
                            <IconButton onClick={() => {
                                setSort({ ...sort, sortType: null });
                            }}>
                                <ReloadOutlined />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Export">
                            <IconButton onClick={(e) => setAnchorElExport(e.currentTarget)}>
                                <ExportOutlined />
                            </IconButton>
                        </Tooltip>
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
                                    orders.length > 0 ?
                                        (rowsPerPage > 0
                                            ? orders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            : orders
                                        ).map((row, index) => (
                                            <TableRow
                                                hover
                                                role="checkbox"
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                tabIndex={-1}
                                                key={row.orderID}
                                            >
                                                <TableCell component="th" scope="row" align="center">
                                                    <Link color="secondary" component={RouterLink} to="">
                                                        {index + 1}
                                                    </Link>
                                                </TableCell>
                                                <TableCell component="th" scope="row" align="center">
                                                    <Chip label={status(row.status).label} color={status(row.status).color} />
                                                </TableCell>
                                                <TableCell align="left">
                                                    {getCustomerName(row, users)}
                                                </TableCell>
                                                <TableCell align="left">
                                                    {getCustomerPhone(row, users)}
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
                                        ))
                                        :
                                        <TableRow>
                                            <TableCell colSpan={headCells.length} sx={{ textAlign: "center" }}>
                                                <Avatar src={nodata} sx={{ margin: "auto", borderRadius: 0, marginBlock: 1, width: 60, height: 60 }}></Avatar>
                                                <Typography variant="subtitle"><i>Không có đơn hàng</i></Typography>
                                            </TableCell>
                                        </TableRow>
                            }
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TablePagination
                                    rowsPerPageOptions={[5, 10, 25, { label: 'Tất cả', value: -1 }]}
                                    colSpan={headCells.length}
                                    count={orders.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    labelRowsPerPage="Số lượng đơn đặt hàng mỗi trang:"
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                />
                            </TableRow>
                        </TableFooter>
                    </Table>
                </TableContainer>
            </MainCard>
            {openLoading && <Loading />}
            <OrderFilter
                open={openFilter}
                setAnchorEl={setAnchorElFilter}
                anchorEl={anchorElFilter}
                filterObject={filterObject}
                setFilterObject={setFilterObject}
                onSubmit={getOrders}
            />
            <MenuExport open={openMenuExport} setAnchorEl={setAnchorElExport} anchorEl={anchorElExport} exportObject="service" />
            <MenuSort
                open={openMenuSort}
                setAnchorEl={setAnchorElSort}
                anchorEl={anchorElSort}
                cols={headCells.filter(h => h.id !== "orderID" && h.id !== "actions")}
                sort={sort}
                setSort={setSort}
            />
        </>
    )
}

export default Order;