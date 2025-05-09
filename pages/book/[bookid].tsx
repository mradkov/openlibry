import Layout from '@/components/layout/Layout';
import { useState } from 'react';
import { getAllTopics, getBook } from '../../entities/book';

import { useRouter } from 'next/router';

import { convertStringToDay, replaceBookDateString } from '@/utils/dateutils';
import { PrismaClient } from '@prisma/client';

import BookEditForm from '@/components/book/BookEditForm';
import { BackButton } from '@/components/layout/back-button';
import { BookType } from '@/entities/BookType';
import { UserType } from '@/entities/UserType';

import { GetServerSidePropsContext } from 'next/types';
import { toast } from 'sonner';

interface BookDetailProps {
  user: UserType;
  book: BookType;
  topics: string[];
}

export default function BookDetail({ user, book, topics }: BookDetailProps) {
  const router = useRouter();

  const [bookData, setBookData] = useState<BookType>(book);

  if (!router.query.bookid) {
    return <div>ID not found</div>;
  }

  const bookid = parseInt(
    Array.isArray(router.query.bookid)
      ? router.query.bookid[0]
      : router.query.bookid
  );

  const handleSaveButton = () => {
    console.log('Saving book ', bookData);

    const rentedDate = convertStringToDay(bookData.rentedDate as string);
    const dueDate = convertStringToDay(bookData.dueDate as string);

    //we don't need to update the dates
    const { updatedAt, createdAt, ...savingBook } = bookData;

    fetch('/api/book/' + bookid, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...savingBook, rentedDate, dueDate }),
    })
      .then((res) => res.json())
      .then((data) => {
        toast.success('Книгата е запазена!');
        router.push('/book');
      });
  };

  const handleDeleteButton = () => {
    console.log('Deleting book ', bookData);

    fetch('/api/book/' + bookid, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('Delete operation performed on ', bookid, data);
        toast.warning('Книгата е изтрита!');
        router.push('/book');
      });
  };

  return (
    <Layout>
      <BookEditForm
        book={bookData}
        setBookData={setBookData}
        deleteBook={handleDeleteButton}
        saveBook={handleSaveButton}
        topics={topics}
      />
      <div className="text-right">
        <BackButton />
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const prisma = new PrismaClient();

  const dbbook = await getBook(prisma, parseInt(context.query.bookid as any));
  if (!dbbook) {
    return {
      notFound: true,
    };
  }

  const dbtopics = await getAllTopics(prisma);
  const topics: string[] = [];
  if (dbtopics != null) {
    const redundanttopics: string[] = [];
    dbtopics.map((t) => {
      if ('topics' in t && t.topics != null) {
        const singletopics = t.topics.split(';');
        singletopics.map((s) => {
          const filteredTopic = s.trim();
          s.trim().length > 0 ? redundanttopics.push(s) : 0;
        });
      }
    });

    //const topics = [...new Set(redundanttopics)];

    redundanttopics.map((element: string) => {
      if (!topics.includes(element)) {
        topics.push(element);
      }
    });
  }

  //console.log("Found these topics:", topics);

  if (!dbbook) return;

  const book = replaceBookDateString(dbbook as any);
  //console.log("Replaced date string", book, dbbook);
  //const imagesArray = await getImages();
  //console.log("Images", imagesArray);
  //push array to object for performance reasons
  //const images = {};
  //imagesArray.map((i) => ((images as any)[i] = "1"));

  if (!('id' in book) || !book.id) return; //shouldn't happen

  // Pass data to the page via props
  return { props: { book, topics } };
}
