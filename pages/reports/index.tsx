import Layout from '@/components/layout/Layout';
import { getAllBooks, getRentedBooksWithUsers } from '@/entities/book';
import { PrismaClient } from '@prisma/client';
import { getAllUsers } from '../../entities/user';

import { buttonVariants } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { BookType } from '@/entities/BookType';
import { UserType } from '@/entities/UserType';
import { dayjs } from '@/lib/dayjs';
import { convertDateToDayString } from '@/utils/dateutils';
import Link from 'next/link';

const prisma = new PrismaClient();

interface ReportPropsType {
  users: Array<UserType>;
  books: Array<BookType>;
  rentals: any;
}

type ReportCardProps = {
  title: string;
  subtitle: string;
  unit: string;
  link: string;
  startLabel?: number;
  setStartLabel?: any;
  totalNumber: number;
};

type LinkCardProps = {
  title: string;
  subtitle: string;
  buttonTitle: string;
  link: string;
};

const LinkCard = ({ title, subtitle, buttonTitle, link }: LinkCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{subtitle}</CardDescription>
      </CardHeader>
      <CardFooter>
        <Link href={link} className={buttonVariants({ variant: 'outline' })}>
          {buttonTitle}
        </Link>
      </CardFooter>
    </Card>
  );
};

export default function Reports({ users, books, rentals }: ReportPropsType) {
  const ReportCard = ({
    title,
    subtitle,
    link,
    totalNumber,
  }: ReportCardProps) => {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{`${title} - ${totalNumber}`}</CardTitle>
          <CardDescription>{subtitle}</CardDescription>
        </CardHeader>

        <CardFooter>
          <Link href={link} className={buttonVariants({ variant: 'outline' })}>
            Виж всички
          </Link>
        </CardFooter>
      </Card>
    );
  };
  const allTags = [] as any;
  books.map((b: BookType) => {
    //console.log("Importing topics", b.topics);
    b.topics
      ? allTags.push(b.topics!.split(';').filter((t: string) => t.length > 0))
      : null;
  });
  //console.log("All Tags", allTags);

  const tagSet = convertToTopicCount(allTags);
  //console.log("Tag Set", tagSet);

  function convertToTopicCount(
    arr: string[][]
  ): { topic: string; count: number }[] {
    // Flatten the array of arrays into a single array of strings
    const flattenedArray = arr.flat();

    // Use reduce to create the topicCountMap
    const topicCountMap = flattenedArray.reduce((acc, topic) => {
      acc[topic] = (acc[topic] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    // Convert the map to an array of objects with "topic" and "count"
    return Object.keys(topicCountMap).map((topic) => ({
      topic,
      count: topicCountMap[topic],
    }));
  }

  return (
    <Layout>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <ReportCard
          title="Потребители"
          subtitle="Списък на всички потребители"
          unit="users"
          totalNumber={users.length}
          link="reports/users"
        />
        <ReportCard
          title="Книги"
          subtitle="Списък на всички книги"
          unit="books"
          totalNumber={books.length}
          link="reports/books"
        />
        <ReportCard
          title="Наеми"
          subtitle="Списък на всички наеми"
          unit="rentals"
          totalNumber={rentals.length}
          link="reports/rentals"
        />
        <LinkCard
          title="Експорт в Excel"
          subtitle="Експорт на данни в Excel"
          buttonTitle="Изтегли Excel"
          link="api/excel"
        />
        <LinkCard
          title="Импорт от Excel"
          subtitle="Импорт на данни от Excel"
          buttonTitle="Качи Excel"
          link="reports/xlsimport"
        />
        <ReportCard
          title="История"
          subtitle="Активности на книги/потребители"
          unit="audits"
          totalNumber={1000}
          link="reports/audit"
        />
      </div>
    </Layout>
  );
}

export async function getServerSideProps() {
  const allUsers = await getAllUsers(prisma);
  console.log('Reports page - loaded Users');
  const users = allUsers.map((u) => {
    const newUser = { ...u } as any; //define a better type there with conversion of Date to string
    newUser.createdAt = convertDateToDayString(u.createdAt);
    newUser.updatedAt = convertDateToDayString(u.updatedAt);
    return newUser;
  });
  console.log('Reports page - converted Users');

  const allBooks = await getAllBooks(prisma);
  console.log('Reports page - loaded Books');
  const books = allBooks.map((b) => {
    const newBook = { ...b } as any; //define a better type there with conversion of Date to string
    newBook.createdAt = convertDateToDayString(b.createdAt);
    newBook.updatedAt = convertDateToDayString(b.updatedAt);
    newBook.rentedDate = b.rentedDate
      ? convertDateToDayString(b.rentedDate)
      : '';
    newBook.dueDate = b.dueDate ? convertDateToDayString(b.dueDate) : '';
    //temp TODO
    return newBook;
  });
  console.log('Reports page - converted Books');
  const allRentals = await getRentedBooksWithUsers(prisma);
  console.log('Reports page - Rentals calculated');
  const rentals = allRentals.map((r) => {
    //calculate remaining days for the rental
    const due = dayjs(r.dueDate);
    const today = dayjs();
    const diff = today.diff(due, 'days');

    return {
      id: r.id,
      title: r.title,
      lastName: r.user?.lastName,
      firstName: r.user?.firstName,
      remainingDays: diff,
      dueDate: convertDateToDayString(due.toDate()),
      renewalCount: r.renewalCount,
      userid: r.user?.id,
    };
  });

  //console.log(allRentals);

  // Pass data to the page via props
  return { props: { users, books, rentals } };
}
