import Layout from '@/components/layout/Layout';
import { useEffect, useState } from 'react';
import { getUser } from '../../entities/user';

import { getRentedBooksForUser } from '@/entities/book';
import { useRouter } from 'next/router';

import {
  convertDateToDayString,
  extendDays,
  replaceBookStringDate,
  replaceUserDateString,
} from '@/utils/dateutils';
import { PrismaClient } from '@prisma/client';

import UserEditForm from '@/components/user/UserEditForm';
import { BookType } from '@/entities/BookType';
import { UserType } from '@/entities/UserType';
import { Typography } from '@mui/material';
import { GetServerSidePropsContext } from 'next/types';
import { toast } from 'sonner';

type UserDetailPropsType = {
  user: UserType;
  books: Array<BookType>;
  extensionDays: number;
};

export default function UserDetail({
  user,
  books,
  extensionDays,
}: UserDetailPropsType) {
  const router = useRouter();

  const [userData, setUserData] = useState(user);

  useEffect(() => {
    setUserData(user);
  }, []);

  if (!router.query.userid) {
    return <Typography>ID not found</Typography>;
  }

  const userid = parseInt(
    Array.isArray(router.query.userid)
      ? router.query.userid[0]
      : router.query.userid
  );

  const handleSaveButton = () => {
    console.log('Saving user ', userData);

    //we don't need to update the dates
    const { updatedAt, createdAt, ...savingUser } = userData;

    fetch('/api/user/' + userid, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(savingUser),
    })
      .then((res) => res.json())
      .then((data) => {
        router.push('/user');
      });
  };

  const handleReturnBookButton = (bookid: number) => {
    console.log('Returning book ', bookid);

    fetch('/api/book/' + bookid + '/user/' + userid, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        toast.success('Книгата е върната!');
      });
  };

  const handleExtendBookButton = (bookid: number, book: BookType) => {
    //we don't need to update the dates

    //console.log("Extended date", book, extendWeeks(book.dueDate as Date, 2));

    const newbook = replaceBookStringDate(book) as any;
    //extend logic

    const newDueDate = extendDays(new Date(), extensionDays);
    newbook.dueDate = newDueDate.toDate();
    newbook.renewalCount = newbook.renewalCount + 1;

    //console.log("Saving an extended book", newbook);
    delete newbook.user; //don't need the user here

    fetch('/api/book/' + bookid, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newbook),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        toast.info('Наемът на книгата е удължен!');
      });
    //T
  };

  const handleDeleteButton = () => {
    console.log('Deleting user ', userData);

    fetch('/api/user/' + userid, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('Delete operation performed on ', userid, data);
        router.push('/user');
      });
  };

  return (
    <Layout>
      <UserEditForm
        user={userData}
        books={books}
        setUserData={setUserData}
        deleteUser={handleDeleteButton}
        saveUser={handleSaveButton}
        returnBook={handleReturnBookButton}
        extendBook={handleExtendBookButton}
      />
    </Layout>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const extensionDays = process.env.EXTENSION_DURATION_DAYS || 14;
  if (!context.query.userid) return { props: {} };
  const prisma = new PrismaClient();

  const dbuser = await getUser(
    prisma,
    parseInt(context.query.userid as string)
  );

  if (!dbuser) {
    return {
      notFound: true,
    };
  }

  const user = replaceUserDateString(dbuser);

  if (!('id' in user) || !user.id) return; //shouldn't happen

  const allBooks = (await getRentedBooksForUser(prisma, user.id)) as any;

  //TODO fix the type for book incl user

  console.log('User, Books', user, allBooks);
  const books = allBooks.map((b: BookType) => {
    const newBook = { ...b } as any; //define a better type there with conversion of Date to string
    newBook.createdAt = convertDateToDayString(b.createdAt);
    newBook.updatedAt = convertDateToDayString(b.updatedAt);
    newBook.rentedDate = b.rentedDate
      ? convertDateToDayString(b.rentedDate)
      : '';
    newBook.dueDate = b.dueDate ? convertDateToDayString(b.dueDate) : '';
    //temp TODO
    //console.log("Book", newBook);
    return newBook;
  });

  // Pass data to the page via props
  return { props: { user, books, extensionDays } };
}
