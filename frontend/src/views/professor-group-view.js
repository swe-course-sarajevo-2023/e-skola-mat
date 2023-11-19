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
import { useState, useEffect } from "react";
import isAuth from "@/components/isAuth";
import axiosInstance from "@/utils/axios";

const cutTimeFromDate=(date) => {
  const index = date.indexOf('T');
  const newDate=date.substring(0, index);
  return newDate.split('-').reverse().join('-');
}

const ProfessorGroupView = (props) => {

  const [groupName, setGroupName] = useState("");

  const [openHomeworks, setOpenHomeworks] = useState([]);
  const [forReviewHomeworks, setForReviewHomeworks] = useState([]);
  const [finishedHomeworks, setFinishedHomeworks] = useState([]);

  useEffect(() => {

      const token=localStorage.getItem('token');

      axiosInstance.get('/groups/class', {
        params: {
          class_id: props.grupa,
        },
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }).then(response => {
        setGroupName(response.data.name);
        console.log(response.data.name);
      }).catch(error => {
        console.error('Error fetching data:', error);
      });

      axiosInstance.get('/homeworks/homeworks', {
          params: {
            class_id: props.grupa,
          },
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }).then(response => {
          setOpenHomeworks([]);
          setFinishedHomeworks([]);
          setForReviewHomeworks([]);
          response.data.forEach((obj) => {
            switch (obj.status) {
              case 'finished':
                setFinishedHomeworks((prev) => [...prev, obj]);
                break;
              case 'in progress':
                setForReviewHomeworks((prev) => [...prev, obj]);
                break;
              default:
                setOpenHomeworks((prev) => [...prev, obj]);
                break;
            }
          });       
        }).catch(error => {
          console.error('Error fetching data:', error);
        });
      }, []);
  return (
    <Container>
      <Grid container spacing={1} sx={{ marginTop: 5 }}>
        <Grid item xs={12} sx={{ marginBottom: 1 }}>
          <Paper>
            <Grid container spacing={2}>
              <Grid item>
                <Typography variant="h5" sx={{ marginLeft: 2 }}>
                  {" "}
                  GRUPA: {groupName}
                </Typography>
              </Grid>
              <Grid item>
                <Button>
                  DODAJ ZADAĆU
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          {" "}
        </Grid>

        <Grid item xs={12} sx={{ marginTop: 2 }}>
          <Paper sx={{ backgroundColor: "#b5ffb3" }}>
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
            {openHomeworks.map((element) => (
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <Card sx={{ maxWidth: 345, backgroundColor: "#b5ffb3"}}>
                  <CardContent>
                    <Typography gutterBottom variant="h6" component="div">
                      Zadaća: {element.name}
                    </Typography>

                    <Typography variant="h9">
                      Postavljeno: {cutTimeFromDate(element.dateOfCreation)}.
                      <br />
                    </Typography>

                    <Typography variant="h9">
                      Rok: {cutTimeFromDate(element.deadline)}.
                    </Typography>

                  </CardContent>
                  <CardActions sx={{justifyContent: "center", marginTop: -1}}>
                    <Button size="small">
                      <Link
                        href={"/profiles/profesor/zadaca/" + element.id}
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
            {forReviewHomeworks.map((element) => (
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <Card sx={{ maxWidth: 345, backgroundColor: "#ffffb3"}}>
                  <CardContent>
                    <Typography gutterBottom variant="h6" component="div">
                      Zadaća: {element.name}
                    </Typography>

                    <Typography variant="h9">
                      Postavljeno: {cutTimeFromDate(element.dateOfCreation)}.
                      <br />
                    </Typography>

                    <Typography variant="h9">
                      Rok: {cutTimeFromDate(element.deadline)}.
                    </Typography>
                  </CardContent>
                  <CardActions sx={{justifyContent: "center", marginTop: -1}}>
                    <Button size="small">
                      <Link
                        href={"/profiles/profesor/zadaca/" + element.id}
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
          <Paper sx={{ backgroundColor: "#ffd6d6" }}>
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
                <Card sx={{ maxWidth: 345, backgroundColor: "#ffd6d6" }}>
                  <CardContent>
                    <Typography gutterBottom variant="h6" component="div">
                      Zadaća: {element.name}
                    </Typography>

                    <Typography variant="h9">
                      Postavljeno: {cutTimeFromDate(element.dateOfCreation)}.
                      <br />
                    </Typography>

                    <Typography variant="h9">
                      Rok: {cutTimeFromDate(element.deadline)}.
                    </Typography>
                  </CardContent>
                  <CardActions sx={{justifyContent: "center", marginTop: -1}}>
                    <Button size="small">
                      <Link
                        href={"/profiles/profesor/zadaca/" + element.id}
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
