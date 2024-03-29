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
    },
    {
      id: 'plugin',
      title: 'Plugins',
      type: 'item',
      url: 'https://codedthemes.gitbook.io/mantis/',
      icon: icons.ApiOutlined,
      external: true,
      target: true
    },
    {
      id: 'faqs',
      title: 'FAQS',
      type: 'item',
      url: 'https://codedthemes.gitbook.io/mantis/',
      icon: icons.QuestionOutlined,
      external: true,
      target: true
    }
  ]
};

export default support;
