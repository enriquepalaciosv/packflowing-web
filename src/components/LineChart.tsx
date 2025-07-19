import { LineChart } from '@mui/x-charts/LineChart';

type DataPoint = {
    fecha: string;
    total: number;
};

type Props = {
    data: DataPoint[];
};

export default function VentasChart({ data }: Props) {
    return (
        <div id="ventas-chart" style={{ background: "white" }}>
            <LineChart
                xAxis={[{
                    data: data.map((item) => item.fecha),
                    scaleType: 'band'
                }]}
                series={[
                    {
                        data: data.map((item) => item.total),
                        color: '#1976d2',
                    },
                ]}
                width={800}
                height={200}
            />
        </div>
    );
}
