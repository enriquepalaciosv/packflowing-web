import { Box, Button, Chip, MenuItem, Select, TextField } from "@mui/material";
import Paper from "@mui/material/Paper";
import {
  GridColDef,
  GridRenderEditCellParams,
  GridRowSelectionModel,
} from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { PaqueteDto, updatePaquete } from "../firebase/firestore/paquetes";
import { COLORS_BY_STATUS } from "../utils/colorsStatus";
import STATUS_PACKAGES from "../utils/statusPackages";
import { usePaqueteStore } from "../zustand/usePaquetesStore";
import DataTable from "./DataTable";
import FooterTable from "./FooterTable";
import ModalFormPackage from "./ModalPackage";
import ModalPackagesInBatch from "./ModalPackagesInBatch";

export default function TablePackages() {
  const [isOpen, setIsOpen] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 20,
  });
  const [isOpenModalInBatch, setIsOpenModalInBatch] = useState(false);
  const [search, setSearch] = useState("");
  const [entity, setEntity] = useState<PaqueteDto>();
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>();
  const { countTotal, allPaquetes, resetPackages, fetchNextPage, fetchCounts } =
    usePaqueteStore();

  useEffect(() => {
    resetPackages();
    fetchNextPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleIsOpenModal = (b?: boolean) => setIsOpen(b ?? !isOpen);

  const filteredRows = allPaquetes.filter((row) =>
    row.idRastreo.includes(search.toUpperCase())
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
      <ModalPackagesInBatch
        isOpen={isOpenModalInBatch}
        onClose={() => setIsOpenModalInBatch(false)}
        ids={selectionModel?.ids}
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
          rows={filteredRows.slice(
            paginationModel.page * paginationModel.pageSize,
            (paginationModel.page + 1) * paginationModel.pageSize
          )}
          columns={columns}
          paginationModel={paginationModel}
          onSelectionModelChange={setSelectionModel}
          processRowUpdate={async (newRow: PaqueteDto, oldRow: PaqueteDto) => {
            try {
              const { usuario, ...paquete } = newRow;
              if (newRow.estado !== oldRow.estado) {
                // @ts-expect-error
                delete newRow?.tarifa?.nombre;
                await updatePaquete({ ...paquete, estado: newRow.estado });
                toast.success("Estado del paquete actualizado con éxito");
              }
              return newRow;
            } catch (error) {
              console.error("Error al actualizar:", error);
              toast.error(`Error al actualizar estado del paquete`);
              return oldRow;
            } finally {
              await fetchCounts();
            }
          }}
          onProcessRowUpdateError={(error) => {
            console.error("Error al procesar actualización:", error);
          }}
          slots={{
            footer: () => (
              <FooterTable
                selectedCount={selectionModel?.ids.size || 0}
                onBatchEdit={() => setIsOpenModalInBatch(true)}
                //   {
                //   const selectedPaquetes = allPaquetes.filter((p) =>
                //     selectionModel?.ids.has(p.id)
                //   );
                //   console.log("Editar en lote:", selectedPaquetes);
                // }}
              />
            ),
          }}
          onPaginationModelChange={async (newModel: {
            page: number;
            pageSize: number;
          }) => {
            setPaginationModel(newModel);

            const totalLoaded = allPaquetes.length;
            const totalNeeded = (newModel.page + 1) * newModel.pageSize;

            if (totalNeeded > totalLoaded) {
              await fetchNextPage();
            }
          }}
          rowCount={search ? filteredRows.length : countTotal}
        />
      </Paper>
    </>
  );
}
