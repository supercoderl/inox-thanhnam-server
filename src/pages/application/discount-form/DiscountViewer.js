import * as Yup from 'yup';
import { Formik } from 'formik';
import axiosInstance from 'config/axios';
import { Button, FormHelperText, Grid, InputLabel, OutlinedInput, Stack, Select, MenuItem, } from '@mui/material';
import AnimateButton from 'components/@extended/AnimateButton';
import { toast } from 'react-toastify';
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const DiscountViewer = ({ discount, state, resetPage }) => {
    return (
        <>
            <Formik
                initialValues={{
                    discountID: discount?.discountID || 0,
                    name: discount?.name || "",
                    code: discount?.code || "",
                    percentage: discount?.percentage || 0,
                    active: discount?.active || false,
                    priority: discount?.priority || 0,
                    dateExpire: discount?.dateExpire || new Date(),
                    limitedQuantity: discount?.limitedQuantity || 0
                }}
                validationSchema={Yup.object().shape({
                    name: Yup.string().required('Tên mã giảm giá không được để trống'),
                    code: Yup.string().required('Mã giảm giá không được để trống'),
                    percentage: Yup.number().required('Phần trăm giảm không được để trống'),
                })}
                onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                    try {
                        setStatus({ success: false });
                        setSubmitting(true);
                        if (state === "update") {
                            const discountObject = {
                                discountID: values.discountID,
                                name: values.name,
                                code: values.code,
                                percentage: values.percentage,
                                active: values.active,
                                priority: values.priority
                            };

                            await axiosInstance.put(`Discount/update-discount/${values.discountID}`, discountObject).then(async (response) => {
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
                            await axiosInstance.delete(`Discount/delete-discount/${values.discountID}`, values).then((response) => {
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
                            <Grid item xs={6}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="name-discount">Tên mã giảm giá</InputLabel>
                                    <OutlinedInput
                                        id="name-discount"
                                        type="text"
                                        value={values.name}
                                        name="name"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        placeholder="Tên mã giảm giá"
                                        fullWidth
                                        error={Boolean(touched.name && errors.name)}
                                    />
                                    {touched.name && errors.name && (
                                        <FormHelperText error id="standard-weight-helper-text-name-discount">
                                            {errors.name}
                                        </FormHelperText>
                                    )}
                                </Stack>
                            </Grid>

                            <Grid item xs={6}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="code-discount">Mã giảm giá</InputLabel>
                                    <OutlinedInput
                                        id="code-discount"
                                        type="text"
                                        value={values.code}
                                        name="code"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        placeholder="Mã giảm giá"
                                        fullWidth
                                        error={Boolean(touched.code && errors.code)}
                                    />
                                    {touched.code && errors.code && (
                                        <FormHelperText error id="standard-weight-helper-text-code-discount">
                                            {errors.code}
                                        </FormHelperText>
                                    )}
                                </Stack>
                            </Grid>

                            <Grid item xs={6}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="percentage-discount">Phần trăm giảm</InputLabel>
                                    <OutlinedInput
                                        id="percentage-discount"
                                        type="number"
                                        value={values.percentage}
                                        name="percentage"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        placeholder="Phần trăm giảm"
                                        fullWidth
                                        error={Boolean(touched.percentage && errors.percentage)}
                                    />
                                    {touched.percentage && errors.percentage && (
                                        <FormHelperText error id="standard-weight-helper-text-percentage-discount">
                                            {errors.percentage}
                                        </FormHelperText>
                                    )}
                                </Stack>
                            </Grid>

                            <Grid item xs={6}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="active-discount">Trạng thái</InputLabel>
                                    <Select
                                        labelId="active-discount"
                                        id="active-discount"
                                        value={values.active}
                                        onBlur={handleBlur}
                                        name="active"
                                        onChange={handleChange}
                                        placeholder="Trạng thái"
                                        fullWidth
                                        error={Boolean(touched.active && errors.active)}
                                    >
                                        <MenuItem value={true}>Hoạt động</MenuItem>
                                        <MenuItem value={false}>Tạm khóa</MenuItem>
                                    </Select>
                                    {touched.active && errors.active && (
                                        <FormHelperText error id="standard-weight-helper-text-active-discount">
                                            {errors.active}
                                        </FormHelperText>
                                    )}
                                </Stack>
                            </Grid>

                            <Grid item xs={6}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="priority-discount">Vị trí</InputLabel>
                                    <OutlinedInput
                                        id="priority-discount"
                                        type="number"
                                        value={values.priority}
                                        name="priority"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        placeholder="Vị trí"
                                        fullWidth
                                        error={Boolean(touched.priority && errors.priority)}
                                    />
                                    {touched.priority && errors.priority && (
                                        <FormHelperText error id="standard-weight-helper-text-priority-discount">
                                            {errors.priority}
                                        </FormHelperText>
                                    )}
                                </Stack>
                            </Grid>

                            <Grid item xs={6}>
                            <Stack spacing={1}>
                                <InputLabel htmlFor="date-expire-discount">Ngày hết hạn</InputLabel>
                                <DatePicker
                                    onChange={(e) => setFieldValue("dateExpire", e._d)}
                                />
                                {touched.dateExpire && errors.dateExpire && (
                                    <FormHelperText error id="standard-weight-helper-text-date-expire-discount">
                                        {errors.dateExpire}
                                    </FormHelperText>
                                )}
                            </Stack>
                        </Grid>

                        <Grid item xs={6}>
                            <Stack spacing={1}>
                                <InputLabel htmlFor="limited-quantity-discount">Số lượng tối thiểu</InputLabel>
                                <OutlinedInput
                                    id="limited-quantity-discount"
                                    type="number"
                                    value={values.limitedQuantity}
                                    name="limitedQuantity"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    placeholder="Số lượng tối thiểu"
                                    fullWidth
                                    error={Boolean(touched.limitedQuantity && errors.limitedQuantity)}
                                />
                                {touched.limitedQuantity && errors.limitedQuantity && (
                                    <FormHelperText error id="standard-weight-helper-text-limited-quantity-discount">
                                        {errors.limitedQuantity}
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
        </>
    )
}

export default DiscountViewer;