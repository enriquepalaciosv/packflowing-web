import { Dialog, DialogTitle } from "@mui/material";

interface ModalProps {
  title: string;
  content: React.JSX.Element;
  open: boolean;
  onClose: () => void;
}

export default function Modal({ title, content, open, onClose }: ModalProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      sx={{
        width: {
          xs: "100%",
          sm: "100%",
          md: "75%",
        },
        margin: "0 auto",
        ".MuiPaper-root": { width: "100%", maxWidth: "100%" },
      }}
    >
      <DialogTitle>{title}</DialogTitle>
      {content}
    </Dialog>
  );
}
