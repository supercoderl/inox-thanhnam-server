import MainCard from "components/MainCard";
import "./css/OrderViewer.css";
import { Typography, Grid, TableContainer, Table, TableBody, TableRow, TableCell, TableFooter, Avatar, Box, Button } from "@mui/material";
import { useParams } from "react-router-dom";
import CustomTableHead from "components/Table/CustomTableHead";
import { useEffect, useState } from "react";
import { formatCurrency } from "utils/currency";
import axiosInstance from "config/axios";
import { noImageProduct } from "config";
import { toast } from "react-toastify";

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
    const [order] = useState('asc');
    const [orderBy] = useState('');
    const [orderInfo, setOrderInfo] = useState(null);
    const [orderItemInfos, setOrderItemInfos] = useState([]);
    const [loading, setLoading] = useState(false);

    const param = useParams();

    useEffect(() => {
        getOrder();
    }, []);

    const getProductImage = async (productID) => {
        return await axiosInstance.get(`ProductImage/images/${productID}`).then((response) => {
            const result = response.data;
            if (!result) return null;
            else if (result.success) return result;
            return null;
        }).catch((error) => { console.log("Get Image: ", error); return null; });
    }

    const getProductInfo = async (productID) => {
        return await axiosInstance.get(`Product/get-product-by-id/${productID}`).then((response) => {
            const result = response.data;
            if (!result) return null;
            else if (result.success) return result;
            // else toast.error(result.message);
        }).catch((error) => { console.log("Get Product: ", error); return null; });
    }

    const getImageURL = (orderItemID) => {
        if (orderItemInfos && orderItemInfos.length > 0) {
            const orderItem = orderItemInfos.find(x => x.orderItemID === orderItemID);
            return orderItem && orderItem?.image ? orderItem.image.imageURL : "N/A";
        }
        return "N/A";
    }

    const getProduct = (orderItemID) => {
        if (orderItemInfos && orderItemInfos.length > 0) {
            const orderItem = orderItemInfos.find(x => x.orderItemID === orderItemID);
            return orderItem && orderItem?.product ? orderItem.product : null;
        }
        return null;
    }

    const getOrder = async () => {
        setLoading(true);
        await axiosInstance.get(`Order/get-order-by-id/${param?.orderID}`).then((response) => {
            const result = response.data;
            if (!result) return;
            else if (result.success) {
                setOrderInfo(result.data);
                result.data && result.data.orderItems && result.data.orderItems.length ?
                    result.data.orderItems.map(async e => {
                        const image = await getProductImage(e.productID);
                        const product = await getProductInfo(e.productID);
                        if (image && product) {
                            if (orderItemInfos.length === 0)
                                setOrderItemInfos(prev => [
                                    ...prev,
                                    { orderItemID: e.orderItemID, image: image.data[0], product: product.data }
                                ]);
                            else {
                                if (!orderItemInfos.some(x => x.orderItemID === e.orderItemID))
                                    setOrderItemInfos(prev => [
                                        ...prev,
                                        { orderItemID: e.orderItemID, image: image.data[0], product: product.data }
                                    ]);
                            }
                        }
                        else if (product) {
                            if (orderItemInfos.length === 0)
                                setOrderItemInfos(prev => [
                                    ...prev,
                                    { orderItemID: e.orderItemID, image: { imageURL: noImageProduct }, product: product.data }
                                ]);
                            else {
                                if (!orderItemInfos.some(x => x.orderItemID === e.orderItemID))
                                    setOrderItemInfos(prev => [
                                        ...prev,
                                        { orderItemID: e.orderItemID, image: { imageURL: noImageProduct }, product: product.data }
                                    ]);
                            }
                        }
                    }) : null;
            }
        }).catch((error) => console.log(error)).finally(() => setTimeout(() => setLoading(false), 2000));
    };

    const submitStatus = async () => {
        setLoading(true);
        const body = {
            orderDate: orderInfo?.order.orderDate,
            orderID: orderInfo?.order.orderID,
            status: 3,
            totalAmount: orderInfo?.order.totalAmount,
            userID: orderInfo?.order.userID,
            fullname: orderInfo?.order.fullname,
            phone: orderInfo?.order.phone,
            address: orderInfo?.order.address
        };
        await axiosInstance.put(`Order/update-order/${orderInfo?.order.orderID}`, body, null).then((response) => {
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
                    <Typography variant="h3" gutterBottom>Mã đơn hàng: <span style={{ color: "#69b1ff" }}>#{param.orderID}</span></Typography>
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
                                <CustomTableHead headCells={headCells} order={order} orderBy={orderBy} />
                                <TableBody>
                                    {
                                        orderInfo && orderInfo.orderItems && orderInfo.orderItems.length > 0 ?
                                            orderInfo.orderItems.map((item, index) => {
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
                                                                src={getImageURL(item.orderItemID)}
                                                                className="order-detail avatar"
                                                                id="avatar"
                                                            >

                                                            </Avatar>
                                                            <Typography
                                                                variant="h5"
                                                                color="rgb(17 92 172)"
                                                                sx={{ textWrap: "wrap" }}
                                                            >
                                                                {getProduct(item.orderItemID)?.name}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell align="center" sx={{ width: 100 }}>
                                                            {item.quantity}
                                                        </TableCell>
                                                        <TableCell align="right" sx={{ width: "15%" }}>
                                                            {formatCurrency(getProduct(item.orderItemID)?.price || 0)}
                                                        </TableCell>
                                                        <TableCell align="right" sx={{ width: "15%" }}>
                                                            {formatCurrency((getProduct(item.orderItemID)?.price || 0) * item.quantity)}
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
                                                <span>{formatCurrency(orderInfo?.totalAmount)}</span>
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
                                                <Typography variant="h5" sx={{ fontWeight: 'bold', color: "black" }}>{formatCurrency(orderInfo?.totalAmount)}</Typography>
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
                                    <Typography variant="h6">{orderInfo?.fullname || "N/A"}</Typography>
                                </Box>
                                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                    <span style={{ fontWeight: 500 }}>Số điện thoại:</span>
                                    <Typography variant="h6">{orderInfo?.phone || "N/A"}</Typography>
                                </Box>
                                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                    <span style={{ fontWeight: 500 }}>Địa chỉ:</span>
                                    <Typography variant="h6" sx={{ maxWidth: 200, overflowWrap: "break-word", textAlign: "right" }}>
                                        {orderInfo?.address || "N/A"}
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