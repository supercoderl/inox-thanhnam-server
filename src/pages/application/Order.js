import MainCard from "components/MainCard"
import { Box, IconButton, Link, Table, TableBody, TableCell, TableContainer, TableFooter, TablePagination, TableRow, Tooltip, } from "../../../node_modules/@mui/material/index";
import { useEffect, useState } from "react";
import { Link as RouterLink } from 'react-router-dom';
import { DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import CustomTableHead from "components/Table/CustomTableHead";
import { dateFormatterV1 } from "utils/date";
import { formatCurrency } from "utils/currency";
import TableRowsLoader from "components/Table/TableRowsSkeleton";
import axiosInstance from "config/axios";
import { toast } from "react-toastify";

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
                toast.success(result.message);
                setOrders(result.data);
                console.log(result.data);
            }
            else toast.error(result.message);
        }).catch((error) => console.log(error)).finally(() => setTimeout(() => setLoading(false), 2000));
    }

    const getUsers = async () => {
        setLoading(true);
        await axiosInstance.get("User/users").then((response) => {
            const result = response.data;
            if (result && result.success) {
                toast.success(result.message);
                setUsers(result.data);
            }
            else toast.error(result.message);
        }).catch((error) => console.log(error)).finally(() => setTimeout(() => setLoading(false), 2000));
    }

    useEffect(() => {
        getOrders();
        getUsers();
    }, []);

    return (
        <MainCard title="Danh sách đơn đặt hàng">
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
                                ).filter(x => x.status === 1).map((row, index) => (
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
                                                    <IconButton aria-label="edit" onClick={() => handleOpen(row, "update")}>
                                                        <EyeOutlined />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Xóa" placement="top">
                                                    <IconButton aria-label="delete" onClick={() => handleOpen(row, "delete")}>
                                                        <DeleteOutlined />
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
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
    )
}

export default Order;