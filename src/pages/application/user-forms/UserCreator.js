import * as Yup from 'yup';
import { Formik } from 'formik';
import axiosInstance from 'config/axios';
import { Button, FormHelperText, Grid, InputLabel, OutlinedInput, Stack } from '@mui/material';
import AnimateButton from 'components/@extended/AnimateButton';
import { v4 as uuid } from 'uuid';
import { toast } from 'react-toastify';

const UserCreator = ({ resetPage }) => {
    return (
        <Formik
            initialValues={{
                userID: uuid(),
                username: "",
                password: "123456",
                firstname: "",
                lastname: "",
                phone: "",
            }}
            validationSchema={Yup.object().shape({
                username: Yup.string().required('Tên người dùng không được để trống'),
                phone: Yup.number().required('Số điện thoại không được để trống'),
                password: Yup.string().required('Mật khẩu không được để trống'),
                firstname: Yup.string().required('Tên không được để trống'),
                lastname: Yup.string().required('Họ không được để trống'),
            })}
            onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                try {
                    setStatus({ success: false });
                    setSubmitting(true);
                    await axiosInstance.post(`Auth/register`, values).then((response) => {
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
                                <InputLabel htmlFor="password-user">Mật khẩu</InputLabel>
                                <OutlinedInput
                                    id="password-user"
                                    type="text"
                                    value={values.password}
                                    name="password"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    placeholder="Mật khẩu"
                                    fullWidth
                                    error={Boolean(touched.password && errors.password)}
                                />
                                {touched.password && errors.password && (
                                    <FormHelperText error id="standard-weight-helper-text-password-user">
                                        {errors.password}
                                    </FormHelperText>
                                )}
                            </Stack>
                        </Grid>

                        <Grid item xs={6}>
                            <Stack spacing={1}>
                                <InputLabel htmlFor="firstname-user">Tên</InputLabel>
                                <OutlinedInput
                                    id="firstname-user"
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
                                    <FormHelperText error id="standard-weight-helper-text-firstname-user">
                                        {errors.firstname}
                                    </FormHelperText>
                                )}
                            </Stack>
                        </Grid>

                        <Grid item xs={6}>
                            <Stack spacing={1}>
                                <InputLabel htmlFor="lastname-user">Họ</InputLabel>
                                <OutlinedInput
                                    id="lastname-user"
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
                                    <FormHelperText error id="standard-weight-helper-text-lastname-user">
                                        {errors.lastname}
                                    </FormHelperText>
                                )}
                            </Stack>
                        </Grid>

                        <Grid item xs={6}>
                            <Stack spacing={1}>
                                <InputLabel htmlFor="phone-user">Số điện thoại</InputLabel>
                                <OutlinedInput
                                    id="phone-user"
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
                                    <FormHelperText error id="standard-weight-helper-text-phone-user">
                                        {errors.phone}
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

export default UserCreator;