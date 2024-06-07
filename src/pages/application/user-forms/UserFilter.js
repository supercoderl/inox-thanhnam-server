import { useState } from "react";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Menu, Slider, TextField, Typography } from "../../../../node_modules/@mui/material/index";
import { MinusOutlined } from "@ant-design/icons";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import moment from "moment";

const UserFilter = ({ open, anchorEl, setAnchorEl, filterObject, setFilterObject, onSubmit }) => {
    const [openDialog, setOpenDialog] = useState(false);
    const [value, setValue] = useState([0, 1000]);
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
            setFilterObject({ ...filterObject, priceMin: Math.min(newValue[0], value[1] - minDistance) });
        } else {
            setValue([value[0], Math.max(newValue[1], value[0] + minDistance)]);
            setFilterObject({ ...filterObject, priceMax: Math.max(newValue[1], value[0] + minDistance) });
        }
    };

    function valuetext(value) {
        return `${value}€`;
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
                        Booking Date
                    </Typography>
                    <Divider />
                    <Box display="flex" gap={1} alignItems="center" py={1.5}>
                        <DatePicker
                            value={moment(filterObject.bookingDateFrom)}
                            onChange={e => setFilterObject({ ...filterObject, bookingDateFrom: e._d })}
                        />
                        <MinusOutlined />
                        <DatePicker
                            value={moment(filterObject.bookingDateTo)}
                            onChange={e => setFilterObject({ ...filterObject, bookingDateTo: e._d })}
                        />
                    </Box>
                    <Typography variant="subheading">
                        Total Price (€)
                    </Typography>
                    <Divider />
                    <Box display="flex" gap={1} alignItems="center" py={1.5}>
                        <TextField label="Min" value={value[0]} variant="outlined" readOnly />
                        <MinusOutlined />
                        <TextField label="Max" value={value[1]} variant="outlined" readOnly />
                    </Box>
                    <Slider
                        getAriaLabel={() => 'Minimum distance'}
                        value={value}
                        onChange={handleChange}
                        valueLabelDisplay="auto"
                        getAriaValueText={valuetext}
                        disableSwap
                        max={1000}
                    />
                    <Box display="flex" justifyContent="space-evenly" pt={3}>
                        <Button onClick={() => {
                            setFilterObject({
                                workingTimeFrom: null,
                                workingTimeTo: null,
                                priceMin: 0,
                                priceMax: null,
                                categoryID: null
                            });
                            setOpenDialog(true);
                        }}>
                            Remove condition
                        </Button>
                        <Button variant="contained" onClick={() => {
                            onSubmit();
                            setAnchorEl(null);
                        }}>
                            Refine your search
                        </Button>
                    </Box>
                </Box>
            </Menu>
            <Dialog
                open={openDialog}
                onClose={handleCancel}
            >
                <DialogTitle>Remove filter</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Your filter will be removed. Are you sure?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancel}>Cancel</Button>
                    <Button onClick={() => {
                        onSubmit();
                        setAnchorEl(null);
                        handleCancel();
                    }}>Accept</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default UserFilter;