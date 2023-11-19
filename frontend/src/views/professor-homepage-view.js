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
import { useEffect, useState } from "react";
import axiosInstance from "@/utils/axios";

const ProfesorHomepageView = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
      const token=localStorage.getItem('token');
      axiosInstance.get('/groups/classes', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }).then(response => {
          setData(response.data);
        }).catch(error => {
          console.error('Error fetching data:', error);
        });
      }, []);

  return (
    <Container sx={{ padding: 5 }}>
      <Grid container spacing={2} sx={{ marginTop: 5 }}>
        {data.map((element) => (
          <Grid item key={element.id} xs={12} sm={6} md={4} lg={3}>
            <Card sx={{ maxWidth: 345 }}>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Grupa {element.name}
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
