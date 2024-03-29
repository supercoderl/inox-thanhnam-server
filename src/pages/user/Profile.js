import { useEffect, useState } from "react";
import { Avatar, Box, Button, FormHelperText, Grid, InputLabel, OutlinedInput, Stack, TextField, Typography } from "../../../node_modules/@mui/material/index"
import { HighlightOutlined } from "@ant-design/icons"
import { HexColorPicker } from "react-colorful";

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';
import axiosInstance from "config/axios";
import { toast } from "react-toastify";
import { getFirstName, getLastName } from "utils/text";

const Profile = () => {
    const [iconColor, setIconColor] = useState("black");
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [profile, setProfile] = useState({
        userID: "",
        username: "",
        fullname: "",
        phone: "",
        isActive: true
    });

    const handleColorChange = (color) => {
        setIconColor(color);
    };

    const getProfile = async () => {
        await axiosInstance.get("User/profile").then((response) => {
            const result = response.data;
            if (!result) return;
            else if (result.success) setProfile({
                userID: result.data?.userID,
                username: result.data?.username,
                fullname: result.data?.lastname + " " + result.data?.firstname,
                phone: result.data?.phone,
                isActive: result.data?.isActive
            });
            else toast.error(result.message);
        }).catch((error) => console.log(error));
    }

    useEffect(() => {
        getProfile();
    }, []);

    const handleSave = async () => {
        const body = {
            userID: profile?.userID,
            username: profile?.username,
            firstname: getFirstName(profile?.fullname),
            lastname: getLastName(profile?.fullname),
            phone: profile?.phone,
            isActive: profile?.isActive,
        }
        await axiosInstance.put(`User/update-user/${profile?.userID}`, body).then((response) => {
            const result = response.data;
            if (!result) return;
            else if (result.success) {
                toast.success(result.message);
                getProfile();
            }
            else toast.error(result.message);
        }).catch((error) => console.log(error));
    }

    return (
        <Box sx={{ flexGrow: 1, px: 6 }}>
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <Box sx={{ borderRadius: "5%", width: "100%", height: "100%" }}>
                        <Box sx={{ bgcolor: `${iconColor}`, height: 120, position: "relative" }}>
                            <Avatar
                                sx={{ width: 24, height: 24, bgcolor: "white", position: "absolute", right: "3%", top: "10%", cursor: "pointer" }}
                                onClick={() => setShowColorPicker(true)}
                            >
                                <HighlightOutlined style={{ fontSize: 12, color: "black" }} />
                            </Avatar>
                            {
                                showColorPicker &&
                                <HexColorPicker
                                    color={iconColor}
                                    onChange={handleColorChange}
                                    onMouseLeave={() => setShowColorPicker(false)}
                                    style={{ float: "inline-end", width: 120, height: 120, borderRadius: "none" }}
                                />
                            }
                            <Avatar
                                alt="Remy Sharp"
                                src="https://media.wired.com/photos/598e35fb99d76447c4eb1f28/master/pass/phonepicutres-TA.jpg"
                                sx={{ width: 100, height: 100, position: "absolute", bottom: "-50%", left: "5%", borderRadius: "15%", border: "3px solid white" }}
                            />
                        </Box>
                        <Box sx={{ bgcolor: "white", pt: 9, px: 3 }}>
                            <Typography variant="h5">Ảnh của bạn</Typography>
                            <Typography variant="caption">Avatar sẽ được hiển thị trên hồ sơ của bạn</Typography>
                            <Box sx={{ d: "flex", py: 2 }}>
                                <Stack spacing={{ xs: 1, sm: 1 }} direction="row" useFlexGap flexWrap="wrap">
                                    <Button variant="outlined">Đổi ảnh</Button>
                                    <Button variant="contained" onClick={handleSave}>Lưu</Button>
                                </Stack>
                            </Box>
                        </Box>
                    </Box>
                </Grid>
                <Grid item xs={4}>
                    <Box sx={{ borderRadius: "5%" }}>
                        <Box sx={{ bgcolor: "white", p: 3 }}>
                            <Typography variant="h5">Đổi mật khẩu</Typography>
                            <Box sx={{ my: 2 }}>
                                <Formik
                                    initialValues={{
                                        newPassword: '',
                                        oldPassword: '',
                                    }}
                                    validationSchema={Yup.object().shape({
                                        newPassword: Yup.string().max(255).min(6, "Mật khẩu phải có từ 6 ký tự").required('Vui lòng điền mật khẩu mới'),
                                        oldPassword: Yup.string().max(255).min(6, "Mật khẩu phải có từ 6 ký tự").required('Vui lòng điền mật khẩu cũ')
                                    })}
                                    onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                                        try {
                                            setStatus({ success: false });
                                            setSubmitting(true);
                                            await axiosInstance.put("Auth/change-password", values).then(async (response) => {
                                                const result = response.data;
                                                if (result && result.success) {
                                                    setStatus({ success: true });
                                                    toast.success(result.message);
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
                                            <Stack spacing={2}>
                                                <Stack spacing={1}>
                                                    <TextField
                                                        label="Mật khẩu mới" variant="outlined"
                                                        id="newpassword-changepassword"
                                                        type="text"
                                                        value={values.newPassword}
                                                        name="newPassword"
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                        fullWidth
                                                        error={Boolean(touched.newPassword && errors.newPassword)}
                                                    />
                                                    {touched.newPassword && errors.newPassword && (
                                                        <FormHelperText error id="standard-weight-helper-text-newpassword-changepassword">
                                                            {errors.newPassword}
                                                        </FormHelperText>
                                                    )}
                                                </Stack>
                                                <Stack spacing={1}>
                                                    <TextField
                                                        label="Mật khẩu cũ" variant="outlined"
                                                        id="oldpassword-changepassword"
                                                        type="text"
                                                        value={values.oldPassword}
                                                        name="oldPassword"
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                        fullWidth
                                                        error={Boolean(touched.oldPassword && errors.oldPassword)}
                                                    />
                                                    {touched.oldPassword && errors.oldPassword && (
                                                        <FormHelperText error id="standard-weight-helper-text-oldpassword-changepassword">
                                                            {errors.oldPassword}
                                                        </FormHelperText>
                                                    )}
                                                </Stack>
                                                <Button disableElevation disabled={isSubmitting} variant="contained" type="submit">Lưu thay đổi</Button>
                                            </Stack>
                                        </form>
                                    )}
                                </Formik>
                            </Box>
                        </Box>
                    </Box>
                </Grid>
                <Grid item xs={6}>
                    <Box sx={{ borderRadius: "5%" }}>
                        <Box sx={{ bgcolor: "white", p: 3 }}>
                            <Typography variant="h5">Thông tin cá nhân</Typography>
                            <Box sx={{ py: 1 }}>
                                <Stack spacing={2}>
                                    <Stack spacing={1}>
                                        <InputLabel htmlFor="fullname-user">Họ và tên</InputLabel>
                                        <OutlinedInput
                                            id="fullname-user"
                                            type="text"
                                            name="fullname"
                                            placeholder="Họ và tên"
                                            value={profile?.fullname}
                                            onChange={(e) => setProfile({ ...profile, fullname: e.target.value })}
                                            fullWidth
                                        />
                                    </Stack>
                                    <Stack spacing={1}>
                                        <InputLabel htmlFor="phone-user">Số điện thoại</InputLabel>
                                        <OutlinedInput
                                            id="phone-user"
                                            type="tel"
                                            name="phone"
                                            placeholder="Số điện thoại"
                                            value={profile?.phone}
                                            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                            fullWidth
                                        />
                                    </Stack>
                                </Stack>
                            </Box>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    )
}

export default Profile