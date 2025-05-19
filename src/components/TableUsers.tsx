import { Box, Button, TextField } from "@mui/material";
import Paper from "@mui/material/Paper";
import {
    GridColDef,
    GridPagination,
    GridRowSelectionModel
} from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { PaqueteDto } from "../firebase/firestore/paquetes";
import { Usuario } from "../firebase/firestore/usuarios";
import { useUsuariosStore } from "../zustand/useUsuariosStore";
import DataTable from "./DataTable";
import FooterTable from "./FooterTable";
import ModalFormUser from "./ModalFormUser";

export default function TableUsers() {
    const [isOpen, setIsOpen] = useState(false);
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 20,
    });
    const [_, setIsOpenModalInBatch] = useState(false);
    const [search, setSearch] = useState("");
    const [entity, setEntity] = useState<Usuario>();
    const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>();

    const { countTotal, allUsuarios, resetUsuarios, fetchNextPage } = useUsuariosStore();

    useEffect(() => {
        resetUsuarios();
        fetchNextPage();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleIsOpenModal = (b?: boolean) => setIsOpen(b ?? !isOpen);

    const filteredRows = allUsuarios.filter((row) => {
        const searchTerm = search.toLowerCase();

        return (
            row.name?.toLowerCase().includes(searchTerm) ||
            row.lastName?.toLowerCase().includes(searchTerm) ||
            row.lockerCode?.toLowerCase().includes(searchTerm) ||
            row.id?.toLowerCase().includes(searchTerm) ||
            row.email?.toLowerCase().includes(searchTerm)
        );
    });

    const handleEdit = (usuario: Usuario) => {
        setEntity(usuario);
        setIsOpen(!isOpen);
    };

    const handleCloseModal = () => {
        handleIsOpenModal(false);
        setEntity(undefined);
    };

    const columns: GridColDef[] = [
        { field: "id", headerName: "ID", width: 270 },
        { field: "lockerCode", headerName: "Cliente", width: 120 },
        { field: "name", headerName: "Nombre", width: 120 },
        { field: "lastName", headerName: "Apellido", width: 120 },
        { field: "email", headerName: "Correo", width: 150 },
        {
            field: "phone",
            headerName: "Télefono",
            width: 150,
            renderCell: (params) => {
                const { countryCode, phone } = params.row;
                return countryCode + " " + phone
            }
        },
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
            {entity && <ModalFormUser
                isOpen={isOpen}
                onClose={handleCloseModal}
                entity={entity}
            />}
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
                    {/**
                        <Button
                            variant="contained"
                            onClick={() => handleIsOpenModal()}
                            size="small"
                        >
                            Crear
                        </Button>
                    */}
                </Box>

                <DataTable<Usuario>
                    rows={filteredRows.slice(
                        paginationModel.page * paginationModel.pageSize,
                        (paginationModel.page + 1) * paginationModel.pageSize
                    )}
                    columns={columns}
                    paginationModel={paginationModel}
                    onSelectionModelChange={setSelectionModel}
                    checkboxSelection={false}
                    slots={{
                        footer: () => <GridPagination />,
                    }}
                    onPaginationModelChange={async (newModel: {
                        page: number;
                        pageSize: number;
                    }) => {
                        setPaginationModel(newModel);

                        const totalLoaded = allUsuarios.length;
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
