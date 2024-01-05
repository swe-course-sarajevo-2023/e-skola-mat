'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Link from 'next/link';
import { GetLoggedUser } from '@/api';
import { useQuery } from 'react-query';

export default function ButtonAppBar() {

	const { data } = useQuery(['getLoggedUser'], () => GetLoggedUser());

	const router = useRouter();

	const handleLogout = () => {
		localStorage.removeItem('token');
		router.push('/login');
	};

	return (
		<Box sx={{ flexGrow: 1 }}>
			<AppBar position="static">
				<Toolbar sx={{ height: 75 }}>
					<a href="http://umks.pmf.unsa.ba/" target="_blank">
						<div
							edge="start"
							color="inherit"
							aria-label="menu"
							sx={{ mr: 2 }}
							style={{
								backgroundImage: 'url("/logo.png")',
								backgroundRepeat: 'no-repeat',
								height: 70,
								width: 70,
								backgroundSize: 'cover',
								backgroundPosition: 'center',
							}}
						></div>
					</a>
					<Typography
						variant="h6"
						component="div"
						sx={{ flexGrow: 1, marginLeft: 2 }}
					>
						eŠkola matematike
					</Typography>

					<Link href={data?.user_role === 'PROFESSOR' ? "/profiles/profesor" : "/profiles/student"} passHref>
						<Button color="inherit">Početna</Button>
					</Link>

					<Link href="/profiles/resetpassword" passHref>
						<Button color="inherit">Promijeni lozinku</Button>
					</Link>

					<Button color="inherit" onClick={handleLogout}>
						LOGOUT
					</Button>
				</Toolbar>
			</AppBar>
		</Box>
	);
}
