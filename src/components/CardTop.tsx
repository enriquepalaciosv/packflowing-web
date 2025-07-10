import { Card, CardContent, Grid, Typography } from "@mui/material";
import MedalIcon from "../constants/icons/medal";
import { PODIUM_COLORS } from "../utils/colorsStatus";

interface CardTopUsersProp {
    title: string;
    total: number;
    packages: number;
    position: number
}

export default function CardTopUsers({ title, total, packages, position }: CardTopUsersProp) {
    const [color1, color2] = PODIUM_COLORS[position as keyof typeof PODIUM_COLORS];
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
                <CardContent sx={{ position: "relative", paddingBottom: 0 }}>
                    <Typography fontSize={12} fontWeight={900} sx={{ position: "absolute", right: 10, top: 10 }}>
                        # {position}
                    </Typography>
                    <Typography variant="h2" fontWeight={700}>
                        ${total}
                    </Typography>
                    <Typography fontSize={14} fontWeight={700}>
                        {title}
                    </Typography>
                    {/* <Typography fontSize={12} fontWeight={500}>
                        {packages} paquetes
                    </Typography> */}
                    <div style={{ position: "absolute", right: -15, bottom: -25, opacity: 0.25 }}>
                        <MedalIcon />
                    </div>
                </CardContent>
            </Card>
        </Grid>
    );
}