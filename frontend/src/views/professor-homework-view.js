import { useState } from 'react';
import {
	Button,
	Container,
	Box,
	Typography,
	CircularProgress,
} from '@mui/material';
import { FormDialog, HomeworkCard } from '@/components/professor-homework';
import { useMutation, useQuery } from 'react-query';
import { deleteProfessorHomework, getProfessorHomeworks } from '@/api';
import isAuth from '@/components/isAuth';

const ProfessorHomeworkView = () => {
	const [open, setOpen] = useState(false);
	const { data, isLoading, isRefetching, error, isError, refetch } = useQuery(
		['fetchProfessorHomework'],
		getProfessorHomeworks
	);
	const { mutateAsync } = useMutation(deleteProfessorHomework);

	const handleOpen = e => {
		e.stopPropagation();
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const handleDelete = async id => {
		try {
			await mutateAsync(id);
			refetch();
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<Container
			sx={{ p: 5, background: 'silver', height: '100vh', overflowY: 'auto' }}
		>
			<Box sx={{ pt: 3 }}>
				<Typography variant="h3">Zadaće</Typography>
				<Box display="flex">
					<Button variant="contained" onClick={handleOpen}>
						Dodaj zadaću
					</Button>
				</Box>
				{(isLoading || isRefetching) && (
					<Box display="flex" justifyContent="center" mt={3}>
						<CircularProgress size={50} />
					</Box>
				)}
				{isError && <Typography>{error.message}</Typography>}
				<Box
					display="flex"
					justifyContent="space-between"
					gap={3}
					flexWrap="wrap"
				>
					{!(isLoading || isRefetching) &&
						!isError &&
						data?.map(homework => (
							<Box
								sx={{ py: 2 }}
								flex={{ xs: '1 100%', md: '1 45%', lg: '1 20%' }}
								key={homework.id}
							>
								<HomeworkCard
									id={homework.id}
									name={homework.name}
									dateOfCreation={homework.dateOfCreation}
									deadline={homework.deadline}
									maxNumbersOfTasks={homework.maxNumbersOfTasks}
									handleDelete={handleDelete}
								/>
							</Box>
						))}
				</Box>
			</Box>

			<FormDialog open={open} handleClose={handleClose} refetch={refetch} />
		</Container>
	);
};

export default isAuth(ProfessorHomeworkView, 'professor-homework-view');
