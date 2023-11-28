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
  CircularProgress
} from "@mui/material";
import { useState } from "react";
import Canvas from "../utils/canvas";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import isAuth from "@/components/isAuth";
import { useQuery } from "react-query";
import { getHomeworkDataForReview } from "@/api";

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

const HomeworkView = (props) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTaskNumber, setSelectedTaskNumber] = useState(0);
  const [selectedImgSource, setSelectedImgSource] = useState("");
  const [selectedComment, setSelectedComment] = useState("");

  const handleClose = () => setModalOpen(false);

  const handleImageButton = (taskNumber, imageSource, commnet) => {
    setSelectedTaskNumber(taskNumber);
    setSelectedImgSource(imageSource);
    setSelectedComment(commnet);
    setModalOpen(true);

  };

  const { data, isLoading, isRefetching, error, isError } = useQuery(
    ["getHomeworkDataForReview"],
    () => getHomeworkDataForReview(props.id)
  );

  return (
    <Container>
      <Grid container spacing={2} sx={{ marginTop: 5 }}>

        <Grid item xs={12} md={4} lg={4}>
          <Paper>
            <Typography variant="h5">
              Učenik: {data && data.user.name} {data && data.user.surname}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4} lg={4}>
          <Paper>
            <Typography variant="h5">
              Zadaća: {data && data.homework.name}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4} lg={4}>
          <Paper>
            <Typography variant="h5"> Ukupan broj zadataka: {data && data.homework.number_of_tasks}</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12}></Grid>

        <Grid item xs={12} md={2} lg={2} sx={{ display: "flex" }}>
          <TextField
            id="outlined-multiline-static"
            size="small"
            label="Unesite ocjenu"
            focused={(!(isLoading || isRefetching) || data?.data.grade) ? true : false}
            defaultValue={ data?.data.grade }
          />

        </Grid>

        <Grid item xs={12} md={8} lg={8}>
          <TextField
            id="standard-basic"
            size="small"
            fullWidth
            label="Unesite generalni komentar"
            focused={(!(isLoading || isRefetching) || data?.data.comment) ? true : false}
            variant="outlined"
            defaultValue={ data?.data.comment }
            multiline
            rows={2}
          />
        </Grid>

        <Grid item xs={12} md={2} lg={2}>
            <Button variant="outlined" size="small">
              SPASI OCJENU I KOMENTAR
            </Button>
        </Grid>

        {(isLoading || isRefetching) && (
          <Grid item xs={12}>
            <Box display="flex" justifyContent="center" mt={3}>
              <CircularProgress size={50} />
              </Box>
          </Grid>
        )}

        <Grid item xs={12} md={12} lg={12} sx={{marginTop: 6}}>
          <Paper>
            <Typography variant="h7">
              {" "}
              <b>Komentar učenika: </b>Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
               Integer ultricies dui ante, eget volutpat lorem pharetra at. Sed sollicitudin justo et eros pharetra consequat.
            </Typography>
          </Paper>
        </Grid>

        {data && data.problems.map((element) => (
          <Grid item xs={12} md={3} lg={3}>
          <Card fullWidth>
            <CardContent>
            <Grid container spacing={1}>
              {element.images.map((image) => (
                <Grid item xs={4} lg={4} md={4}>
                <Button onClick={() => handleImageButton(element.order_num, image.file_path, image.comment_professor)}>
                  <div
                  style={{
                    backgroundImage: `url('${image.file_path}')`,
                    backgroundRepeat: "no-repeat",
                    height: "0",
                    paddingTop: "200%",
                    width: "500%",
                  }}
                  ></div>
                </Button>
                </Grid>
              ))}
              </Grid>
              <Typography gutterBottom variant="h6" component="div">
                Zadatak {element.order_num}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {element.student_comment}
              </Typography>
            </CardContent>
            <CardActions sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <TextField
              id="standard-basic"
              size="small"
              fullWidth
              label="Unesite komentar za zadatak"
              focused={(!(isLoading || isRefetching) || element.teacher_comment) ? true : false}
              variant="outlined"
              defaultValue={element?.teacher_comment}
              sx={{marginTop: 2, marginBottom: 1}}
              multiline
              rows={2}
              />
              <Button variant="outlined" size="small">
                SPASI KOMENTAR
              </Button>
            </CardActions>
          </Card>
        </Grid>
        ))}

      </Grid>

      <Modal
        open={modalOpen}
        onClose={handleClose}
        sx={{ width: "auto" }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography variant="h5" id="modal-modal-description" sx={{ mt: 2 }}>
            Zadatak {selectedTaskNumber}
          </Typography>
          <Canvas source={selectedImgSource} comment={selectedComment}/>
        </Box>
      </Modal>

    </Container>
  );
};

export default isAuth(HomeworkView, "homework-view");
