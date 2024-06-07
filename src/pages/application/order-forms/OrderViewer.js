import MainCard from "components/MainCard";
import "./css/OrderViewer.css";
import { Typography, Grid, TableContainer, Table, TableBody, TableRow, TableCell, TableFooter, Avatar, Box, Button } from "@mui/material";
import { useLocation } from "react-router-dom";
import CustomTableHead from "components/Table/CustomTableHead";
import { useEffect, useState } from "react";
import { formatCurrency } from "utils/currency";
import axiosInstance from "config/axios";
import { toast } from "react-toastify";
import { getImage } from "utils/image";

const headCells = [
    {
        id: 'product',
        align: 'left',
        disablePadding: true,
        label: 'Sản phẩm'
    },
    {
        id: 'quantity',
        align: 'center',
        disablePadding: true,
        label: 'Số lượng'
    },
    {
        id: 'price',
        align: 'right',
        disablePadding: true,
        label: 'Đơn giá'
    },
    {
        id: 'total',
        align: 'right',
        disablePadding: true,
        label: 'Thành tiền'
    },
];

const OrderViewer = () => {
    const [order, setOrder] = useState(null);
    const [orderItems, setOrderItems] = useState([]);
    const [loading, setLoading] = useState(false);

    const { state } = useLocation();

    useEffect(() => {
        getOrder();
    }, []);

    const getOrder = () => {
        if (state && state.item) {
            setOrder(state.item?.order);
            setOrderItems(state.item?.orderItems || []);
        }
    }

    const submitStatus = async () => {
        setLoading(true);
        const body = {
            orderDate: order?.orderDate,
            orderID: order?.orderID,
            status: 2,
            totalAmount: order?.totalAmount,
            userID: order?.userID,
            sessionID: order?.sessionID,
            fullname: order?.fullname,
            phone: order?.phone,
            address: order?.address
        };
        await axiosInstance.put(`Order/update-order/${order?.orderID}`, body, null).then((response) => {
            const result = response.data;
            if (!result) return;
            else if (result.success) toast.success("Đã xác nhận đơn hàng");
            else toast.error(result.message);
        }).catch((error) => { setLoading(false); console.log(error); }).finally(() => setLoading(false));
    }

    const back = () => {
        window.history.back();
    }

    return (
        <>
            <MainCard title="Chi tiết đơn hàng">
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="h3" gutterBottom>Mã đơn hàng: <span style={{ color: "#69b1ff" }}>#{order?.orderID}</span></Typography>
                    <Box>
                        <Button variant="contained" color="error" onClick={back} sx={{ mr: 1 }}>Quay lại</Button>
                        <Button variant="contained" onClick={submitStatus} disabled={loading}>Xác nhận</Button>
                    </Box>
                </Box>
                <hr />
                <Grid container spacing={2}>
                    <Grid item xs={8}>
                        <TableContainer
                            sx={{
                                width: '100%',
                                overflowX: 'auto',
                                position: 'relative',
                                display: 'block',
                                maxWidth: '100%',
                                '& td, & th': { whiteSpace: 'nowrap' },
                                border: "1px solid rgba(0, 0, 0, 0.1)"
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
                                <CustomTableHead headCells={headCells} />
                                <TableBody>
                                    {
                                        orderItems && orderItems.length > 0 ?
                                            orderItems.map((item, index) => {
                                                return (
                                                    <TableRow
                                                        hover
                                                        role="checkbox"
                                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                        tabIndex={-1}
                                                        key={index}
                                                    >
                                                        <TableCell
                                                            align="left"
                                                            sx={{ display: "flex", gap: 1, alignItems: "center", width: "90%" }}
                                                        >
                                                            <Avatar
                                                                sx={{ bgcolor: "orange", borderRadius: 1 }}
                                                                src={getImage(item?.product?.imageURL)}
                                                                className="order-detail avatar"
                                                                id="avatar"
                                                            >

                                                            </Avatar>
                                                            <Typography
                                                                variant="h5"
                                                                color="rgb(17 92 172)"
                                                                sx={{ textWrap: "wrap" }}
                                                            >
                                                                {item.product?.name}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell align="center" sx={{ width: 100 }}>
                                                            {item.quantity}
                                                        </TableCell>
                                                        <TableCell align="right" sx={{ width: "15%" }}>
                                                            {formatCurrency(item.product?.price || 0)}
                                                        </TableCell>
                                                        <TableCell align="right" sx={{ width: "15%" }}>
                                                            {formatCurrency((item.product?.price || 0) * item?.quantity)}
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            })
                                            :
                                            null
                                    }
                                </TableBody>
                                <TableFooter className="order-detail footer">
                                    <TableRow>
                                        <TableCell colSpan={headCells.length}>
                                            <div className="data">
                                                <span>Trị giá đơn hàng</span>
                                                <span>{formatCurrency(order?.totalAmount)}</span>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell colSpan={headCells.length}>
                                            <div className="data">
                                                <span>Khuyến mãi</span>
                                                <span>{formatCurrency(1.00)}</span>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell colSpan={headCells.length}>
                                            <div className="data">
                                                <span>Phí vận chuyển</span>
                                                <span>{formatCurrency(1.00)}</span>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell colSpan={headCells.length}>
                                            <div className="data">
                                                <Typography variant="h5" sx={{ fontWeight: 'bold', color: "black" }}>Tổng thu</Typography>
                                                <Typography variant="h5" sx={{ fontWeight: 'bold', color: "black" }}>{formatCurrency(order?.totalAmount)}</Typography>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                </TableFooter>
                            </Table>
                        </TableContainer>
                    </Grid>
                    <Grid item xs={4}>
                        <Box sx={{ padding: "20px 10px", border: "1px solid rgba(0, 0, 0, 0.1)" }}>
                            <Typography variant="h4">Thông tin khách hàng</Typography>
                            <hr />
                            <Box sx={{ paddingBlock: 1, display: "grid", gap: 2 }}>
                                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                    <span style={{ fontWeight: 500 }}>Tên khách hàng:</span>
                                    <Typography variant="h6">{order?.fullname || "N/A"}</Typography>
                                </Box>
                                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                    <span style={{ fontWeight: 500 }}>Số điện thoại:</span>
                                    <Typography variant="h6">{order?.phone || "N/A"}</Typography>
                                </Box>
                                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                    <span style={{ fontWeight: 500 }}>Địa chỉ:</span>
                                    <Typography variant="h6" sx={{ maxWidth: 200, overflowWrap: "break-word", textAlign: "right" }}>
                                        {order?.address || "N/A"}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </MainCard >
        </>
    )
}

export default OrderViewer;