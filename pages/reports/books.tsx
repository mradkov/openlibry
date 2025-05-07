import Layout from '@/components/layout/Layout';
import { PrismaClient } from '@prisma/client';

import { BackButton } from '@/components/layout/back-button';
import { DataTable } from '@/components/ui/data-table';
import { BookType } from '@/entities/BookType';
import { getAllBooks } from '@/entities/book';
import { translations } from '@/entities/fieldTranslations';
import { dayjs } from '@/lib/dayjs';
import { ColumnDef } from '@tanstack/react-table';

const prisma = new PrismaClient();

interface BookPropsType {
  books: Array<BookType>;
}

export default function Books({ books }: BookPropsType) {
  const columns: ColumnDef<BookType>[] = [
    {
      accessorKey: 'title',
      header: 'Заглавие',
    },
    {
      accessorKey: 'author',
      header: 'Автор',
    },
    {
      accessorFn: (r) => translations.rentalStatus[r.rentalStatus],
      header: 'Статус',
    },
    { accessorKey: 'libraryId', header: 'Каталожен номер' },
    { accessorKey: 'isbn', header: 'ISBN' },
  ];

  return (
    <Layout>
      <DataTable columns={columns} data={books} />
      <div className="text-right mt-4">
        <BackButton />
      </div>
    </Layout>
  );
}

export async function getServerSideProps() {
  const books = (await getAllBooks(prisma)).map((b) => ({
    ...b,
    createdAt: b.createdAt ? dayjs(b.createdAt).format('D MMMM YYYY') : null,
    updatedAt: b.updatedAt ? dayjs(b.updatedAt).format('D MMMM YYYY') : null,
    rentedDate: b.rentedDate ? dayjs(b.rentedDate).format('D MMMM YYYY') : null,
    dueDate: b.dueDate ? dayjs(b.dueDate).format('D MMMM YYYY') : null,
  }));

  return { props: { books } };
}
