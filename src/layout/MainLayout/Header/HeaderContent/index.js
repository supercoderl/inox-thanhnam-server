// material-ui
import { Box, IconButton, Link, useMediaQuery } from '@mui/material';
import { InstagramOutlined, DiscordOutlined, FacebookOutlined } from '@ant-design/icons';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';

// project import
import Search from './Search';
import Profile from './Profile';
import Notification from './Notification';
import MobileSection from './MobileSection';
import AuthService from 'services/auth';
import { useEffect, useState } from 'react';
import axiosInstance from 'config/axios';

// ==============================|| HEADER - CONTENT ||============================== //

const HeaderContent = () => {
  const matchesXs = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const user = JSON.parse(AuthService.getUser());
  const [connection, setConnection] = useState();
  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);

  const joinRoom = async (user, room) => {
    const connection = new HubConnectionBuilder().withUrl("https://inox.somee.com/notify").configureLogging(LogLevel.Information).build();
    connection.on("ReceiveMessage", (user, message, result) => {
      setNotifications(messages => [result, ...messages]);
    });
    await connection.start();
    await connection.invoke("JoinRoom", { user, room });
    setConnection(connection);
  }

  const getNotifications = async () => {
    await axiosInstance.get("Notification/notifications").then((response) => {
      const result = response.data;
      if(!result) return;
      else if(result.success && result.data && result.data.length > 0)
      {
        result.data.map(item => setNotifications(notifications => [...notifications, item]));
        setNotificationCount(result.data.filter(x => !x.readAt).length);
        localStorage.setItem("notificationCount", result.data.filter(x => !x.readAt).length);
      }
    }).catch((error) => console.log("Get notifications: ", error));
  }

  useEffect(() => {
    getNotifications();
    joinRoom(user?.fullname || "Anonymous", "notification");
    console.log(connection);
  }, []);

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

      <Notification notifications={notifications} count={notificationCount} />
      {!matchesXs && <Profile />}
      {matchesXs && <MobileSection />}
    </>
  );
};

export default HeaderContent;
