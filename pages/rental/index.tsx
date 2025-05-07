//("use client");
import Layout from '@/components/layout/Layout';

import { BookRentalList } from '@/components/rental/BookRentalList';

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

import { useRef, useState } from 'react';

import { RentalsUserType } from '@/entities/RentalsUserType';
import { dayjs } from '@/lib/dayjs';
import { getBookFromID } from '@/utils/getBookFromID';
import { toast } from 'sonner';
import useSWR from 'swr';

interface RentalPropsType {
  books: Array<BookType>;
  users: Array<UserType>;
  rentals: Array<RentalsUserType>;
  extensionDays: number;
  numberBooksToShow: number;
}

const prisma = new PrismaClient();

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function Rental({
  books,
  users,
  rentals,
  extensionDays,
  numberBooksToShow,
}: RentalPropsType) {
  const [userExpanded, setUserExpanded] = useState<number | false>(false);

  const bookFocusRef = useRef<HTMLInputElement>();
  const handleBookSearchSetFocus = () => {
    bookFocusRef.current!.focus();
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
          toast.error('Операцията не беше успешна');
        }
        return res.json();
      })
      .then((data) => {
        toast.success(`"${getBookFromID(bookid, books).title}" е върната.`);
      })
      .catch((error) => {
        console.error(error);
        toast.error('Сървърът не е достъпен. Проверете интернет връзката.');
      });
  };

  const handleExtendBookButton = (bookid: number, book: BookType) => {
    const newbook = replaceBookStringDate(book) as any;
    const newDueDate = extendDays(
      book.dueDate ? new Date(book.dueDate) : new Date(),
      extensionDays
    );

    newbook.dueDate = newDueDate.toDate();
    newbook.renewalCount = newbook.renewalCount + 1;

    delete newbook.user;

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
          toast.error('Операцията не беше успешна');
        }
        return res.json();
      })
      .then((data) => {
        toast.success(`"${getBookFromID(bookid, books).title}" е наета.`);
      })
      .catch((error) => {
        console.error(error);
        toast.error('Сървърът не е достъпен. Проверете интернет връзката.');
      });
  };

  return (
    <Layout>
      <div className="grid md:grid-cols-2 gap-4">
        <UserRentalList
          users={users}
          books={books}
          rentals={rentals}
          handleExtendBookButton={handleExtendBookButton}
          handleReturnBookButton={handleReturnBookButton}
          setUserExpanded={setUserExpanded}
          userExpanded={userExpanded}
        />

        <BookRentalList
          books={books}
          users={users} //to figure out the name of the user who rented
          handleExtendBookButton={handleExtendBookButton}
          handleReturnBookButton={handleReturnBookButton}
          handleRentBookButton={handleRentBookButton}
          userExpanded={userExpanded}
          numberBooksToShow={numberBooksToShow}
        />
      </div>
    </Layout>
  );
}

export async function getServerSideProps() {
  const numberBooksToShow = process.env.NUMBER_BOOKS_OVERVIEW
    ? parseInt(process.env.NUMBER_BOOKS_OVERVIEW)
    : 10;

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
    newBook.searchableTopics = b.topics ? b.topics.split(';') : ''; //otherwise the itemsjs search doesn't work, but not sure if I can override the type?

    return newBook;
  });

  return { props: { books, users, rentals, extensionDays, numberBooksToShow } };
}
