import { Controller } from 'react-hook-form';
import { TextField } from '@mui/material';

const FormInput = ({ name, label, type = 'string' }) => {
	return (
		<Controller
			name={name}
			render={({ field, fieldState }) => (
				<TextField
					{...field}
					label={label}
					type={type}
					error={!!fieldState.error}
					fullWidth
					helperText={fieldState.error && fieldState.error.message}
				/>
			)}
		/>
	);
};

export default FormInput;
