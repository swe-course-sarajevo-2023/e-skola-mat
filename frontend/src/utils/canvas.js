import React, { useRef, useState, useEffect } from 'react';
import { CompactPicker } from 'react-color';
import 'bootstrap/dist/css/bootstrap.min.css';

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { Button } from '@mui/material';
import { TextField } from '@mui/material';

import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';

const Item = styled(Paper)(({ theme }) => ({
	backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
	...theme.typography.body2,
	padding: theme.spacing(1),
	textAlign: 'center',
	color: theme.palette.text.secondary,
}));

export const Canvas = props => {
	const { source, comment } = props;

	const [isDrawing, setIsDrawing] = useState(false);
	const [tool, setTool] = useState('handdrawn');
	const [tool1, setTool1] = useState('#000000');
	const [tool2, setTool2] = useState('Medium');
	const [img, setImg] = useState();
	const [name, setName] = useState('');
	const [name1, setName1] = useState('');
	const [[x, y], coordinates] = useState([0, 0]);
	const canvasRef = useRef();
	const contextRef = useRef();
	const [imgComment, setImgComment] = useState('');

	console.log(source, 'source');

	const saveImage = event => {
		console.log('save');
		let link = event.currentTarget;
		console.log(link);
		link.setAttribute('download', source);
		console.log(link);
		let image = canvasRef.current.toDataURL('image/png');
		console.log(image);
		link.setAttribute('href', image);
	};

	function changeColor(color) {
		setTool1(color.hex);
	}

	const prepareCanvas = () => {
		const canvas = canvasRef.current;
		canvas.width = 500;
		canvas.height = 500;
		canvas.style.backgroundColor = 'lightblue';
		const context = canvas.getContext('2d');
		context.lineWidth = 3;
		contextRef.current = context;
		const image = new Image();
		image.src = img;
		image.onload = () => {
			context.drawImage(image, 0, 0, 500, 500);
		};
	};

	const startDrawing = ({ nativeEvent }) => {
		const canvas = canvasRef.current;
		const context = canvas.getContext('2d');
		context.strokeStyle = tool1;
		const { offsetX, offsetY } = nativeEvent;
		coordinates([offsetX, offsetY]);
		contextRef.current.beginPath();
		if (tool == 'line') {
			contextRef.current.moveTo(offsetX, offsetY);
		}
		setIsDrawing(true);
	};

	const finishDrawing = ({ nativeEvent }) => {
		const { offsetX, offsetY } = nativeEvent;
		if (tool == 'line') {
			contextRef.current.moveTo(x, y);
			contextRef.current.lineTo(offsetX, offsetY);
			contextRef.current.stroke();
		}
		contextRef.current.closePath();
		setIsDrawing(false);
	};

	const draw = ({ nativeEvent }) => {
		if (!isDrawing) {
			return;
		}
		const { offsetX, offsetY } = nativeEvent;
		if (tool2 == 'Thin') {
			contextRef.current.lineWidth = 1;
		}
		if (tool2 == 'Medium') {
			contextRef.current.lineWidth = 2;
		}
		if (tool2 == 'Thick') {
			contextRef.current.lineWidth = 3;
		}
		if (tool == 'handdrawn') {
			contextRef.current.lineTo(offsetX, offsetY);
			contextRef.current.stroke();
		}
	};

	const clearCanvas = () => {
		prepareCanvas();
	};

	function getImage(e) {
		e.preventDefault();
		const canvas = canvasRef.current;
		const context = canvas.getContext('2d');
		contextRef.current = context;
		const image = new Image();
		image.src = '../../public/test-image.jpg';
		image.onload = () => {
			context.drawImage(image, 0, 0, 500, 500);
		};
	}

	function rotate(e) {
		e.preventDefault();

		const canvas = canvasRef.current;
		const context = canvas.getContext('2d');
		var mCanvas = document.createElement('canvas');
		mCanvas.width = canvas.width;
		mCanvas.height = canvas.height;
		var mctx = mCanvas.getContext('2d');

		mctx.drawImage(canvas, 0, 0);

		context.clearRect(0, 0, canvas.width, canvas.height);

		context.translate(250, 250);

		var radians = (90 / 180) * Math.PI;
		context.rotate(radians);

		context.drawImage(mCanvas, -canvas.width / 2, -canvas.height / 2);

		context.rotate(-radians);
		context.translate(-canvas.width / 2, -canvas.height / 2);
	}
	useEffect(() => {
		prepareCanvas();
	}, [img]);
	useEffect(() => {
		setImg(source);
	}, []);

	const handleChange = event => {
		setTool(event.target.value);
	};
	const handleChangeStyle = event => {
		setTool2(event.target.value);
	};

	return (
		<div style={{ display: 'flex' }}>
			<Box sx={{ flexGrow: 1, marginTop: 2, marginRight: 3 }}>
				<Grid container spacing={2}>
					<Grid item xs={12} md={12}>
						{' '}
						<div className="form-group col-4 col-md-4 col-sm-4 col-xs-4">
							<CompactPicker color={tool1} onChangeComplete={changeColor} />
						</div>
					</Grid>
					<Grid item xs={6} md={6} sx={{}}>
						<FormControl>
							<FormLabel id="demo-radio-buttons-group-label">Alat:</FormLabel>
							<RadioGroup
								aria-labelledby="demo-radio-buttons-group-label"
								defaultValue="handdrawn"
								name="radio-buttons-group"
								onChange={handleChange}
							>
								<FormControlLabel
									value="handdrawn"
									control={<Radio />}
									label="Olovka"
								/>
								<FormControlLabel
									value="line"
									control={<Radio />}
									label="Linija"
								/>
							</RadioGroup>
						</FormControl>
					</Grid>
					<Grid item xs={6} md={6} sx={{}}>
						<FormControl>
							<FormLabel id="demo-radio-buttons-group-label">
								Debljina linije:
							</FormLabel>
							<RadioGroup
								aria-labelledby="demo-radio-buttons-group-label"
								defaultValue="Medium"
								name="radio-buttons-group"
								onChange={handleChangeStyle}
							>
								<FormControlLabel
									value="Thin"
									control={<Radio />}
									label="Tanka"
								/>
								<FormControlLabel
									value="Medium"
									control={<Radio />}
									label="Srednja"
								/>
								<FormControlLabel
									value="Thick"
									control={<Radio />}
									label="Deblja"
								/>
							</RadioGroup>
						</FormControl>
					</Grid>
					<Grid item xs={12} md={12}>
						<TextField
							id="outlined-multiline-static"
							label="Unesite komentar za sliku"
							multiline
							fullWidth
							rows={4}
							defaultValue={comment ? comment : ''}
						/>
					</Grid>
					<Grid item xs={12} md={12}>
						<Button variant="outlined">Spasi komentar</Button>
					</Grid>
				</Grid>
			</Box>
			<Box>
				<div>
					<canvas
						onMouseDown={startDrawing}
						onMouseUp={finishDrawing}
						onMouseMove={draw}
						ref={canvasRef}
					/>
				</div>
				<div style={{ display: 'flex' }}>
					<button className="form-control" onClick={rotate}>
						Rotiraj
					</button>
					<button
						className="form-control"
						onClick={clearCanvas}
						style={{ marginLeft: '8px' }}
					>
						Očisti
					</button>
					<a
						className="form-control"
						onClick={saveImage}
						href="download_image"
						style={{ marginLeft: '8px', textAlign: 'center' }}
					>
						Spremi
					</a>
				</div>
			</Box>
		</div>
	);
};

export default Canvas;
