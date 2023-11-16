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
import { loginUser } from "@/api";

export default function LoginView() {
  const [user, setUser] = React.useState({
    username: "",
    password: "",
  });
  const { mutateAsync, error, isLoading } = useMutation(loginUser);
  const router = useRouter();

  const onLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await mutateAsync(user);
      localStorage.setItem("token", data.access_token);
      router.push("/");
    } catch (error) {}
  };

  return (
    <Container
      sx={{
        backgroundColor: "#1976d2",
        minHeight: "100vh",
        minWidth: "100vw",
        padding: 5,
      }}
    >
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

        <Grid item>
          <Typography
            variant="h4"
            sx={{ marginBottom: 3, textAlign: "center", color: "white" }}
          >
            eŠkola matematike
          </Typography>
        </Grid>

        <Grid item sx={{ marginTop: 3 }}>
          <Card sx={{ maxWidth: 345, backgroundColor: "white", padding: 2 }}>
            <CardContent>
              <Grid container spacing={1}>
                <Grid item xs={12} mb={2}>
                  {error && (
                    <Alert severity="error">
                      {error?.response?.data || error?.message || error?.detail}
                    </Alert>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    id="email"
                    label="Email"
                    type="text"
                    autoComplete="current-email"
                    fullWidth
                    value={user.username}
                    onChange={(e) =>
                      setUser({ ...user, username: e.target.value })
                    }
                  />
                </Grid>
                <Grid item xs={12}></Grid>
                <Grid item xs={12}>
                  <TextField
                    id="password"
                    label="Lozinka"
                    type="password"
                    autoComplete="current-password"
                    fullWidth
                    value={user.password}
                    onChange={(e) =>
                      setUser({ ...user, password: e.target.value })
                    }
                  />
                </Grid>
                <Grid item xs={12}></Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={onLogin}
                    disabled={isLoading}
                  >
                    LOGIN
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
