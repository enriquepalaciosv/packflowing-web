import {
  DataGrid,
  GridColDef,
  GridRowModel,
  GridRowsProp,
  GridSlotsComponent,
  GridValidRowModel,
} from "@mui/x-data-grid";

interface DataTableProps<T extends GridValidRowModel> {
  rows: GridRowsProp<T>;
  columns: GridColDef[];
  paginationModel: {
    page: number;
    pageSize: number;
  };
  processRowUpdate?: (
    newRow: GridRowModel<T>,
    oldRow: GridRowModel<T>
  ) => Promise<T>;
  onProcessRowUpdateError?: (error: unknown) => void;
  onSelectionModelChange: (selectionModel: any) => void;
  slots: Partial<GridSlotsComponent>;
  onPaginationModelChange: (model: { page: number; pageSize: number }) => void;
  rowCount: number;
  checkboxSelection?: boolean
}

export default function DataTable<T extends GridValidRowModel>({
  rows,
  rowCount,
  columns,
  paginationModel,
  processRowUpdate,
  onProcessRowUpdateError,
  checkboxSelection = true,
  onSelectionModelChange,
  slots,
  onPaginationModelChange,
}: DataTableProps<T>) {
  return (
    <DataGrid
      rows={rows}
      columns={columns}
      initialState={{ pagination: { paginationModel } }}
      pageSizeOptions={[20]}
      checkboxSelection={checkboxSelection}
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
