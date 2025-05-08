import { Box, Button, Chip, MenuItem, Select, TextField } from "@mui/material";
import Paper from "@mui/material/Paper";
import { GridColDef, GridRenderEditCellParams } from "@mui/x-data-grid";
import { useState } from "react";
import { PaqueteDto, updatePaquete } from "../firebase/firestore/paquetes";
import { COLORS_BY_STATUS } from "../utils/colorsStatus";
import STATUS_PACKAGES from "../utils/statusPackages";
import { usePaqueteStore } from "../zustand/usePaquetesStore";
import DataTable from "./DataTable";
import ModalFormPackage from "./ModalPackage";

const paginationModel = { page: 0, pageSize: 20 };

export default function TablePackages() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [entity, setEntity] = useState<PaqueteDto>();
  const { allPaquetes } = usePaqueteStore();

  const handleIsOpenModal = (b?: boolean) => setIsOpen(b ?? !isOpen);

  const filteredRows = allPaquetes.filter((row) =>
    row.idRastreo.includes(search)
  );

  const handleEdit = (paquete: PaqueteDto) => {
    setEntity(paquete);
    setIsOpen(!isOpen);
  };

  const handleCloseModal = () => {
    handleIsOpenModal(false);
    setEntity(undefined);
  };

  const columns: GridColDef[] = [
    { field: "idRastreo", headerName: "ID", width: 160 },
    { field: "contenido", headerName: "Contenido", width: 120 },
    {
      field: "usuario",
      headerName: "Usuario",
      width: 200,
      renderCell: (params) => {
        const user = params.value;
        return `${user.name} ${user.lastName} - ${user.lockerCode}`;
      },
    },
    { field: "via", headerName: "Vía", width: 80 },
    {
      field: "estado",
      headerName: "Estado",
      width: 150,
      editable: true,
      renderCell: (params) => {
        const estado = params.value as
          | "entregado"
          | "listo_para_retirar"
          | "en_transito"
          | "recibido";

        return (
          <Chip
            label={String(estado).replaceAll("_", " ")}
            sx={{
              backgroundColor: COLORS_BY_STATUS[estado][0],
              color: "#fff",
              textTransform: "capitalize",
              fontWeight: "bold",
            }}
          />
        );
      },
      renderEditCell: (params: GridRenderEditCellParams) => {
        return (
          <Select
            value={params.value}
            onChange={(e) =>
              params.api.setEditCellValue({
                id: params.id,
                field: params.field,
                value: e.target.value,
              })
            }
            fullWidth
            size="small"
          >
            {STATUS_PACKAGES.map((status) => (
              <MenuItem key={status} value={status}>
                {status.replaceAll("_", " ")}
              </MenuItem>
            ))}
          </Select>
        );
      },
    },
    {
      field: "rastreo",
      headerName: "Últ. Rastreo",
      width: 120,
      renderCell: (params) => {
        const lastIndex = params.value.length - 1;
        const { hora, fecha } = params.value[lastIndex];
        return fecha + " " + hora;
      },
    },
    { field: "total", headerName: "Total", width: 50 },
    {
      field: "acciones",
      headerName: "Acciones",
      width: 150,
      renderCell: (params) => (
        <Button
          variant="outlined"
          size="small"
          onClick={() => handleEdit(params.row)}
        >
          Editar
        </Button>
      ),
    },
  ];

  return (
    <>
      <ModalFormPackage
        isOpen={isOpen}
        onClose={handleCloseModal}
        entity={entity}
      />
      <Paper sx={{ padding: 2, width: "auto", marginTop: 2 }}>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            jsutifyContent: "space-between",
            marginBottom: 2,
          }}
        >
          <TextField
            label="Buscar por ID"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
            sx={{ width: "90%" }}
          />
          <Button
            variant="contained"
            onClick={() => handleIsOpenModal()}
            size="small"
          >
            Crear
          </Button>
        </Box>
        <DataTable
          rows={filteredRows}
          columns={columns}
          paginationModel={paginationModel}
          processRowUpdate={async (newRow, oldRow) => {
            try {
              await updatePaquete(newRow.id, { estado: newRow.estado });
              return newRow;
            } catch (error) {
              console.error("Error al actualizar:", error);
              return oldRow;
            }
          }}
          onProcessRowUpdateError={(error) => {
            console.error("Error al procesar actualización:", error);
          }}
        />
      </Paper>
    </>
  );
}
