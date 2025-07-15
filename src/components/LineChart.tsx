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
        <LineChart
            xAxis={[{
                data: data.map((item) => item.fecha),
                scaleType: 'band'
            }]}
            series={[
                {
                    data: data.map((item) => item.total),
                    label: 'Ventas (USD)',
                    color: '#1976d2',
                },
            ]}
            width={800}
            height={400}
        />
    );
}
