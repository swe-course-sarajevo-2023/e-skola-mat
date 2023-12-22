"use client";
import React, { useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import {
  Box,
  ListItem,
  ListItemText,
  Modal,
  Typography,
  TextField,
  Button,
} from "@mui/material";

import { useMutation, useQuery } from "react-query";
import { submitTask, submitHomeworkGeneralComment } from "@/api";
const fileTypes = ["JPG", "PNG", "GIF"];
const numOfTasks = [[1, 2], [1], [1, 2, 3], [1, 2, 3]]; //Broj zadataka unutar zadace
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

/*
OCEKIVANI OBJEKAT NA BACKENDU
{
homework_id: str,
task_number: int,
task_comment: str,
images: List[UploadFile],
}



*/

export default function SubmitModal(props) {
  const [comments, setComment] = useState(""); // comment from specific exercise
  const [generalComment, setGeneralComment] = useState(""); // general comment
  const [fileList, setFiles] = useState([]); // uploaded files from one specific exercise
  const handleChange = (files) => {
    setFiles(files);
    console.log(fileList); //shows structure of files for one exercise in console
  };

  const mutation = useMutation(submitTask, {
    onSuccess: () => {
      // Invalidate and refetch the 'allStudentsForSpecificGroup' query
      setComment("");
      setGeneralComment("");
      setFiles([]);
    },
    onError: (error) => {
      alert("Došlo je do greške!", error);
    },
  });

  const mutationGeneralComment = useMutation(submitHomeworkGeneralComment, {
    onSuccess: () => {
      // Invalidate and refetch the 'allStudentsForSpecificGroup' query
      setGeneralComment("");
    },
    onError: (error) => {
      alert("Došlo je do greške!", error);
    },
  });

  const handleSubmit = (taskNum) => {
    let data = {
      homework_id: props.homework_id,
      task_number: taskNum,
      task_comment: comments,
      images: fileList,
    };
    mutation.mutate(data);
  };

  const handleGeneralCommentSubmit = () => {
    let data = {
      homework_id: props.homework_id,
      comment: generalComment,
    };
    mutationGeneralComment.mutate(data);
  };

  return (
    <Modal
      open={props.open}
      onClose={props.onClose}
      sx={{ width: "auto" }}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h5" component="h2">
          Pošalji zadaću {props.brojZadace + 1}
        </Typography>
        {numOfTasks[props.brojZadace].map((zadatak, index) => (
          <Box>
            <ListItem key={index} disableGutters>
              <ListItemText
                primary={`Zadatak ${index + 1}`}
                sx={{ marginRight: 3 }}
              />
              <FileUploader
                handleChange={handleChange}
                name="files"
                types={fileTypes}
                multiple
              />
            </ListItem>
            <TextField
              fullWidth
              label="Komentar"
              id="komentar"
              onChange={(e) => setComment(e.target.value)}
            />
            <Button
              sx={{ display: "flex" }}
              size="small"
              onClick={() => handleSubmit(index + 1)}
              style={{ border: "solid blue 1px", marginTop: "5%" }}
            >
              Pošalji zadatak {index + 1}
            </Button>
          </Box>
        ))}
        <br></br>
        <Typography id="modal-modal-title" variant="h5" component="h2">
          Dodaj komentar na zadaću {props.brojZadace + 1}
        </Typography>
        <TextField
          fullWidth
          label="Komentar"
          id="komentar"
          onChange={(e) => setGeneralComment(e.target.value)}
        />
        <Button
          sx={{ display: "flex" }}
          size="small"
          style={{ border: "solid blue 1px", marginTop: "5%" }}
          onClick={() => handleGeneralCommentSubmit()}
        >
          Pošalji komentar
        </Button>
      </Box>
    </Modal>
  );
}
