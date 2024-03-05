// material-ui
import { Box, IconButton, Link, useMediaQuery } from '@mui/material';
import { InstagramOutlined, DiscordOutlined, FacebookOutlined } from '@ant-design/icons';

// project import
import Search from './Search';
import Profile from './Profile';
import Notification from './Notification';
import MobileSection from './MobileSection';

// ==============================|| HEADER - CONTENT ||============================== //

const HeaderContent = () => {
  const matchesXs = useMediaQuery((theme) => theme.breakpoints.down('md'));

  return (
    <>
      {!matchesXs && <Search />}
      {matchesXs && <Box sx={{ width: '100%', ml: 1 }} />}

      <Box sx={{ display: "flex", gap: "8px" }}>
        <IconButton
          component={Link}
          href="https://facebook.com"
          target="_blank"
          disableRipple
          color="secondary"
          title="Facebook"
          sx={{ color: 'text.primary', bgcolor: 'grey.100' }}
        >
          <FacebookOutlined style={{ color: "#4267B2" }} />
        </IconButton>

        <IconButton
          component={Link}
          href="https://instagram.com"
          target="_blank"
          disableRipple
          color="secondary"
          title="Instagram"
          sx={{ color: 'text.primary', bgcolor: 'grey.100' }}
        >
          <InstagramOutlined style={{ color: "#FCAF45" }} />
        </IconButton>

        <IconButton
          component={Link}
          href="https://discord.com"
          target="_blank"
          disableRipple
          color="secondary"
          title="Dicord"
          sx={{ color: 'text.primary', bgcolor: 'grey.100' }}
        >
          <DiscordOutlined style={{ color: "#424549" }} />
        </IconButton>
      </Box>

      <Notification />
      {!matchesXs && <Profile />}
      {matchesXs && <MobileSection />}
    </>
  );
};

export default HeaderContent;
