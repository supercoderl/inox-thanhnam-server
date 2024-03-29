// project import
import Routes from 'routes';
import ThemeCustomization from 'themes';
import ScrollTop from 'components/ScrollTop';
import 'react-toastify/dist/ReactToastify.css';
import "App.css";
import { ToastContainer } from "react-toastify";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// ==============================|| APP - THEME, ROUTER, LOCAL  ||============================== //

const App = () => (
  <ThemeCustomization>
    <ToastContainer />
    <ScrollTop>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Routes />
      </LocalizationProvider>
    </ScrollTop>
  </ThemeCustomization>
);

export default App;
