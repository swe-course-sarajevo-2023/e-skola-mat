"use client";
import {
  Button,
  Typography,
  Container,
  Grid,
  TextField,
  CardContent,
  Card,
  Alert,
} from "@mui/material";
import React from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "react-query";
import { ResetPassword } from "@/api";
import styles from "./page.module.css";

export default function ResetPasswordView() {
  const [user, setUser] = React.useState({
    newPassword: "",
    newPasswordRepeat: ""
  });

  const [alertVisible, setAlertVisible] = React.useState(false);
 
  const router = useRouter();

  const mutation = useMutation(ResetPassword, {
    onSuccess: () => {
        router.push('/');
    },
    onError: (error) => {
      console.log(error);
      setAlertVisible(true);
    },
  });

  const onLogin = () => {
    if(!(user.newPassword=='' || user.newPasswordRepeat=='' || user.newPassword!=user.newPasswordRepeat)){
        let data = {password: user.newPassword}
        mutation.mutate(data);
    }else{
        setAlertVisible(true);
    }
  }

  return (
    <main className={styles.main}>

      <div className={styles.description}>

        <div>
          <a
            href="https://pmf.unsa.ba"
            target="_blank"
            rel="noopener noreferrer"
          >
            By{" PMF 2023/2024"}
          </a>
        </div>
      </div>
      <Grid
        container
        sx={{ alignContent: "center", marginTop: 1 }}
        direction="column"
      >
        <Grid item>
          <div

            style={{
              marginLeft: 100,
              backgroundImage: "url('/logo.png')",
              backgroundRepeat: "no-repeat",
              height: 130,
              width: 130,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          ></div>
        </Grid>

        <Grid item xs={12}></Grid>

        {/* <Grid item >
          <Typography
            variant="h4"
            sx={{ marginTop: 4, textAlign: "center", color: "gray" }}
          >
            eŠkola matematike
          </Typography>
        </Grid> */}

        <Grid item sx={{ marginTop: 1 }} className={styles.center}>
          <Card sx={{ maxWidth: 345, backgroundColor: "white", padding: 2 }}>
            <CardContent>
              <Grid container spacing={1}>
              <Grid item xs={12}>
              <Typography
                variant="h6"
                sx={{textAlign: "center", color: "gray" }}
              >
                eŠkola matematike
              </Typography>
                </Grid>

                <Grid item xs={12}>
                {alertVisible && (
                <Alert severity="error">
                Došlo je do greške!
                </Alert>
                )}
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    id="newPassowrd"
                    label="Nova lozinka"
                    type="password"
                    autoComplete="current-newPassowrd"
                    fullWidth
                    value={user.newPassword}
                    onChange={(e) =>
                      setUser({ ...user, newPassword: e.target.value })
                    }
                  />
                </Grid>
                <Grid item xs={12}></Grid>
                <Grid item xs={12}>
                  <TextField
                    id="newPassowrdRepeat"
                    label="Nova lozinka ponovno"
                    type="password"
                    autoComplete="current-newPassowrdRepeat"
                    fullWidth
                    value={user.newPasswordRepeat}
                    onChange={(e) =>
                      setUser({ ...user, newPasswordRepeat: e.target.value })
                    }
                  />
                </Grid>
                <Grid item xs={12}></Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={onLogin}
                   
                  >
                    PROMJENI LOZINKU
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </main>
  );
}