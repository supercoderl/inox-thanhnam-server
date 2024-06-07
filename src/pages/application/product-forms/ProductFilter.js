import { useEffect, useState } from "react";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Menu, MenuItem, Select, Slider, TextField, Typography } from "../../../../node_modules/@mui/material/index";
import { MinusOutlined } from "@ant-design/icons";
import axiosInstance from "config/axios";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { dateFormatterV2 } from "utils/date";

const ProductFilter = ({ open, anchorEl, setAnchorEl, filterObject, setFilterObject, onSubmit }) => {
    const [value, setValue] = useState([0, 10000000]);
    const [categories, setCategories] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const minDistance = 100000;

    const handleCancel = () => {
        setOpenDialog(false);
    }

    const handleChange = (event, newValue, activeThumb) => {
        if (!Array.isArray(newValue)) {
            return;
        }

        if (activeThumb === 0) {
            setValue([Math.min(newValue[0], value[1] - minDistance), value[1]]);
            setFilterObject({ ...filterObject, priceMin: Math.min(newValue[0], value[1] - minDistance) });
        } else {
            setValue([value[0], Math.max(newValue[1], value[0] + minDistance)]);
            setFilterObject({ ...filterObject, priceMax: Math.max(newValue[1], value[0] + minDistance) });
        }
    };

    function valuetext(value) {
        return `${value}°C`;
    }

    const getCategories = async () => {
        await axiosInstance.get("Category/categories").then((response) => {
            const result = response.data;
            if (!result) return;
            else if (result.status && result.data) setCategories(result.data);
        }).catch((error) => console.log("Service filter - get categories: ", error));
    }

    useEffect(() => {
        getCategories();
    }, []);

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
                        Thời gian cập nhật
                    </Typography>
                    <Divider />
                    <Box display="flex" gap={1} alignItems="center" py={1.5}>
                        <DatePicker
                            value={dayjs(filterObject.updatedDateFrom || new Date())}
                            onChange={e => setFilterObject({ ...filterObject, updatedDateFrom: dateFormatterV2(e.$d) })}
                        />
                        <MinusOutlined />
                        <DatePicker
                            value={dayjs(filterObject.updatedDateTo || new Date())}
                            onChange={e => setFilterObject({ ...filterObject, updatedDateTo: dateFormatterV2(e.$d) })}
                        />
                    </Box>
                    <Typography variant="subheading">
                        Giá sản phẩm
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
                        Danh mục
                    </Typography>
                    <Divider />
                    <Select
                        id="category-standard"
                        value={filterObject.categoryID}
                        sx={{ width: "100%", my: 1.5 }}
                        onChange={e => {
                            setFilterObject({ ...filterObject, categoryID: e.target.value });
                        }}
                    >
                        <MenuItem value={-1} readOnly>Chọn danh mục</MenuItem>
                        {
                            categories && categories.length > 0 ?
                                categories.map((c, index) => {
                                    return (
                                        <MenuItem key={index} value={c.categoryID}>{c.name}</MenuItem>
                                    )
                                })
                                :
                                null
                        }
                    </Select>
                    <Box display="flex" justifyContent="space-evenly" pt={3}>
                        <Button onClick={() => {
                            setFilterObject({
                                updatedDateFrom: null,
                                updatedDateTo: null,
                                priceMin: 0,
                                priceMax: null,
                                categoryID: -1
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
                        Bạn có chắc chắn muốn xóa bộ lọc không?
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

export default ProductFilter;