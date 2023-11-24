"use client";
import {
  TextField,
  Box,
  Modal,
  Button,
  Container,
  Typography,
  Grid,
  Paper,
} from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import isAuth from "@/components/isAuth";
import { useState } from "react";


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
  email: "niko.nikic@yahoo.com"
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
    email: "neko.nekic@gmail.com"
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
    email: "mozda.mozdic@gmail.com"
  };

const students = [student, student1, student2]

const group = 3; // Group ID

const StudentGroupView = () => {
  const [modalOpen, setModalOpenAdd] = useState(false);
  const [modalOpen1, setModalOpenDelete] = useState(false);

  const handleImageButtonAdd = () => {
    setModalOpenAdd(true);
  };

  const handleImageButtonDelete = () => {
    setModalOpenDelete(true);
  };

  
  const handleClose = () => setModalOpenAdd(false);

  const handleClose1 = () => setModalOpenDelete(false);

  const [name, setName]=useState(""); // set name of new student
  const [surname, setSurname]=useState(""); // set surname of new student
  const [email, setEmail]=useState(""); // set email of new student

  const [emailDelete, setEmailDelete]=useState(""); // set email of student you want to delete

  return (
    <>
      <Container>
        <Grid item xs={12} style={{ marginTop: "10%" }}>
        <Grid container spacing={2} sx={{ marginBottom: 5 }}>
        <Grid item xs={6}>
                <Card sx={{ maxWidth: 345 }}>
                  <CardContent>
                    <Button gutterBottom variant="h5" component="div" onClick={() => handleImageButtonAdd()}>
                      Dodaj učenika
                    </Button>
                  </CardContent>
                  
                </Card>
         </Grid>
         <Grid item xs={6}>
                <Card sx={{ maxWidth: 345 }}>
                  <CardContent>
                    <Button gutterBottom variant="h5" component="div" onClick={() => handleImageButtonDelete()}>
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
                    <Typography gutterBottom variant="h6" component="div">
                      {student.email}
                    </Typography>
                  </CardContent>
                  
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
          <Typography variant="h6">Unesite podatke novog učenika</Typography>
        <TextField fullWidth label="Ime učenika" id="name" onChange={(e)=>setName(e.target.value)}/>
        <TextField fullWidth label="Prezime učenika" id="surname" onChange={(e)=>setSurname(e.target.value)}/>
        <TextField fullWidth label="Email učenika" id="email" onChange={(e)=>setEmail(e.target.value)}/>
        <Button
        sx={{ display: "flex" }}
        size="small"
        style={{border: "solid blue 1px", marginTop: "5%"}}
        
        >Dodaj učenika
        </Button>

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
          <Typography variant="h6">Unesite email učenika kojeg želite obrisati</Typography>
          <TextField fullWidth label="Email učenika" id="emailDelete" onChange={(e)=>setEmailDelete(e.target.value)}/>
          <Button
        sx={{ display: "flex" }}
        size="small"
        style={{border: "solid blue 1px", marginTop: "5%"}}
        
        >Obriši učenika
        </Button>
          </Box>
        </Modal>
      </Container>
    </>
  );
};

export default isAuth(StudentGroupView, "group-student-view");
