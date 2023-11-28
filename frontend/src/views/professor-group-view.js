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
  CircularProgress,
  Box
} from "@mui/material";
import { useEffect } from "react";
import isAuth from "@/components/isAuth";
import { getGroup, getProfessorHomeworksForSpecificGroup } from "@/api";
import { useQuery } from "react-query";

const cutTimeFromDate=(date) => {
  const index = date.indexOf('T');
  const newDate=date.substring(0, index);
  return newDate.split('-').reverse().join('.');
}

const ProfessorGroupView = (props) => {

  const { data, isLoading, isRefetching, error, isError } = useQuery(
    ["professorHomeworksForSpecificGroup"],
    () => getProfessorHomeworksForSpecificGroup(props.grupa)
  );

  const { data: grupa, refetch: refetch2} = useQuery(
    ["group"],
    () => getGroup(props.grupa),
    {enabled: false}
  );

  useEffect(() => {
    refetch2();
  }, [refetch2]);

  return (
    <Container>

      <Grid container spacing={1} sx={{ marginTop: 5 }}>
        <Grid item xs={12} sx={{ marginBottom: 1 }}>
          <Paper>
            <Grid container spacing={2}>
              <Grid item>
                <Typography variant="h5" sx={{ marginLeft: 2 }}>
                  {" "}
                  GRUPA: {grupa && grupa.name}
                </Typography>
              </Grid>
              <Grid item>
              <Button size="small">
                <Link href="/profiles/profesor/professor-homework" underline="none">
                  DODAJ ZADAĆU
                </Link>
              </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          {" "}
        </Grid>

        {(isLoading || isRefetching) && (
          <Grid item xs={12}>
            <Box display="flex" justifyContent="center" mt={3}>
              <CircularProgress size={50} />
              </Box>
          </Grid>
        )}
        
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
          {!(isLoading || isRefetching) &&
            !isError &&  data[0]?.map((element) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={element.id}>
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
              </Grid>))}
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
          {!(isLoading || isRefetching) &&
            !isError &&  data[1]?.map((element) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={element.id}>
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
              </Grid>))}
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
          {!(isLoading || isRefetching) &&
            !isError && data[2]?.map((element) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={element.id}>
                <Card sx={{ maxWidth: 345, backgroundColor: "#ffd6d6"}}>
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
              </Grid>))}
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};
export default isAuth(ProfessorGroupView, "professor-group-view");
