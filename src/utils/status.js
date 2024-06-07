export const status = (value) => {
    let result;
    switch (value) {
        case 1:
            result = {
                label: "Đơn hàng mới",
                color: "success"
            };
            break;
        case 2:
            result = {
                label: "Đã xác nhận",
                color: "secondary"
            };
            break;
        case 3:
            result = {
                label: "Đã giao hàng",
                color: "error"
            };
            break;
        default:
            result = {
                label: "Khách chưa đặt",
                color: "warning"
            };
            break;
    }
    return result;
}