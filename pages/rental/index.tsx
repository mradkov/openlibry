//("use client");
import Layout from '@/components/layout/Layout';
import { Grid } from '@mui/material';

import BookRentalList from '@/components/rental/BookRentalList';
import { useRouter } from 'next/router';
import { forwardRef } from 'react';

import {
  convertDateToDayString,
  extendDays,
  replaceBookStringDate,
} from '@/utils/dateutils';
import { PrismaClient } from '@prisma/client';

import UserRentalList from '@/components/rental/UserRentalList';
import { BookType } from '@/entities/BookType';
import { UserType } from '@/entities/UserType';
import { getAllBooks, getRentedBooksWithUsers } from '@/entities/book';
import { getAllUsers } from '@/entities/user';
import dayjs from 'dayjs';
import { useRef, useState } from 'react';

import { RentalsUserType } from '@/entities/RentalsUserType';
import { getBookFromID } from '@/utils/getBookFromID';
import { Snackbar } from '@mui/material';
import MuiAlert, { AlertColor, AlertProps } from '@mui/material/Alert';
import useSWR from 'swr';

interface RentalPropsType {
  books: Array<BookType>;
  users: Array<UserType>;
  rentals: Array<RentalsUserType>;
  extensionDays: number;
}

const prisma = new PrismaClient();

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function Rental({
  books,
  users,
  rentals,
  extensionDays,
}: RentalPropsType) {
  const router = useRouter();
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const [snackBarMessage, setSnackBarMessage] = useState('');
  const [snackBarSeverity, setSnackBarSeverity] =
    useState<AlertColor>('success');
  const [userExpanded, setUserExpanded] = useState<number | false>(false);

  const bookFocusRef = useRef<HTMLInputElement>();
  const handleBookSearchSetFocus = () => {
    bookFocusRef.current!.focus();
  };

  const userFocusRef = useRef<HTMLInputElement>();
  const handleUserSearchSetFocus = () => {
    userFocusRef.current!.focus();
  };

  const { data, error } = useSWR(
    process.env.NEXT_PUBLIC_API_URL + '/api/rental',
    fetcher,
    { refreshInterval: 1000 }
  );
  console.log('SWR Fetch performed');
  data ? (rentals = data.rentals) : null;
  data ? (books = data.books) : null;
  data ? (users = data.users) : null; //books = data.books;
  //users = data.users;

  const handleReturnBookButton = (bookid: number, userid: number) => {
    console.log('Returning book ', bookid);
    fetch('/api/book/' + bookid + '/user/' + userid, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (!res.ok) {
          console.log(
            'ERROR while calling API for returning the book',
            res.statusText
          );
          setSnackBarMessage(
            'За съжаление не се получи, но сървърът е достъпен'
          );
          setSnackBarSeverity('error');
          setSnackbarOpen(true);
        }
        return res.json();
      })
      .then((data) => {
        console.log(data);
        setSnackBarMessage(
          'Книга - ' + getBookFromID(bookid, books).title + ' - върната'
        );
        setSnackbarOpen(true);
      })
      .catch((error) => {
        setSnackBarMessage(
          'Сървърът не е достъпен. Всичко наред ли е с интернет връзката?'
        );
        setSnackBarSeverity('error');
        setSnackbarOpen(true);
      });
  };

  const handleExtendBookButton = (bookid: number, book: BookType) => {
    console.log('Extending book ', bookid, book);
    const newbook = replaceBookStringDate(book) as any;

    console.log('Extension days: ', extensionDays);
    //extend logic
    const newDueDate = extendDays(
      book.dueDate ? new Date(book.dueDate) : new Date(),
      extensionDays
    );
    newbook.dueDate = newDueDate.toDate();
    newbook.renewalCount = newbook.renewalCount + 1;

    delete newbook.user; //don't need the user here
    delete newbook._id; // I think this is an id introduced by SWR, no  idea why, but we don't need it in the update call
    console.log('Extending book, json body', JSON.stringify(newbook));

    fetch('/api/book/' + bookid, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newbook),
    })
      .then((res) => {
        if (!res.ok) {
          console.log(
            'ERROR while calling API for extending the book',
            res.statusText
          );
          setSnackBarMessage(
            'За съжаление не се получи, но сървърът е достъпен'
          );
          setSnackBarSeverity('error');
          setSnackbarOpen(true);
        }

        return res.json();
      })
      .then((data) => {
        console.log(data);
        setSnackBarMessage('Книга - ' + book.title + ' - удължена');
        setSnackbarOpen(true);
      })
      .catch((error) => {
        setSnackBarMessage(
          'Сървърът не е достъпен. Всичко наред ли е с интернет връзката?'
        );
        setSnackBarSeverity('error');
        setSnackbarOpen(true);
      });
    //TODO create negative snackbar if something went wrong
  };

  const handleRentBookButton = (bookid: number, userid: number) => {
    console.log('Renting book for ', bookid, userid);
    fetch('/api/book/' + bookid + '/user/' + userid, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (!res.ok) {
          console.log(
            'ERROR while calling API for renting the book',
            res.statusText
          );
          setSnackBarMessage(
            'За съжаление не се получи, но сървърът е достъпен'
          );
          setSnackBarSeverity('error');
          setSnackbarOpen(true);
        }
        return res.json();
      })
      .then((data) => {
        console.log(data);
        setSnackBarMessage(
          'Книга ' + getBookFromID(bookid, books).title + ' взета под наем'
        );
        setSnackbarOpen(true);
      })
      .catch((error) => {
        setSnackBarMessage(
          'Сървърът не е достъпен. Всичко наред ли е с интернет връзката?'
        );
        setSnackBarSeverity('error');
        setSnackbarOpen(true);
      });
  };

  const handleCloseSnackbar = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref
  ) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
  return (
    <Layout>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="flex-start"
        spacing={2}
        sx={{ my: 1 }}
      >
        <Grid item xs={12} md={6}>
          <UserRentalList
            users={users}
            books={books}
            rentals={rentals}
            handleExtendBookButton={handleExtendBookButton}
            handleReturnBookButton={handleReturnBookButton}
            setUserExpanded={setUserExpanded}
            userExpanded={userExpanded}
            searchFieldRef={userFocusRef}
            handleBookSearchSetFocus={handleBookSearchSetFocus}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <BookRentalList
            books={books}
            users={users} //to figure out the name of the user who rented
            handleExtendBookButton={handleExtendBookButton}
            handleReturnBookButton={handleReturnBookButton}
            handleRentBookButton={handleRentBookButton}
            userExpanded={userExpanded}
            searchFieldRef={bookFocusRef}
            handleUserSearchSetFocus={handleUserSearchSetFocus}
          />
        </Grid>
      </Grid>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        sx={{ width: '50%' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackBarSeverity}
          sx={{ width: '100%' }}
        >
          {snackBarMessage}
        </Alert>
      </Snackbar>
    </Layout>
  );
}

