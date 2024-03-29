import { useEffect, useState } from "react";
import { Avatar, Button, Typography } from "../../../node_modules/@mui/material/index";
import { SendOutlined, } from "@ant-design/icons";
import axiosInstance from "config/axios";
import { MessageList } from "components/Message/MessageList/MessageList";
import { getFirstLetter, getFirstName } from "utils/text";
import { stringAvatar } from "themes/theme/color";
import { toast } from "react-toastify";

const Message = () => {
    const [messagesChoosen, setMessageChoosen] = useState([]);
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");

    useEffect(() => {
        getMessages();
    }, []);

    const getMessages = async (searchText = "") => {
        await axiosInstance.get("Contact/contacts", { params: { text: searchText } }).then((response) => {
            const result = response.data;
            if (!result) return;
            else if (result.success && result.data) {
                setMessages(result.data);
            }
        }).catch((error) => console.log("Get messages: ", error));
    }

    const handleOpenMessage = (data) => {
        console.log(data);
        setMessageChoosen(data);
    };

    const handleSendMail = async () => {
        if (messagesChoosen.length === 0) return;
        else if (!text && text === "") {
            toast.warning("Bạn phải nhập nội dung");
            return;
        }
        const body = {
            to: messages[0]?.email,
            content: text
        }
        await axiosInstance.post("Email/send-mail", body).then((response) => {
            const result = response.data;
            if (!result) return;
            else if (result.success) toast.success(result.message)
        }).catch((error) => console.log(error)).finally(() => setText(""));
    }

    return (
        <div className='container'>
            <div className='inbox'>
                <aside>
                    <div className="title">Tin nhắn</div>
                    <MessageList messages={messages} handleOpenMessage={handleOpenMessage} onGet={getMessages} />
                </aside>
                <main>
                    <div className="title">{messagesChoosen.length > 0 && messagesChoosen[0]?.fullname || "Hãy mở một tin nhắn"}</div>
                    <div className="message-wrap">
                        <div className="senderSays">
                            {messagesChoosen.length > 0 && <Avatar {...stringAvatar(getFirstLetter(getFirstName(messagesChoosen[0]?.fullname)))} />}
                            <div className="text-box-sender">
                                {
                                    messagesChoosen && messagesChoosen.length > 0 ?
                                        messagesChoosen.map((item, index) => {
                                            return (
                                                <div className="text" key={index}>
                                                    <Typography variant="h6">{item?.notes}</Typography>
                                                </div>
                                            )
                                        })
                                        :
                                        null
                                }
                            </div>
                        </div>
                        {/* <div className="userSays">
                            <div className="text">
                                <Typography variant="h6">test</Typography>
                            </div>
                        </div> */}
                    </div>
                    <footer>
                        <form>
                            <input placeholder='Nhập tin nhắn' type='text' value={text} onChange={(e) => setText(e.target.value)} />
                            <Button variant="contained" color="error" className="send" onClick={handleSendMail}>
                                Send
                                <SendOutlined />
                            </Button>
                        </form>
                    </footer>
                </main>
            </div>
        </div>
    )
}

export default Message;