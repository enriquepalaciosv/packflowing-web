import { Card, CardContent, Grid, Typography } from "@mui/material";
import COLORS from "../../utils/colorsStatus";
import { StatusText } from "../../utils/statusText";
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PackageOpenIcon from "../../constants/icons/package-open";
import CheckIcon from "../../constants/icons/check";
import PackageClose from "../../constants/icons/package-close";

interface CardStatisticProp {
  title: StatusText;
  count: number;
}

export default function CardStatistic({ title, count }: CardStatisticProp) {
  const [color1, color2] = COLORS[title];
  return (
    <Grid size={{ xs: 3 }}>
      <Card
        sx={{
          background: `linear-gradient(180deg, ${color1}, ${color2})`,
          color: "#fff",
          width: "95%",
          margin: "0 auto",
          minHeight: 100,
        }}
      >
        <CardContent sx={{ position: "relative" }}>
          <Typography variant="h2" fontWeight={700}>
            {count}
          </Typography>
          <Typography fontSize={14} fontWeight={700}>
            {title}
          </Typography>
          <Icon title={title} />
        </CardContent>
      </Card>
    </Grid>
  );
}

const Icon = ({ title }: { title: StatusText }) => {
  switch (title) {
    case "Paquetes en tránsito":
      return (
        <div style={{ position: "absolute", right: -15, bottom: -30, opacity: 0.25 }}>
          <LocalShippingIcon sx={{ fontSize: 140 }} />;
        </div>
      )
    case "Paquetes entregados":
      return (
        <div style={{ position: "absolute", right: -25, bottom: -30, opacity: 0.25 }}>
          <CheckIcon />
        </div>
      )
    case "Paquetes listos para recoger":
      return (
        <div style={{ position: "absolute", right: -25, bottom: -30, opacity: 0.25 }}>
          <PackageClose />
        </div>
      )
    case "Paquetes recibidos":
      return (
        <div style={{ position: "absolute", right: -25, bottom: -30, opacity: 0.25 }}>
          <PackageOpenIcon />
        </div>
      );
    default:
      return null;
  }
}