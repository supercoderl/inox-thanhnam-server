import MainCard from "components/MainCard"
import { Avatar, Box, Button, IconButton, Link, OutlinedInput, Table, TableBody, TableCell, TableContainer, TableFooter, TablePagination, TableRow, Tooltip, Typography, } from "../../../node_modules/@mui/material/index";
import { useEffect, useState } from "react";
import { Link as RouterLink } from 'react-router-dom';
import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined, CloseCircleOutlined, CaretDownOutlined, SortAscendingOutlined, SortDescendingOutlined, FilterOutlined, ReloadOutlined, ExportOutlined } from '@ant-design/icons';
import CustomTableHead from "components/Table/CustomTableHead";
import axiosInstance from "config/axios";
import TableRowsLoader from "components/Table/TableRowsSkeleton";
import { toast } from "react-toastify";
import { formatCurrency } from "utils/currency";
import ModalCustom from "components/Modal/Modal";
import ProductViewer from "./product-forms/ProductViewer";
import ProductCreator from "./product-forms/ProductCreator";
import { dateFormatterV1 } from "utils/date";
import ProductFilter from "./product-forms/ProductFilter";
import MenuExport from "components/MenuExport";
import MenuSort from "components/MenuSort";
import { getImage } from "utils/image";

const headCells = [
    {
        id: 'productID',
        align: 'center',
        disablePadding: false,
        label: 'STT'
    },
    {
        id: 'imageURL',
        align: 'center',
        disablePadding: false,
        label: 'Hình ảnh'
    },
    {
        id: 'name',
        align: 'left',
        disablePadding: true,
        label: 'Tên sản phẩm'
    },
    {
        id: 'price',
        align: 'right',
        disablePadding: false,
        label: 'Giá'
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

const Product = () => {
    const [page, setPage] = useState(0);
    const [order] = useState('asc');
    const [orderBy] = useState('userID');
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [product, setProduct] = useState(null);
    const [state, setState] = useState("update");
    const [searchText, setSearchText] = useState(null);
    const [anchorElExport, setAnchorElExport] = useState(null);
    const [anchorElSort, setAnchorElSort] = useState(null);
    const [anchorElFilter, setAnchorElFilter] = useState(null);
    const [filterObject, setFilterObject] = useState({
        updatedDateFrom: null,
        updatedDateTo: null,
        priceMin: 0,
        priceMax: null,
        categoryID: -1
    });
    const [sort, setSort] = useState({
        sortType: null,
        sortFrom: "descending"
    });
    const openMenuExport = Boolean(anchorElExport);
    const openMenuSort = Boolean(anchorElSort);
    const openFilter = Boolean(anchorElFilter);

    const handleOpen = (item, state) => {
        setOpenModal(true);
        setState(state);
        setProduct(item);
    };

    const handleClose = () => {
        setOpenModal(false);
        setProduct(null);
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const getProducts = async () => {
        setLoading(true);
        await axiosInstance.get("Product/products", {
            params: {
                ...filterObject,
                ...sort,
                searchText,
            }
        }).then((response) => {
            const result = response.data;
            if (result && result.success) {
                toast.success(result.message);
                setProducts(result.data);
            }
            else toast.error(result.message);
        }).catch((error) => console.log(error)).finally(() => setTimeout(() => setLoading(false), 2000));
    }

    useEffect(() => {
        getProducts();
    }, [sort]);

    return (
        <>
            <MainCard title="Danh sách sản phẩm">
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <OutlinedInput
                            id="outlined-adornment-password"
                            startAdornment={<SearchOutlined onClick={getProducts} />}
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
                            placeholder="Tìm sản phẩm..."
                            size="small"
                            onKeyPress={event => {
                                event.key === 'Enter' && getProducts();
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
                                    products.length > 0 ?
                                        (rowsPerPage > 0
                                            ? products.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            : products
                                        ).map((row, index) => (
                                            <TableRow
                                                hover
                                                role="checkbox"
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                tabIndex={-1}
                                                key={row.productID}
                                            >
                                                <TableCell component="th" scope="row" align="center">
                                                    <Link color="secondary" component={RouterLink} to="">
                                                        {index + 1}
                                                    </Link>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Avatar
                                                        sx={{ bgcolor: "orange", borderRadius: 1 }}
                                                        src={getImage(row?.imageURL)}
                                                        className="order-detail avatar"
                                                        id="avatar"
                                                    ></Avatar>
                                                </TableCell>
                                                <TableCell align="left">{row.name}</TableCell>
                                                <TableCell align="right">{formatCurrency(row.price)}</TableCell>
                                                <TableCell align="center">{dateFormatterV1(row.updatedAt)}</TableCell>
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
                                                <Typography variant="subtitle"><i>Không có sản phẩm</i></Typography>
                                            </TableCell>
                                        </TableRow>
                            }
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TablePagination
                                    rowsPerPageOptions={[5, 10, 25, { label: 'Tất cả', value: -1 }]}
                                    colSpan={headCells.length}
                                    count={products.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    labelRowsPerPage="Số lượng sản phẩm mỗi trang:"
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                />
                            </TableRow>
                        </TableFooter>
                    </Table>
                </TableContainer>
            </MainCard>
            <ModalCustom open={openModal} handleClose={handleClose} width={800}>
                {
                    state === "create" ?
                        <ProductCreator resetPage={getProducts} />
                        :
                        <ProductViewer product={product} state={state} resetPage={getProducts} />
                }
            </ModalCustom>
            <ProductFilter
                open={openFilter}
                setAnchorEl={setAnchorElFilter}
                anchorEl={anchorElFilter}
                filterObject={filterObject}
                setFilterObject={setFilterObject}
                onSubmit={getProducts}
            />
            <MenuExport open={openMenuExport} setAnchorEl={setAnchorElExport} anchorEl={anchorElExport} exportObject="product" />
            <MenuSort
                open={openMenuSort}
                setAnchorEl={setAnchorElSort}
                anchorEl={anchorElSort}
                cols={headCells.filter(h => h.id !== "productID" && h.id !== "actions")}
                sort={sort}
                setSort={setSort}
            />
        </>
    )
}

export default Product;