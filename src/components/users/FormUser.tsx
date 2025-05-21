import { Box, Button, DialogContent, Grid, Stack } from "@mui/material";
import { Usuario } from "../../firebase/firestore/usuarios";
import useUserFormik from "../../hooks/useUserHook";
import useBreakpoint from "../../utils/useBreakpoint";
import InputFormik from "../inputs/InputFormik";
import SelectCountryCodes from "../inputs/SelectCountryCodes";


export default function FormUser({
    entity,
    onClose,
}: {
    entity: Usuario;
    onClose: () => void;
}) {
    const bp = useBreakpoint();
    const {
        values,
        loading,
        errors,
        touched,
        handleChange,
        handleBlur,
        setFieldValue,
        handleSubmit,
    } = useUserFormik(entity);

    const handleSubmitAndCloseModal = () => {
        handleSubmit();
        onClose();
    }

    return (
        <DialogContent sx={{ maxWidth: "100%" }}>
            <Grid container spacing={4} sx={{ paddingX: 4, paddingTop: 2 }}>
                <Grid size={{ sm: 4, md: 6 }}>
                    <InputFormik
                        label="Nombre"
                        name="name"
                        value={values.name}
                        error={!!touched.name && !!errors.name}
                        errorText={errors.name ?? ""}
                        handleChange={handleChange("name")}
                        handleBlur={handleBlur("name")}
                    />
                </Grid>

                <Grid size={{ sm: 4, md: 6 }}>
                    <InputFormik
                        label="Apellido"
                        name="lastName"
                        value={values.lastName}
                        error={!!touched.lastName && !!errors.lastName}
                        errorText={errors.lastName ?? ""}
                        handleChange={handleChange("lastName")}
                        handleBlur={handleBlur("lastName")}
                    />
                </Grid>

                <Grid size={{ sm: 4, md: 6 }}>
                    <InputFormik
                        label="Correo"
                        name="email"
                        value={values.email}
                        error={!!touched.email && !!errors.email}
                        errorText={errors.email ?? ""}
                        handleChange={handleChange("email")}
                        handleBlur={handleBlur("email")}
                        type="email"
                        autoCapitalize="none"
                    />
                </Grid>

                <Grid size={{ sm: 4, md: 6 }}>
                    <Stack
                        sx={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            gap: 2,
                        }}
                    >
                        <SelectCountryCodes
                            label={"Cód."}
                            name={"countryCode"}
                            value={values.countryCode}
                            error={!!touched.countryCode && !!errors.countryCode}
                            errorText={errors.countryCode ?? ""}
                            setFieldValue={setFieldValue}
                            handleBlur={handleBlur("countryCode")}
                        />

                        <InputFormik
                            label="Teléfono"
                            name="phone"
                            value={values.phone}
                            error={!!touched.phone && !!errors.phone}
                            errorText={errors.phone ?? ""}
                            handleChange={handleChange("phone")}
                            handleBlur={handleBlur("phone")}
                            style={{ width: bp === "xs" || bp === "sm" ? "60%" : "70%" }}
                        />
                    </Stack>
                </Grid>
                <Grid size={{ sm: 4, md: 6 }}>
                    <InputFormik
                        label="Cliente"
                        name="lockerCode"
                        value={values.lockerCode}
                        error={!!touched.lockerCode && !!errors.lockerCode}
                        errorText={errors.lockerCode ?? ""}
                        handleChange={handleChange("lockerCode")}
                        handleBlur={handleBlur("lockerCode")}
                    />
                </Grid>

                <Grid size={{ xs: 12 }} sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                    <Button onClick={onClose} sx={{ mr: 1 }}>
                        Cancelar
                    </Button>
                    <Box sx={{ flex: "1 1 auto" }} />
                    <Button onClick={handleSubmitAndCloseModal}>
                        Guardar
                    </Button>
                </Grid>
            </Grid>
        </DialogContent>
    )
}