import * as Yup from 'yup';
import { Formik } from 'formik';
import axiosInstance from 'config/axios';
import { Button, FormHelperText, Grid, InputLabel, OutlinedInput, Stack } from '@mui/material';
import AnimateButton from 'components/@extended/AnimateButton';
import { toast } from 'react-toastify';
import { TabContext, TabList, TabPanel } from '../../../../node_modules/@mui/lab/index';
import { Box, Tab } from '../../../../node_modules/@mui/material/index';
import { useState } from 'react';

const CustomerViewer = ({ customer, state, resetPage }) => {
    const [value, setValue] = useState('1');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <>
            <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList onChange={handleChange}>
                        <Tab label={`Khách hàng: #${customer?.userID.substring(0, 8) || 0}`} value="1" />
                    </TabList>
                </Box>
                <TabPanel value="1" sx={{ p: 0.5 }}>
                    <Formik
                        initialValues={{
                            userID: customer?.userID || "",
                            firstname: customer?.firstname || "",
                            lastname: customer?.lastname || "",
                            phone: customer?.phone || 0,
                            address: customer?.userAddress?.address || "",
                            cityID: customer?.userAddress?.cityID || 0,
                            districtID: customer?.userAddress?.districtID || 0,
                            wardID: customer?.userAddress?.wardID || 0,
                        }}
                        validationSchema={Yup.object().shape({
                            firstname: Yup.string().required('Tên khách hàng không được để trống'),
                            lastname: Yup.string().required('Họ khách hàng không được để trống'),
                            phone: Yup.number().required('Số điện thoại không được để trống'),
                            address: Yup.string().required('Địa chỉ không được để trống'),
                        })}
                        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                            try {
                                setStatus({ success: false });
                                setSubmitting(true);
                                if (state === "update") {
                                    const userObject = {
                                        userID: values.userID,
                                        username: customer?.username,
                                        firstname: values.firstname,
                                        lastname: values.lastname,
                                        phone: values.phone,
                                        isActive: customer?.isActive || 1
                                    };

                                    await axiosInstance.put(`User/update-user/${values.userID}`, userObject).then(async (response) => {
                                        const result = response.data;
                                        if (result && result.success) {
                                            if (customer?.userAddress) {
                                                const addressObject = {
                                                    addressID: customer?.userAddress?.addressID,
                                                    userID: values.userID,
                                                    address: values.address,
                                                    cityID: values.cityID,
                                                    districtID: values.districtID,
                                                    wardID: values.wardID
                                                };
                                                await axiosInstance.put(`UserAddress/update-address/${customer?.userAddress?.addressID}`, addressObject).then((addressResponse) => {
                                                    const addressResult = addressResponse.data;
                                                    if (addressResult && addressResult.success) {
                                                        setStatus({ success: true });
                                                        toast.success(addressResult.message);
                                                        setTimeout(() => {
                                                            resetPage();
                                                        }, 1600);
                                                    }
                                                    else toast.error(addressResult.message);
                                                }).catch((addressError) => console.log(addressError));
                                            }
                                            else toast.success(result.message);
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
                        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                            <form noValidate onSubmit={handleSubmit}>
                                <Grid container spacing={3}>
                                    <Grid item xs={4}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="firstname-customer">Tên</InputLabel>
                                            <OutlinedInput
                                                id="firstname-customer"
                                                type="text"
                                                value={values.firstname}
                                                name="firstname"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                placeholder="Tên"
                                                fullWidth
                                                error={Boolean(touched.firstname && errors.firstname)}
                                            />
                                            {touched.firstname && errors.firstname && (
                                                <FormHelperText error id="standard-weight-helper-text-firstname-customer">
                                                    {errors.firstname}
                                                </FormHelperText>
                                            )}
                                        </Stack>
                                    </Grid>

                                    <Grid item xs={4}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="lastname-customer">Họ</InputLabel>
                                            <OutlinedInput
                                                id="lastname-customer"
                                                type="text"
                                                value={values.lastname}
                                                name="lastname"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                placeholder="Họ"
                                                fullWidth
                                                error={Boolean(touched.lastname && errors.lastname)}
                                            />
                                            {touched.lastname && errors.lastname && (
                                                <FormHelperText error id="standard-weight-helper-text-lastname-customer">
                                                    {errors.lastname}
                                                </FormHelperText>
                                            )}
                                        </Stack>
                                    </Grid>

                                    <Grid item xs={4}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="phone-customer">Số điện thoại</InputLabel>
                                            <OutlinedInput
                                                id="phone-customer"
                                                type="tel"
                                                value={values.phone}
                                                name="phone"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                placeholder="Số điện thoại"
                                                fullWidth
                                                error={Boolean(touched.phone && errors.phone)}
                                            />
                                            {touched.phone && errors.phone && (
                                                <FormHelperText error id="standard-weight-helper-text-phone-customer">
                                                    {errors.phone}
                                                </FormHelperText>
                                            )}
                                        </Stack>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="address-customer">Địa chỉ</InputLabel>
                                            <OutlinedInput
                                                id="address-customer"
                                                type="text"
                                                value={values.address}
                                                name="address"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                placeholder="Địa chỉ"
                                                fullWidth
                                                rows={4}
                                                multiline
                                                error={Boolean(touched.address && errors.address)}
                                            />
                                            {touched.address && errors.address && (
                                                <FormHelperText error id="standard-weight-helper-text-address-customer">
                                                    {errors.address}
                                                </FormHelperText>
                                            )}
                                        </Stack>
                                    </Grid>

                                    <Grid item xs={4}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="city-customer">Thành phố</InputLabel>
                                            <OutlinedInput
                                                id="city-customer"
                                                type="text"
                                                value={values.cityID}
                                                name="city"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                placeholder="Thành phố"
                                                fullWidth
                                                error={Boolean(touched.cityID && errors.cityID)}
                                            />
                                            {touched.cityID && errors.cityID && (
                                                <FormHelperText error id="standard-weight-helper-text-city-customer">
                                                    {errors.cityID}
                                                </FormHelperText>
                                            )}
                                        </Stack>
                                    </Grid>

                                    <Grid item xs={4}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="district-customer">Quận, huyện</InputLabel>
                                            <OutlinedInput
                                                id="district-customer"
                                                type="text"
                                                value={values.districtID}
                                                name="district"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                placeholder="Quận, huyện"
                                                fullWidth
                                                error={Boolean(touched.districtID && errors.districtID)}
                                            />
                                            {touched.districtID && errors.districtID && (
                                                <FormHelperText error id="standard-weight-helper-text-district-customer">
                                                    {errors.districtID}
                                                </FormHelperText>
                                            )}
                                        </Stack>
                                    </Grid>

                                    <Grid item xs={4}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="ward-customer">Phường, xã</InputLabel>
                                            <OutlinedInput
                                                id="ward-customer"
                                                type="text"
                                                value={values.wardID}
                                                name="ward"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                placeholder="Phường, xã"
                                                fullWidth
                                                error={Boolean(touched.wardID && errors.wardID)}
                                            />
                                            {touched.wardID && errors.wardID && (
                                                <FormHelperText error id="standard-weight-helper-text-ward-customer">
                                                    {errors.wardID}
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
                                                {state === "update" ? "Cập nhật" : "Xóa khách hàng"}
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

export default CustomerViewer;