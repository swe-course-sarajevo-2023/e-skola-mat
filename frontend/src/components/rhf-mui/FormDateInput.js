import { Controller } from 'react-hook-form';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';

const FormDateInput = ({ name, label }) => {
	return (
		<Controller
			name={name}
			render={({ field, fieldState }) => (
				<LocalizationProvider dateAdapter={AdapterMoment}>
					<DatePicker
						{...field}
						format="DD.MM.YYYY"
						label={label}
						slotProps={{
							toolbar: {
								toolbarPlaceholder: '__',
								toolbarFormat: 'DD.MM.YYYY',
								hidden: false,
							},
							textField: {
								helperText: fieldState.error && fieldState.error.message,
								error: !!fieldState.error,
							},
						}}
						sx={{ width: 1 }}
					/>
				</LocalizationProvider>
			)}
		/>
	);
};

export default FormDateInput;
