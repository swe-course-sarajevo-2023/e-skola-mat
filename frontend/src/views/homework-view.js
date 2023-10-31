import { useState } from "react";
import { Button, Container, Box, Typography } from "@mui/material";
import { FormDialog, HomeworkCard } from "@/components/homework";

export default function HomeworkView() {
  const [open, setOpen] = useState(false);

  const handleOpen = (e) => {
    setOpen(true);
    e.stopPropagation();
  };

  const handleClose = () => {
    setOpen(false);
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
          {[...Array(5)].map(() => (
            <Box
              sx={{ py: 2 }}
              flex={{ xs: "1 100%", md: "1 45%", lg: "1 20%" }}
            >
              <HomeworkCard />
            </Box>
          ))}
        </Box>
      </Box>

      <FormDialog open={open} handleClose={handleClose} />
    </Container>
  );
}
