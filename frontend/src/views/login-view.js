import {
  Box,
  Button,
  CardActionArea,
  CardActions,
  Container,
} from "@mui/material";

export default function LoginView() {
  return (
    <Container>
      <Box sx={{ display: "flex", justifyContent: "center", marginTop: "70px" }}>
         <Button variant="contained" >Login</Button>
      </Box>
    </Container>
  )
}
