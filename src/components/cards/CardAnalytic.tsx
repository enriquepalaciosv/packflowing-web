import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { Card, CardContent, Grid, Typography } from "@mui/material";
import FlightIcon from '@mui/icons-material/Flight';
import CheckIcon from "../../constants/icons/check";
import PackageClose from "../../constants/icons/package-close";
import PackageOpenIcon from "../../constants/icons/package-open";
import { COLORS_ANALYTICS } from "../../utils/colorsStatus";
import { AnalyticText } from "../../utils/statusText";
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

interface CardAnalyticProp {
    title: AnalyticText;
    count: number | string;
}

export default function CardAnalytic({ title, count }: CardAnalyticProp) {
    const [color1, color2] = COLORS_ANALYTICS[title];

    return (
        <Grid size={{ xs: 6 }}>
            <Card
                sx={{
                    background: `linear-gradient(180deg, ${color1}, ${color2})`,
                    color: "#fff",
                    width: "95%",
                    margin: "0 auto",
                    minHeight: 100,
                }}
            >
                <CardContent sx={{ position: "relative", paddingLeft: 5 }}>
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

const Icon = ({ title }: { title: AnalyticText }) => {
    switch (title) {
        case "Total paquetes":
            return (
                <div style={{ position: "absolute", right: 30, bottom: 0, top: 0, opacity: 0.25 }}>
                    <PackageOpenIcon />
                </div>
            )
        case "Total ventas":
            return (
                <div style={{ position: "absolute", right: 20, bottom: 0, top: 0, opacity: 0.25 }}>
                    <AttachMoneyIcon sx={{ fontSize: 180 }} />
                </div>
            )
        case "Paquetes marítimos":
            return (
                <div style={{ position: "absolute", right: -25, bottom: -30, opacity: 0.25 }}>
                    <PackageClose />
                </div>
            )
        case "Paquetes aéreos":
            return (
                <div style={{ position: "absolute", right: -25, bottom: 0, top: 0, opacity: 0.25 }}>
                    <FlightIcon sx={{ fontSize: 140, transform: "rotate(90deg)" }} />
                </div>
            );
        default:
            return null;
    }
}