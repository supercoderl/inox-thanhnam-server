import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import MainLayout from 'layout/MainLayout';
import Message from 'pages/application/Message';

// render - dashboard
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard')));

// render - sample page
const SamplePage = Loadable(lazy(() => import('pages/extra-pages/SamplePage')));

// render - utilities
const Typography = Loadable(lazy(() => import('pages/components-overview/Typography')));
const Color = Loadable(lazy(() => import('pages/components-overview/Color')));
const Shadow = Loadable(lazy(() => import('pages/components-overview/Shadow')));
const AntIcons = Loadable(lazy(() => import('pages/components-overview/AntIcons')));
const Customer = Loadable(lazy(() => import('pages/application/Customer')));
const User = Loadable(lazy(() => import('pages/application/User')));
const Product = Loadable(lazy(() => import('pages/application/Product')));
const Order = Loadable(lazy(() => import('pages/application/Order')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: 'color',
      element: <Color />
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: <DashboardDefault />
        }
      ]
    },
    {
      path: 'sample-page',
      element: <SamplePage />
    },
    {
      path: 'shadow',
      element: <Shadow />
    },
    {
      path: 'typography',
      element: <Typography />
    },
    {
      path: 'icons/ant',
      element: <AntIcons />
    },
    {
      path: 'application',
      children: [
        {
          path: 'customer',
          children: [
            {
              path: 'default',
              element: <Customer />
            }
          ]
        },
        {
          path: 'user',
          children: [
            {
              path: 'default',
              element: <User />
            }
          ]
        },
        {
          path: 'product',
          children: [
            {
              path: 'default',
              element: <Product />
            }
          ]
        },
        {
          path: 'order',
          children: [
            {
              path: 'default',
              element: <Order />
            }
          ]
        },
        {
          path: 'message',
          children: [
            {
              path: 'default',
              element: <Message />
            }
          ]
        },
      ]
    },
  ]
};

export default MainRoutes;
