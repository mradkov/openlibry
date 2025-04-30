import Layout from '@/components/layout/Layout';
import { getAllBooks, getRentedBooksWithUsers } from '@/entities/book';
import { PrismaClient } from '@prisma/client';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { getAllUsers } from '../../entities/user';

import UserAdminList from '@/components/user/UserAdminList';

import dayjs from 'dayjs';

import { convertDateToDayString } from '@/utils/dateutils';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import NewUserDialog from '@/components/user/NewUserDialog';
import { BookType } from '@/entities/BookType';
import { RentalsUserType } from '@/entities/RentalsUserType';
import { UserType } from '@/entities/UserType';
import getMaxId from '@/utils/idhandling';
import { Search, UserPlus } from 'lucide-react';
import { toast } from 'sonner';

const prisma = new PrismaClient();

interface UsersPropsType {
  users: Array<UserType>;
  books: Array<BookType>;
  rentals: Array<RentalsUserType>;
}

export default function Users({ users, books, rentals }: UsersPropsType) {
  const [userSearchInput, setUserSearchInput] = useState('');
  const [open, setOpen] = useState(false);

  const router = useRouter();

  const handleCreateNewUser = (autoID: boolean, proposedID: number) => {
    console.log('Creating a new user with', autoID, proposedID);

    const user: UserType = {
      firstName: '',
      lastName: '',
      phone: '',
      active: true,
    };
    if (!autoID) user.id = proposedID;

    fetch('/api/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Server error: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        router.push('user/' + data.id);
        console.log('User created', data);
      })
      .catch((error) => {
        console.error('Error updating user IDs:', error);
        toast.error(
          'Неуспешно създаване на нов потребител. Вече съществува потребител с това ID!'
        );
      });
  };

  return (
    <Layout>
      <NewUserDialog
        open={open}
        setOpen={setOpen}
        maxUserID={getMaxId(users) + 1}
        onCreate={(idAuto, idValue) => {
          console.log('Creating user', idAuto, idValue);
          handleCreateNewUser(idValue, idAuto);
          setOpen(false);
        }}
      />

      <div className="flex items-center space-x-4 mb-4">
        <div className="relative grow flex items-center">
          <Input
            value={userSearchInput}
            onChange={(e) => setUserSearchInput(e.target.value)}
            placeholder="Търсене на потребител.."
          />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Search className="absolute right-1.5 top-1.5 text-input" />
              </TooltipTrigger>
              <TooltipContent>Търсене</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className="m-0">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setOpen(true)}
              >
                <UserPlus />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Създаване на нов потребител</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <UserAdminList
        users={users}
        rentals={rentals}
        searchString={userSearchInput.toLowerCase()}
      />
    </Layout>
  );
}

export async function getServerSideProps() {
  const allUsers = await getAllUsers(prisma);

  const users = allUsers.map((u) => {
    const newUser = { ...u } as any; //define a better type there with conversion of Date to string
    newUser.createdAt = convertDateToDayString(u.createdAt);
    newUser.updatedAt = convertDateToDayString(u.updatedAt);
    return newUser;
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
    //temp TODO
    return newBook;
  });
  const allRentals = await getRentedBooksWithUsers(prisma);
  const rentals = allRentals.map((r) => {
    //calculate remaining days for the rental
    const due = dayjs(r.dueDate);
    const today = dayjs();
    const diff = today.diff(due, 'days');
    if (r.user?.lastName == undefined)
      console.log('Fetching rental for undefined user', r);

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

  // Pass data to the page via props
  //console.log("Fetched rentals", rentals);
  return { props: { users, books, rentals } };
}
