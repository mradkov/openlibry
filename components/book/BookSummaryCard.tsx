import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import { BookType } from '@/entities/BookType';
import { dayjs } from '@/lib/dayjs';
import { cn } from '@/lib/utils';
import { BookCheck, BookText, BookUp2 } from 'lucide-react';
import { Button, buttonVariants } from '../ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';

interface BookSummaryCardPropType {
  book: BookType;
  returnBook: React.MouseEventHandler<HTMLButtonElement>;
}

export default function BookSummaryCard({
  book,
  returnBook,
}: BookSummaryCardPropType) {
  const [src, setSrc] = useState('/coverimages/default_1.png');

  return (
    <Card key={book.id}>
      <CardHeader>
        <div className="flex text-muted-foreground text-sm space-x-2 justify-between items-center">
          {book.rentalStatus === 'rented' ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <BookUp2 className="text-chart-5" />
                </TooltipTrigger>
                <TooltipContent>Книгата е заета</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <BookCheck className="text-chart-2" />
                </TooltipTrigger>
                <TooltipContent>Книгата е налична</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          {book.libraryId ? <span>{`ID: ${book.libraryId}`}</span> : null}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Link
                  href={'/book/' + book.id}
                  className={buttonVariants({ variant: 'ghost', size: 'icon' })}
                >
                  <BookText className="size-6" />
                </Link>
              </TooltipTrigger>
              <TooltipContent>Детайли</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <CardTitle>{`${book.title}${
          book.subtitle ? ` (${book.subtitle})` : ''
        }`}</CardTitle>
        <CardDescription>{book.author}</CardDescription>
      </CardHeader>

      <CardContent className="grow">
        <Image src={src} width={320} height={200} alt="book-cover" />
        <p>{book.summary}</p>
      </CardContent>
      {book.userId ? (
        <CardFooter className="text-sm space-x-4 justify-between">
          <p>
            Взета от{' '}
            <Link
              href={`/user/${book.userId}`}
              className={cn(
                buttonVariants({ variant: 'link' }),
                'p-0 font-bold'
              )}
            >{`${book.user?.firstName} ${book.user?.lastName}`}</Link>{' '}
            до <b>{dayjs(book.dueDate).format('D MMMM YYYY')}</b>
          </p>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Button variant="ghost" size="icon" onClick={returnBook}>
                  <BookCheck className="size-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Върни</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardFooter>
      ) : null}
    </Card>
  );
}
