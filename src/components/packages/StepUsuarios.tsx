import { Box, Button, TextField } from "@mui/material";
import AutocompleteComponent from "../inputs/Autocomplete";
import React from "react";
import {
  Usuario,
  searchUsersByFullNameOrLocker,
} from "../../firebase/firestore/usuarios";

export default function StepUsuario({
  selectedUser,
  setSelectedUser,
  handleBack,
  handleNext,
  activeStep,
}: {
  selectedUser: Usuario | undefined;
  setSelectedUser: (usuario: Usuario) => void;
  handleBack: () => void;
  handleNext: () => void;
  activeStep: number;
}) {
  const [usuarios, setUsuarios] = React.useState<Usuario[]>([]);

  const handleInputChange = async (_: any, newValue: string) => {
    console.log({ newValue });
    if (newValue.length >= 2) {
      const usuarios = await searchUsersByFullNameOrLocker(newValue);
      setUsuarios(usuarios || []);
    }
  };

  return (
    <Box
      sx={{
        minHeight: 300,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <AutocompleteComponent
        options={usuarios}
        value={selectedUser}
        noOptionsText="No hay registros disponibles"
        size="small"
        getOptionLabel={(user) =>
          `${user?.name} ${user?.lastName} — ${user?.lockerCode}`
        }
        onInputChange={handleInputChange}
        onChange={(_, value) => value && setSelectedUser(value)}
        renderInput={(params) => (
          <TextField {...params} label="Buscar usuario por nombre o locker" />
        )}
      />
      <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
        <Button disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>
          Anterior
        </Button>
        <Box sx={{ flex: "1 1 auto" }} />
        <Button onClick={handleNext} disabled={!selectedUser}>
          Siguiente
        </Button>
      </Box>
    </Box>
  );
}
