import MainCard from "components/MainCard"
import { Box, Button, Chip, Grid, IconButton, Link, Table, TableBody, TableCell, TableContainer, TableFooter, TablePagination, TableRow, Tooltip, Typography, } from "../../../node_modules/@mui/material/index";
import { useEffect, useState } from "react";
import { Link as RouterLink } from 'react-router-dom';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import CustomTableHead from "components/Table/CustomTableHead";
import axiosInstance from "config/axios";
import { toast } from "react-toastify";
import TableRowsLoader from "components/Table/TableRowsSkeleton";
import ModalCustom from "components/Modal/Modal";
import UserCreator from "./user-forms/UserCreator";
import UserViewer from "./user-forms/UserViewer";
import { dateFormatterV1 } from "utils/date";

const headCells = [
    {
        id: 'userID',
        align: 'center',
        disablePadding: false,
        label: 'STT'
    },
    {
        id: 'username',
        align: 'left',
        disablePadding: true,
        label: 'Tên tài khoản'
    },
    {
        id: 'position',
        align: 'left',
        disablePadding: false,
        label: 'Chức vụ'
    },
    {
        id: 'status',
        align: 'center',
        disablePadding: true,
        label: 'Trạng thái'
    },
    {
        id: 'updatedAt',
        align: 'center',
        disablePadding: false,
        label: 'Thời gian cập nhật'
    },
    {
        id: 'actions',
        align: 'center',
        disablePadding: false,
        label: 'Chức năng'
    },
];

const User = () => {
    const [page, setPage] = useState(0);
    const [order] = useState('asc');
    const [orderBy] = useState('userID');
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [user, setUser] = useState(null);
    const [state, setState] = useState("update");

    const handleOpen = (item, state) => {
        setOpenModal(true);
        setState(state);
        setUser(item);
    };

    const handleClose = () => {
        setOpenModal(false);
        setUser(null);
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const getUsers = async () => {
        setLoading(true);
        await axiosInstance.get("User/users").then((response) => {
            const result = response.data;
            if (result && result.success) {
                toast.success(result.message);
                setUsers(result.data);
                console.log(result.data);
            }
            else toast.error(result.message);
        }).catch((error) => console.log(error)).finally(() => setTimeout(() => setLoading(false), 2000));
    }

    useEffect(() => {
        getUsers();
    }, []);

    return (
        <>
            <MainCard title="Danh sách tài khoản">
                <Grid container justifyContent="flex-end">
                    <Button variant="outlined" color="success" onClick={() => handleOpen(null, "create")}>
                        <PlusOutlined />
                        <Typography sx={{ ml: 0.5 }}>Thêm mới</Typography>
                    </Button>
                </Grid>
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
                                        ? users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        : users
                                    ).map((row, index) => (
                                        <TableRow
                                            hover
                                            role="checkbox"
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            tabIndex={-1}
                                            key={row.userID}
                                        >
                                            <TableCell component="th" scope="row" align="center">
                                                <Link color="secondary" component={RouterLink} to="">
                                                    {index + 1}
                                                </Link>
                                            </TableCell>
                                            <TableCell align="left">{row.username}</TableCell>
                                            <TableCell align="left">{row.roles.join(", ")}</TableCell>
                                            <TableCell align="center">
                                                <Chip
                                                    label={row.isActive ? "Đang hoạt động" : "Bị khóa"}
                                                    color={row.isActive ? "success" : "error"}
                                                />
                                            </TableCell>
                                            <TableCell align="center">{dateFormatterV1(row.updatedAt) || "N/A"}</TableCell>
                                            <TableCell align="center">
                                                <Box>
                                                    <Tooltip title="Cập nhật" placement="top">
                                                        <IconButton aria-label="edit" onClick={() => handleOpen(row, "update")}>
                                                            <EditOutlined />
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
                                    count={users.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    SelectProps={{
                                        inputProps: {
                                            'aria-label': 'Tài khoản mỗi trang',
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
            <ModalCustom open={openModal} handleClose={handleClose} width={600}>
                {
                    state === "create" ?
                        <UserCreator resetPage={getUsers} />
                        :
                        <UserViewer user={user} state={state} resetPage={getUsers} />
                }
            </ModalCustom>
        </>
    )
}

export default User;