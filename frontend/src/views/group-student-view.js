'use client';
import {
	TextField,
	Box,
	Modal,
	Button,
	Container,
	Typography,
	Grid,
	Paper,
	Card,
	CardContent,
	CircularProgress,
	Alert,
} from '@mui/material';
import isAuth from '@/components/isAuth';
import { useState, useEffect } from 'react';
import { getGroup } from '@/api';
import { getAllStudentsForSpecificGroup } from '@/api';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { deleteStudent, addStudent } from '@/api';

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

const StudentGroupView = props => {
	const queryClient = useQueryClient();

	const { data, isLoading, isRefetching, error, isError } = useQuery(
		['allStudentsForSpecificGroup'],
		() => getAllStudentsForSpecificGroup(props.grupa)
	);

	const { data: grupa, refetch: refetch2 } = useQuery(
		['group'],
		() => getGroup(props.grupa),
		{ enabled: false }
	);

	useEffect(() => {
		refetch2();
	}, [refetch2]);

	const [modalOpen, setModalOpenAdd] = useState(false);
	const [modalOpen1, setModalOpenDelete] = useState(false);

	const [name, setName] = useState(''); // set name of new student
	const [surname, setSurname] = useState(''); // set surname of new student
	const [email, setEmail] = useState(''); // set email of new student
	const [password, setPassword] = useState(''); // set password of new student

	const [emailDelete, setEmailDelete] = useState(''); // set email of student you want to delete

	const [deleteButtonState, setDeleteButtonState] = useState(true);
	const [alertVisible, setAlertVisible] = useState(false);

	const [addButtonState, setAddButtonState] = useState(true);
	const [alertVisible1, setAlertVisible1] = useState(false);

	const handleButtonAdd = () => {
		setModalOpenAdd(true);
	};

	const handleButtonDelete = () => {
		setModalOpenDelete(true);
	};

	const handleClose = () => {
		setModalOpenAdd(false);
		setName('');
		setSurname('');
		setEmail('');
		setPassword('');
		setAlertVisible1(false);
	};

	const handleClose1 = () => {
		setModalOpenDelete(false);
		setDeleteButtonState(true);
		setAlertVisible(false);
	};

	useEffect(() => {
		if (emailDelete !== '') {
			setDeleteButtonState(false);
		} else {
			setDeleteButtonState(true);
		}
	}, [emailDelete]);

	useEffect(() => {
		if (email == '' || name == '' || surname == '' || password == '') {
			setAddButtonState(true);
		} else if (email != '' && name != '' && surname != '' && password != '') {
			setAddButtonState(false);
		}
	}, [email, name, surname, password]);

	const mutation = useMutation(deleteStudent, {
		onSuccess: () => {
			// Invalidate and refetch the 'allStudentsForSpecificGroup' query
			queryClient.invalidateQueries(['allStudentsForSpecificGroup']);
			setModalOpenDelete(false);
			setDeleteButtonState(true);
			setAlertVisible(false);
		},
		onError: error => {
			setAlertVisible(true);
		},
	});

	const mutation2 = useMutation(addStudent, {
		onSuccess: () => {
			// Invalidate and refetch the 'allStudentsForSpecificGroup' query
			queryClient.invalidateQueries(['allStudentsForSpecificGroup']);
			setModalOpenAdd(false);
			setAddButtonState(true);
			setAlertVisible1(false);
		},
		onError: error => {
			setAlertVisible1(true);
		},
	});

	const handleDelete = () => {
		let data2 = { email: emailDelete };
		mutation.mutate(data2);
	};

	const handleAdd = () => {
		let data3 = {
			group_id: props.grupa,
			new_student: {
				email: email,
				password: password,
				name: name,
				surname: surname,
			},
		};
		mutation2.mutate(data3);
	};

	return (
		<>
			<Container>
				<Grid container spacing={2} sx={{ marginTop: 5 }}>
					<Grid item xs={12}>
						<Grid container spacing={2} sx={{ marginBottom: 5 }}>
							<Grid item xs={12} sx={{ marginBottom: 1 }}>
								<Paper>
									<Grid container spacing={2}>
										<Grid item xs={12} md={8} lg={8}>
											<Typography variant="h5" sx={{ marginLeft: 2 }}>
												{' '}
												GRUPA: {grupa && grupa.name}
											</Typography>
										</Grid>

										<Grid item xs={6} md={2} lg={2}>
											<Button onClick={() => handleButtonAdd()}>
												DODAJ UČENIKA
											</Button>
										</Grid>

										<Grid item xs={6} md={2} lg={2}>
											<Button onClick={() => handleButtonDelete()}>
												OBRIŠI UČENIKA
											</Button>
										</Grid>
									</Grid>
								</Paper>
							</Grid>
						</Grid>
					</Grid>

					<Grid item xs={12}></Grid>

					{(isLoading || isRefetching) && (
						<Grid item xs={12}>
							<Box display="flex" justifyContent="center" mt={3}>
								<CircularProgress size={50} />
							</Box>
						</Grid>
					)}

					<Grid item xs={12} md={12} lg={12}>
						<Grid container sx={{ display: 'flex' }} spacing={2}>
							{!(isLoading || isRefetching) &&
								!isError &&
								data?.data?.map(student => {
									return (
										<Grid item xs={12} md={3} lg={3} key={student.email}>
											<Card sx={{ maxWidth: 345 }}>
												<CardContent>
													<Typography gutterBottom variant="h5" component="div">
														{student.name} {student.surname}
													</Typography>
													<Typography gutterBottom variant="h7" component="div">
														{student.email}
													</Typography>
												</CardContent>
											</Card>
										</Grid>
									);
								})}
						</Grid>
					</Grid>
				</Grid>

				<Modal
					open={modalOpen}
					onClose={handleClose}
					sx={{ width: 'auto' }}
					aria-labelledby="modal-modal-title"
					aria-describedby="modal-modal-description"
				>
					<Box sx={style}>
						<Typography variant="h6" sx={{ textAlign: 'center' }}>
							Unesite podatke novog učenika
						</Typography>
						{alertVisible1 && (
							<Alert severity="error">Unesite ispravne podatke!</Alert>
						)}
						<TextField
							fullWidth
							label="Ime"
							id="name"
							sx={{ marginTop: '2%', marginBottom: '2%' }}
							onChange={e => setName(e.target.value)}
						/>
						<TextField
							fullWidth
							label="Prezime"
							id="surname"
							sx={{ marginBottom: '2%' }}
							onChange={e => setSurname(e.target.value)}
						/>
						<TextField
							fullWidth
							label="Email"
							id="email"
							sx={{ marginBottom: '2%' }}
							onChange={e => setEmail(e.target.value)}
						/>
						<TextField
							fullWidth
							label="Password"
							id="password"
							sx={{ marginBottom: '2%' }}
							onChange={e => setPassword(e.target.value)}
						/>
						<Button
							sx={{ display: 'flex' }}
							size="small"
							variant="contained"
							fullWidth
							onClick={handleAdd}
							disabled={addButtonState}
						>
							DODAJ
						</Button>
					</Box>
				</Modal>

				<Modal
					open={modalOpen1}
					onClose={handleClose1}
					sx={{ width: 'auto' }}
					aria-labelledby="modal-modal-title"
					aria-describedby="modal-modal-description"
				>
					<Box sx={style}>
						<Typography variant="h6" sx={{ textAlign: 'center' }}>
							Unesite email učenika kojeg želite obrisati
						</Typography>
						{alertVisible && (
							<Alert severity="error">Unesite ispravan email!</Alert>
						)}
						<TextField
							fullWidth
							label="Email"
							id="emailDelete"
							sx={{ marginTop: '5%', marginBottom: '5%' }}
							onChange={e => setEmailDelete(e.target.value)}
						/>
						<Button
							sx={{ display: 'flex', backgroundColor: 'red' }}
							size="small"
							variant="contained"
							fullWidth
							onClick={handleDelete}
							disabled={deleteButtonState}
						>
							OBRIŠI
						</Button>
					</Box>
				</Modal>
			</Container>
		</>
	);
};

export default isAuth(StudentGroupView, 'group-student-view');
