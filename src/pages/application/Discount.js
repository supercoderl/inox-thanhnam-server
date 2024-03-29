import MainCard from "components/MainCard"
import { Box, Button, Grid, IconButton, Link, Table, TableBody, TableCell, TableContainer, TableFooter, TablePagination, TableRow, Tooltip, Typography, } from "../../../node_modules/@mui/material/index";
import { useEffect, useState } from "react";
import { Link as RouterLink } from 'react-router-dom';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import CustomTableHead from "components/Table/CustomTableHead";
import axiosInstance from "config/axios";
import TableRowsLoader from "components/Table/TableRowsSkeleton";
import { toast } from "react-toastify";
import DiscountCreator from "./discount-form/DiscountCreator";
import DiscountViewer from "./discount-form/DiscountViewer";
import ModalCustom from "components/Modal/Modal";

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
        disablePadding: true,
        label: 'Tên mã giảm giá'
    },
    {
        id: 'code',
        align: 'left',
        disablePadding: false,
        label: 'Mã giảm giá'
    },
    {
        id: 'percentage',
        align: 'center',
        disablePadding: false,
        label: 'Phần trăm giảm'
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

    const handleOpen = (item, state) => {
        setOpenModal(true);
        setState(state);
        setDiscount(item);
        console.log(discount);
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
        await axiosInstance.get("Discount/discounts").then((response) => {
            const result = response.data;
            if (result && result.success) {
                toast.success(result.message);
                setDiscounts(result.data);
            }
            else toast.error(result.message);
        }).catch((error) => console.log(error)).finally(() => setTimeout(() => setLoading(false), 2000));
    }

    useEffect(() => {
        getDiscounts();
    }, []);

    return (
        <>
            <MainCard title="Danh sách mã giảm giá">
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
                                            <TableCell align="center">{row.percentage}</TableCell>
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
                                    count={discounts.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    SelectProps={{
                                        inputProps: {
                                            'aria-label': 'Mã giảm giá mỗi trang',
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
            <ModalCustom open={openModal} handleClose={handleClose} width={400}>
                {
                    state === "create" ?
                        <DiscountCreator resetPage={getDiscounts} />
                        :
                        <DiscountViewer discount={discount} state={state} resetPage={getDiscounts} />
                }
            </ModalCustom>
        </>
    )
}

export default Discount;