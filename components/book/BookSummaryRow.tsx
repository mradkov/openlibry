import { BookType } from '@/entities/BookType';
import { BookCheck, BookText, BookUp2, Copy } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '../ui/badge';
import { Button, buttonVariants } from '../ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';

interface BookSummaryRowPropType {
  book: BookType;
  handleCopyBook: React.MouseEventHandler<HTMLButtonElement>;
  returnBook: React.MouseEventHandler<HTMLButtonElement>;
}

interface BookTopicsPropType {
  topics: string;
}

export default function BookSummaryRow({
  book,
  handleCopyBook,
  returnBook,
}: BookSummaryRowPropType) {
  const BookTopics = ({ topics }: BookTopicsPropType) => {
    const topicsArray = topics.split(';');
    return (
      <div>
        {topicsArray
          .filter((t) => t.length > 0)
          .map((t) => (
            <Badge></Badge>
          ))}
      </div>
    );
  };
  const bookTopics = (
    'topics' in book && book.topics != null ? book.topics : ''
  ).split(';');

  return (
    <div className="flex items-center gap-2 p-2 hover:bg-secondary">
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

      <p className="grow">{`"${book.title}${
        book.subtitle ? ` (${book.subtitle})` : ''
      }" от ${book.author}`}</p>

      {bookTopics
        .filter((t) => t.length > 0)
        .map((t, i) => (
          <Badge key={i}>{t}</Badge>
        ))}
      {book.rentalStatus !== 'available' ? (
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
      ) : null}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Button variant="ghost" size="icon" onClick={handleCopyBook}>
              <Copy className="size-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Копиране на книга</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Link
              href={'/book/' + book.id}
              className={buttonVariants({ variant: 'ghost', size: 'icon' })}
            >
              <BookText className="size-5" />
            </Link>
          </TooltipTrigger>
          <TooltipContent>Детайли</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
