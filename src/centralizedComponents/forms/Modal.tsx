import React from "react";
import { Modal, Box, IconButton, SxProps, Theme } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface CentralizedModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  sx?: SxProps<Theme>;
}

export const CentralizedModal: React.FC<CentralizedModalProps> = ({
  open,
  onClose,
  children,
  sx,
}) => {
  const defaultStyle: SxProps<Theme> = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
    maxWidth: "90vw", 
    maxHeight: "90vh", 
    overflow: "auto", 
    "&::-webkit-scrollbar": {
      width: "6px", 
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "#888", 
      borderRadius: "4px", 
    },
    "&::-webkit-scrollbar-thumb:hover": {
      backgroundColor: "#555", 
    },
    "&::-webkit-scrollbar-track": {
      backgroundColor: "#f1f1f1", 
      borderRadius: "4px", 
    },
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="centralized-modal-title"
      aria-describedby="centralized-modal-description"
    >
      <Box sx={{ ...defaultStyle, ...sx }}>
        <IconButton
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            color: "text.primary",
          }}
          onClick={onClose}
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>
        {children}
      </Box>
    </Modal>
  );
};
