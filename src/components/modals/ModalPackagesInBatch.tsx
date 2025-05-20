import { GridRowId } from "@mui/x-data-grid";
import FormPackagesInBatch from "../packages/FormPackagesInBatch";
import Modal from "./Modal";

export default function ModalPackagesInBatch({
  ids,
  isOpen,
  onClose,
}: {
  ids?: Set<GridRowId>;
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title={`Editar ${ids?.size} paquete(s) seleccionado(s)`}
      content={<FormPackagesInBatch onClose={onClose} ids={ids} />}
    />
  );
}
