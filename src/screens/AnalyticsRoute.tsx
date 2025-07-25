import { PictureAsPdf, TableView } from "@mui/icons-material";
import { Box, Button, Container, Grid, Tooltip, Typography } from "@mui/material";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import AppBar from "../components/AppBar";
import CardAnalytic from "../components/cards/CardAnalytic";
import DateRangePickerComponent from "../components/inputs/DateRangePicker";
import VentasChart from "../components/LineChart";
import NavBar from "../components/NavBar";
import getPackagesByRange, { Analytics, getVentasByFecha } from "../firebase/firestore/paquetes";
import { exportExcelStatistics, exportPDFStatistics } from "../utils/exportTable";
import { useAgenciaStore } from "../zustand/useAgenciaStore";
import { useDateRangeStore } from "../zustand/useDateRangeStore";

export default function AnalyticsRoute() {
    const { agencia } = useAgenciaStore();
    const { fechaInicio, fechaFin, setFechas } = useDateRangeStore();
    const [analytics, setAnalytics] = useState<Analytics>();
    const [data, setData] = useState<{ fecha: string; total: number }[]>([]);

    useEffect(() => {

        const fetchData = async () => {
            const ventas = await getVentasByFecha(
                fechaInicio.startOf("day").toDate(),
                fechaFin.endOf("day").toDate()
            );
            setData(ventas);
        };

        fetchData();
        getPackagesByRange(
            fechaInicio.toDate(),
            fechaFin.toDate()
        )
            .then(response => setAnalytics(response))
    }, [fechaInicio, fechaFin])

    if (!agencia?.activo)
        return (
            <Container maxWidth={false} sx={{ mt: 1, p: 0 }}>
                <Typography sx={{ textAlign: "center" }}>
                    Servicio no disponible por el momento
                </Typography>
            </Container>
        );

    return (
        <>
            <AppBar />
            <Container maxWidth={false} sx={{ mt: 1, p: 1, ml: "17%", width: "83%" }}>
                <NavBar />
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                        marginTop: 2,
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            gap: 2,
                            marginTop: 2,
                        }}
                    >
                        <DateRangePickerComponent
                            start={fechaInicio}
                            end={fechaFin}
                            setDate={setFechas}
                            handleChange={() => null}
                        />
                        <Box
                            sx={{
                                display: "flex",
                                gap: 2
                            }}
                        >
                            <Button
                                size="small"
                                disabled={!analytics}
                                onClick={() => {
                                    const fecha = dayjs().format("DD/MM/YYYY")
                                    const fileName = `estadisticas-${fecha}.pdf`
                                    exportPDFStatistics(
                                        fileName,
                                        "ventas-chart",
                                        agencia?.nombre ?? "",
                                        analytics
                                    )
                                }}
                            >
                                <Tooltip title="Exportar como archivo PDF">
                                    <PictureAsPdf />
                                </Tooltip>
                            </Button>
                            <Button
                                size="small"
                                disabled={!analytics}
                                onClick={() => {
                                    const fecha = dayjs().format("DD/MM/YYYY")
                                    const fileName = `estadisticas-${fecha}.xlsx`
                                    exportExcelStatistics(
                                        fileName,
                                        agencia?.nombre ?? "",
                                        analytics
                                    )
                                }}
                            >
                                <Tooltip title="Exportar como archivo .xlsx">
                                    <TableView />
                                </Tooltip>
                            </Button>
                        </Box>
                    </Box>
                    <Box sx={{ width: "100%" }}>
                        <VentasChart data={data} />
                    </Box>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        <Grid container spacing={2} justifyContent={"space-around"}>
                            <CardAnalytic title={"Total paquetes"} count={analytics?.packages ?? 0} />
                            <CardAnalytic title={"Total ventas"} count={`$${analytics?.sales ?? 0}`} />
                        </Grid>
                        <Grid container spacing={2} justifyContent={"space-around"}>
                            <CardAnalytic title={"Paquetes aéreos"} count={analytics?.aereo ?? 0} />
                            <CardAnalytic title={"Paquetes marítimos"} count={analytics?.maritimo ?? 0} />
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </>
    );
}
