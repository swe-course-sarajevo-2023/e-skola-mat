'use client';
import React, { useState } from 'react';
import { FileUploader } from 'react-drag-drop-files';
import { Box, Modal, Typography, TextField, Button } from '@mui/material';
const fileTypes = ['JPG', 'PNG', 'GIF'];
const numOfTasks = [[1, 2], [1], [1, 2, 3], [1, 2, 3]]; //Broj zadataka unutar zadace
const style = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	bgcolor: 'background.paper',
	border: '2px solid #000',
	boxShadow: 24,
	p: 4,
};

export default function AddModal(props) {
	const [number, setNumber] = useState('');
	const [file, setFile] = useState(null);
	const handleChange = file => {
		setFile(file);
	};

	return (
		<Modal
			open={props.open}
			onClose={props.onClose}
			sx={{ width: 'auto' }}
			aria-labelledby="modal-modal-title"
			aria-describedby="modal-modal-description"
		>
			<Box sx={style}>
				<Typography id="modal-modal-title" variant="h5" component="h2">
					Dodaj zadaću
				</Typography>
				<br></br>
				<Box>
					<FileUploader
						handleChange={handleChange}
						name="file"
						types={fileTypes}
					/>
					<br></br>
					<TextField
						fullWidth
						label="Redni broj zadaće"
						id="komentar"
						onChange={e => setNumber(e.target.value)}
					/>
				</Box>
				<Button
					sx={{ display: 'flex' }}
					size="small"
					style={{ border: 'solid blue 1px', marginTop: '5%' }}
				>
					Postavi zadaću
				</Button>
			</Box>
		</Modal>
	);
}
