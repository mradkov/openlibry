import Box from '@mui/material/Box';
import * as React from 'react';
import { Dispatch, useState } from 'react';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import MoreTimeIcon from '@mui/icons-material/MoreTime';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';

import { UserType } from '@/entities/UserType';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import ListItemText from '@mui/material/ListItemText';

import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';

import { BookType } from '@/entities/BookType';
import palette from '@/styles/palette';
import {
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
  Paper,
  TextField,
  Tooltip,
} from '@mui/material';

const bull = (
  <Box
    component="span"
    sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
  >
    •
  </Box>
);

type UserEditFormPropType = {
  user: UserType;
  books: Array<BookType>;
  setUserData: Dispatch<UserType>;
  deleteUser: () => void;
  saveUser: () => void;
  returnBook: (bookid: number) => void;
  extendBook: (bookid: number, book: BookType) => void;
  initiallyEditable?: boolean;
};

interface ReturnBooksType {
  bookid: number;
  time: Date;
}

type ReturnedIconPropsType = {
  id: number;
};
export default function UserEditForm({
  user,
  books,
  setUserData,
  deleteUser,
  saveUser,
  returnBook,
  extendBook,
  initiallyEditable = false,
}: UserEditFormPropType) {
  const [editable, setEditable] = useState(
    initiallyEditable ? initiallyEditable : false
  );
  const [userBooks, setUserBooks] = useState(books);

  const [editButtonLabel, setEditButtonLabel] = useState(
    initiallyEditable ? 'Отказ' : 'Редактиране'
  );
  const [returnedBooks, setReturnedBooks] = useState({});

  const toggleEditButton = () => {
    editable ? setEditButtonLabel('Редактиране') : setEditButtonLabel('Отказ');
    setEditable(!editable);
  };

  const ReturnedIcon = ({ id }: ReturnedIconPropsType) => {
    //console.log("Rendering icon ", id, returnedBooks);
    if (id in returnedBooks) {
      return <CheckCircleIcon color="success" />;
    } else {
      return <ArrowCircleLeftIcon />;
    }
  };

  return (
    <Paper sx={{ mt: 5, px: 4 }}>
      <Divider sx={{ mb: 3 }}>
        <Typography variant="body1" color={palette.info.main}>
          Данни
        </Typography>
      </Divider>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="firstName"
            name="firstName"
            label="Име"
            defaultValue={user.firstName}
            disabled={!editable}
            fullWidth
            autoComplete="given-name"
            variant="standard"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setUserData({ ...user, firstName: event.target.value });
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="lastName"
            name="lastName"
            label="Фамилия"
            defaultValue={user.lastName}
            disabled={!editable}
            fullWidth
            autoComplete="family-name"
            variant="standard"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setUserData({ ...user, lastName: event.target.value });
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="phone"
            name="phone"
            label="Телефон"
            defaultValue={user.phone}
            disabled={!editable}
            fullWidth
            autoComplete="shipping address-level2"
            variant="standard"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setUserData({ ...user, phone: event.target.value });
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            id="email"
            name="email"
            label="Електронна поща"
            defaultValue={user.eMail}
            disabled={!editable}
            fullWidth
            variant="standard"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setUserData({
                ...user,
                eMail: event.target.value,
              });
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            id="createdAt"
            name="createdAt"
            label="Създаден на"
            defaultValue={
              'Потребител създаден на ' +
              user.createdAt +
              ' с номер на карта ' +
              user.id
            }
            disabled={true}
            fullWidth
            variant="standard"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            id="lastUpdated"
            name="lastUpdated"
            label="Последна актуализация"
            defaultValue={user.updatedAt}
            disabled={true}
            fullWidth
            variant="standard"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControlLabel
            control={
              <Checkbox
                color="secondary"
                name="saveActive"
                disabled={!editable}
                checked={user.active}
                onClick={() => {
                  const toggleValue = !user.active;
                  setUserData({ ...user, active: toggleValue });
                }}
              />
            }
            label="Активен"
          />
        </Grid>
      </Grid>
      <Divider sx={{ mb: 3 }}>
        <Typography variant="body1" color={palette.info.main}>
          Заемани книги
        </Typography>
      </Divider>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={2}
      >
        <Grid item xs={12}>
          {' '}
          {userBooks.map((b: BookType, index: number) => {
            return 'id' in b ? (
              <ListItem key={b.id}>
                <Tooltip title="Връщане">
                  <IconButton
                    onClick={() => {
                      returnBook(b.id!);
                      const time = Date.now();
                      const newbook = {};
                      (newbook as any)[b.id!] = time;
                      setReturnedBooks({ ...returnedBooks, ...newbook });
                    }}
                    aria-label="върни"
                  >
                    <ReturnedIcon key={b.id} id={b.id!} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Verlängern">
                  <IconButton
                    onClick={() => {
                      if (!b.id) return;
                      extendBook(b.id, b);
                      const newBooks = [...books];
                      newBooks[index].renewalCount++;
                      setUserBooks(newBooks);
                    }}
                    aria-label="verlängern"
                  >
                    <MoreTimeIcon key={b.id} />
                  </IconButton>
                </Tooltip>
                <ListItemText>
                  {b.title + ', ' + b.renewalCount + 'x verlängert'}
                </ListItemText>
              </ListItem>
            ) : (
              <div>ID not found</div>
            );
          })}
        </Grid>
        <Grid item xs={12} md={4}>
          <Button onClick={toggleEditButton} startIcon={<EditIcon />}>
            {editButtonLabel}
          </Button>
        </Grid>
        <Grid item xs={12} md={4}>
          {editable && (
            <Button
              onClick={() => {
                saveUser();
                toggleEditButton();
              }}
              startIcon={<SaveAltIcon />}
            >
              Запази
            </Button>
          )}
        </Grid>
        <Grid item xs={12} md={4}>
          {editable && (
            <Button
              color="error"
              onClick={deleteUser}
              startIcon={<DeleteForeverIcon />}
            >
              Изтрий
            </Button>
          )}
        </Grid>{' '}
      </Grid>
    </Paper>
  );
}