export async function getServerSideProps() {
  const extensionDays = process.env.EXTENSION_DURATION_DAYS || 14;
  const allUsers = await getAllUsers(prisma);

  const users = allUsers.map((u) => {
    const newUser = { ...u } as any; //define a better type there with conversion of Date to string
    newUser.createdAt = convertDateToDayString(u.createdAt);
    newUser.updatedAt = convertDateToDayString(u.updatedAt);
    return newUser;
  });

  const allRentals = await getRentedBooksWithUsers(prisma);
  const rentals = allRentals.map((r: any) => {
    //calculate remaining days for the rental
    const due = dayjs(r.dueDate);
    const today = dayjs();
    const diff = today.diff(due, 'days');
    //console.log("Fetching rental", r);

    return {
      id: r.id,
      title: r.title,
      lastName: r.user?.lastName,
      firstName: r.user?.firstName,
      remainingDays: diff,
      dueDate: convertDateToDayString(due.toDate()),
      renewalCount: r.renewalCount,
      userid: r.user?.id,
    };
  });

  const allBooks = await getAllBooks(prisma);

  const books = allBooks.map((b) => {
    const newBook = { ...b } as any; //define a better type there with conversion of Date to string
    newBook.createdAt = convertDateToDayString(b.createdAt);
    newBook.updatedAt = convertDateToDayString(b.updatedAt);
    newBook.rentedDate = b.rentedDate
      ? convertDateToDayString(b.rentedDate)
      : '';
    newBook.dueDate = b.dueDate ? convertDateToDayString(b.dueDate) : '';

    return newBook;
  });
  //console.log("Initial fetch of books", books[0]);

  return { props: { books, users, rentals, extensionDays } };
}
