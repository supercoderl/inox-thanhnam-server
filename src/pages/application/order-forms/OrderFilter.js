import { useState } from "react";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Menu, MenuItem, Select, Slider, TextField, Typography } from "../../../../node_modules/@mui/material/index";
import { MinusOutlined } from "@ant-design/icons";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { dateFormatterV2 } from "utils/date";
import dayjs from "dayjs";

const OrderFilter = ({ open, anchorEl, setAnchorEl, filterObject, setFilterObject, onSubmit }) => {
    const [value, setValue] = useState([0, 10000000]);
    const [openDialog, setOpenDialog] = useState(false);
    const minDistance = 10;

    const handleCancel = () => {
        setOpenDialog(false);
    }

    const handleChange = (event, newValue, activeThumb) => {
        if (!Array.isArray(newValue)) {
            return;
        }

        if (activeThumb === 0) {
            setValue([Math.min(newValue[0], value[1] - minDistance), value[1]]);
            setFilterObject({ ...filterObject, totalMin: Math.min(newValue[0], value[1] - minDistance) });
        } else {
            setValue([value[0], Math.max(newValue[1], value[0] + minDistance)]);
            setFilterObject({ ...filterObject, totalMax: Math.max(newValue[1], value[0] + minDistance) });
        }
    };

    function valuetext(value) {
        return `${value}°C`;
    }

    return (
        <>
            <Menu
                id="menu-filter"
                anchorEl={anchorEl}
                open={open}
                onClose={() => setAnchorEl(null)}
            >
                <Box sx={{ width: 400, padding: 2 }}>
                    <Typography variant="subheading">
                        Ngày đặt hàng
                    </Typography>
                    <Divider />
                    <Box display="flex" gap={1} alignItems="center" py={1.5}>
                        <DatePicker
                            value={dayjs(filterObject.orderDateTo || new Date())}
                            onChange={e => setFilterObject({ ...filterObject, orderDateFrom: dateFormatterV2(e.$d) })}
                        />
                        <MinusOutlined />
                        <DatePicker
                            value={dayjs(filterObject.orderDateTo || new Date())}
                            onChange={e => setFilterObject({ ...filterObject, orderDateTo: dateFormatterV2(e.$d) })}
                        />
                    </Box>
                    <Typography variant="subheading">
                        Tổng tiền
                    </Typography>
                    <Divider />
                    <Box display="flex" gap={1} alignItems="center" py={1.5}>
                        <TextField label="Thấp nhất" value={value[0]} variant="outlined" readOnly />
                        <MinusOutlined />
                        <TextField label="Cao nhất" value={value[1]} variant="outlined" readOnly />
                    </Box>
                    <Slider
                        getAriaLabel={() => 'Minimum distance'}
                        value={value}
                        onChange={handleChange}
                        valueLabelDisplay="auto"
                        getAriaValueText={valuetext}
                        disableSwap
                        max={10000000}
                    />
                    <Typography variant="subheading">
                        Trạng thái
                    </Typography>
                    <Divider />
                    <Select
                        id="status-standard"
                        value={filterObject.status}
                        sx={{ width: "100%", my: 1.5 }}
                        onChange={e => {
                            setFilterObject({ ...filterObject, status: e.target.value });
                        }}
                    >
                        <MenuItem value={-1} readOnly>Chọn trạng thái</MenuItem>
                        <MenuItem value={0}>Khách chưa đặt</MenuItem>
                        <MenuItem value={1}>Đơn hàng mới</MenuItem>
                        <MenuItem value={2}>Đã xác nhận</MenuItem>
                        <MenuItem value={3}>Đã giao hàng</MenuItem>
                    </Select>
                    <Box display="flex" justifyContent="space-evenly" pt={3}>
                        <Button onClick={() => {
                            setOpenDialog(true);
                            setFilterObject({
                                orderDateFrom: null,
                                orderDateTo: null,
                                totalMin: 0,
                                totalMax: null,
                                status: -1
                            })
                        }}>
                            Xóa bộ lọc
                        </Button>
                        <Button variant="contained" onClick={() => {
                            onSubmit();
                            setAnchorEl(null);
                        }}>
                            Hoàn thành lọc
                        </Button>
                    </Box>
                </Box>
            </Menu>
            <Dialog
                open={openDialog}
                onClose={handleCancel}
            >
                <DialogTitle>Xóa bộ lọc</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Bạn có chắc chắn muốn xóa bộ lọc không
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancel}>Hủy bỏ</Button>
                    <Button onClick={() => {
                        onSubmit();
                        setAnchorEl(null);
                        handleCancel();
                    }}>Chấp nhận</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default OrderFilter;