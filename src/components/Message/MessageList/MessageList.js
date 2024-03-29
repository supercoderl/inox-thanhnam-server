import { useEffect, useState } from "react";
import { Box, List, OutlinedInput } from "../../../../node_modules/@mui/material/index";
import { SearchOutlined, } from "@ant-design/icons";
import { MessageItem } from "../MessageItem/MessageItem";

export const MessageList = (props) => {
    const { messages, onGet, handleOpenMessage, } = props;
    const [search, setSearch] = useState("");
    const [emailGroups, setEmailGroups] = useState({});

    useEffect(() => {
        const groupedMessages = {};
        messages.forEach(message => {
            if (!(message.email in groupedMessages)) {
                groupedMessages[message.email] = [];
            }
            groupedMessages[message.email].push(message);
        });

        setEmailGroups(groupedMessages);
    }, [messages]);

    return (
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            <Box sx={{ p: "0.75rem" }}>
                <OutlinedInput
                    startAdornment={
                        <SearchOutlined />
                    }
                    placeholder="Tìm kiếm..."
                    size="small"
                    value={search}
                    fullWidth
                    onChange={(e) => {
                        onGet(e.target.value);
                        setSearch(e.target.value);
                    }}
                />
            </Box>
            {
                emailGroups && Object.keys(emailGroups).length > 0 ?
                    Object.keys(emailGroups).map((email, index) => {
                        return (
                            <MessageItem key={index} email={email} data={emailGroups[email]} handleOpenMessage={handleOpenMessage} />
                        )
                    })
                    :
                    <div>asd</div>
            }
        </List>
    )
}