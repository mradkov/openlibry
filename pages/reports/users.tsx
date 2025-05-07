import Layout from '@/components/layout/Layout';
import { PrismaClient } from '@prisma/client';

import { BackButton } from '@/components/layout/back-button';
import { DataTable } from '@/components/ui/data-table';
import { UserType } from '@/entities/UserType';
import { getAllUsers } from '@/entities/user';
import { dayjs } from '@/lib/dayjs';
import type {} from '@mui/x-data-grid/themeAugmentation';
import { ColumnDef } from '@tanstack/react-table';

const prisma = new PrismaClient();

interface UsersPropsType {
  users: Array<UserType>;
}

const columns: ColumnDef<UserType>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'createdAt',
    header: 'Създаден',
  },
  {
    accessorKey: 'updatetAt',
    header: 'Обновен',
  },
  { accessorKey: 'firstName', header: 'Име' },
  { accessorKey: 'lastName', header: 'Фамилия' },
  { accessorKey: 'phone', header: 'Телефон' },
  { accessorKey: 'eMail', header: 'Ел. поща' },
  { accessorFn: (u) => (u.active ? '✅' : '❌'), header: 'Активен' },
];

export default function Users({ users }: UsersPropsType) {
  return (
    <Layout>
      <DataTable columns={columns} data={users} />
      <div className="text-right mt-4">
        <BackButton />
      </div>
    </Layout>
  );
}

export async function getServerSideProps() {
  const users = (await getAllUsers(prisma)).map((u) => ({
    ...u,
    createdAt: u.createdAt ? dayjs(u.createdAt).format('D MMMM YYYY') : null,
    updatedAt: u.updatedAt ? dayjs(u.updatedAt).format('D MMMM YYYY') : null,
  }));
  return { props: { users } };
}
