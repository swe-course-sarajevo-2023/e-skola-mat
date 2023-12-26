import { useState } from 'react';
import {
	Button,
	Container,
	Box,
	Typography,
	CircularProgress,
} from '@mui/material';
import { useQuery, useMutation } from 'react-query';
import { FromDialog, UserCard } from '@/components/users';
import { getUsers, removeUser } from '@/api';
import isAuth from '@/components/isAuth';

const UsersView = () => {
	const removeuserMutation = useMutation(removeUser);
	const { data, isLoading, isError, error } = useQuery('fetchUsers', getUsers, {
		enabled: false,
	});

	const [open, setOpen] = useState(false);

	const handleOpen = e => {
		setOpen(true);
		e.stopPropagation();
	};

	const handleClose = () => {
		setOpen(false);
	};

	return (
		<Container sx={{ p: 5, height: '100vh', overflowY: 'auto' }}>
			<Box sx={{ pt: 3 }}>
				<Typography variant="h4">Korisnici</Typography>
				<Button onClick={handleOpen}>Dodaj korisnika</Button>

				{isLoading && <CircularProgress size="xl" />}
				{isError && <Typography>{error.message}</Typography>}

				{!isLoading && !isError && (
					<Box
						display="flex"
						justifyContent="space-between"
						gap={3}
						flexWrap="wrap"
					>
						{[...Array(5)].map(() => (
							<Box
								sx={{ py: 2 }}
								flex={{ xs: '1 100%', md: '1 45%', lg: '1 20%' }}
							>
								<UserCard />
							</Box>
						))}
					</Box>
				)}
			</Box>

			<FromDialog open={open} handleClose={handleClose} />
		</Container>
	);
};

export default isAuth(UsersView, 'users-view');
