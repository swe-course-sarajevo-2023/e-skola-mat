import { useState } from "react";
import { Button, Container, Box, Typography } from "@mui/material";
import { FormDialog, HomeworkCard } from "@/components/professor-homework";

export default function ProfessorHomeworkView() {
  const [open, setOpen] = useState(false);
  const [homeworks, setHomeworks] = useState(mockData);

  const handleOpen = (e) => {
    setOpen(true);
    e.stopPropagation();
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = (id) => {
    const index = homeworks.findIndex((homework) => homework.id === id);
    if (index !== -1)
      setHomeworks((previousHomeworks) => {
        const newHomeworks = [...previousHomeworks];
        newHomeworks.splice(index, 1);
        return newHomeworks;
      });
  };

  const refetch = (homework) => {
    setHomeworks((previousHomeworks) => [...previousHomeworks, homework]);
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
        <Box
          display="flex"
          justifyContent="space-between"
          gap={3}
          flexWrap="wrap"
        >
          {homeworks.map((homework) => (
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

const mockData = [
  {
    id: 1,
    name: "Zadaća 1",
    dateOfCreation: new Date(),
    deadline: new Date(),
    maxNumbersOfProblems: 1,
  },
  {
    id: 2,
    name: "Zadaća 2",
    dateOfCreation: new Date(),
    deadline: new Date(),
    maxNumbersOfProblems: 1,
  },
  {
    id: 3,
    name: "Zadaća 3",
    dateOfCreation: new Date(),
    deadline: new Date(),
    maxNumbersOfProblems: 1,
  },
  {
    id: 4,
    name: "Zadaća 4",
    dateOfCreation: new Date(),
    deadline: new Date(),
    maxNumbersOfProblems: 1,
  },
  {
    id: 5,
    name: "Zadaća 5",
    dateOfCreation: new Date(),
    deadline: new Date(),
    maxNumbersOfProblems: 1,
  },
];
