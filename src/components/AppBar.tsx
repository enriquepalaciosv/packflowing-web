import {
  Inventory,
  Person,
  Settings,
  Analytics
} from "@mui/icons-material";
import {
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const drawerWidth = "17%";

const ITEMS = [
  {
    title: "Paquetes",
    Icon: <Inventory sx={{ color: "#FFFFFF", fontSize: "1.25rem" }} />,
    path: "/",
  },
  {
    title: "Usuarios",
    Icon: <Person sx={{ color: "#FFFFFF", fontSize: "1.25rem" }} />,
    path: "/users",
  },
  {
    title: "Estadisticas",
    Icon: <Analytics sx={{ color: "#FFFFFF", fontSize: "1.25rem" }} />,
    path: "/analytics",
  },
  {
    title: "Configuración",
    Icon: <Settings sx={{ color: "#FFFFFF", fontSize: "1.25rem" }} />,
    path: "/settings",
  },
];

export default function AppBar() {
  const navigate = useNavigate();
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: "border-box",
          backgroundColor: "#353a40",
        },
      }}
    >
      <List>
        <ListItem
          key={"logo"}
          sx={{
            padding: { xs: "8px 0", sm: "8px 0", md: "8px 16px" },
            justifyContent: {
              xs: "center",
              sm: "center",
              md: "flex-start",
            },
          }}
        >
          <ListItemIcon sx={{ justifyContent: "center" }}>
            <img src={"/logo.png"} alt={"Logo"} style={{ width: "2rem" }} />
          </ListItemIcon>
          <ListItemText
            primary={"Pack Flowing"}
            sx={{
              color: "#FFFFFF",
              fontSize: 20,
              display: { xs: "none", sm: "none", md: "block" },
            }}
          />
        </ListItem>
        <Divider sx={{ mx: 1, mb: 2, mt: 1 }} color="#FFFFFF" />
        {ITEMS.map(({ title, Icon, path }) => (
          <ListItem key={title} disablePadding>
            <ListItemButton
              onClick={() => navigate(path)}
              sx={{
                padding: { xs: "8px 0", sm: "8px 0", md: "8px 16px" },
                justifyContent: {
                  xs: "center",
                  sm: "center",
                  md: "flex-start",
                },
              }}
            >
              <ListItemIcon sx={{ justifyContent: "center" }}>
                {Icon}
              </ListItemIcon>
              <ListItemText
                primary={title}
                sx={{
                  color: "#FFFFFF",
                  display: { xs: "none", sm: "none", md: "block" },
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}
