// assets
import { ApiOutlined, BgColorsOutlined, QuestionOutlined } from '@ant-design/icons';

// icons
const icons = {
  ApiOutlined,
  BgColorsOutlined,
  QuestionOutlined
};

// ==============================|| MENU ITEMS - SAMPLE PAGE & DOCUMENTATION ||============================== //

const support = {
  id: 'support',
  title: 'Support',
  type: 'group',
  children: [
    {
      id: 'theme',
      title: 'Themes',
      type: 'item',
      url: '/sample-page',
      icon: icons.BgColorsOutlined
    }
  ]
};

export default support;
