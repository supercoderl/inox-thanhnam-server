import * as Yup from 'yup';
import { Formik } from 'formik';
import axiosInstance from 'config/axios';
import { Button, FormHelperText, Grid, InputLabel, OutlinedInput, Stack, } from '@mui/material';
import AnimateButton from 'components/@extended/AnimateButton';
import { toast } from 'react-toastify';

const DiscountCreator = ({ resetPage }) => {
    return (
        <Formik
            initialValues={{
                name: "",
                code: "",
                percentage: 0,
            }}
            validationSchema={Yup.object().shape({
                name: Yup.string().required('Tên mã giảm giá không được để trống'),
                code: Yup.string().required('Mã giảm giác không được để trống'),
                percentage: Yup.number().required('Phần trăm giảm không được để trống'),
            })}
            onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                try {
                    setStatus({ success: false });
                    setSubmitting(true);
                    await axiosInstance.post(`Discount/create-discount`, values).then((response) => {
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
                        <Grid item xs={12}>
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

                        <Grid item xs={12}>
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

                        <Grid item xs={12}>
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

                        <Grid item xs={12}>
                            <AnimateButton>
                                <Button
                                    disableElevation
                                    disabled={isSubmitting}
                                    size="large"
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                >
                                    Tạo mới
                                </Button>
                            </AnimateButton>
                        </Grid>
                    </Grid>
                </form>
            )
            }
        </Formik >
    )
}

export default DiscountCreator;