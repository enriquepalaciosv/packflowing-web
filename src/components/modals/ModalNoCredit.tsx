import { Box, Button, Link, Typography } from "@mui/material";
import Modal from "./Modal";
import { useAgenciaStore } from "../../zustand/useAgenciaStore";

export default function ModalNoCredit({
    isOpen,
    onClose,
}: {
    isOpen: boolean;
    onClose: () => void;
}) {
    return <Modal
        open={isOpen}
        onClose={onClose}
        title={"Créditos insuficientes"}
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
    const { agencia } = useAgenciaStore();

    if(!agencia) return null

    return (
        <Box sx={{ paddingX: "24px", marginBottom: 2, display: "flex", flexDirection: "column", gap: 3 }}>
            <Typography>
                Has alcanzado el límite de ({agencia.suscripcion.limite}) paquetes en tu suscripción para el mes actual, envía un correo a <Link href="mailto:soporte@packflowing.com">soporte@packflowing.com</Link> para mejorar tu suscripción o espera hasta el próximo mes para continuar gestionando más paquetes
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                <Button onClick={onClose} variant="outlined" size="small">Cerrar</Button>
            </Box>
        </Box>
    )
}