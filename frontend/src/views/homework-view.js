"use client";
import {
  Box,
  Button,
  CardActionArea,
  CardActions,
  Container,
  Modal,
  Typography,
} from "@mui/material";
import { useState } from "react";
import Canvas from "../utils/canvas";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function HomeworkView() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImg, setSelectedImg] = useState(0);

  const handleClose = () => setModalOpen(false);

  const handleImageButton = (imageNum) => {
    setSelectedImg(imageNum);
    setModalOpen(true);
  };

  return (
    <Container>
      <Box
        sx={{ display: "flex", justifyContent: "center", marginTop: "70px" }}
      >
        <Button variant="contained" onClick={() => handleImageButton(0)}>
          Image 0
        </Button>
      </Box>
      <Box
        sx={{ display: "flex", justifyContent: "center", marginTop: "70px" }}
      >
        <Button variant="contained" onClick={() => handleImageButton(1)}>
          Image 1
        </Button>
      </Box>
      <Box
        sx={{ display: "flex", justifyContent: "center", marginTop: "70px" }}
      >
        <Button variant="contained" onClick={() => handleImageButton(2)}>
          Image 2
        </Button>
      </Box>
      <Modal
        open={modalOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Modal header
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Selected image is number {selectedImg}
          </Typography>
          <Canvas />
        </Box>
      </Modal>
    </Container>
  );
}
