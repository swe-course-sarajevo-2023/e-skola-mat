import moment from "moment";
import { useForm } from "react-hook-form";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Grid,
  Alert,
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
import { useMutation, useQuery } from "react-query";
import { createProfessorHomework, getGroups } from "@/api";

const FormDialog = ({ open, handleClose, refetch }) => {
  const methods = useForm({
    resolver: yupResolver(homeworkSchema),
    defaultValues: {
      name: "",
      maxNumbersOfTasks: 1,
      deadline: moment(new Date(new Date().setHours(0, 0, 0, 0))),
      groups: [],
    },
    mode: "onBlur",
  });
  const { data } = useQuery(["groups"], getGroups, {
    refetchOnWindowFocus: false,
    select: (data) => {
      const formInputData = data.map(({ name, id }) => ({
        value: id,
        key: name,
      }));
      formInputData.push({ value: "all", key: "Sve grupe" });
      return formInputData;
    },
  });
  const { mutateAsync, error: mutateError } = useMutation(
    createProfessorHomework
  );

  const onSubmit = async (data) => {
    try {
      const { groups, ...otherFields } = data;
      await mutateAsync({
        ...otherFields,
        deadline: otherFields.deadline.format(),
        groups:
          groups.length === 1 && groups[0].value === "all"
            ? "all"
            : groups.map(({ value }) => value),
      });
      refetch();
      methods.reset();
      handleClose();
    } catch (error) {}
  };

  const errorMessage = Array.isArray(mutateError?.response?.data?.detail)
    ? mutateError?.response?.data?.detail.map(({ msg }) => msg).join(", ")
    : mutateError?.response?.data?.detail?.msg;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      keepMounted
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
        <Grid item xs={12} mb={2}>
          {mutateError && <Alert severity="error">{errorMessage}</Alert>}
        </Grid>
        <Form methods={methods} onSubmit={onSubmit}>
          <FormInput name="name" label="Naziv" />
          <FormInput
            name="maxNumbersOfTasks"
            label="Broj zadataka"
            type="number"
          />
          <FormDateInput name="deadline" label="Rok" />
          <FormAutocompleteSelect name="groups" label="Grupe" options={data} />
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
