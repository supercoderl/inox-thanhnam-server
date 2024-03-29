import { getFirstLetter, getFirstName } from "utils/text"
import { Avatar, ListItem, ListItemAvatar, ListItemButton, ListItemText } from "../../../../node_modules/@mui/material/index"
import { timeAgo } from "utils/date"
import { stringAvatar } from "themes/theme/color";

export const MessageItem = (props) => {
    const { handleOpenMessage, email, data } = props;

    return (
        <ListItemButton sx={{ p: 0 }} onClick={() => handleOpenMessage(data)}>
            <ListItem>
                <ListItemAvatar>
                    <Avatar {...stringAvatar(getFirstLetter(getFirstName(data[0]?.fullname)))} />
                </ListItemAvatar>
                <ListItemText primary={email || "Ẩn danh"} secondary={timeAgo(data[0]?.createdAt)} />
            </ListItem>
        </ListItemButton>
    )
}