import MainCard from "components/MainCard"
import { Avatar, Box, Button, IconButton, Link, OutlinedInput, Table, TableBody, TableCell, TableContainer, TableFooter, TablePagination, TableRow, Tooltip, Typography, } from "../../../node_modules/@mui/material/index";
import { useEffect, useState } from "react";
import { Link as RouterLink } from 'react-router-dom';
import { DeleteOutlined, EditOutlined, SearchOutlined, CloseCircleOutlined, CaretDownOutlined, SortDescendingOutlined, SortAscendingOutlined, ReloadOutlined, ExportOutlined } from '@ant-design/icons';
import CustomTableHead from "components/Table/CustomTableHead";
import axiosInstance from "config/axios";
import TableRowsLoader from "components/Table/TableRowsSkeleton";
import { toast } from "react-toastify";
import ModalCustom from "components/Modal/Modal";
import CustomerViewer from "./customer-forms/CustomerViewer";
import MenuExport from "components/MenuExport";
import MenuSort from "components/MenuSort";
import nodata from "../../assets/images/icons/nodata.png";

const headCells = [
    {
        id: 'userID',
        align: 'center',
        disablePadding: false,
        label: 'STT'
    },
    {
        id: 'lastname',
        align: 'left',
        disablePadding: false,
        label: 'Họ'
    },
    {
        id: 'firstname',
        align: 'left',
        disablePadding: false,
        label: 'Tên khách hàng'
    },
    {
        id: 'phone',
        align: 'right',
        disablePadding: false,
        label: 'Số điện thoại'
    },
    {
        id: 'address',
        align: 'left',
        disablePadding: false,
        label: 'Địa chỉ'
    },
    {
        id: 'actions',
        align: 'center',
        disablePadding: false,
        label: 'Chức năng'
    },
];

const Customer = () => {
    const [page, setPage] = useState(0);
    const [order] = useState('asc');
    const [orderBy] = useState('customerID');
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [user, setUser] = useState(null);
    const [state, setState] = useState("update");
    const [searchText, setSearchText] = useState("");
    const [anchorElExport, setAnchorElExport] = useState(null);
    const [anchorElSort, setAnchorElSort] = useState(null);
    const [sort, setSort] = useState({
        sortType: null,
        sortFrom: "descending"
    });
    const openMenuExport = Boolean(anchorElExport);
    const openMenuSort = Boolean(anchorElSort);

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
        await axiosInstance.get("User/users", {
            params: {
                ...sort,
                searchText,
            }
        }).then((response) => {
            const result = response.data;
            if (result && result.success) {
                toast.success(result.message);
                setUsers(result.data);
            }
            else toast.error(result.message);
        }).catch((error) => console.log(error)).finally(() => setTimeout(() => setLoading(false), 2000));
    }

    useEffect(() => {
        getUsers();
    }, [sort]);


    return (
        <>
            <MainCard title="Danh sách khách hàng">
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <OutlinedInput
                            startAdornment={<SearchOutlined onClick={getUsers} />}
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
                            placeholder="Tìm kiếm khách hàng.."
                            size="small"
                            onKeyPress={event => {
                                event.key === 'Enter' && getUsers();
                            }}
                        />
                        <Button variant="outlined" endIcon={<CaretDownOutlined />} sx={{
                            '.MuiButton-endIcon > *:nth-of-type(1)': {
                                fontSize: 14
                            }
                        }} onClick={(e) => setAnchorElSort(e.currentTarget)}>
                            Sort by
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
                        aria-labelledby="tableTitle sticky"
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
                                    users.length > 0 ?
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
                                                <TableCell align="left">{row.lastname}</TableCell>
                                                <TableCell align="left">{row.firstname}</TableCell>
                                                <TableCell align="right">{"0" + row.phone}</TableCell>
                                                <TableCell align="left">{row.userAddress?.address || ""}</TableCell>
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
                                    count={users.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    labelRowsPerPage="Số lượng khách hàng mỗi trang:"
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                />
                            </TableRow>
                        </TableFooter>
                    </Table>
                </TableContainer>
            </MainCard>
            <ModalCustom open={openModal} handleClose={handleClose} width={600}>
                <CustomerViewer customer={user} state={state} resetPage={getUsers} />
            </ModalCustom>
            <MenuExport open={openMenuExport} setAnchorEl={setAnchorElExport} anchorEl={anchorElExport} exportObject="user" />
            <MenuSort
                open={openMenuSort}
                setAnchorEl={setAnchorElSort}
                anchorEl={anchorElSort}
                cols={headCells.filter(h => h.id !== "userID" && h.id !== "actions")}
                sort={sort}
                setSort={setSort}
            />
        </>
    )
}

export default Customer;