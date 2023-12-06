"use client"

import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Link from 'next/link';
export default function ButtonAppBar() {

    return (
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static"> 
          <Toolbar  sx={{height: 75}}>
            <a href='http://umks.pmf.unsa.ba/' target="_blank">
            <div
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
              style={{
                backgroundImage: 'url("/logo.png")',
                backgroundRepeat: "no-repeat",
                height: 70,
                width: 70,
                backgroundSize: "cover",
                backgroundPosition: "center"
              }}
            ></div>
            </a>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, marginLeft: 2}}>
              eŠkola matematike
            </Typography>
            <Link href="/profiles/profesor" passHref>
            <Button color="inherit">Profesori</Button>
          </Link>

          <Link href="/profiles/student" passHref>
            <Button color="inherit">Učenici</Button>
          </Link>

          <Link href="/users" passHref>
            <Button color="inherit">Korisnici</Button>
          </Link>
            <Button color="inherit">LOGOUT</Button>
            
    
          </Toolbar>
        </AppBar>
      </Box>
    );
  }