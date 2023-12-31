'use client';
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
	CircularProgress,
} from '@mui/material';
import { useState } from 'react';
import Canvas from '../utils/canvas';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import isAuth from '@/components/isAuth';
import { useQuery, useMutation, queryClient } from 'react-query';
import {
	commentTask,
	getHomeworkDataForReview,
	gradeHomework,
	commentHomework,
} from '@/api';

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

const Comment = ({ element, isLoading, isRefetching }) => {
	const [commentValue, setCommentValue] = useState(
		element?.teacher_comment || ''
	);

	const handleChange = event => {
		setCommentValue(event.target.value);
	};

	return (
		<CardActions
			sx={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'flex-start',
			}}
		>
			<TextField
				id="standard-basic"
				size="small"
				fullWidth
				label="Unesite komentar za zadatak"
				focused={
					!(isLoading || isRefetching) || element.teacher_comment ? true : false
				}
				variant="outlined"
				value={commentValue}
				onChange={handleChange}
				sx={{ marginTop: 2, marginBottom: 1 }}
				multiline
				rows={2}
			/>
			<Button
				variant="outlined"
				size="small"
				onClick={() => {
					commentTask({ task_id: element?.id, comment: commentValue });
				}}
			>
				SPASI KOMENTAR
			</Button>
		</CardActions>
	);
};

const HomeworkView = props => {
	const { data, isLoading, isRefetching } = useQuery(
		['getHomeworkDataForReview'],
		() => getHomeworkDataForReview(props.id)
	);
	const [modalOpen, setModalOpen] = useState(false);
	const [selectedTaskNumber, setSelectedTaskNumber] = useState(0);
	const [selectedImgSource, setSelectedImgSource] = useState('');
	const [selectedComment, setSelectedComment] = useState('');

	const [commentProfessor, setCommentProfessor] = useState(data?.data.comment);
	const [grade, setGrade] = useState(data?.data.grade);
	const [gradeInputColor, setGradeInputColor] = useState('primary');
	const [gradeHelperText, setGradeHelperText] = useState('');

	const [selectedImgId, setSelectedImgId] = useState();

	const handleClose = () => setModalOpen(false);

	const handleImageButton = (taskNumber, imageId, imageSource, comment) => {
		setSelectedTaskNumber(taskNumber);
		setSelectedImgId(imageId);
		setSelectedImgSource(imageSource);
		setSelectedComment(comment);
		setModalOpen(true);
	};

	const mutation = useMutation(gradeHomework, {
		onSuccess: () => {
			setGradeInputColor('primary');
			setGradeHelperText('');
		},
		onError: () => {
			setGradeInputColor('error');
			setGradeHelperText('Spašena ocjena mora biti validan broj!');
		},
	});

	const mutation2 = useMutation(commentHomework);

	const gradeH = () => {
		let data2 = {
			homework_id: data?.homework.id,
			user_id: data?.user.id,
			grade: grade,
		};
		mutation.mutate(data2);
	};

	const commentH = () => {
		let data2 = {
			homework_id: data?.homework.id,
			user_id: data?.user.id,
			note: commentProfessor,
		};
		mutation2.mutate(data2);
	};

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
						<Typography variant="h5">
							{' '}
							Ukupan broj zadataka: {data && data.homework.number_of_tasks}
						</Typography>
					</Paper>
				</Grid>

				<Grid item xs={12}></Grid>

				<Grid item xs={12} md={2} lg={2} sx={{ display: 'flex' }}>
					<TextField
						id="outlined-multiline-static"
						size="small"
						label="Unesite ocjenu"
						color={gradeInputColor}
						helperText={gradeHelperText}
						focused={
							!(isLoading || isRefetching) || data?.data.grade ? true : false
						}
						defaultValue={data?.data.grade}
						value={grade}
						onChange={e => {
							setGrade(e.target.value);
						}}
					/>
				</Grid>

				<Grid item xs={12} md={1} lg={1}>
					<Button variant="outlined" size="small" onClick={() => gradeH()}>
						SPASI OCJENU
					</Button>
				</Grid>

				<Grid item xs={12} md={8} lg={8}>
					<TextField
						id="standard-basic"
						size="small"
						fullWidth
						label="Unesite generalni komentar"
						focused={
							!(isLoading || isRefetching) || data?.data.comment ? true : false
						}
						variant="outlined"
						defaultValue={data?.data.comment}
						value={commentProfessor}
						onChange={e => {
							setCommentProfessor(e.target.value);
						}}
						multiline
						rows={2}
					/>
				</Grid>

				<Grid item xs={12} md={1} lg={1}>
					<Button variant="outlined" size="small" onClick={() => commentH()}>
						SPASI KOMENTAR
					</Button>
				</Grid>

				{(isLoading || isRefetching) && (
					<Grid item xs={12}>
						<Box display="flex" justifyContent="center" mt={3}>
							<CircularProgress size={50} />
						</Box>
					</Grid>
				)}

				<Grid item xs={12} md={12} lg={12} sx={{ marginTop: 6 }}>
					<Paper>
						<Typography variant="h7">
							{' '}
							<b>Komentar učenika: </b>
							{data?.data.comment_student}
						</Typography>
					</Paper>
				</Grid>

				{data &&
					data.problems.map(element => (
						<Grid item xs={12} md={3} lg={3} key={element.order_num}>
							<Card fullWidth>
								<CardContent>
									<Grid container spacing={1}>
										{element.images.map(image => (
											<Grid item xs={4} lg={4} md={4} key={image.id}>
												<Button
													onClick={() =>
														handleImageButton(
															element.order_num,
															image.id,
															image.file_path,
															image.comment_professor
														)
													}
												>
													<div
														style={{
															backgroundImage: `url('${image.file_path}')`,
															backgroundRepeat: 'no-repeat',
															height: '0',
															paddingTop: '200%',
															width: '500%',
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
								<Comment
									element={element}
									isLoading={isLoading}
									isRefetching={isRefetching}
								/>
							</Card>
						</Grid>
					))}
			</Grid>

			<Modal
				open={modalOpen}
				onClose={handleClose}
				sx={{ width: 'auto' }}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box sx={style}>
					<Typography variant="h5" id="modal-modal-description" sx={{ mt: 2 }}>
						Zadatak {selectedTaskNumber}
					</Typography>
					<Canvas
						imageId={selectedImgId}
						source={selectedImgSource}
						comment={selectedComment}
					/>
				</Box>
			</Modal>
		</Container>
	);
};

export default isAuth(HomeworkView, 'homework-view');
