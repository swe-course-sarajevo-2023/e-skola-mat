"use client";
import React, { useState } from "react"; 
import { FileUploader } from "react-drag-drop-files"; 
import {
    Box,
    ListItem,
    ListItemText,
    Modal,
    Typography,
    TextField
  } from "@mui/material";
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

export default function SubmitModal(props) { 
  const [comment, setComment]=useState("");
  const [file, setFile] = useState(null); 
  const handleChange = file => { 
	  setFile(file); 
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
            <ListItem
              key={index}
              disableGutters
            >
              <ListItemText primary={`Zadatak ${index+1}`} sx={{ marginRight: 3 }} />
              <FileUploader 
                handleChange={handleChange} 
                name="file"
                types={fileTypes} 
              />
              
            </ListItem>
            <TextField fullWidth label="Komentar" id="komentar" onChange={(e)=>setComment(e.target.value)}/>
          </Box>
        ))}
      </Box>
    </Modal>  
  ); 
} 

