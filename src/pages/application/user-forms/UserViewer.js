import * as Yup from 'yup';
import { Formik } from 'formik';
import axiosInstance from 'config/axios';
import { Button, FormHelperText, Grid, InputLabel, OutlinedInput, Stack } from '@mui/material';
import AnimateButton from 'components/@extended/AnimateButton';
import { toast } from 'react-toastify';
import { TabContext, TabList, TabPanel } from '../../../../node_modules/@mui/lab/index';
import { Box, MenuItem, Select, Tab } from '../../../../node_modules/@mui/material/index';
import { useState } from 'react';

const UserViewer = ({ user, state, resetPage }) => {
    const [value, setValue] = useState('1');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <>
            <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList onChange={handleChange}>
                        <Tab label={`Tài khoản: #${user?.userID.substring(0, 8) || 0}`} value="1" />
                    </TabList>
                </Box>
                <TabPanel value="1" sx={{ p: 0.5 }}>
                    <Formik
                        initialValues={{
                            userID: user?.userID || 0,
                            username: user?.username || "",
                            firstname: user?.firstname || "",
                            lastname: user?.lastname || "",
                            phone: user?.phone || 0,
                            status: user?.status || true
                        }}
                        validationSchema={Yup.object().shape({
                            username: Yup.string().required('Tên người dùng không được để trống'),
                        })}
                        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                            try {
                                setStatus({ success: false });
                                setSubmitting(true);
                                if (state === "update") {
                                    await axiosInstance.put(`User/update-user/${values.userID}`, values).then((response) => {
                                        const result = response.data;
                                        if (result && result.success) {
                                            setStatus({ success: true });
                                            toast.success(result.message);
                                            setTimeout(() => {
                                                resetPage();
                                            }, 1600);
                                        }
                                        else toast.error(result.message);
                                    }).catch((error) => console.log(error)).finally(() => setSubmitting(false));
                                }
                                else {
                                    await axiosInstance.delete(`User/delete-user/${values.userID}`, values).then((response) => {
                                        const result = response.data;
                                        if (result && result.success) {
                                            setStatus({ success: true });
                                            toast.success(result.message);
                                            setTimeout(() => {
                                                resetPage();
                                            }, 1600);
                                        }
                                        else toast.error(result.message);
                                    }).catch((error) => console.log(error)).finally(() => setSubmitting(false));
                                }
                            } catch (err) {
                                setStatus({ success: false });
                                setErrors({ submit: err.message });
                                setSubmitting(false);
                            }
                        }}
                    >
                        {({ errors, handleBlur, handleChange, handleSelect, handleSubmit, isSubmitting, touched, values }) => (
                            <form noValidate onSubmit={handleSubmit}>
                                <Grid container spacing={3}>
                                    <Grid item xs={6}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="username-user">Tên người dùng</InputLabel>
                                            <OutlinedInput
                                                id="username-user"
                                                type="text"
                                                value={values.username}
                                                name="username"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                placeholder="Tên người dùng"
                                                fullWidth
                                                error={Boolean(touched.username && errors.username)}
                                            />
                                            {touched.username && errors.username && (
                                                <FormHelperText error id="standard-weight-helper-text-username-user">
                                                    {errors.username}
                                                </FormHelperText>
                                            )}
                                        </Stack>
                                    </Grid>

                                    <Grid item xs={6}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="status-user">Trạng thái</InputLabel>
                                            <Select
                                                id="status-user"
                                                value={values.status}
                                                onChange={handleSelect}
                                            >
                                                <MenuItem value={true}>Kích hoạt</MenuItem>
                                                <MenuItem value={false}>Khóa tài khoản</MenuItem>
                                            </Select>
                                            {touched.status && errors.status && (
                                                <FormHelperText error id="standard-weight-helper-text-status-user">
                                                    {errors.status}
                                                </FormHelperText>
                                            )}
                                        </Stack>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <AnimateButton>
                                            <Button
                                                disableElevation
                                                disabled={isSubmitting}
                                                size="large"
                                                type="submit"
                                                fullWidth
                                                variant="contained"
                                                color={state === "update" ? "primary" : "error"}
                                            >
                                                {state === "update" ? "Cập nhật" : "Xóa tài khoản"}
                                            </Button>
                                        </AnimateButton>
                                    </Grid>
                                </Grid>
                            </form>
                        )
                        }
                    </Formik >
                </TabPanel>
            </TabContext>
        </>
    )
}

export default UserViewer;