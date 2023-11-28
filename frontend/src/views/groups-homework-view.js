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
  Badge, 
  Box,
  CircularProgress
} from "@mui/material";
import isAuth from "@/components/isAuth";
import { useQuery } from "react-query";
import { getProfessorAllSubmitedHomeworks } from "@/api";


const GroupsHomeworkView = (props) => {
  const { data, isLoading, isRefetching, error, isError } = useQuery(
    ["professorAllSubmitedHomeworks"],
    () => getProfessorAllSubmitedHomeworks(props.zadaca)
  );
  return (
    <Container>
      <Grid container spacing={1} sx={{ marginTop: 5 }}>
        <Grid item xs={12} sx={{ marginBottom: 5 }}>
          <Paper>
            <Grid container spacing={2}>
              <Grid item>
                <Typography variant="h5" sx={{ marginLeft: 2 }}>
                  {" "}
                  Zadaća: {!(isLoading || isRefetching) &&
                  !isError && data?.homework.name}
                </Typography>
              </Grid>
              <Grid item>
                <Button>POSTAVI REZULTATE</Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {(isLoading || isRefetching) && (
          <Grid item xs={12}>
            <Box display="flex" justifyContent="center" mt={3}>
              <CircularProgress size={50} />
              </Box>
          </Grid>
        )}

        <Grid item xs={12}>
          {" "}
        </Grid>

        <Grid item xs={12}>
          <Grid container spacing={2}>
            {!(isLoading || isRefetching) &&
            !isError && data?.data.map((element) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={element.id}>
                <Card sx={{ maxWidth: 345, backgroundColor: element.grade === null ? "#ffd6d6" : "#b5ffb3"}}>
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div" sx={{textAlign: "center"}}>
                      {element.user.name}  {element.user.surname}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{justifyContent: "center", marginTop: -1}}>
                    <Button size="small">
                      <Link href={"/profiles/profesor/homework/"+element.id} underline="none">
                        PREGLEDAJ
                      </Link>
                    </Button>
                    <Badge badgeContent={element.grade} color="primary" sx={{marginLeft: 2}}>
                    </Badge>
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
export default isAuth(GroupsHomeworkView, "groups-homework-view");
