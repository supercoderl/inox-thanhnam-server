// material-ui
import { Box } from '@mui/material';
import { useEffect, useState } from 'react';
import mobileBG from "../background/mobile.jpg";
import desktopBG from "../background/desktop.jpg";

// ==============================|| AUTH BLUR BACK SVG ||============================== //

const AuthBackground = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 767);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 767);
      console.log(isMobile);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <Box sx={{ position: 'absolute', width: "100%", height: "100%", filter: 'blur(6px)', zIndex: -1 }}>
      <img src={isMobile ? mobileBG : desktopBG} width="100%" height="inherit" alt='' />
    </Box>
  );
};

export default AuthBackground;
