export const checkImageURL = (url) => {
    if (typeof url === "string" && (url.includes("http://") || url.includes("https://"))) return url;
    return "http://localhost:5112/" + url;
}

export const getFirstLetter = (text) => {
    return text && text.length > 0 ? text[0].toUpperCase() : "A";
}

export const getFirstName = (fullname) => {
    if (!fullname && typeof fullname !== "string") return "A";
    var words = fullname.split(" ");
    var firstname = words[words.length - 1];
    return firstname;
}

export const getLastName = (fullname) => {
    if (!fullname && typeof fullname !== "string") return "";
    const words = fullname.split(" ");
    if (words.length === 1) return "";
    const lastName = words.slice(0, words.length - 1).join(" ");
    return lastName;
}

export const getCustomerName = (order, users) => {
    let customerName = "";
    if (!order) return "N/A";
    if (users && users.length > 0) {
        const user = users.find(x => x.userID === order.userID);
        if(user) customerName = user?.lastName || "" + " " + user?.firstname || "";
        else customerName = order?.fullname || "N/A";
    }
    else {
        customerName = order?.fullname || "N/A";
    }
    return customerName;
}

export const getCustomerPhone = (order, users) => {
    let customerPhone = "";
    if (!order) return "N/A";
    if (users && users.length > 0) {
        const user = users.find(x => x.userID === order.userID);
        if(user) customerPhone = user?.phone || "N/A";
        else customerPhone = order?.phone || "N/A";
    }
    else {
        customerPhone = order?.phone || "N/A";
    }
    return customerPhone;
}