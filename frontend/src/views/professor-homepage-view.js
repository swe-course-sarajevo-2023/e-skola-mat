'use client';
import {
	Button,
	CardActions,
	Container,
	Typography,
	Grid,
	Link,
	CircularProgress,
	Box,
	Card,
	CardContent,
} from '@mui/material';
import isAuth from '@/components/isAuth';
import { useQuery } from 'react-query';
import { getGroups } from '@/api';

const ProfesorHomepageView = () => {
	const { data, isLoading, isRefetching, error, isError } = useQuery(
		['groups'],
		getGroups
	);

	return (
		<Container sx={{ padding: 5 }}>
			{(isLoading || isRefetching) && (
				<Box display="flex" justifyContent="center" mt={3}>
					<CircularProgress size={50} />
				</Box>
			)}
			{isError && <Typography>{error.message}</Typography>}
			<Grid container spacing={2} sx={{ marginTop: 5 }}>
				{!(isLoading || isRefetching) &&
					!isError &&
					data?.map(element => (
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
											href={'/profiles/profesor/grupa/' + element.id}
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

export default isAuth(ProfesorHomepageView, 'professor-homepage-view');
