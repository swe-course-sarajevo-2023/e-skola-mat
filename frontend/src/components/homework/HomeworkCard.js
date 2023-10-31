import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { DeleteOutlineOutlined } from "@mui/icons-material";

const HomeworkCard = () => {
  return (
    <Card sx={{ minWidth: 300 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between">
          <Typography gutterBottom variant="h5" component="div">
            Zadaća 1
          </Typography>
          <IconButton sx={{ pt: 0 }}>
            <DeleteOutlineOutlined />
          </IconButton>
        </Box>
        <List disablePadding>
          <ListItem disablePadding>
            <ListItemText primary="Datum Kreiranja" secondary="20.03.2023" />
          </ListItem>
          <ListItem disablePadding>
            <ListItemText primary="Rok" secondary="27.03.2023" />
          </ListItem>
          <ListItem disablePadding>
            <ListItemText primary="Broj zadataka" secondary="5" />
          </ListItem>
        </List>
      </CardContent>
    </Card>
  );
};

export default HomeworkCard;
