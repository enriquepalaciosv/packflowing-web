import { Box, Button, Typography } from "@mui/material";
import { toast } from "react-toastify";
import { deletePackage, PaqueteDto } from "../../firebase/firestore/paquetes";
import { usePaqueteStore } from "../../zustand/usePaquetesStore";
import Modal from "./Modal";

export default function ModalDeletePackage({
    isOpen,
    onClose,
    paquete
}: {
    isOpen: boolean;
    onClose: () => void;
    paquete: PaqueteDto
}) {
    return <Modal
        open={isOpen}
        onClose={onClose}
        title={"Eliminar paquete"}
        content={<ContentModal id={paquete.id} idRastreo={paquete.idRastreo} onClose={onClose} />}
        sx={{
            marginX: "auto",
            width: {
                xs: "90%",
                sm: "50%",
            }
        }}
    />
}

const ContentModal = ({ id, idRastreo, onClose }: { id: string, idRastreo: string, onClose: () => void }) => {
    const { fetchAllPaquetes, fetchCounts } = usePaqueteStore();

    const handleDelete = async () => {
        try {
            await deletePackage(id);
            toast.success('Paquete eliminado con éxito');
            onClose();
        } catch (error) {
            toast.error(`Error al eliminar paquete. Intente nuevamente`);
        } finally {
            await Promise.all([fetchAllPaquetes(), fetchCounts()]);
        }
    };

    return (
        <Box sx={{ paddingX: "24px", marginBottom: 2, display: "flex", flexDirection: "column", gap: 3 }}>
            <Typography>
                Estas a punto de eliminar el paquete ({idRastreo}). ¿Estás seguro que deseas continuar?
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 2 }}>
                <Button onClick={onClose} variant="outlined" size="small">Cancelar</Button>
                <Button onClick={handleDelete} variant="contained" color="warning" size="small">Eliminar paquete</Button>
            </Box>
        </Box>
    )
}