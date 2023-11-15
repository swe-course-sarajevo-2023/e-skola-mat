"use client";
import {
  Button,
  Container,
  Typography,
  Grid,
  Paper,
  Link,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";
import { useState } from "react";
import AddModal from "./add-homework";
import isAuth from "@/components/isAuth";

const OpenHomeworks = [
  { index: "6", datum: new Date("2023-12-12") },
  { index: "7", datum: new Date("2023-11-13") },
];
const ForReviewHomeworks = [
  { index: "5", datum: new Date("2023-10-12") },
  { index: "4", datum: new Date("2023-10-03") },
];
const finishedHomeworks = [
  { index: "3", datum: new Date("2023-09-22") },
  { index: "2", datum: new Date("2023-09-12") },
  { index: "1", datum: new Date("2023-09-01") },
];

const ProfessorGroupView = (props) => {
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  return (
    <Container>
      <Grid container spacing={1} sx={{ marginTop: 5 }}>
        <Grid item xs={12} sx={{ marginBottom: 5 }}>
          <Paper>
            <Grid container spacing={2}>
              <Grid item>
                <Typography variant="h5" sx={{ marginLeft: 2 }}>
                  {" "}
                  GRUPA: {props.grupa}
                </Typography>
              </Grid>
              <Grid item>
                <Button onClick={() => setShowSubmitModal(true)}>
                  DODAJ ZADAĆU
                </Button>
              </Grid>
              <AddModal
                open={showSubmitModal}
                onClose={() => setShowSubmitModal(false)}
              />
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          {" "}
        </Grid>

        <Grid item xs={12} sx={{ marginTop: 2 }}>
          <Paper sx={{ backgroundColor: "#ffd6d6" }}>
            <Grid container spacing={2}>
              <Grid item>
                <Typography variant="h7">OTVORENO</Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12}></Grid>

        <Grid item xs={12}>
          <Grid container spacing={2}>
            {OpenHomeworks.map((element) => (
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <Card sx={{ maxWidth: 345 }}>
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      Zadaća {element.index}
                    </Typography>

                    <Typography>
                      Datum: {element.datum.toDateString()}.
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small">POSTAVKA</Button>
                    <Button size="small">
                      <Link
                        href={"/profiles/profesor/zadaca/" + element.index}
                        underline="none"
                      >
                        PRIKAZ
                      </Link>
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>

        <Grid item xs={12}>
          {" "}
        </Grid>

        <Grid item xs={12} sx={{ marginTop: 2 }}>
          <Paper sx={{ backgroundColor: "#ffffb3" }}>
            <Grid container spacing={2}>
              <Grid item>
                <Typography variant="h7">ZA PREGLEDATI</Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12}></Grid>

        <Grid item xs={12}>
          <Grid container spacing={2}>
            {ForReviewHomeworks.map((element) => (
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <Card sx={{ maxWidth: 345 }}>
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      Zadaća {element.index}
                    </Typography>

                    <Typography>
                      Datum: {element.datum.toDateString()}.
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small">POSTAVKA</Button>
                    <Button size="small">
                      <Link
                        href={"/profiles/profesor/zadaca/" + element.index}
                        underline="none"
                      >
                        PRIKAZ
                      </Link>
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>

        <Grid item xs={12}>
          {" "}
        </Grid>

        <Grid item xs={12} sx={{ marginTop: 2 }}>
          <Paper sx={{ backgroundColor: "#b5ffb3" }}>
            <Grid container spacing={2}>
              <Grid item>
                <Typography variant="h7">ZAVRŠENO</Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12}></Grid>

        <Grid item xs={12}>
          <Grid container spacing={2}>
            {finishedHomeworks.map((element) => (
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <Card sx={{ maxWidth: 345 }}>
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      Zadaća {element.index}
                    </Typography>

                    <Typography>
                      Datum: {element.datum.toDateString()}.
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small">POSTAVKA</Button>
                    <Button size="small">
                      <Link
                        href={"/profiles/profesor/zadaca/" + element.index}
                        underline="none"
                      >
                        PRIKAZ
                      </Link>
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};
export default isAuth(ProfessorGroupView, "professor-group-view");
