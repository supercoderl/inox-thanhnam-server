// assets
import { UserOutlined, TeamOutlined, ShoppingOutlined, ShoppingCartOutlined, CommentOutlined } from '@ant-design/icons';

// icons
const icons = {
    UserOutlined,
    TeamOutlined,
    ShoppingOutlined,
    ShoppingCartOutlined,
    CommentOutlined
};

// ==============================|| MENU ITEMS - APPLICATION ||============================== //

const application = {
    id: 'application',
    title: 'Application',
    type: 'group',
    children: [
        {
            id: 'customer',
            title: 'Khách hàng',
            type: 'item',
            url: 'application/customer/default',
            icon: icons.TeamOutlined,
            //   breadcrumbs: false
        },
        {
            id: 'user',
            title: 'Tài khoản',
            type: 'item',
            url: 'application/user/default',
            icon: icons.UserOutlined,
            //   breadcrumbs: false
        },
        {
            id: 'product',
            title: 'Sản phẩm',
            type: 'item',
            url: 'application/product/default',
            icon: icons.ShoppingOutlined,
            //   breadcrumbs: false
        },
        {
            id: 'order',
            title: 'Đơn đặt hàng',
            type: 'item',
            url: 'application/order/default',
            icon: icons.ShoppingCartOutlined,
            //   breadcrumbs: false
        },
        {
            id: 'message',
            title: 'Tin nhắn',
            type: 'item',
            url: 'application/message/default',
            icon: icons.CommentOutlined,
            //   breadcrumbs: false
        }
    ]
};

export default application;
