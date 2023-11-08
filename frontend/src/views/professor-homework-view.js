import { useState } from "react";
import {
  Button,
  Container,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import { FormDialog, HomeworkCard } from "@/components/professor-homework";
import { useMutation, useQuery } from "react-query";
import { deleteProfessorHomework, getProfessorHomeworks } from "@/api";

export default function ProfessorHomeworkView() {
  const [open, setOpen] = useState(false);
  const { data, isLoading, error, isError, refetch } = useQuery(
    ["fetchProfessorHomework"],
    getProfessorHomeworks
  );
  const { mutateAsync } = useMutation(deleteProfessorHomework);

  const handleOpen = (e) => {
    setOpen(true);
    e.stopPropagation();
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = async (id) => {
    try {
      await mutateAsync(id);
      refetch();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Container
      sx={{ p: 5, background: "silver", height: "100vh", overflowY: "auto" }}
    >
      <Box display="flex" justifyContent="center">
        <Button variant="contained" onClick={handleOpen}>
          Dodaj zadaću
        </Button>
      </Box>
      <Box sx={{ pt: 3 }}>
        <Typography variant="h3">Zadaće</Typography>
        {isLoading && <CircularProgress size="xl" />}
        {isError && <Typography>{error.message}</Typography>}
        <Box
          display="flex"
          justifyContent="space-between"
          gap={3}
          flexWrap="wrap"
        >
          {!isLoading &&
            !isError &&
            data?.map((homework) => (
              <Box
                sx={{ py: 2 }}
                flex={{ xs: "1 100%", md: "1 45%", lg: "1 20%" }}
                key={homework.id}
              >
                <HomeworkCard
                  id={homework.id}
                  name={homework.name}
                  dateOfCreation={homework.dateOfCreation}
                  deadline={homework.deadline}
                  maxNumbersOfProblems={homework.maxNumbersOfProblems}
                  handleDelete={handleDelete}
                />
              </Box>
            ))}
        </Box>
      </Box>

      <FormDialog open={open} handleClose={handleClose} refetch={refetch} />
    </Container>
  );
}
