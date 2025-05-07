import Layout from '@/components/layout/Layout';
import { translations } from '@/entities/fieldTranslations';
import { PrismaClient } from '@prisma/client';

import { BackButton } from '@/components/layout/back-button';
import { DataTable } from '@/components/ui/data-table';
import { AuditType } from '@/entities/AuditType';
import { getAllAudit } from '@/entities/audit';
import { dayjs } from '@/lib/dayjs';
import type {} from '@mui/x-data-grid/themeAugmentation';
import { ColumnDef } from '@tanstack/react-table';

const prisma = new PrismaClient();

interface AuditPropsType {
  audits: Array<AuditType>;
}

const columns: ColumnDef<AuditType>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'createdAt',
    header: 'Създаден',
  },
  {
    accessorKey: 'updatedAt',
    header: 'Обновен',
  },
  {
    accessorFn: (r) => translations.events[r.eventType] ?? r.eventType,
    header: 'Действие',
  },
  { accessorKey: 'eventContent', header: 'Детайли' },
  { accessorKey: 'userid', header: 'Потребител ID' },
  { accessorKey: 'bookid', header: 'Книга ID' },
];

export default function Audit({ audits }: AuditPropsType) {
  return (
    <Layout>
      <DataTable columns={columns} data={audits} />
      <div className="text-right mt-4">
        <BackButton />
      </div>
    </Layout>
  );
}

export async function getServerSideProps() {
  const audits = (await getAllAudit(prisma)).map((a) => ({
    ...a,
    createdAt: a.createdAt
      ? dayjs(a.createdAt).format('D MMMM YYYY HH:mm')
      : null,
    updatedAt: a.updatedAt
      ? dayjs(a.updatedAt).format('D MMMM YYYY HH:mm')
      : null,
  }));

  return { props: { audits } };
}
