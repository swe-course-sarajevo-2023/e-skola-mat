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
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HomeIcon from '@mui/icons-material/Home';

export default function ButtonAppBar() {
	const { data } = useQuery(['getLoggedUser'], () => GetLoggedUser());

	const router = useRouter();

	const handleLogout = () => {
		localStorage.removeItem('token');
		router.push('/login');
	};

	const [anchorElIcon, setAnchorElIcon] = React.useState(null);
    const [anchorElMenu, setAnchorElMenu] = React.useState(null);

	const handleIconClick = (event) => {
        setAnchorElIcon(event.currentTarget);
    };

    const handleMenuClick = (event) => {
        setAnchorElMenu(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorElIcon(null);
        setAnchorElMenu(null);
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

					<Link
                        href={
                            data?.user_role === 'PROFESSOR'
                                ? '/profiles/profesor'
                                : '/profiles/home'
                        }
                        passHref
                    >
                       <IconButton
                        aria-label="more"
                        aria-controls="long-menu"
                        aria-haspopup="true"
                        color="inherit"
                    >
                        <HomeIcon />
                    </IconButton>
                    </Link>

					{data?.user_role === 'PROFESSOR' ? (
                        <>
							<IconButton
								aria-label="more"
								aria-controls="long-menu"
								aria-haspopup="true"
								onClick={handleMenuClick}
								color="inherit"
							>
								<MenuIcon />
							</IconButton>
								
                            <Menu
                                id="simple-menu"
                                anchorEl={anchorElMenu}
                                open={Boolean(anchorElMenu)}
                                onClose={handleClose}
                            >
                                <MenuItem onClick={handleClose}>
                                    <Link href="/profiles/profesor/professor-homework" passHref>
                                        Dodavanje/prikaz zadaća
                                    </Link>
                                </MenuItem>
                                <MenuItem onClick={handleClose}>
                                    <Link href="/profiles/profesor" passHref>
                                        Dodavanje/prikaz grupa
                                    </Link>
                                </MenuItem>
                            </Menu>
                        </>
                    ) : (
						<>
						<IconButton
							aria-label="more"
							aria-controls="long-menu"
							aria-haspopup="true"
							onClick={handleMenuClick}
							color="inherit"
						>
							<MenuIcon />
						</IconButton>
							
						<Menu
							id="simple-menu"
							anchorEl={anchorElMenu}
							open={Boolean(anchorElMenu)}
							onClose={handleClose}
						>
							<MenuItem onClick={handleClose}>
								<Link href="/profiles/student" passHref>
									Sve zadaće
								</Link>
							</MenuItem>
							<MenuItem onClick={handleClose}>
								<Link href="/profiles/student" passHref>
									Poslane zadaće
								</Link>
							</MenuItem>
							
						</Menu>
					</>
                    )}

					<IconButton
                        aria-label="more"
                        aria-controls="long-menu"
                        aria-haspopup="true"
                        onClick={handleIconClick}
                        color="inherit"
                    >
                        <AccountCircleIcon />
                    </IconButton>

                    <Menu
                        id="long-menu"
                        anchorEl={anchorElIcon}
                        keepMounted
                        open={Boolean(anchorElIcon)}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={handleClose}>
                            <Link href="/profiles/resetpassword" passHref>
                                Promijeni lozinku
                            </Link>
                        </MenuItem>
                        <MenuItem onClick={handleLogout}>LOGOUT</MenuItem>
                    </Menu>
				</Toolbar>
			</AppBar>
		</Box>
	);
}
