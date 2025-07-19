
import { Box, Button, Typography } from "@mui/material";
import { toast } from "react-toastify";
import { deletePackage, PaqueteDto } from "../../firebase/firestore/paquetes";
import { usePaqueteStore } from "../../zustand/usePaquetesStore";
import Modal from "./Modal";

interface ModalDeletePackageProps {
    isOpen: boolean;
    onClose: () => void;
    paquete?: PaqueteDto;
    ids: string[];
}

interface ContentModalProps {
    ids: string[];
    idRastreo: string;
    onClose: () => void;
}

export default function ModalDeletePackage(props: ModalDeletePackageProps) {
    const { isOpen, onClose, paquete, ids } = props;
    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            title={"Eliminar paquete" + (ids.length > 1 ? "s" : "")}
            content={
                <ContentModal
                    ids={ids.length > 1 ? ids : [paquete!.id]}
                    idRastreo={ids.length === 1 ? paquete!.idRastreo : ""}
                    onClose={onClose}
                />
            }
            sx={{
                marginX: "auto",
                width: {
                    xs: "90%",
                    sm: "50%",
                }
            }}
        />
    );
}

const ContentModal = (props: ContentModalProps) => {
    const { ids, idRastreo, onClose } = props;
    const { fetchAllPaquetes, fetchCounts } = usePaqueteStore();

    const handleDelete = async () => {
        try {
            for (const id of ids) {
                await deletePackage(id);
            }
            toast.success('Eliminación exitosa');
            onClose();
        } catch (error) {
            toast.error('Error al eliminar. Intente nuevamente');
        } finally {
            await Promise.all([fetchAllPaquetes(), fetchCounts()]);
        }
    };

    return (
        <Box sx={{ paddingX: "24px", marginBottom: 2, display: "flex", flexDirection: "column", gap: 3 }}>
            <Typography>
                {ids.length > 1 ? `${ids.length} paquetes serán eliminados permanentemente ` : `El paquete ${idRastreo} será eliminado permanentemente `}
                ¿Estás seguro que deseas continuar?
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 2 }}>
                <Button onClick={onClose} variant="outlined" size="small">Cancelar</Button>
                <Button onClick={handleDelete} variant="contained" color="warning" size="small">
                    Eliminar
                </Button>
            </Box>
        </Box>
    );
};