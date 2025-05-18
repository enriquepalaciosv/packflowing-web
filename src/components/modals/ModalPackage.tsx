import { PaqueteDto } from "../../firebase/firestore/paquetes";
import FormPackage from "../packages/FormPackage";
import Modal from "./Modal";

export default function ModalFormPackage({
  entity,
  isOpen,
  onClose,
}: {
  entity?: PaqueteDto;
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title={entity ? "Editar paquete" : "Crear paquete"}
      content={<FormPackage onClose={onClose} entity={entity} />}
    />
  );
}
