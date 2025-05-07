import { useState } from 'react';

import { BookType } from '@/entities/BookType';
import { UserType } from '@/entities/UserType';

import { dayjs } from '@/lib/dayjs';
import { cn } from '@/lib/utils';
import { Book, BookCheck, BookUp2, CalendarPlus } from 'lucide-react';
import Link from 'next/link';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion';
import { Button, buttonVariants } from '../ui/button';
import { Input } from '../ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';

interface BookPropsType {
  books: Array<BookType>;
  users: Array<UserType>;
  handleExtendBookButton: (id: number, b: BookType) => void;
  handleReturnBookButton: (bookid: number, userid: number) => void;
  handleRentBookButton: (id: number, userid: number) => void;
  userExpanded: number | false;
  numberBooksToShow: number;
}

export function BookRentalList({
  books,
  users,
  handleExtendBookButton,
  handleReturnBookButton,
  handleRentBookButton,
  userExpanded,
  numberBooksToShow,
}: BookPropsType) {
  const [renderedBooks, setRenderedBooks] = useState(books);
  const [bookSearchInput, setBookSearchInput] = useState('');
  const [searchResultNumber, setSearchResultNumber] = useState(0);
  const [pageIndex, setPageIndex] = useState(numberBooksToShow);
  function searchBooks(searchString: string) {
    const foundBooks = books.filter(
      (book) =>
        book.title.toLowerCase().includes(searchString) ||
        book.author.toLowerCase().includes(searchString) ||
        book.subtitle?.toLowerCase().includes(searchString) ||
        book.libraryId?.toLowerCase().includes(searchString) ||
        book.barcode?.toLowerCase().includes(searchString) ||
        book.id?.toString().toLowerCase().includes(searchString)
    );
    setPageIndex(numberBooksToShow);
    setRenderedBooks(foundBooks);
    setSearchResultNumber(foundBooks.length);
  }

  const handleInputChange = async (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const searchString = e.target.value.toLowerCase();
    setPageIndex(numberBooksToShow);
    searchBooks(searchString);
    setBookSearchInput(searchString);
  };

  return (
    <div>
      <Input
        placeholder="Книга (заглавие, номер, баркод, ISBN)"
        id="bookInput"
        value={bookSearchInput}
        onChange={handleInputChange}
        className="h-10"
      />
      <p className="text-sm text-secondary-foreground h-5">
        {bookSearchInput.length > 0
          ? searchResultNumber > 0
            ? `Намерени са ${searchResultNumber} книги`
            : 'Няма намерени книги'
          : ''}
      </p>

      <Accordion type="multiple">
        {renderedBooks.slice(0, pageIndex).map((b) => (
          <AccordionItem key={b.id} value={b.id?.toString() ?? ''}>
            <AccordionTrigger className="text-base">
              <div className="flex grow">
                <p className="grow">
                  {`${b.title}${b.subtitle && ` (${b.subtitle})`} - ${
                    b.author
                  }`}{' '}
                </p>
                {userExpanded && b.rentalStatus === 'available' ? (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRentBookButton(b.id!, userExpanded);
                          }}
                        >
                          <BookUp2 className="size-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Вземи</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ) : null}
                <Link
                  onClick={(e) => e.stopPropagation()}
                  href={'/book/' + b.id}
                  className={buttonVariants({
                    variant: 'ghost',
                    size: 'icon',
                  })}
                >
                  <Book className="size-5" />
                </Link>
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-base">
              {!!b.libraryId && <p>{`ID: ${b.libraryId}`}</p>}
              {!!b.isbn && <p>{`ISBN: ${b.isbn}`}</p>}

              {b.userId ? (
                <div className="flex items-center">
                  <p className="grow">
                    Взета от{' '}
                    <Link
                      href={`/user/${b.userId}`}
                      className={cn(
                        buttonVariants({ variant: 'link' }),
                        'p-0 font-bold'
                      )}
                    >{`${b.user?.firstName} ${b.user?.lastName}`}</Link>{' '}
                    до <b>{dayjs(b.dueDate).format('D MMMM YYYY')}</b>
                  </p>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            handleReturnBookButton(b.id!, b.userId!)
                          }
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
                          onClick={() => handleExtendBookButton(b.id!, b)}
                        >
                          <CalendarPlus className="size-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Удължи</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              ) : null}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      {renderedBooks.length - pageIndex > 0 && (
        <Button
          onClick={() => setPageIndex(pageIndex + numberBooksToShow)}
          className="mt-4"
          variant="outline"
        >
          {`Покажи още ${Math.min(
            numberBooksToShow,
            renderedBooks.length - pageIndex
          )} от ${Math.max(
            0,
            renderedBooks.length - pageIndex
          ).toString()} книги`}
        </Button>
      )}
    </div>
  );
}
