import { Button } from "../../../node_modules/@mui/material/index";
import { SendOutlined } from "@ant-design/icons";

const Message = () => {
    return (
        <div className='container'>
            <div className='inbox'>
                <aside>
                    <div className="title">Browse Conversations</div>
                    <ul>
                        <li>
                            <p className='username'>test</p>
                        </li>
                    </ul>
                </aside>
                <main>
                    <div className="title">Erica Masson</div>
                    <div className='message-wrap'>
                        <div className='message'>
                            <p>1</p>
                        </div>
                    </div>
                    <footer>
                        <form>
                            <input placeholder='Nhập tin nhắn' type='text' />
                            <Button variant="contained" color="error" className="send">
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