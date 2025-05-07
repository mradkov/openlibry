import { useRouter } from 'next/router';

import Layout from '@/components/layout/Layout';
import { useState } from 'react';

import { getAllBooks } from '@/entities/book';
import { PrismaClient } from '@prisma/client';

import { convertDateToDayString, currentTime } from '@/utils/dateutils';

import { BookType } from '@/entities/BookType';

import BookSummaryCard from '@/components/book/BookSummaryCard';

import BookSearchBar from '@/components/book/BookSearchBar';
import BookSummaryRow from '@/components/book/BookSummaryRow';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const prisma = new PrismaClient();

interface SearchableBookType extends BookType {
  searchableTopics: Array<string>;
}

interface BookPropsType {
  books: Array<SearchableBookType>;
  numberBooksToShow: number;
}

export default function Books({ books, numberBooksToShow }: BookPropsType) {
  const router = useRouter();

  const [renderedBooks, setRenderedBooks] = useState(books);
  const [bookSearchInput, setBookSearchInput] = useState('');
  const [detailView, setDetailView] = useState(true);
  const [bookCreating, setBookCreating] = useState(false);
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

  const handleCreateNewBook = () => {
    console.log('Creating a new book');
    setBookCreating(true);
    const book: BookType = {
      title: '',
      subtitle: '',
      author: '',
      renewalCount: 0,
      rentalStatus: 'available',
      topics: ';',
      rentedDate: currentTime(),
      dueDate: currentTime(),
    };

    fetch('/api/book', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(book),
    })
      .then((res) => res.json())
      .then((data) => {
        setBookCreating(false);
        router.push('book/' + data.id);
        console.log('Book created', data);
      });
  };

  const handleCopyBook = (book: BookType) => {
    console.log('Creating a new book from an existing book');
    setBookCreating(true);
    const newBook: BookType = {
      title: book.title,
      subtitle: book.subtitle,
      author: book.author,
      renewalCount: 0,
      rentalStatus: 'available',
      topics: book.topics,
      rentedDate: currentTime(),
      dueDate: currentTime(),
    };

    fetch('/api/book', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newBook),
    })
      .then((res) => res.json())
      .then((data) => {
        setBookCreating(false);
        router.push('book/' + data.id);
        console.log('Book created', data);
      });
  };

  const handleReturnBook = (id: number, userid: number) => {
    console.log('Return  book');

    fetch(`/api/book/${id}/user/${userid}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('Book returned, relationship deleted', data, id, userid);
        const newRenderedBooks = renderedBooks.map((b) => {
          console.log('Compare rendered books', b.id, id);
          return b.id === id ? { ...b, rentalStatus: 'available' } : b;
        });
        console.log('New rendered books', newRenderedBooks, renderedBooks);
        setRenderedBooks(newRenderedBooks);
        toast.success('Книгата е върната!');
      });
  };

  const handleInputChange = async (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const searchString = e.target.value.toLowerCase();
    setPageIndex(numberBooksToShow);
    searchBooks(searchString);
    setBookSearchInput(searchString);
  };

  const toggleView = () => {
    const newView = !detailView;
    setDetailView(newView);
    setPageIndex(numberBooksToShow);
    console.log('Detail view render toggled', newView);
  };

  const DetailCardContainer = ({ renderedBooks }: any) => {
    return (
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {renderedBooks.slice(0, pageIndex).map((b: BookType) => (
          <BookSummaryCard
            book={b}
            key={b.id}
            returnBook={() => handleReturnBook(b.id!, b.userId!)}
          />
        ))}
      </div>
    );
  };

  const SummaryRowContainer = ({ renderedBooks }: any) => {
    return (
      <div className="divide-y">
        {renderedBooks.slice(0, pageIndex).map((b: BookType) => (
          <BookSummaryRow
            key={b.id}
            book={b}
            handleCopyBook={() => handleCopyBook(b)}
            returnBook={() => handleReturnBook(b.id!, b.userId!)}
          />
        ))}
      </div>
    );
  };

  return (
    <Layout>
      <BookSearchBar
        handleInputChange={handleInputChange}
        handleNewBook={handleCreateNewBook}
        bookSearchInput={bookSearchInput}
        toggleView={toggleView}
        detailView={detailView}
      />
      <h2 className="text-center font-bold mb-4">
        {searchResultNumber > 0
          ? `Намерени са ${searchResultNumber} книги`
          : 'Няма намерени книги'}
      </h2>
      {detailView ? (
        <DetailCardContainer renderedBooks={renderedBooks} />
      ) : (
        <SummaryRowContainer renderedBooks={renderedBooks} />
      )}
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
    </Layout>
  );
}

export async function getServerSideProps() {
  const allBooks = await getAllBooks(prisma);
  const numberBooksToShow = process.env.NUMBER_BOOKS_OVERVIEW
    ? parseInt(process.env.NUMBER_BOOKS_OVERVIEW)
    : 10;

  const maxBooks = process.env.NUMBER_BOOKS_MAX
    ? parseInt(process.env.NUMBER_BOOKS_MAX)
    : 1000000;

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

  return { props: { books, numberBooksToShow, maxBooks } };
}
