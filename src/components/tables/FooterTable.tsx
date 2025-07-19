import { Box, Button, Stack, Typography } from "@mui/material";
import { GridFooterContainer, GridPagination } from "@mui/x-data-grid";

interface TableFooterProps {
  selectedCount: number;
  onBatchEdit: () => void;
  onBatchDelete: () => void;
}

export default function FooterTable({
  selectedCount,
  onBatchEdit,
  onBatchDelete,
}: TableFooterProps) {
  return (
    <GridFooterContainer>
      {selectedCount > 0 && (
        <Box
          sx={{
            width: "50%",
            px: 2,
            py: 1,
            borderTop: "1px solid #e0e0e0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <Typography>{selectedCount} elemento(s) seleccionado(s)</Typography>
          <Stack direction="row" spacing={2}>
            <Button variant="outlined" size="small" onClick={onBatchEdit}>
              Editar seleccionados
            </Button>
            <Button variant="outlined" color="error" size="small" onClick={onBatchDelete}>
              Eliminar seleccionados
            </Button>
          </Stack>
        </Box>
      )}
      <GridPagination />
    </GridFooterContainer>
  );
}
