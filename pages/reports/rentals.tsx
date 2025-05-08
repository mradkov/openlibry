import Layout from '@/components/layout/Layout';
import { getRentedBooksWithUsers } from '@/entities/book';
import { PrismaClient } from '@prisma/client';

import { BackButton } from '@/components/layout/back-button';
import { DataTable } from '@/components/ui/data-table';
import { Rental } from '@/entities/BookType';
import { dayjs } from '@/lib/dayjs';
import { ColumnDef } from '@tanstack/react-table';

const prisma = new PrismaClient();

interface RentalsPropsType {
  rentals: Rental[];
}

const columns: ColumnDef<Rental>[] = [
  {
    accessorKey: 'title',
    header: 'Заглавие',
  },
  {
    accessorKey: 'author',
    header: 'Автор',
  },
  {
    accessorFn: (r) => `${r.user?.firstName} ${r.user?.lastName}`,
    header: 'Заета от',
  },
  {
    accessorFn: (r) => r.user?.firstName,
    header: 'Име',
  },
  {
    accessorFn: (r) => r.user?.lastName,
    header: 'Фамилия',
  },
  {
    accessorKey: 'dueDate',
    header: 'Връщане на',
  },
  { accessorKey: 'renewalCount', header: 'Подновявания' },
];

export default function Rentals({ rentals }: RentalsPropsType) {
  return (
    <Layout>
      <DataTable columns={columns} data={rentals} />
      <div className="text-right mt-4">
        <BackButton />
      </div>
    </Layout>
  );
}

export async function getServerSideProps() {
  const rentals: Rental[] = (await getRentedBooksWithUsers(prisma)).map(
    (rental) => ({
      ...rental,
      dueDate: rental.dueDate
        ? dayjs(rental.dueDate).format('D MMMM YYYY')
        : null,
    })
  );

  return { props: { rentals } };
}
