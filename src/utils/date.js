import moment from "../../node_modules/moment/moment"

export const dateFormatterV1 = (date) => {
    return date ? moment(date).format("DD/MM/YYYY") : "N/A";
}