import { Usuario } from "../../firebase/firestore/usuarios";
import FormUser from "../users/FormUser";
import Modal from "./Modal";

export default function ModalFormUser({
  entity,
  isOpen,
  onClose,
}: {
  entity: Usuario;
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title={"Editar usuario"}
      content={<FormUser onClose={onClose} entity={entity} />}
    />
  );
}
