import {
  Equalizer,
  Home,
  Inventory,
  Person,
  Settings,
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

const drawerWidth = "17%";

const ITEMS = [
  {
    title: "Inicio",
    Icon: <Home sx={{ color: "#FFFFFF", fontSize: "1.25rem" }} />,
  },
  {
    title: "Paquetes",
    Icon: <Inventory sx={{ color: "#FFFFFF", fontSize: "1.25rem" }} />,
  },
  {
    title: "Usuarios",
    Icon: <Person sx={{ color: "#FFFFFF", fontSize: "1.25rem" }} />,
  },
  {
    title: "Estadisticas",
    Icon: <Equalizer sx={{ color: "#FFFFFF", fontSize: "1.25rem" }} />,
  },
  {
    title: "Configuración",
    Icon: <Settings sx={{ color: "#FFFFFF", fontSize: "1.25rem" }} />,
  },
];

export default function AppBar() {
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
        <ListItem key={"logo"}>
          <ListItemIcon sx={{ justifyContent: "center" }}>
            <img src={"/logo.png"} alt={"Logo"} style={{ width: "2rem" }} />
          </ListItemIcon>
          <ListItemText
            primary={"Pack Flowing"}
            sx={{
              color: "#FFFFFF",
              fontSize: 20,
            }}
          />
        </ListItem>
        <Divider sx={{ mx: 1, mb: 2, mt: 1 }} color="#FFFFFF" />
        {ITEMS.map(({ title, Icon }, index) => (
          <ListItem key={title} disablePadding>
            <ListItemButton>
              <ListItemIcon sx={{ justifyContent: "center" }}>
                {Icon}
              </ListItemIcon>
              <ListItemText primary={title} sx={{ color: "#FFFFFF" }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}
