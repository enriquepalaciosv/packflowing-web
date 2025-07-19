import { Delete, Edit, Help, PictureAsPdf, TableView } from "@mui/icons-material";
import { Box, Button, Chip, MenuItem, Select, TextField, Tooltip } from "@mui/material";
import Paper from "@mui/material/Paper";
import {
  GridColDef,
  GridRenderEditCellParams,
  GridRowSelectionModel,
} from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { PaqueteDto, updatePaquete } from "../../firebase/firestore/paquetes";
import { validateCreditsAgency, validateHasRates } from "../../utils/agencyValidations";
import { COLORS_BY_STATUS } from "../../utils/colorsStatus";
import { exportExcel, exportPDF } from "../../utils/exportTable";
import STATUS_PACKAGES from "../../utils/statusPackages";
import { useAgenciaStore } from "../../zustand/useAgenciaStore";
import { useDateRangeStore } from "../../zustand/useDateRangeStore";
import { usePaqueteStore } from "../../zustand/usePaquetesStore";
import ModalDeletePackage from "../modals/ModalDeletePackage";
import ModalHasNotRates from "../modals/ModalHasNotRates";
import ModalNoCredit from "../modals/ModalNoCredit";
import ModalFormPackage from "../modals/ModalPackage";
import ModalPackagesInBatch from "../modals/ModalPackagesInBatch";
import DataTable from "./DataTable";
import FooterTable from "./FooterTable";

export default function TablePackages() {
  const { fechaInicio, fechaFin } = useDateRangeStore();
  const { agencia } = useAgenciaStore()
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenModalNoCredit, setIsOpenModalNoCredit] = useState(false);
  const [isOpenModalDeletePackage, setIsOpenModalDeletePackage] = useState(false);
  const [isOpenModalHasNotRates, setIsOpenModalHasNotRates] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 20,
  });
  const [isOpenModalInBatch, setIsOpenModalInBatch] = useState(false);
  const [search, setSearch] = useState("");
  const [entity, setEntity] = useState<PaqueteDto>();
  const [packageForDelete, setPackageForDelete] = useState<PaqueteDto>();
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

  const handleEdit = (paquete?: PaqueteDto) => {
    setEntity(paquete);
    setIsOpen(!isOpen);
  };

  const handleCloseModal = () => {
    handleIsOpenModal(false);
    setEntity(undefined);
  };

  const handleCreate = async () => {
    // Validate credits
    if (await validateCreditsAgency(agencia)) {
      // Validate has rates
      if (validateHasRates(agencia)) {
        handleIsOpenModal();
      } else {
        // Modal hasn't rates
        setIsOpenModalHasNotRates(true)
      }
    } else {
      // Modal contact soport
      setIsOpenModalNoCredit(true)
    }
  }

  const handleDeletePackages = (pack?: PaqueteDto) => {
    setPackageForDelete(pack);
    setIsOpenModalDeletePackage(true)
  }

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
      renderHeader() {
        return (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            Estado
            <Tooltip title="Presione dos veces en el estado para modificarlo">
              <Help fontSize="small" />
            </Tooltip>
          </Box>
        )
      },
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
          <>
            <Chip
              label={String(estado).replaceAll("_", " ")}
              sx={{
                backgroundColor: COLORS_BY_STATUS[estado][0],
                color: "#fff",
                textTransform: "capitalize",
                fontWeight: "bold",
                cursor: "pointer"
              }}
            />
          </>
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
      width: 100,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 2, alignItems: "center", height: "100%" }}>
          <Button
            variant="outlined"
            sx={{ minWidth: "auto", padding: "5px" }}
            onClick={() => handleEdit(params.row)}
          >
            <Edit sx={{ fontSize: 20 }} />
          </Button>
          <Button
            variant="outlined"
            sx={{ minWidth: "auto", padding: "5px", borderColor: "#ed6c02" }}
            onClick={() => handleDeletePackages(params.row as PaqueteDto)}
          >
            <Delete sx={{ fontSize: 20 }} color="warning" />
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <>
      <ModalNoCredit
        isOpen={isOpenModalNoCredit}
        onClose={() => setIsOpenModalNoCredit(false)}
      />
      <ModalHasNotRates
        isOpen={isOpenModalHasNotRates}
        onClose={() => setIsOpenModalHasNotRates(false)}
      />
      {isOpenModalDeletePackage && (
        <ModalDeletePackage
          isOpen={isOpenModalDeletePackage}
          onClose={() => {
            setPackageForDelete(undefined);
            setIsOpenModalDeletePackage(false);
          }}
          paquete={packageForDelete}
          ids={selectionModel ? Array.from(selectionModel?.ids!).map(id => String(id)) : []}
        />
      )}
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
            onClick={() => handleCreate()}
            size="small"
          >
            Crear
          </Button>
          <Button
            size="small"
            disabled={!filteredRows.slice(
              paginationModel.page * paginationModel.pageSize,
              (paginationModel.page + 1) * paginationModel.pageSize
            ).length}
            onClick={() => {
              const fechaInicioFormateada = fechaInicio.format("DD/MM/YYYY");
              const fechaFinFormateada = fechaFin.format("DD/MM/YYYY")
              const fileName = `${fechaInicioFormateada}-${fechaFinFormateada}.pdf`
              exportPDF(
                fileName,
                filteredRows,
                agencia?.nombre ?? "",
                fechaInicioFormateada + " a " + fechaFinFormateada
              )
            }}
          >
            <Tooltip title="Exportar como archivo PDF">
              <PictureAsPdf />
            </Tooltip>
          </Button>
          <Button
            size="small"
            disabled={!filteredRows.slice(
              paginationModel.page * paginationModel.pageSize,
              (paginationModel.page + 1) * paginationModel.pageSize
            ).length}
            onClick={() => {
              const fechaInicioFormateada = fechaInicio.format("DD/MM/YYYY");
              const fechaFinFormateada = fechaFin.format("DD/MM/YYYY")
              const fileName = `${fechaInicioFormateada}-${fechaFinFormateada}.xlsx`
              exportExcel(
                fileName,
                filteredRows,
                agencia?.nombre ?? "",
                fechaInicioFormateada + " a " + fechaFinFormateada
              )
            }}
          >
            <Tooltip title="Exportar como archivo .xlsx">
              <TableView />
            </Tooltip>
          </Button>
        </Box>

        <DataTable<PaqueteDto>
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
                onBatchDelete={() => setIsOpenModalDeletePackage(true)}
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