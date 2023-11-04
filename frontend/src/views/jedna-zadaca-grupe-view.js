"use client";
import {
  Box,
  Button,
  Container,
  Modal,
  Typography,
  Grid,
  Paper,
  TextField,
  Link,
  Card, 
  CardContent, 
  CardActions
} from "@mui/material";

const zadaće = [{"ucenik": "ucenik 1 ime"}, {"ucenik": "ucenik 2 ime"}, {"ucenik": "ucenik 3 ime"}, {"ucenik": "ucenik 4 ime"}];

const JednaZadacaGrupeView=(props)=>{
    return (
      <Container>
        <Grid container spacing={1} sx={{ marginTop: 5 }}>

            <Grid item xs={12} sx={{marginBottom: 5}}>
            <Paper>
                <Grid container spacing={2}>
                    <Grid item>
                    <Typography variant="h5" sx={{marginLeft: 2}}> Zadaća: {props.zadaca}</Typography>
                    </Grid>
                    <Grid item>
                    <Button>POŠALJI REZULTATE</Button>
                    </Grid>
                </Grid>
            </Paper>
            </Grid>

            <Grid item xs={12}> </Grid>

            <Grid item xs={12}>
                <Grid container spacing={2}>
                {zadaće.map((element) => (
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                        <Card sx={{ maxWidth: 345 }}>
                            <CardContent>
                            <Typography gutterBottom variant="h5" component="div">
                                {element.ucenik}
                            </Typography>
                            
                            </CardContent>
                            <CardActions>
                            <Button
                                size="small"
                            >
                                <Link href="/homework" underline="none">PREGLEDAJ</Link>
                            </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
                </Grid>
                </Grid>

        </Grid>
      </Container>
    );
  }
export default JednaZadacaGrupeView;