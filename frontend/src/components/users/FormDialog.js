import { useForm, Controller } from 'react-hook-form';
import {
	Button,
	Dialog,
	DialogTitle,
	DialogContent,
	IconButton,
	Input,
	Typography,
	Select,
	MenuItem,
} from '@mui/material';
import { useMutation } from 'react-query';
import { Close } from '@mui/icons-material';
import { Form } from '../rhf-mui';
import { addUser } from '@/api';

const FormDialog = ({ open, handleClose }) => {
	const methods = useForm();
	const adduserMutation = useMutation(addUser);

	const onSubmit = async data => {
		console.log(data); // handle mutation
		handleClose();
	};

	return (
		<Dialog open={open} onClose={handleClose}>
			<DialogTitle
				style={{
					display: 'flex',
					justifyContent: 'space-between',
				}}
			>
				Korisnik
				<IconButton
					onClick={handleClose}
					sx={{ position: 'absolute', top: 5, right: 5 }}
				>
					<Close />
				</IconButton>
			</DialogTitle>
			<DialogContent style={{ paddingTop: '20px' }}>
				<Form methods={methods} onSubmit={onSubmit}>
					<Controller
						control={methods.control}
						rules={{
							required: 'Ime je obavezno!',
							maxLength: { value: 100, message: 'Ime je predugacko!' },
						}}
						name="name"
						render={({ field: { onChange, onBlur, value } }) => (
							<Input
								onChange={onChange}
								value={value}
								onBlur={onBlur}
								placeholder="Ime"
								defaultValue=""
								fullWidth
							/>
						)}
					/>

					{methods.formState.errors.name && (
						<Typography color="red">
							{methods.formState.errors.name.message}
						</Typography>
					)}

					<Controller
						control={methods.control}
						rules={{
							required: 'Prezime je obavezno!',
							maxLength: { value: 100, message: 'Prezime je predugacko!' },
						}}
						name="surname"
						render={({ field: { onChange, onBlur, value } }) => (
							<Input
								onChange={onChange}
								value={value}
								onBlur={onBlur}
								placeholder="Prezime"
								defaultValue=""
								fullWidth
							/>
						)}
					/>

					{methods.formState.errors.surname && (
						<Typography color="red">
							{methods.formState.errors.surname.message}
						</Typography>
					)}

					<Controller
						control={methods.control}
						rules={{
							required: 'Email je obavezan!',
							validate: value => {
								if (!/^\S+@\S+\.\S+$/.test(value)) {
									return 'Neispravan e-mail!';
								}
								return true;
							},
						}}
						name="email"
						render={({ field: { onChange, onBlur, value } }) => (
							<Input
								onChange={onChange}
								value={value}
								onBlur={onBlur}
								placeholder="E-mail"
								defaultValue=""
								fullWidth
							/>
						)}
					/>

					{methods.formState.errors.email && (
						<Typography color="red">
							{methods.formState.errors.email.message}
						</Typography>
					)}

					<Controller
						control={methods.control}
						rules={{
							required: 'Username je obavezan!',
						}}
						name="username"
						render={({ field: { onChange, onBlur, value } }) => (
							<Input
								onChange={onChange}
								value={value}
								onBlur={onBlur}
								placeholder="Username"
								defaultValue=""
								fullWidth
							/>
						)}
					/>

					{methods.formState.errors.username && (
						<Typography color="red">
							{methods.formState.errors.username.message}
						</Typography>
					)}

					<Controller
						control={methods.control}
						rules={{
							required: 'Rola je obavezna!',
						}}
						name="role"
						render={({ field: { onChange, onBlur, value } }) => (
							<Select
								value={value}
								placeholder="Rola"
								onBlur={onBlur}
								onChange={onChange}
								fullWidth
							>
								<MenuItem value="1">Profesor</MenuItem>
								<MenuItem value="2">Ucenik</MenuItem>
							</Select>
						)}
					/>

					{methods.formState.errors.role && (
						<Typography color="red">
							{methods.formState.errors.role.message}
						</Typography>
					)}

					<Button type="submit" fullWidth>
						Dodaj
					</Button>
				</Form>
			</DialogContent>
		</Dialog>
	);
};

export default FormDialog;
