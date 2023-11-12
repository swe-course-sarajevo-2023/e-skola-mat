import moment from "moment";
import { useForm } from "react-hook-form";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import {
  Form,
  FormAutocompleteSelect,
  FormDateInput,
  FormInput,
} from "../rhf-mui";
import { yupResolver } from "@hookform/resolvers/yup";
import { homeworkSchema } from "@/schemas";
import { useMutation } from "react-query";
import { createProfessorHomework } from "@/api";

const FormDialog = ({ open, handleClose, refetch }) => {
  const methods = useForm({
    resolver: yupResolver(homeworkSchema),
    defaultValues: {
      name: "",
      maxNumbersOfProblems: 1,
      deadline: moment(),
      groups: [],
    },
    mode: "onBlur",
  });
  const { mutateAsync } = useMutation(createProfessorHomework);

  const onSubmit = async (data) => {
    try {
      const { groups, ...otherFields } = data;
      await mutateAsync({
        ...otherFields,
        groups: groups.map(({ value }) => value),
      });
      refetch();
      methods.reset();
      handleClose();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle
        id="alert-dialog-title"
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        Zadaća
        <IconButton
          onClick={handleClose}
          sx={{ position: "absolute", top: 5, right: 5 }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent style={{ paddingTop: "20px" }}>
        <Form methods={methods} onSubmit={onSubmit}>
          <FormInput name="name" label="Naziv" />
          <FormInput
            name="maxNumbersOfProblems"
            label="Broj zadataka"
            type="number"
          />
          <FormDateInput name="deadline" label="Rok" />
          <FormAutocompleteSelect
            name="groups"
            label="Grupe"
            options={[
              { value: 1, key: "Group 1" },
              { value: 2, key: "Group 2" },
              { value: "all", key: "All" },
            ]}
          />
          <Button
            type="submit"
            variant="outlined"
            fullWidth
            sx={{ lineHeight: 3 }}
          >
            Dodaj
          </Button>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default FormDialog;