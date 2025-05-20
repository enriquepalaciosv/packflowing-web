import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Modal from "./Modal";

export default function ModalHasNotRates({
    isOpen,
    onClose,
}: {
    isOpen: boolean;
    onClose: () => void;
}) {
    return <Modal
        open={isOpen}
        onClose={onClose}
        title={"No hay tarifas registradas"}
        content={<ContentModal onClose={onClose} />}
        sx={{
            marginX: "auto",
            width: {
                xs: "90%",
                sm: "50%",
            }
        }}
    />
}

const ContentModal = ({ onClose }: { onClose: () => void }) => {
    const navigate = useNavigate();
    return (
    <Box sx={{ paddingX: "24px", marginBottom: 2, display: "flex", flexDirection: "column", gap: 3 }}>
        <Typography>
            La agencia no tiene tarifas registradas. Por favor, debe registrar al menos una para poder crear paquetes desde el menú de configuración.
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 2 }}>
            <Button onClick={onClose} variant="outlined" size="small">Cerrar</Button>
            <Button onClick={() => navigate("/settings")} variant="contained" size="small">Ir a Configuración</Button>
        </Box>
    </Box>
)
}