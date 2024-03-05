import * as Yup from 'yup';
import { Formik } from 'formik';
import axiosInstance from 'config/axios';
import { Button, FormHelperText, Grid, InputLabel, OutlinedInput, Stack } from '@mui/material';
import AnimateButton from 'components/@extended/AnimateButton';
import { toast } from 'react-toastify';
import { TabContext, TabList, TabPanel } from '../../../../node_modules/@mui/lab/index';
import { Box, Tab } from '../../../../node_modules/@mui/material/index';
import { useState } from 'react';

const ProductViewer = ({ product, state, resetPage }) => {
    const [value, setValue] = useState('1');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <>
            <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList onChange={handleChange}>
                        <Tab label={`Sản phẩm: #${product?.productID || 0}`} value="1" />
                        <Tab label="Hình ảnh" value="2" />
                    </TabList>
                </Box>
                <TabPanel value="1" sx={{ p: 0.5 }}>
                    <Formik
                        initialValues={{
                            productID: product?.productID || "",
                            name: product?.name || "",
                            description: product?.description || "",
                            categoryID: product?.categoryID || null,
                            inventoryID: product?.inventoryID || null,
                            price: product?.price || 0,
                            priority: product?.priority || 0,
                            discountID: product?.discountID || null,
                            material: product?.material || "",
                            dimension: product?.dimension || "",
                            origin: product?.origin || "",
                        }}
                        validationSchema={Yup.object().shape({
                            name: Yup.string().required('Tên sản phẩm không được để trống'),
                            price: Yup.number().required('Giá không được để trống'),
                            material: Yup.string().required('Chất liệu không được để trống'),
                            dimension: Yup.string().required('Kích thước không được để trống'),
                            origin: Yup.string().required('Nguồn gốc không được để trống'),
                        })}
                        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                            try {
                                setStatus({ success: false });
                                setSubmitting(true);
                                if (state === "update") {
                                    await axiosInstance.put(`Product/update-product/${values.productID}`, values).then((response) => {
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
                                    await axiosInstance.delete(`Product/delete-product/${values.productID}`, values).then((response) => {
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
                                            <InputLabel htmlFor="name-product">Tên sản phẩm</InputLabel>
                                            <OutlinedInput
                                                id="name-product"
                                                type="text"
                                                value={values.name}
                                                name="name"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                placeholder="Tên sản phẩm"
                                                fullWidth
                                                error={Boolean(touched.name && errors.name)}
                                            />
                                            {touched.name && errors.name && (
                                                <FormHelperText error id="standard-weight-helper-text-name-product">
                                                    {errors.name}
                                                </FormHelperText>
                                            )}
                                        </Stack>
                                    </Grid>

                                    <Grid item xs={4}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="price-product">Giá bán</InputLabel>
                                            <OutlinedInput
                                                id="price-product"
                                                type="number"
                                                value={values.price}
                                                name="price"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                placeholder="Giá bán"
                                                fullWidth
                                                error={Boolean(touched.price && errors.price)}
                                            />
                                            {touched.price && errors.price && (
                                                <FormHelperText error id="standard-weight-helper-text-price-product">
                                                    {errors.price}
                                                </FormHelperText>
                                            )}
                                        </Stack>
                                    </Grid>

                                    <Grid item xs={4}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="category-product">Phân loại</InputLabel>
                                            <OutlinedInput
                                                id="category-product"
                                                type="text"
                                                value={values.categoryID}
                                                name="category"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                placeholder="Phân loại"
                                                fullWidth
                                                error={Boolean(touched.categoryID && errors.categoryID)}
                                            />
                                            {touched.categoryID && errors.categoryID && (
                                                <FormHelperText error id="standard-weight-helper-text-category-product">
                                                    {errors.categoryID}
                                                </FormHelperText>
                                            )}
                                        </Stack>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="description-product">Mô tả sản phẩm</InputLabel>
                                            <OutlinedInput
                                                id="description-product"
                                                type="text"
                                                value={values.description}
                                                name="description"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                placeholder="Mô tả sản phẩm"
                                                fullWidth
                                                rows={4}
                                                multiline
                                                error={Boolean(touched.description && errors.description)}
                                            />
                                            {touched.description && errors.description && (
                                                <FormHelperText error id="standard-weight-helper-text-description-product">
                                                    {errors.description}
                                                </FormHelperText>
                                            )}
                                        </Stack>
                                    </Grid>

                                    <Grid item xs={4}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="category-product">Tồn kho</InputLabel>
                                            <OutlinedInput
                                                id="inventory-product"
                                                type="text"
                                                value={values.inventoryID}
                                                name="inventory"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                placeholder="Tồn kho"
                                                fullWidth
                                                error={Boolean(touched.inventoryID && errors.inventoryID)}
                                            />
                                            {touched.inventoryID && errors.inventoryID && (
                                                <FormHelperText error id="standard-weight-helper-text-inventory-product">
                                                    {errors.inventoryID}
                                                </FormHelperText>
                                            )}
                                        </Stack>
                                    </Grid>

                                    <Grid item xs={4}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="priority-product">Vị trí</InputLabel>
                                            <OutlinedInput
                                                id="priority-product"
                                                type="text"
                                                value={values.priority}
                                                name="priority"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                placeholder="Vị trí"
                                                fullWidth
                                                error={Boolean(touched.priority && errors.priority)}
                                            />
                                            {touched.priority && errors.priority && (
                                                <FormHelperText error id="standard-weight-helper-text-priority-product">
                                                    {errors.priority}
                                                </FormHelperText>
                                            )}
                                        </Stack>
                                    </Grid>

                                    <Grid item xs={4}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="discount-product">Loại giảm giá</InputLabel>
                                            <OutlinedInput
                                                id="discount-product"
                                                type="text"
                                                value={values.discountID}
                                                name="discount"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                placeholder="Loại giảm giá"
                                                fullWidth
                                                error={Boolean(touched.discountID && errors.discountID)}
                                            />
                                            {touched.discountID && errors.discountID && (
                                                <FormHelperText error id="standard-weight-helper-text-discount-product">
                                                    {errors.discountID}
                                                </FormHelperText>
                                            )}
                                        </Stack>
                                    </Grid>

                                    <Grid item xs={4}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="material-product">Chất liệu</InputLabel>
                                            <OutlinedInput
                                                id="material-product"
                                                type="text"
                                                value={values.material}
                                                name="material"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                placeholder="Chất liệu"
                                                fullWidth
                                                error={Boolean(touched.material && errors.material)}
                                            />
                                            {touched.material && errors.material && (
                                                <FormHelperText error id="standard-weight-helper-text-material-product">
                                                    {errors.material}
                                                </FormHelperText>
                                            )}
                                        </Stack>
                                    </Grid>

                                    <Grid item xs={4}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="dimension-product">Kích thước</InputLabel>
                                            <OutlinedInput
                                                id="dimension-product"
                                                type="text"
                                                value={values.dimension}
                                                name="dimension"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                placeholder="Kích thước"
                                                fullWidth
                                                error={Boolean(touched.dimension && errors.dimension)}
                                            />
                                            {touched.dimension && errors.dimension && (
                                                <FormHelperText error id="standard-weight-helper-text-dimension-product">
                                                    {errors.dimension}
                                                </FormHelperText>
                                            )}
                                        </Stack>
                                    </Grid>

                                    <Grid item xs={4}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="origin-product">Xuất xứ</InputLabel>
                                            <OutlinedInput
                                                id="origin-product"
                                                type="text"
                                                value={values.origin}
                                                name="origin"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                placeholder="Xuất xứ"
                                                fullWidth
                                                error={Boolean(touched.origin && errors.origin)}
                                            />
                                            {touched.origin && errors.origin && (
                                                <FormHelperText error id="standard-weight-helper-text-origin-product">
                                                    {errors.origin}
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
                                                {state === "update" ? "Cập nhật" : "Xóa sản phẩm"}
                                            </Button>
                                        </AnimateButton>
                                    </Grid>
                                </Grid>
                            </form>
                        )
                        }
                    </Formik >
                </TabPanel>
                <TabPanel value="2">Item Two</TabPanel>
            </TabContext>
        </>
    )
}

export default ProductViewer;