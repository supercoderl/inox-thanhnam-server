import { useState } from "react";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Menu, MenuItem, OutlinedInput, Select, Slider, TextField, Typography } from "../../../../node_modules/@mui/material/index";
import { MinusOutlined } from "@ant-design/icons";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { dateFormatterV2 } from "utils/date";

const DiscountFilter = ({ open, anchorEl, setAnchorEl, filterObject, setFilterObject, onSubmit }) => {
    const [value, setValue] = useState([0, 100]);
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
            setFilterObject({ ...filterObject, percentageMin: Math.min(newValue[0], value[1] - minDistance) });
        } else {
            setValue([value[0], Math.max(newValue[1], value[0] + minDistance)]);
            setFilterObject({ ...filterObject, percentageMax: Math.max(newValue[1], value[0] + minDistance) });
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
                        Ngày hết hạn
                    </Typography>
                    <Divider />
                    <Box py={1.5}>
                        <DatePicker
                            sx={{ width: "100%" }}
                            onChange={e => setFilterObject({ ...filterObject, dateExpire: dateFormatterV2(e.$d) })}
                        />
                    </Box>
                    <Typography variant="subheading">
                        Số lượng giới hạn khoảng
                    </Typography>
                    <Divider />
                    <Box py={1.5}>
                        <OutlinedInput
                            fullWidth
                            id="limitedQuantity"
                            type="number"
                            value={filterObject.limitedQuantity}
                            placeholder="Nhập số lượng"
                            name="limitedQuantity"
                            onChange={(e) => setFilterObject({ ...filterObject, limitedQuantity: e.target.value })}
                        />
                    </Box>
                    <Typography variant="subheading">
                        Theo phần trăm
                    </Typography>
                    <Divider />
                    <Box display="flex" gap={1} alignItems="center" py={1.5}>
                        <TextField label="% thấp nhất" value={value[0]} variant="outlined" readOnly />
                        <MinusOutlined />
                        <TextField label="% cao nhất" value={value[1]} variant="outlined" readOnly />
                    </Box>
                    <Slider
                        getAriaLabel={() => 'Minimum distance'}
                        value={value}
                        onChange={handleChange}
                        valueLabelDisplay="auto"
                        getAriaValueText={valuetext}
                        disableSwap
                        max={100}
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
                        <MenuItem value={-1} readOnly hidden>Chọn trạng thái</MenuItem>
                        <MenuItem value={0}>Bị khóa</MenuItem>
                        <MenuItem value={1}>Kích hoạt</MenuItem>
                    </Select>
                    <Box display="flex" justifyContent="space-evenly" pt={3}>
                        <Button onClick={() => {
                            setFilterObject({
                                percentageMin: 0,
                                percentageMax: null,
                                limitedQuantity: null,
                                dateExpire: null,
                                status: -1
                            });
                            setOpenDialog(true);
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
                        Bạn chắc chắn muốn xóa bộ này này không?
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

export default DiscountFilter;