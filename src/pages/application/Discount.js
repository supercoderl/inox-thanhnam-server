import MainCard from "components/MainCard"
import { Avatar, Box, Button, IconButton, Link, OutlinedInput, Switch, Table, TableBody, TableCell, TableContainer, TableFooter, TablePagination, TableRow, Tooltip, Typography, } from "../../../node_modules/@mui/material/index";
import { useEffect, useState } from "react";
import { Link as RouterLink } from 'react-router-dom';
import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined, CloseCircleOutlined, CaretDownOutlined, SortAscendingOutlined, SortDescendingOutlined, FilterOutlined, ReloadOutlined, ExportOutlined } from '@ant-design/icons';
import CustomTableHead from "components/Table/CustomTableHead";
import axiosInstance from "config/axios";
import TableRowsLoader from "components/Table/TableRowsSkeleton";
import { toast } from "react-toastify";
import DiscountCreator from "./discount-form/DiscountCreator";
import DiscountViewer from "./discount-form/DiscountViewer";
import ModalCustom from "components/Modal/Modal";
import MenuExport from "components/MenuExport";
import MenuSort from "components/MenuSort";
import DiscountFilter from "./discount-form/DiscountFilter";
import { dateFormatterV2 } from "utils/date";
import nodata from "../../assets/images/icons/nodata.png";

const headCells = [
    {
        id: 'discountID',
        align: 'center',
        disablePadding: false,
        label: 'STT'
    },
    {
        id: 'name',
        align: 'left',
        disablePadding: false,
        label: 'Tên mã giảm giá',
    },
    {
        id: 'code',
        align: 'left',
        disablePadding: false,
        label: 'Mã giảm giá'
    },
    {
        id: 'dateExpire',
        align: 'center',
        disablePadding: false,
        label: 'Ngày hết hạn'
    },
    {
        id: 'percentage',
        align: 'center',
        disablePadding: false,
        label: 'Phần trăm giảm'
    },
    {
        id: 'active',
        align: 'center',
        disablePadding: false,
        label: 'Trạng thái'
    },
    {
        id: 'actions',
        align: 'center',
        disablePadding: false,
        label: 'Chức năng'
    },
];

const Discount = () => {
    const [page, setPage] = useState(0);
    const [order] = useState('asc');
    const [orderBy] = useState('userID');
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [loading, setLoading] = useState(false);
    const [discounts, setDiscounts] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [discount, setDiscount] = useState(null);
    const [state, setState] = useState("update");
    const [searchText, setSearchText] = useState(null);
    const [anchorElExport, setAnchorElExport] = useState(null);
    const [anchorElSort, setAnchorElSort] = useState(null);
    const [anchorElFilter, setAnchorElFilter] = useState(null);
    const [filterObject, setFilterObject] = useState({
        percentageMin: 0,
        percentageMax: null,
        limitedQuantity: null,
        dateExpire: null,
        status: -1
    });
    const [sort, setSort] = useState({
        sortType: null,
        sortFrom: null
    });
    const openMenuExport = Boolean(anchorElExport);
    const openMenuSort = Boolean(anchorElSort);
    const openFilter = Boolean(anchorElFilter);

    const handleOpen = (item, state) => {
        setOpenModal(true);
        setState(state);
        setDiscount(item);
    };

    const handleClose = () => {
        setOpenModal(false);
        setDiscount(null);
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const getDiscounts = async () => {
        setLoading(true);
        await axiosInstance.get("Discount/discounts", {
            params: {
                ...filterObject,
                ...sort,
                searchText,
            }
        }).then((response) => {
            const result = response.data;
            if (result && result.success) {
                toast.success(result.message);
                setDiscounts(result.data);
            }
            else toast.error(result.message);
        }).catch((error) => console.log(error)).finally(() => setTimeout(() => setLoading(false), 2000));
    }

    const handleCheckStatus = async (item, status) => {
        item.active = status;
        await axiosInstance.put(`Discount/update-discount/${item.discountID}`, item).then((response) => {
            const result = response.data;
            if (result && result.success) {
                getDiscounts();
            }
            else toast.error(result.message);
        }).catch((error) => console.log(error));
    }

    useEffect(() => {
        getDiscounts();
    }, [sort]);

    return (
        <>
            <MainCard title="Danh sách mã giảm giá">
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <OutlinedInput
                            id="outlined-adornment-password"
                            startAdornment={<SearchOutlined onClick={getDiscounts} />}
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
                            placeholder="Tìm mã giảm giá.."
                            size="small"
                            onKeyPress={event => {
                                event.key === 'Enter' && getDiscounts();
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
                        <Tooltip title="Create new">
                            <IconButton onClick={() => handleOpen(null, "create")}>
                                <PlusOutlined />
                            </IconButton>
                        </Tooltip>
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
                                    discounts.length > 0 ?
                                        (rowsPerPage > 0
                                            ? discounts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            : discounts
                                        ).map((row, index) => (
                                            <TableRow
                                                hover
                                                role="checkbox"
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                tabIndex={-1}
                                                key={row.discountID}
                                            >
                                                <TableCell component="th" scope="row" align="center">
                                                    <Link color="secondary" component={RouterLink} to="">
                                                        {index + 1}
                                                    </Link>
                                                </TableCell>
                                                <TableCell align="left">{row.name}</TableCell>
                                                <TableCell align="left">{row.code}</TableCell>
                                                <TableCell align="left">{dateFormatterV2(row.dateExpire)}</TableCell>
                                                <TableCell align="center">{row.percentage}</TableCell>
                                                <TableCell align="center">
                                                    <Switch
                                                        checked={row.active}
                                                        onChange={(e) => handleCheckStatus(row, e.target.checked)}
                                                    />
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Box>
                                                        <Tooltip title="Cập nhật" placement="top">
                                                            <IconButton aria-label="edit" onClick={() => handleOpen(row, "update")}>
                                                                <EditOutlined />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Xóa" placement="top" onClick={() => handleOpen(row, "delete")}>
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
                                    count={discounts.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    labelRowsPerPage="Số lượng mã giảm giá mỗi trang:"
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
                        <DiscountCreator resetPage={() => {
                            getDiscounts();
                            handleClose();
                        }} />
                        :
                        <DiscountViewer discount={discount} state={state} resetPage={() => {
                            getDiscounts();
                            handleClose();
                        }} />
                }
            </ModalCustom>
            <DiscountFilter
                open={openFilter}
                setAnchorEl={setAnchorElFilter}
                anchorEl={anchorElFilter}
                filterObject={filterObject}
                setFilterObject={setFilterObject}
                onSubmit={getDiscounts}
            />
            <MenuExport open={openMenuExport} setAnchorEl={setAnchorElExport} anchorEl={anchorElExport} exportObject="discount" />
            <MenuSort
                open={openMenuSort}
                setAnchorEl={setAnchorElSort}
                anchorEl={anchorElSort}
                cols={headCells.filter(h => h.id !== "discountID" && h.id !== "actions")}
                sort={sort}
                setSort={setSort}
            />
        </>
    )
}

export default Discount;