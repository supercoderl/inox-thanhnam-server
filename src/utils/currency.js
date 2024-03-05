export const formatCurrency = (price, local, type) => {
    const defaultValue = "vi-VN";
    const defaultType = "VND";
    if (price) {
        return price.toLocaleString(local || defaultValue, {
            style: 'currency',
            currency: type || defaultType
        });
    }
};