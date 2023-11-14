import { Controller } from "react-hook-form";
import { Autocomplete, Chip, TextField } from "@mui/material";

const FormAutocompleteSelect = ({ name, label, options }) => {
  return (
    <Controller
      name={name}
      render={({ field, fieldState }) => (
        <Autocomplete
          loading
          fullWidth
          multiple
          label={label}
          options={options || []}
          getOptionLabel={(option) => option.key}
          value={field.value}
          renderInput={(params) => (
            <TextField
              {...params}
              label={label}
              error={!!fieldState.error}
              helperText={fieldState.error && fieldState.error.message}
            />
          )}
          onChange={(_, values) => {
            field.onChange([...values]);
          }}
          isOptionEqualToValue={(option, { value }) => option.value === value}
          renderOption={(props, option) => (
            <li {...props} key={option.key} value={option.value}>
              {option.key}
            </li>
          )}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                variant="outlined"
                label={option.key}
                {...getTagProps({ index })}
                key={index}
              />
            ))
          }
        />
      )}
    />
  );
};

export default FormAutocompleteSelect;
