// material-ui

import { Typography } from "../../../node_modules/@mui/material/index";

/**
 * if you want to use image instead of <svg> uncomment following.
 *
 * import logoDark from 'assets/images/logo-dark.svg';
 * import logo from 'assets/images/logo.svg';
 *
 */

// ==============================|| LOGO SVG ||============================== //

const Logo = () => {

  return (
    /**
     * if you want to use image instead of svg uncomment following, and comment out <svg> element.
     *
     * <img src={logo} alt="Mantis" width="100" />
     *
     */
    <>
      <img
        src="https://cdn-icons-png.flaticon.com/128/13941/13941933.png"
        alt=""
        width={35} height={35}
      />
      <Typography variant="h4" sx={{ ml: 1 }}>Inox Thành Nam</Typography>
    </>
  );
};

export default Logo;
