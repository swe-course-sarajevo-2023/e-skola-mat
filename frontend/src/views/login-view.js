import React, { useState } from 'react';
import {
    Button,
    Typography,
    Grid,
    TextField,
    CardContent,
    Card,
    Alert,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useMutation } from 'react-query';
import { loginUser } from '@/api';
import styles from './page.module.css';

export default function LoginView() {
    const [user, setUser] = useState({ username: '', password: '' });
    const [errors, setErrors] = useState({ username: '', password: '' });
    const { mutateAsync, error, isLoading } = useMutation(loginUser);
    const router = useRouter();

    const validate = () => {
        let tempErrors = { username: '', password: '' };
        let isValid = true;

        if (!user.username) {
            tempErrors.username = 'Email is required';
            isValid = false;
        }
        if (!user.password) {
            tempErrors.password = 'Password is required';
            isValid = false;
        }

        setErrors(tempErrors);
        return isValid;
    };

    const onLogin = async e => {
        e.preventDefault();
        if (validate()) {
            try {
                const data = await mutateAsync(user);
                localStorage.setItem('token', data.access_token);
                router.push('/');
            } catch (error) {
                // Handle login error
            }
        }
    };

    return (
        <main className={styles.main}>
            {/* Other components */}
            <Grid container sx={{ alignContent: 'center', marginTop: 1 }} direction="column">
                {/* Other Grid items */}
                <Grid item sx={{ marginTop: 1 }} className={styles.center}>
                    <Card sx={{ maxWidth: 345, backgroundColor: 'white', padding: 2 }}>
                        <CardContent>
                            <Grid container spacing={1}>
                                {/* Other Grid items */}
                                <Grid item xs={12}>
                                    <TextField
                                        id="email"
                                        label="Email"
                                        type="text"
                                        autoComplete="current-email"
                                        fullWidth
                                        value={user.username}
                                        onChange={e => setUser({ ...user, username: e.target.value })}
                                        error={!!errors.username}
                                        helperText={errors.username}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        id="password"
                                        label="Lozinka"
                                        type="password"
                                        autoComplete="current-password"
                                        fullWidth
                                        value={user.password}
                                        onChange={e => setUser({ ...user, password: e.target.value })}
                                        error={!!errors.password}
                                        helperText={errors.password}
                                    />
                                </Grid>
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
        </main>
    );
}
