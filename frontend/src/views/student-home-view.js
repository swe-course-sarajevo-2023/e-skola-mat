'use client';
import {
	getAllStudentsHomeworks,
	getAllStudentsSubmittedHomeworks,
} from '@/api';
import isAuth from '@/components/isAuth';
import {
	Container,
	Grid,
	Typography
} from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { useEffect, useState } from 'react';
import CardMedia from '@mui/material/CardMedia';
import HomeworkIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HomeIcon from '@mui/icons-material/Home';
import GradingIcon from '@mui/icons-material/Grading';
import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustify';
import WorkspacesIcon from '@mui/icons-material/Workspaces';
import IconButton from '@mui/material/IconButton';
import { teal } from '@mui/material/colors';


const StudentHomeView = () => {
	const [numAllHomeworks, setNumAllHomeworks] = useState(0);
    const [numDoneHomeworks, setNumDoneHomeworks] = useState(0);
    const [numGroups, setNumGroups] = useState(0);

   
    useEffect(() => {
        
        getAllStudentsHomeworks().then((res) => {
			console.log(res)
            
            setNumAllHomeworks(res.data?.length);
        });

		const student_id = 'f47ac13b-58cc-4372-a567-0e02b2c3d479';

       
        getAllStudentsSubmittedHomeworks(student_id).then((res) => {
            
            setNumDoneHomeworks(res.data? res.data.length: 0);
        });

       
        setNumGroups(1); // Example: 1 groups
    }, []);

	return (
		<>
		<Container style={{ marginTop: '5%', padding: 30 }}>
			<Typography variant="h4" style={{paddingBottom: 30 }}>
				Dobrodošli!
            </Typography>
			<Grid container spacing={3} columnSpacing={12}>
				{/* Card for number of all homeworks */}
				<Grid item xs={12} sm={4}>
                        <Card sx={{ boxShadow: 10 }} >
						
                            <CardContent>
								<Typography variant="h1" textAlign={'center'}>
									<FormatAlignJustifyIcon sx={{ fontSize: 150 }} color="primary" />
                                </Typography>
                                <Typography variant="h1" textAlign={'center'}>
                                    {numAllHomeworks}
                                </Typography>
								<Typography variant="h6" component="div" textAlign={'center'}>
                                    Number of All Homeworks
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

				{/* Card for number of done homeworks */}
				<Grid item xs={12} sm={4} >
					<Card  sx={{ boxShadow: 10 }}  >
						
						<CardContent>
						<Typography variant="h1" textAlign={'center'}>
							<GradingIcon sx={{ fontSize: 150 }} color="success" />
                        </Typography>							
							<Typography variant="h1" textAlign={'center'}>
								{numDoneHomeworks}
							</Typography>
							<Typography variant="h6" component="div" textAlign={'center'}>
								Number of Done Homeworks
							</Typography>
						</CardContent>
					</Card>
				</Grid>

				{/* Card for number of groups */}
				<Grid item xs={12} sm={4}>
					<Card  sx={{ boxShadow: 10 }} >
					<CardContent>
						<Typography variant="h1" textAlign={'center'}>
							<WorkspacesIcon sx={{ fontSize: 150, color: teal[600] }} />
                        </Typography>
							<Typography variant="h1" textAlign={'center'}>
								{numGroups}
							</Typography>
							<Typography variant="h6" component="div" textAlign={'center'}>
								Number of Groups
							</Typography>
						</CardContent>
					</Card>
				</Grid>
			</Grid>
		</Container>
	</>
	);
};

export default isAuth(StudentHomeView, 'student-home-view');


