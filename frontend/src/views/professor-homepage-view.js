"use client";
import {
  Button,
  CardActions,
  Container,
  Typography,
  Grid,
  Link,
} from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import isAuth from "@/components/isAuth";

const grupe = [
  { id: "a1", naziv: "A1" },
  { id: "a2", naziv: "A2" },
  { id: "b", naziv: "B" },
  { id: "sg", naziv: "srednja" },
  { id: "ng", naziv: "napredna" },
  { id: "pg", naziv: "predolimpijska" },
  { id: "og", naziv: "olimpijska" },
];

const ProfesorHomepageView = () => {
  return (
    <Container sx={{ padding: 5 }}>
      <Grid container spacing={2} sx={{ marginTop: 5 }}>
        {grupe.map((element) => (
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Card sx={{ maxWidth: 345 }}>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Grupa {element.naziv}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small">
                  <Link
                    href={"/profiles/profesor/grupa/" + element.id}
                    underline="none"
                  >
                    PRIKAZ
                  </Link>
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default isAuth(ProfesorHomepageView, "professor-homepage-view");
