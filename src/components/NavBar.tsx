import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import PersonIcon from '@mui/icons-material/Person';
import * as React from "react";
import { useAgenciaStore } from "../zustand/useAgenciaStore";

export default function NavBar() {
  const { agencia } = useAgenciaStore();
  const settings = [
    {
      title: "Cerrar sesión",
      onClick: () => {
        localStorage.removeItem("auth-storage");
        window.location.reload();
      },
    },
  ];

  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const capitalize = (word: string) => {
    return word.charAt(0).toUpperCase() + word.slice(1)
  }

  return (
    <AppBar
      position="static"
      sx={{ backgroundColor: "#353a40", borderRadius: 2 }}
    >
      <Container maxWidth={false}>
        <Toolbar disableGutters sx={{ justifyContent: "flex-end" }}>
          <Typography style={{ marginRight: 8 }}>
            {capitalize(`${agencia?.suscripcion?.plan}`)}
          </Typography>
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Cerrar sesión">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar>
                  <PersonIcon />
                </Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem
                  key={setting.title}
                  onClick={() => {
                    handleCloseUserMenu();
                    setting.onClick();
                  }}
                >
                  <Typography sx={{ textAlign: "center" }}>
                    {setting.title}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
