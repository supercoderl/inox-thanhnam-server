import { useEffect, useRef, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Avatar,
  Badge,
  Box,
  ClickAwayListener,
  Divider,
  IconButton,
  List,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  ListItemIcon,
  Paper,
  Popper,
  Typography,
  useMediaQuery
} from '@mui/material';

// project import
import MainCard from 'components/MainCard';
import Transitions from 'components/@extended/Transitions';

// assets
import { BellOutlined, CloseOutlined, GiftOutlined, StarFilled, MessageOutlined, CaretDownOutlined, } from '@ant-design/icons';
import { dateFormatterV2, timeAgo } from 'utils/date';
import { useNavigate } from 'react-router-dom';
import axiosInstance from 'config/axios';

// sx styles
const avatarSX = {
  width: 36,
  height: 36,
  fontSize: '1rem'
};

const actionSX = {
  mt: '6px',
  ml: 1,
  top: 'auto',
  right: 'auto',
  alignSelf: 'flex-start',

  transform: 'none'
};

// ==============================|| HEADER CONTENT - NOTIFICATION ||============================== //

const Notification = ({ notifications, count }) => {
  const theme = useTheme();
  const matchesXs = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const notificationRef = useRef(null);
  const [isAtBottom, setIsAtBottom] = useState(false);

  const handleScroll = () => {
    if (notificationRef.current) {
      notificationRef.current.scrollTop += 100;
      notificationRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const handleRouteToOrderDetail = async (orderID, notificationID, type) => {
    if (type === "order") {
      await axiosInstance.put(`Notification/update-notification/${notificationID}`, { notificationID });
      navigate(`application/order/review/${orderID}`);
      window.location.reload();
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      if (notificationRef.current) {
        const container = notificationRef.current;
        const isBottom = container.scrollTop + container.clientHeight === container.scrollHeight;
        setIsAtBottom(isBottom);
      }
    };

    if (notificationRef.current) {
      notificationRef.current.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (notificationRef.current) {
        notificationRef.current.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  const iconBackColorOpen = 'grey.300';
  const iconBackColor = 'grey.100';

  return (
    <Box sx={{ flexShrink: 0, ml: 0.75 }}>
      <IconButton
        disableRipple
        color="secondary"
        sx={{ color: 'text.primary', bgcolor: open ? iconBackColorOpen : iconBackColor }}
        aria-label="open profile"
        ref={anchorRef}
        aria-controls={open ? 'profile-grow' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
      >
        <Badge badgeContent={count} color="primary">
          <BellOutlined />
        </Badge>
      </IconButton>
      <Popper
        placement={matchesXs ? 'bottom' : 'bottom-end'}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [matchesXs ? -5 : 0, 9]
              }
            }
          ]
        }}
      >
        {({ TransitionProps }) => (
          <Transitions type="fade" in={open} {...TransitionProps}>
            <Paper
              sx={{
                boxShadow: theme.customShadows.z1,
                width: '100%',
                minWidth: 285,
                maxWidth: 420,
                [theme.breakpoints.down('md')]: {
                  maxWidth: 285
                }
              }}
            >
              <ClickAwayListener onClickAway={handleClose}>
                <MainCard
                  title="Notification"
                  elevation={0}
                  border={false}
                  content={false}
                  secondary={
                    <IconButton size="small" onClick={handleToggle}>
                      <CloseOutlined />
                    </IconButton>
                  }
                >
                  <List
                    component="nav"
                    sx={{
                      p: 0,
                      '& .MuiListItemButton-root': {
                        py: 0.5,
                        '& .MuiAvatar-root': avatarSX,
                        '& .MuiListItemSecondaryAction-root': { ...actionSX, position: 'relative' }
                      },
                      maxHeight: 400,
                      overflowY: "auto",
                      position: 'relative',
                      scrollBehavior: "smooth"
                    }}
                    ref={notificationRef}
                  >
                    {
                      notifications && notifications.length > 0 ?
                        notifications.slice(0, 10).map((item, index) => {
                          return (
                            <ListItemButton
                              key={index}
                              onClick={() => handleRouteToOrderDetail(item?.objectID, item?.notificationID, item?.type)}
                              sx={{ background: !item?.readAt ? "rgba(0, 0, 0, 0.02)" : "none" }}
                            >
                              {
                                !item?.readAt ?
                                  <ListItemIcon>
                                    <StarFilled />
                                  </ListItemIcon>
                                  :
                                  null
                              }
                              <ListItemAvatar>
                                <Avatar
                                  sx=
                                  {
                                    item?.type === "order" ?
                                      {
                                        color: 'success.main',
                                        bgcolor: 'success.lighter'
                                      }
                                      :
                                      {
                                        color: 'primary.light',
                                        bgcolor: 'secondary.lighter'
                                      }
                                  }
                                >
                                  {item?.type === "order" ? <GiftOutlined /> : <MessageOutlined />}
                                </Avatar>
                              </ListItemAvatar>
                              <ListItemText
                                primary={
                                  <Typography variant="h6">
                                    {item?.message}
                                  </Typography>
                                }
                                secondary={timeAgo(item?.createdAt)}
                              />
                              <ListItemSecondaryAction>
                                <Typography variant="caption" noWrap>
                                  {dateFormatterV2(item?.createdAt, 'h:mm A')}
                                </Typography>
                              </ListItemSecondaryAction>
                            </ListItemButton>
                          )
                        })
                        :
                        <ListItemButton sx={{ textAlign: 'center', py: `${12}px !important` }}>
                          <ListItemText
                            primary={
                              <Typography variant="h6">
                                Không có thông báo
                              </Typography>
                            }
                          />
                        </ListItemButton>
                    }
                    <Divider />
                    {
                      !isAtBottom && <ListItemButton
                        sx={{
                          py: `${8}px !important`,
                          position: 'fixed',
                          bottom: 0,
                          width: "100%",
                          background: 'white',
                          '&:hover': {
                            background: "white",
                          },
                          border: '1px solid rgba(0, 0, 0, 0.1)',
                          justifyContent: "center"
                        }}
                        onClick={handleScroll}
                      >
                        <ListItemIcon>
                          <CaretDownOutlined style={{ fontSize: 20 }} />
                        </ListItemIcon>
                      </ListItemButton>
                    }
                  </List>
                </MainCard>
              </ClickAwayListener>
            </Paper>
          </Transitions>
        )}
      </Popper>
    </Box>
  );
};

export default Notification;
