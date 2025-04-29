import Layout from '@/components/layout/Layout';
import { getAllBooks, getRentedBooksWithUsers } from '@/entities/book';
import { deDE as coreDeDE } from '@mui/material/locale';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { deDE } from '@mui/x-data-grid';
import { PrismaClient } from '@prisma/client';
import dayjs from 'dayjs';
import { getAllUsers } from '../../entities/user';

import BookLabelsCard from '@/components/reports/BookLabelsCard';
import Dashboard from '@/components/reports/Dashboard';
import TagCloudDashboard from '@/components/reports/TagCloud';
import { BookType } from '@/entities/BookType';
import { UserType } from '@/entities/UserType';
import { convertDateToDayString } from '@/utils/dateutils';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import type {} from '@mui/x-data-grid/themeAugmentation';
import router from 'next/router';
import { useState } from 'react';

const prisma = new PrismaClient();

const theme = createTheme(
  {
    palette: {
      primary: { main: '#1976d2' },
    },
    spacing: 4,
  },
  deDE, // x-data-grid translations
  coreDeDE // core translations
);

const cardHeight = 210;

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
    <Card variant="outlined" sx={{ minWidth: 275, minHeight: cardHeight }}>
      <CardContent>
        <Typography variant="h5" component="div">
          {title}
        </Typography>

        <Typography variant="body2">{subtitle}</Typography>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={() => router.push(link)}>
          {buttonTitle}
        </Button>
      </CardActions>
    </Card>
  );
};

const LabelCard = ({
  title,
  subtitle,
  link,
  startLabel,
  totalNumber,
  setStartLabel,
}: ReportCardProps) => {
  return (
    <Card variant="outlined" sx={{ minWidth: 275, minHeight: cardHeight }}>
      <CardContent>
        <Typography variant="h5" component="div">
          {title}
        </Typography>

        <TextField
          id="outlined-number"
          label="Брой етикети"
          key="book_report_number_input"
          type="number"
          value={startLabel}
          error={startLabel! > totalNumber}
          helperText={startLabel! > totalNumber ? 'Толкова няма?' : ''}
          onChange={(e: any) => {
            setStartLabel(parseInt(e.target.value));
          }}
          InputLabelProps={{
            shrink: true,
          }}
          sx={{ mt: 5 }}
        />

        <Typography variant="body2">{subtitle}</Typography>
      </CardContent>
      <CardActions>
        <Button
          size="small"
          onClick={() =>
            window.open(
              link + '/?start=0' + '&end=' + Math.floor(startLabel!),
              '_blank'
            )
          }
        >
          Създай PDF
        </Button>
      </CardActions>
    </Card>
  );
};

export default function Reports({ users, books, rentals }: ReportPropsType) {
  const [startLabel, setStartLabel] = useState(100);
  const [startUserLabel, setStartUserLabel] = useState(10);
  const [topicsFilter, setTopicsFilter] = useState(null);
  const [idFilter, setIdFilter] = useState(0);

  const ReportCard = ({
    title,
    subtitle,
    unit,
    link,
    totalNumber,
  }: ReportCardProps) => {
    return (
      <Card variant="outlined" sx={{ minWidth: 275, minHeight: cardHeight }}>
        <CardContent>
          <Typography variant="h5" component="div">
            {title}
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            {totalNumber}
          </Typography>
          <Typography variant="body2">{subtitle}</Typography>
        </CardContent>
        <CardActions>
          <Button size="small" onClick={() => router.push(link)}>
            Създай таблица
          </Button>
        </CardActions>
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
      <ThemeProvider theme={theme}>
        <TagCloudDashboard tagsSet={tagSet} />

        <Grid
          container
          direction="row"
          alignItems="center"
          justifyContent="center"
          spacing={3}
        >
          <Grid item xs={12} md={6} lg={4} sx={{}}>
            <ReportCard
              title="Потребители"
              subtitle="Списък на всички потребители"
              unit="users"
              totalNumber={users.length}
              link="reports/users"
            />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <ReportCard
              title="Книги"
              subtitle="Списък на всички книги"
              unit="books"
              totalNumber={books.length}
              link="reports/books"
            />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <ReportCard
              title="Наеми"
              subtitle="Списък на всички наеми"
              unit="rentals"
              totalNumber={rentals.length}
              link="reports/rentals"
            />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <LinkCard
              title="Експорт в Excel"
              subtitle="Експорт на данни в Excel"
              buttonTitle="Изтегли Excel"
              link="api/excel"
            />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <LinkCard
              title="Импорт от Excel"
              subtitle="Импорт на данни от Excel"
              buttonTitle="Качи Excel"
              link="reports/xlsimport"
            />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <ReportCard
              title="История"
              subtitle="Активности на книги/потребители"
              unit="audits"
              totalNumber={1000}
              link="reports/audit"
            />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <BookLabelsCard
              title="Етикети за книги"
              subtitle=""
              unit="Етикети"
              link="api/report/booklabels"
              totalNumber={books.length}
              startLabel={startLabel}
              setStartLabel={setStartLabel}
              idFilter={idFilter}
              setIdFilter={setIdFilter}
              topicsFilter={topicsFilter}
              setTopicsFilter={setTopicsFilter}
              allTopics={tagSet}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <LabelCard
              title="Карти"
              subtitle="Списък на всички карти"
              unit="Етикети"
              link="api/report/userlabels"
              totalNumber={users.length}
              startLabel={startUserLabel}
              setStartLabel={setStartUserLabel}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <LinkCard
              title="Напомняния"
              subtitle="Отпечатване на всички напомняния"
              buttonTitle="Създай Word"
              link="/api/report/reminder"
            />
          </Grid>
        </Grid>
        <Dashboard users={users} rentals={rentals} books={books} />
      </ThemeProvider>
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
