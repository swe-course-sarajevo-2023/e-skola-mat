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
import moment from "moment";

const HomeworkCard = ({
  id,
  name,
  dateOfCreation,
  deadline,
  maxNumbersOfProblems,
  handleDelete,
}) => {
  return (
    <Card sx={{ minWidth: 300 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between">
          <Typography gutterBottom variant="h5" component="div">
            {name}
          </Typography>
          <IconButton sx={{ pt: 0 }} onClick={() => handleDelete(id)}>
            <DeleteOutlineOutlined />
          </IconButton>
        </Box>
        <List disablePadding>
          <ListItem disablePadding>
            <ListItemText
              primary="Datum Kreiranja"
              secondary={moment(dateOfCreation).format("DD.MM.YYYY")}
            />
          </ListItem>
          <ListItem disablePadding>
            <ListItemText
              primary="Rok"
              secondary={moment(deadline).format("DD.MM.YYYY")}
            />
          </ListItem>
          <ListItem disablePadding>
            <ListItemText
              primary="Broj zadataka"
              secondary={maxNumbersOfProblems}
            />
          </ListItem>
        </List>
      </CardContent>
    </Card>
  );
};

export default HomeworkCard;
