import {
  DataGrid,
  GridColDef,
  GridRowModel,
  GridRowsProp,
  GridSlotsComponent,
} from "@mui/x-data-grid";
import { PaqueteDto } from "../firebase/firestore/paquetes";

interface DataTableProps {
  rows: GridRowsProp<PaqueteDto>;
  columns: GridColDef[];
  paginationModel: {
    page: number;
    pageSize: number;
  };
  processRowUpdate?: (
    newRow: GridRowModel<PaqueteDto>,
    oldRow: GridRowModel<PaqueteDto>
  ) => Promise<PaqueteDto>;
  onProcessRowUpdateError?: (error: unknown) => void;
  onSelectionModelChange: any;
  slots: Partial<GridSlotsComponent>;
  onPaginationModelChange: any;
  rowCount: number;
}

export default function DataTable({
  rows,
  rowCount,
  columns,
  paginationModel,
  processRowUpdate,
  onProcessRowUpdateError,
  onSelectionModelChange,
  slots,
  onPaginationModelChange,
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
      onRowSelectionModelChange={onSelectionModelChange}
      onPaginationModelChange={onPaginationModelChange}
      slots={slots}
      hideFooterSelectedRowCount
      paginationMode="server"
      rowCount={rowCount}
    />
  );
}
