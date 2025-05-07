import { BookType } from '@/entities/BookType';
import { UserType } from '@/entities/UserType';
import { Dispatch, useState } from 'react';
import OverdueIcon from './OverdueIcon';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { RentalsUserType } from '@/entities/RentalsUserType';
import { dayjs } from '@/lib/dayjs';
import { cn } from '@/lib/utils';
import { hasOverdueBooks } from '@/utils/hasOverdueBooks';
import {
  BookCheck,
  CalendarPlus,
  Eraser,
  MoreVertical,
  UserCog,
} from 'lucide-react';
import Link from 'next/link';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion';
import { Button, buttonVariants } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';

type UserPropsType = {
  users: Array<UserType>;
  books: Array<BookType>;
  rentals: Array<RentalsUserType>;
  handleExtendBookButton: (id: number, b: BookType) => void;
  handleReturnBookButton: (bookid: number, userid: number) => void;
  setUserExpanded: Dispatch<number | false>;
  userExpanded: number | false;
};

const defaultSearchParams = { overdue: false };

export default function UserRentalList({
  users,
  books,
  rentals,
  handleExtendBookButton,
  handleReturnBookButton,
  setUserExpanded,
  userExpanded,
}: UserPropsType) {
  const [userSearchInput, setUserSearchInput] = useState('');

  const [returnedBooks, setReturnedBooks] = useState({});
  const [searchParams, setSearchParams] = useState(defaultSearchParams);
  //console.log("Rendering updated users:", users);

  const handleClear = (e: any) => {
    e.preventDefault();
    setUserExpanded(false);
    setUserSearchInput('');
  };

  let selectedSingleUserId: number = -1;
  const handleInputChange = (e: React.ChangeEvent<any>): void => {
    setUserSearchInput(e.target.value);
  };

  const booksForUser = (id: number): Array<RentalsUserType> => {
    const userRentals = rentals.filter((r: RentalsUserType) => r.userid == id);
    //console.log("Filtered rentals", userRentals);
    return userRentals;
  };

  const getBookFromID = (id: number): BookType => {
    const book = books.filter((b: BookType) => b.id == id);
    return book[0];
  };

  const getUserFromID = (id: number): UserType => {
    const user = users.filter((u: UserType) => u.id == id);
    return user[0];
  };

  const filterUsers = (users: Array<UserType>, searchString: string) => {
    selectedSingleUserId = -1;
    if (searchString.length == 0) return users; //nothing to do

    //console.log("Search tokens", searchTokens);
    const searchPattern = { overdue: false };
    let finalString = searchString;
    if (searchString.indexOf('дължимо?') > -1) {
      searchPattern.overdue = true;
      finalString = searchString.replace('дължимо?', '').trim();
    }

    //console.log("Search check:", searchPattern, finalString);

    const filteredUsers = users.filter((u: UserType) => {
      //this can be done shorter, but like this is easier to understand, ah well, what a mess
      let foundString = false;
      let foundOverdue = true;
      const filterForOverdue = searchPattern.overdue;

      //check if the string is at all there
      if (
        u.lastName.toLowerCase().includes(finalString) ||
        u.firstName.toLowerCase().includes(finalString) ||
        u.id!.toString().includes(finalString)
      ) {
        foundString = true;
      }

      if (
        filterForOverdue &&
        !(searchPattern.overdue == hasOverdueBooks(booksForUser(u.id!)))
      ) {
        foundOverdue = false;
      }

      //console.log("Found: ", foundString, foundClass, foundOverdue);
      if (foundString && foundOverdue) return u;
    });
    if (filteredUsers.length == 1) {
      selectedSingleUserId = filteredUsers[0].id!;
    }
    return filteredUsers;
  };

  return (
    <div>
      <div>
        <div className="relative grow flex items-center space-x-1">
          <Input
            placeholder="Потребител (име, телефон)"
            id="userInput"
            value={userSearchInput}
            onChange={handleInputChange}
            className="h-10"
          />
          {userSearchInput && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="absolute right-[34px] top-0.5">
                  <Button variant="ghost" size="icon" onClick={handleClear}>
                    <Eraser />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Изчистване на търсенето</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger>
              <MoreVertical className="hover:cursor-pointer hover:bg-secondary rounded-md transition-colors p-1 size-8" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <div className="flex items-center space-x-2 p-4">
                <Checkbox
                  checked={searchParams.overdue}
                  onCheckedChange={(c) => {
                    setSearchParams({ overdue: c === true });
                  }}
                  id="overdue"
                />
                <Label htmlFor="overdue">Просрочени</Label>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <p className="text-sm text-secondary-foreground h-5">
          {userExpanded
            ? `Избран потребител: ${getUserFromID(userExpanded).firstName} ${
                getUserFromID(userExpanded).lastName
              }`
            : ''}
        </p>
      </div>

      <Accordion
        type="single"
        collapsible
        value={userExpanded.toString()}
        onValueChange={(v) => setUserExpanded(Number(v))}
      >
        {filterUsers(users, userSearchInput).map((u: UserType) => {
          const rentalsUser = booksForUser(u.id!);

          return (
            <AccordionItem key={u.id} value={u.id?.toString() ?? ''}>
              <AccordionTrigger className="text-base">
                <div className="flex grow">
                  <p className="grow">
                    {u.firstName +
                      ' ' +
                      u.lastName +
                      (rentalsUser.length > 0
                        ? ', ' +
                          rentalsUser.length +
                          (rentalsUser.length > 1 ? ' книги' : ' книга')
                        : '')}
                  </p>

                  <OverdueIcon rentalsUser={rentalsUser} />
                  <Link
                    onClick={(e) => e.stopPropagation()}
                    href={'/user/' + u.id}
                    className={buttonVariants({
                      variant: 'ghost',
                      size: 'icon',
                    })}
                  >
                    <UserCog className="size-5" />
                  </Link>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-base">
                {rentalsUser.map((r: RentalsUserType) => (
                  <div key={r.id} className="flex items-center">
                    <p className="grow">
                      <Link
                        href={`/book/${r.id}`}
                        className={cn(
                          buttonVariants({ variant: 'link' }),
                          'p-0 font-bold'
                        )}
                      >{`"${r.title}"`}</Link>{' '}
                      взета до <b>{dayjs(r.dueDate).format('D MMMM YYYY')}</b>
                    </p>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              if (!userExpanded) return; //нещо се обърка и няма потребител, който да върне книгата
                              handleReturnBookButton(r.id, userExpanded);
                              const time = Date.now();
                              const newbook = {};
                              (newbook as any)[r.id!] = time;
                              setReturnedBooks({
                                ...returnedBooks,
                                ...newbook,
                              });
                            }}
                          >
                            <BookCheck className="size-5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Върни</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              handleExtendBookButton(
                                r.id,
                                getBookFromID(r.id!)
                              );
                              const time = Date.now();
                              const newbook = {};
                              (newbook as any)[r.id!] = time;
                              setReturnedBooks({
                                ...returnedBooks,
                                ...newbook,
                              });
                            }}
                          >
                            <CalendarPlus className="size-5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Удължи</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
