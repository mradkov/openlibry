/* eslint-disable @next/next/no-img-element */
import { Dispatch, useState } from 'react';

import { BookType } from '@/entities/BookType';
import { dayjs } from '@/lib/dayjs';
import { cn } from '@/lib/utils';
import { AlertOctagon, Edit, Save, SquareX, Trash2, Undo } from 'lucide-react';
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Button, buttonVariants } from '../ui/button';
import BookBarcode from './edit/BookBarcode';
import BookMultiText from './edit/BookMultiText';
import BookPagesField from './edit/BookPagesField';
import BookStatusDropdown from './edit/BookStatusDropdown';
import BookTextField from './edit/BookTextField';

type BookEditFormPropType = {
  book: BookType;
  setBookData: Dispatch<BookType>;
  deleteBook: React.MouseEventHandler<HTMLButtonElement>;
  saveBook: React.MouseEventHandler<HTMLButtonElement>;
  topics: string[];
  initiallyEditable?: boolean;
};

export default function BookEditForm({
  book,
  setBookData,
  deleteBook,
  saveBook,
  initiallyEditable = false,
}: BookEditFormPropType) {
  const [showDelete, setShowDelete] = useState(false);

  const [editable, setEditable] = useState(
    initiallyEditable ? initiallyEditable : false
  );

  return (
    <div className="space-y-4 mb-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="mx-auto md:row-span-2">
          <h2 className="font-bold text-center">{`Книга с ID: ${book.id}`}</h2>
          <BookBarcode book={book} />
        </div>
        <BookTextField
          fieldType={'barcode'}
          editable={editable}
          setBookData={setBookData}
          book={book}
        />
        <BookTextField
          fieldType={'libraryId'}
          editable={editable}
          setBookData={setBookData}
          book={book}
        />
        <BookTextField
          fieldType={'title'}
          editable={editable}
          setBookData={setBookData}
          book={book}
        />
        <BookTextField
          fieldType={'subtitle'}
          editable={editable}
          setBookData={setBookData}
          book={book}
        />
        <BookTextField
          fieldType={'author'}
          editable={editable}
          setBookData={setBookData}
          book={book}
        />
        <BookTextField
          fieldType={'isbn'}
          editable={editable}
          setBookData={setBookData}
          book={book}
        />
        <BookMultiText
          fieldType={'summary'}
          editable={editable}
          setBookData={setBookData}
          book={book}
        />
        <BookTextField
          fieldType={'editionDescription'}
          editable={editable}
          setBookData={setBookData}
          book={book}
        />{' '}
        <BookTextField
          fieldType={'publisherName'}
          editable={editable}
          setBookData={setBookData}
          book={book}
        />{' '}
        <BookTextField
          fieldType={'publisherLocation'}
          editable={editable}
          setBookData={setBookData}
          book={book}
        />{' '}
        <BookTextField
          fieldType={'publisherDate'}
          editable={editable}
          setBookData={setBookData}
          book={book}
        />{' '}
        <BookPagesField
          fieldType={'pages'}
          editable={editable}
          setBookData={setBookData}
          book={book}
        />{' '}
        <BookStatusDropdown
          fieldType={'rentalStatus'}
          editable={editable}
          setBookData={setBookData}
          book={book}
        />{' '}
        <div>
          {book.userId ? (
            <div className="space-x-4 justify-between">
              <p>
                Взета от{' '}
                <Link
                  href={`/user/${book.userId}`}
                  className={cn(
                    buttonVariants({ variant: 'link' }),
                    'p-0 font-bold'
                  )}
                >{`${book.user?.firstName} ${book.user?.lastName}`}</Link>{' '}
                на <b>{dayjs(book.rentedDate).format('D MMMM YYYY')}</b> до{' '}
                <b>{dayjs(book.dueDate).format('D MMMM YYYY')}</b>.
                {book.renewalCount && book.renewalCount > 0 ? (
                  <>
                    <br />
                    {`Наемът е удължавант ${book.renewalCount} пъти`}
                  </>
                ) : (
                  ''
                )}
              </p>
            </div>
          ) : null}
        </div>
        <BookTextField
          fieldType={'minAge'}
          editable={editable}
          setBookData={setBookData}
          book={book}
        />{' '}
        <BookTextField
          fieldType={'maxAge'}
          editable={editable}
          setBookData={setBookData}
          book={book}
        />{' '}
        <BookTextField
          fieldType={'price'}
          editable={editable}
          setBookData={setBookData}
          book={book}
        />{' '}
        <BookTextField
          fieldType={'externalLinks'}
          editable={editable}
          setBookData={setBookData}
          book={book}
        />{' '}
        <BookTextField
          fieldType={'additionalMaterial'}
          editable={editable}
          setBookData={setBookData}
          book={book}
        />{' '}
        <BookTextField
          fieldType={'otherPhysicalAttributes'}
          editable={editable}
          setBookData={setBookData}
          book={book}
        />{' '}
        <BookTextField
          fieldType={'supplierComment'}
          editable={editable}
          setBookData={setBookData}
          book={book}
        />{' '}
        <BookTextField
          fieldType={'physicalSize'}
          editable={editable}
          setBookData={setBookData}
          book={book}
        />{' '}
        {showDelete ? (
          <Alert
            variant="destructive"
            className={cn(!editable && 'opacity-30')}
          >
            <AlertOctagon className="h-4 w-4" />
            <AlertTitle>Изтриване на книга</AlertTitle>
            <AlertDescription>
              След изтрване на книгата информацията не може да се възстанови!
              <div className="space-x-2">
                <Button
                  onClick={() => setShowDelete(false)}
                  variant="outline"
                  className="text-foreground"
                  size="sm"
                >
                  <Undo />
                  Отмени
                </Button>
                <Button
                  onClick={deleteBook}
                  className="bg-destructive hover:bg-destructive/90"
                  size="sm"
                >
                  <Trash2 />
                  Изтрий
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        ) : (
          <Button
            onClick={() => setShowDelete(true)}
            disabled={!editable}
            variant="link"
            className="w-fit italic text-destructive text-xs p-0"
            size="sm"
          >
            Изтриване на книга
          </Button>
        )}
        {editable ? (
          <>
            <Button onClick={() => setEditable(false)} variant="outline">
              <SquareX />
              Откажи
            </Button>
            <Button
              onClick={(e) => {
                saveBook(e);
                setEditable(false);
              }}
            >
              <Save />
              Запази
            </Button>
          </>
        ) : (
          <Button onClick={() => setEditable(true)} variant="outline">
            <Edit />
            Редактирай
          </Button>
        )}
      </div>
    </div>
  );
}
