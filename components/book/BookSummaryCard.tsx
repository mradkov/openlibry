import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import { BookType } from '@/entities/BookType';
import { BookCheck, BookUp2 } from 'lucide-react';
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
        <div className="flex text-muted-foreground text-sm space-x-2">
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
        </div>
        <CardTitle>{`${book.title}${
          book.subtitle ? ` (${book.subtitle})` : ''
        }`}</CardTitle>
        <CardDescription>{book.author}</CardDescription>
      </CardHeader>

      <CardContent>
        <Image src={src} width={320} height={200} alt="book-cover" />
        <p>{book.summary}</p>
      </CardContent>
      <CardFooter className="space-x-4">
        <Link
          href={'/book/' + book.id}
          className={buttonVariants({ variant: 'outline' })}
        >
          Детайли
        </Link>
        {book.rentalStatus !== 'available' ? (
          <Button onClick={returnBook}>
            <BookCheck />
            Върни
          </Button>
        ) : null}
      </CardFooter>
    </Card>
  );
}
