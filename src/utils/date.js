import moment from "../../node_modules/moment/moment"

export const dateFormatterV1 = (date) => {
    return date ? moment(date).format("DD/MM/YYYY") : "N/A";
}

export const dateFormatterV2 = (date, format) => {
    return date ? moment(date).format(format || "DD/MM/YYYY") : "N/A";
}

export const timeAgo = (date) => {
    return date ? moment(new Date(date)).fromNow() : "N/A";
}