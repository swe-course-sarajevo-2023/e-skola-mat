"use client";
import {
  Box,
  Button,
  CardActions,
  Container,
  Modal,
  Typography,
  Grid,
  Paper,
  TextField,
} from "@mui/material";
import { useState } from "react";
import Canvas from "../utils/canvas";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import isAuth from "@/components/isAuth";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const student = {
  name: "Mujo",
  surname: "Mujic",
  group: 3,
  id: 15,
  homeworks: [
    ["image1", "image2", "image3"],
    ["image1", "image2"],
    ["image1", "image2", "image3", "image4"],
  ],
};

const HomeworkView = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImg, setSelectedImg] = useState(0);
  const [selectedImgSource, setSelectedImgSource] = useState("");
  const [selectedHomework, setSelectedHomework] = useState(0);

  const handleClose = () => setModalOpen(false);

  const handleImageButton = (imageNum, imageSource) => {
    setSelectedImg(imageNum);
    setSelectedImgSource(imageSource);
    setModalOpen(true);
  };

  return (
    <Container>
      <Grid container spacing={2} sx={{ marginTop: 5 }}>
        <Grid item xs={4}>
          <Paper>
            <Typography variant="h4">
              {" "}
              Učenik: {student.name} {student.surname}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={8}></Grid>
        <Grid item xs={4}>
          <Paper>
            <Typography variant="h5"> Grupa: {student.group}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={8}></Grid>
        <Grid item xs={4}>
          <Paper>
            <Typography variant="h6">
              Pregled zadaće {selectedHomework + 1}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={8}></Grid>
        <Grid item xs={12} sx={{ display: "flex" }}>
          <TextField
            id="standard-basic"
            size="small"
            sx={{ marginRight: 2 }}
            label="Unesite ocjenu"
            variant="outlined"
          />
          <div style={{ marginTop: "auto", marginBottom: "auto" }}>
            <Button variant="outlined" size="small">
              Snimi ocjenu
            </Button>
          </div>
        </Grid>
        <Grid item xs={3}>
          <Card sx={{ maxWidth: 345 }}>
            <div
              style={{
                backgroundImage: `url('/img1.png')`,
                backgroundRepeat: "no-repeat",
                height: "140px",
                width: "200px",
              }}
            ></div>
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Slika 1
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Komentar na sliku 1
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                size="small"
                onClick={() => handleImageButton(1, "img1.png")}
              >
                Pregledaj
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={3}>
          <Card sx={{ maxWidth: 345 }}>
            <div
              style={{
                backgroundImage: `url('/img2.png')`,
                backgroundRepeat: "no-repeat",
                height: "140px",
                width: "200px",
              }}
            ></div>
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Slika 2
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Komentar na sliku 2
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                size="small"
                onClick={() => handleImageButton(2, "img2.png")}
              >
                Pregledaj
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={3}>
          <Card sx={{ maxWidth: 345 }}>
            <div
              style={{
                backgroundImage: `url('/img3.png')`,
                backgroundRepeat: "no-repeat",
                height: "140px",
                width: "200px",
              }}
            ></div>
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Slika 3
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Komentar na sliku 3
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                size="small"
                onClick={() => handleImageButton(3, "img3.png")}
              >
                Pregledaj
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={3} sx={{ padding: 2 }}>
          <Card sx={{ maxWidth: 345 }}>
            <div
              style={{
                backgroundImage: `url('/img3.png')`,
                backgroundRepeat: "no-repeat",
                height: "140px",
                width: "200px",
              }}
            ></div>
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Slika 4
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Komentar na sliku 4
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                size="small"
                onClick={() => handleImageButton(4, "img3.png")}
              >
                Pregledaj
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>

      <Modal
        open={modalOpen}
        onClose={handleClose}
        sx={{ width: "auto" }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h5" component="h2">
            Zadaća {selectedHomework + 1}
          </Typography>
          <Typography variant="h5" id="modal-modal-description" sx={{ mt: 2 }}>
            Slika {selectedImg}
          </Typography>
          <Canvas source={selectedImgSource} />
        </Box>
      </Modal>
    </Container>
  );
};

export default isAuth(HomeworkView, "homework-view");
