import MainCard from "components/MainCard"
import { Box, Button, Grid, IconButton, Link, Table, TableBody, TableCell, TableContainer, TableFooter, TablePagination, TableRow, Tooltip, Typography, } from "../../../node_modules/@mui/material/index";
import { useEffect, useState } from "react";
import { Link as RouterLink } from 'react-router-dom';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import CustomTableHead from "components/Table/CustomTableHead";
import axiosInstance from "config/axios";
import TableRowsLoader from "components/Table/TableRowsSkeleton";
import { toast } from "react-toastify";
import { formatCurrency } from "utils/currency";
import ModalCustom from "components/Modal/Modal";
import ProductViewer from "./product-forms/ProductViewer";
import ProductCreator from "./product-forms/ProductCreator";
import { dateFormatterV1 } from "utils/date";

const headCells = [
    {
        id: 'productID',
        align: 'center',
        disablePadding: false,
        label: 'STT'
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
        await axiosInstance.get("Product/products").then((response) => {
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
    }, []);

    return (
        <>
            <MainCard title="Danh sách sản phẩm">
                <Grid container justifyContent="flex-end">
                    <Button variant="outlined" color="success" onClick={() => handleOpen(null, "create")}>
                        <PlusOutlined/>
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
                                    SelectProps={{
                                        inputProps: {
                                            'aria-label': 'Sản phẩm mỗi trang',
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
            <ModalCustom open={openModal} handleClose={handleClose} width={800}>
                {
                    state === "create" ?
                        <ProductCreator resetPage={getProducts}/>
                        :
                        <ProductViewer product={product} state={state} resetPage={getProducts} />
                }
            </ModalCustom>
        </>
    )
}

export default Product;