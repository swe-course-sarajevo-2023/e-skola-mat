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
} from "@mui/material";
import { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import SubmitModal from "./submit-homework";
import isAuth from "@/components/isAuth";

const currentDate = new Date();

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

const homework = ["/img1.png", "/img2.png", "/img3.png", "/img3.png"]; //Zadaće koje nastavnik postavlja
const date = [
  new Date("2023-09-09"),
  new Date("2023-12-12"),
  new Date("2023-12-31"),
  new Date("2024-01-04"),
]; //Rok za predati
const comment = [
  "Najbolja zadaća u povijesti ljudske rase",
  "Drugi zadatak netačan",
  "",
]; //currCommenti nastavnik
const homeworkComment = [
  //Komantari po zadacima
  ["Ti si kralj", "Svaka čast", "Samo naprijed"],
  ["sin(pi/2) nije 15", "podcrtani dio nema smisla"],
  ["", "", "", "mrsko mi pisati currCommente"],
];

const student = {
  name: "Niko",
  surname: "Nikić",
  group: 3,
  id: 15,
  homeworks: [
    //Zadaće
    ["/img1.png", "/img2.png", "/img2.png"],
    ["/img1.png", "/img2.png"],
    ["/img1.png", "/img2.png", "/img3.png", "/img3.png"],
  ],
};

const UcenikView = () => {
  const [modalOpen, setModalOpenPostavka] = useState(false);
  const [modalOpen1, setModalOpenDodaj] = useState(false);
  const [selectedHomework, setSelectedHomeworkNumb] = useState(0);
  const [expired, setDate] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [homeworkId, setHomeworkId] = useState(1);

  const handleClose = () => setModalOpenPostavka(false);

  const handleClose1 = () => setModalOpenDodaj(false);

  const handleImageButtonPostavka = (homeworkNumb) => {
    setSelectedHomeworkNumb(homeworkNumb);
    setModalOpenPostavka(true);
  };

  const handleImageButtonDodaj = (homeworkNumb, expired) => {
    setSelectedHomeworkNumb(homeworkNumb);
    setModalOpenDodaj(true);
    setDate(expired);
  };

  return (
    <>
      <Container>
        <Grid item xs={12} style={{ marginTop: "10%" }}>
          <Paper>
            <Typography variant="h6">Pregled zadaća</Typography>
          </Paper>
        </Grid>
        <Grid container spacing={2} sx={{ marginTop: 5 }}>
          <Grid item xs={8}></Grid>
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            sx={{ display: "flex" }}
          ></Grid>
          {homework.map((currHomework, index) => {
            const currDate = date[index].toDateString();
            const currComment = comment[index];

            return (
              <Grid item xs={3}>
                <Card sx={{ maxWidth: 345 }}>
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      Zadaća {index + 1}
                    </Typography>
                    {currComment != "" && (
                      <Typography variant="body2" color="text.secondary">
                        {currComment}
                      </Typography>
                    )}
                    {currComment == "" && (
                      <Typography variant="body2" color="text.secondary">
                        Zadaća nije pregledana
                      </Typography>
                    )}
                    {date[index].getTime() < currentDate.getTime() && (
                      <Typography>Istekao rok.</Typography>
                    )}
                    {date[index].getTime() > currentDate.getTime() && (
                      <Typography>Rok do {currDate}.</Typography>
                    )}
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      onClick={() => handleImageButtonPostavka(index)}
                    >
                      Postavka
                    </Button>
                    <Button
                      size="small"
                      onClick={() =>
                        handleImageButtonDodaj(
                          index,
                          date[index].getTime() < currentDate.getTime()
                        )
                      }
                    >
                      Pregledaj
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
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
            <img src={homework[selectedHomework]} loading="lazy" />
          </Box>
        </Modal>

        <Modal
          open={modalOpen1}
          onClose={handleClose1}
          sx={{ width: "auto" }}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h5" component="h2">
              Zadaća {selectedHomework + 1} - Tvoje rješenje
            </Typography>
            {student.homeworks[selectedHomework] &&
              student.homeworks[selectedHomework].map((zadaca, index) => (
                <>
                  <img src={zadaca} loading="lazy" />
                  <Typography
                    id="modal-modal-title"
                    variant="h5"
                    component="h2"
                  >
                    {homeworkComment[selectedHomework][index]}
                  </Typography>
                </>
              ))}
            {!student.homeworks[selectedHomework] && (
              <Typography id="modal-modal-title" variant="h5" component="h2">
                Nije predana.
              </Typography>
            )}
            {!expired && (
              <Button
                xs={12}
                sx={{ display: "flex" }}
                size="small"
                onClick={() => setShowSubmitModal(true)}
              >
                Dodaj
              </Button>
            )}
            <SubmitModal
              open={showSubmitModal}
              onClose={() => setShowSubmitModal(false)}
              brojZadace={selectedHomework}
              homework_id={homeworkId}
            />
          </Box>
        </Modal>
      </Container>
    </>
  );
};

export default isAuth(UcenikView, "student-view");
