import {
  DataGrid,
  GridColDef,
  GridRowModel,
  GridRowsProp,
} from "@mui/x-data-grid";
import { Paquete } from "../firebase/firestore/paquetes";

interface DataTableProps {
  rows: GridRowsProp<Paquete>;
  columns: GridColDef[];
  paginationModel: {
    page: number;
    pageSize: number;
  };
  processRowUpdate?: (
    newRow: GridRowModel<Paquete>,
    oldRow: GridRowModel<Paquete>
  ) => Promise<Paquete>;
  onProcessRowUpdateError?: (error: unknown) => void;
}

export default function DataTable({
  rows,
  columns,
  paginationModel,
  processRowUpdate,
  onProcessRowUpdateError,
}: DataTableProps) {
  return (
    <DataGrid
      rows={rows}
      columns={columns}
      initialState={{ pagination: { paginationModel } }}
      pageSizeOptions={[20]}
      checkboxSelection
      sx={{ border: 0 }}
      processRowUpdate={processRowUpdate}
      onProcessRowUpdateError={onProcessRowUpdateError}
    />
  );
}
