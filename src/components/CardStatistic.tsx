import { Card, CardContent, Grid, Typography } from "@mui/material";
import COLORS from "../utils/colorsStatus";
import { StatusText } from "../utils/statusText";

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
        <CardContent>
          <Typography variant="h2" fontWeight={700}>
            {count}
          </Typography>
          <Typography fontSize={14} fontWeight={700}>
            {title}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
}
