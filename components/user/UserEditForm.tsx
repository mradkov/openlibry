import { Dispatch, useState } from 'react';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import MoreTimeIcon from '@mui/icons-material/MoreTime';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';

import { UserType } from '@/entities/UserType';
import ListItemText from '@mui/material/ListItemText';

import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';

import { BookType } from '@/entities/BookType';

import { cn } from '@/lib/utils';
import { Grid, Tooltip } from '@mui/material';
import { AlertOctagon, Edit, Save, SquareX, Trash2, Undo } from 'lucide-react';
import { dayjs } from '../../lib/dayjs';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';

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
  const [showDelete, setShowDelete] = useState(false);
  const [userBooks, setUserBooks] = useState(books);

  const [returnedBooks, setReturnedBooks] = useState({});

  const ReturnedIcon = ({ id }: ReturnedIconPropsType) => {
    //console.log("Rendering icon ", id, returnedBooks);
    if (id in returnedBooks) {
      return <CheckCircleIcon color="success" />;
    } else {
      return <ArrowCircleLeftIcon />;
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="font-bold text-center">{`Потребител с ID: ${user.id}`}</h2>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="firstName">Име*</Label>
          <Input
            id="firstName"
            required
            disabled={!editable}
            autoComplete="given-name"
            value={user.firstName}
            onChange={(e) => {
              setUserData({ ...user, firstName: e.target.value });
            }}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="lastName">Фамилия*</Label>
          <Input
            id="lastName"
            required
            disabled={!editable}
            autoComplete="family-name"
            value={user.lastName}
            onChange={(e) => {
              setUserData({ ...user, lastName: e.target.value });
            }}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="phone">Телефон*</Label>
          <Input
            id="phone"
            required
            disabled={!editable}
            autoComplete="tel"
            type="tel"
            value={user.phone}
            onChange={(e) => {
              setUserData({ ...user, phone: e.target.value });
            }}
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="eMail">Електронна поща</Label>
          <Input
            id="eMail"
            disabled={!editable}
            autoComplete="email"
            type="email"
            value={user.eMail ?? ''}
            onChange={(e) => {
              setUserData({ ...user, eMail: e.target.value });
            }}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            disabled={!editable}
            checked={user.active}
            onCheckedChange={(c) => {
              setUserData({ ...user, active: c === true });
            }}
            id="isActive"
          />
          <Label htmlFor="isActive">Активен</Label>
        </div>

        {showDelete ? (
          <Alert
            variant="destructive"
            className={cn(!editable && 'opacity-30')}
          >
            <AlertOctagon className="h-4 w-4" />
            <AlertTitle>Изтриване на потребител</AlertTitle>
            <AlertDescription>
              След изтрване на потребителя информацията не може да се
              възстанови!
              <div className="space-x-2">
                <Button
                  onClick={() => setShowDelete(false)}
                  variant="outline"
                  className="text-foreground"
                  size="sm"
                >
                  <Undo />
                  Отмени
                </Button>
                <Button
                  onClick={deleteUser}
                  className="bg-destructive hover:bg-destructive/90"
                  size="sm"
                >
                  <Trash2 />
                  Изтрий
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        ) : (
          <Button
            onClick={() => setShowDelete(true)}
            disabled={!editable}
            variant="link"
            className="w-fit italic text-destructive text-xs p-0"
            size="sm"
          >
            Изтриване на потребител
          </Button>
        )}

        <p>{`Създаден на ${dayjs(user.createdAt).format('D MMMM YYYY')}`}</p>
        <p>{`Последна актуализация на ${dayjs(user.updatedAt).format(
          'D MMMM YYYY'
        )}`}</p>

        {editable ? (
          <>
            <Button onClick={() => setEditable(false)} variant="outline">
              <SquareX />
              Откажи
            </Button>
            <Button
              onClick={() => {
                saveUser();
                setEditable(false);
              }}
            >
              <Save />
              Запази
            </Button>
          </>
        ) : (
          <Button onClick={() => setEditable(true)} variant="outline">
            <Edit />
            Редактирай
          </Button>
        )}
      </div>

      <Separator />

      <h2 className="font-bold text-center">Взети книги</h2>

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
                  {b.title + ', ' + b.renewalCount + 'x удължено'}
                </ListItemText>
              </ListItem>
            ) : (
              <div>ID not found</div>
            );
          })}
        </Grid>
      </Grid>
    </div>
  );
}
