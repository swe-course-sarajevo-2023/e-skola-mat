"use client";
import {
  Button,
  Container,
  Typography,
  Grid,
  Paper,
} from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
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

const student1 = {
    name: "Neko",
    surname: "Nekić",
    group: 3,
    id: 16,
    homeworks: [
      //Zadaće
      ["/img1.png", "/img2.png", "/img2.png"],
      ["/img1.png", "/img2.png"],
      ["/img1.png", "/img2.png", "/img3.png", "/img3.png"],
    ],
  };

  const student2 = {
    name: "Možda",
    surname: "Moždić",
    group: 3,
    id: 17,
    homeworks: [
      //Zadaće
      ["/img1.png", "/img2.png", "/img2.png"],
      ["/img1.png", "/img2.png"],
      ["/img1.png", "/img2.png", "/img3.png", "/img3.png"],
    ],
  };

const students = [student, student1, student2]

const group = 3; // Group ID

const StudentGroupView = () => {

  return (
    <>
      <Container>
        <Grid item xs={12} style={{ marginTop: "10%" }}>
        <Grid container spacing={2} sx={{ marginBottom: 5 }}>
        <Grid item xs={6}>
                <Card sx={{ maxWidth: 345 }}>
                  <CardContent>
                    <Button gutterBottom variant="h5" component="div">
                      Dodaj učenika
                    </Button>
                  </CardContent>
                  
                </Card>
         </Grid>
         <Grid item xs={6}>
                <Card sx={{ maxWidth: 345 }}>
                  <CardContent>
                    <Button gutterBottom variant="h5" component="div">
                    Obriši učenika
                    </Button>
                  </CardContent>
                  
                </Card>
         </Grid>
         </Grid>
          <Paper>
            <Typography variant="h6">Grupa {group}</Typography>
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
          >
            
          </Grid>
          
          {students.map((student) => {

            return (
              <Grid item xs={3}>
                <Card sx={{ maxWidth: 345 }}>
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {student.name}
                    </Typography>
                    <Typography gutterBottom variant="h5" component="div">
                      {student.surname}
                    </Typography>
                  </CardContent>
                  
                </Card>
              </Grid>
            );
          })}
        </Grid>

        
      </Container>
    </>
  );
};

export default isAuth(StudentGroupView, "student-view");
