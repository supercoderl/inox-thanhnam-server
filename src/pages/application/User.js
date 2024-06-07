import MainCard from "components/MainCard"
import { Avatar, Box, Button, Chip, IconButton, Link, OutlinedInput, Table, TableBody, TableCell, TableContainer, TableFooter, TablePagination, TableRow, Tooltip, Typography, } from "../../../node_modules/@mui/material/index";
import { useEffect, useState } from "react";
import { Link as RouterLink } from 'react-router-dom';
import { DeleteOutlined, EditOutlined, SearchOutlined, CloseCircleOutlined, CaretDownOutlined, SortAscendingOutlined, SortDescendingOutlined, ReloadOutlined, ExportOutlined } from '@ant-design/icons';
import CustomTableHead from "components/Table/CustomTableHead";
import axiosInstance from "config/axios";
import { toast } from "react-toastify";
import TableRowsLoader from "components/Table/TableRowsSkeleton";
import ModalCustom from "components/Modal/Modal";
import UserCreator from "./user-forms/UserCreator";
import UserViewer from "./user-forms/UserViewer";
import { dateFormatterV1 } from "utils/date";
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
                console.log(result.data);
            }
            else toast.error(result.message);
        }).catch((error) => console.log(error)).finally(() => setTimeout(() => setLoading(false), 2000));
    }

    useEffect(() => {
        getUsers();
    }, [sort]);

    return (
        <>
            <MainCard title="Danh sách tài khoản">
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
                            placeholder="Tìm kiếm người dùng..."
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
                                    labelRowsPerPage="Số lượng tài khoản mỗi trang:"
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

export default User;