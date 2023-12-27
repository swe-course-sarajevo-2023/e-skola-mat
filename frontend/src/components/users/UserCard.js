import {
	Box,
	Card,
	CardContent,
	Typography,
	IconButton,
	List,
	ListItem,
	ListItemText,
} from '@mui/material';
import { DeleteOutlineOutlined } from '@mui/icons-material';

const UserCard = () => {
	return (
		<Card sx={{ minWidth: 300, backgroundColor: 'whitesmoke' }}>
			<CardContent>
				<Box display="flex" justifyContent="space-between">
					<Typography gutterBottom variant="h5" component="div">
						Ime Prezime
					</Typography>
					<IconButton sx={{ pt: 0 }}>
						<DeleteOutlineOutlined />
					</IconButton>
				</Box>
				<List disablePadding>
					<ListItem disablePadding>
						<ListItemText primary="Profesor" secondary="Rola" />
					</ListItem>
					<ListItem disablePadding>
						<ListItemText primary="example@example.com" secondary="Email" />
					</ListItem>
				</List>
			</CardContent>
		</Card>
	);
};

export default UserCard;
