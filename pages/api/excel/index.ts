import { BookType } from '@/entities/BookType';
import { UserType } from '@/entities/UserType';
import { getAllBooks } from '@/entities/book';
import { getAllUsers } from '@/entities/user';
import {
  convertDateToDayString,
  convertDayToISOString,
} from '@/utils/dateutils';
import { xlsbookcolumns, xlsusercolumns } from '@/utils/xlsColumnsMapping';
import { PrismaClient } from '@prisma/client';
import Excel from 'exceljs';
import type { NextApiRequest, NextApiResponse } from 'next';
const prisma = new PrismaClient();

const MAX_MIGRATION_SIZE = process.env.MAX_MIGRATION_SIZE || '250mb';
export const config = {
  api: {
    bodyParser: {
      sizeLimit: MAX_MIGRATION_SIZE, // Set desired value here
    },
  },
};

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'GET':
      try {
        const fileName = 'openlibry_export.xlsx';

        const allUsers = await getAllUsers(prisma);

        const users = allUsers.map((u) => {
          const newUser = { ...u } as any; //define a better type there with conversion of Date to string
          newUser.createdAt = convertDateToDayString(u.createdAt);
          newUser.updatedAt = convertDateToDayString(u.updatedAt);
          return newUser;
        });

        const allBooks = await getAllBooks(prisma);
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

        const workbook = new Excel.Workbook();
        const booksheet = workbook.addWorksheet('Bücherliste');
        const usersheet = workbook.addWorksheet('Userliste');

        booksheet.columns = xlsbookcolumns;

        books.map((b: BookType) => {
          booksheet.addRow(b);
        });

        usersheet.columns = xlsusercolumns;

        users.map((u: UserType) => {
          usersheet.addRow(u);
        });

        if (!books)
          return res.status(400).json({ data: 'ERROR: Books not found' });
        res.writeHead(200, {
          'Content-Type':
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': 'attachment; filename=' + fileName,
        });
        await workbook.xlsx.write(res);
        res.end();
      } catch (error) {
        console.log(error);
        res.status(400).json({ data: 'ERROR: ' + error });
      }
      break;
    case 'POST':
      const importLog = ['Starte den Transfer in die Datenbank'];
      try {
        const bookData = req.body.bookData.slice(1); //remove top header row of excel
        const userData = req.body.userData.slice(1);
        importLog.push(
          'Премахнати са заглавните редове от Excel, остават ' +
            bookData.length +
            ' книги и ' +
            userData.length +
            ' потребители'
        );

        console.log(
          'Received import xls, it contains so many books and users: ',
          bookData.length,
          userData.length
        );
        console.log('Example: ', bookData.slice(0, 5), userData.slice(0, 5));

        //create a big transaction to import all users and books (or do nothing if something fails)
        const transaction = [] as any;
        var userImportedCount = 0;
        //transaction.push(prisma.user.deleteMany({})); //start with empty table
        userData.map((u: any) => {
          transaction.push(
            prisma.user.create({
              data: {
                id: u['Номер'], //TODO refactoring to re-use the mapping from utils xls mapping
                lastName: u['Фамилия'],
                firstName: u['Име'],
                schoolGrade: u['Клас'],
                schoolTeacherName: u['Учител'],
                active: u['Активен'],
              },
            })
          );
          userImportedCount++;
        });
        var bookImportedCount = 0;
        bookData.map((b: any) => {
          transaction.push(
            prisma.book.create({
              //TODO this needs a more configurable mapping
              data: {
                id: b['Медиен номер'],
                rentalStatus: b['Статус на заемане'],
                rentedDate: convertDayToISOString(b['Заеман на']),
                dueDate: convertDayToISOString(b['Връщане на']),
                renewalCount: b['Брой подновявания'],
                title: b['Заглавие'],
                subtitle: b['Подзаглавие'],
                author: b['Автор'],
                topics: b['Ключови думи'] ? b['Ключови думи'] : '',
                imageLink: b['Изображение'],
                isbn: b['ISBN'],
                editionDescription: b['Издание'],
                publisherLocation: b['Място на издаване'],
                pages: parseInt(b['Страници']),
                summary: b['Резюме'],
                minPlayers: b['Мин играчи'],
                publisherName: b['Издател'],
                otherPhysicalAttributes: b['Характеристики'],
                supplierComment: b['Доставчик'],
                publisherDate: b['Дата на издаване'],
                physicalSize: b['Размери'],
                minAge: b['Мин възраст'],
                maxAge: b['Макс възраст'],
                additionalMaterial: b['Материали'],
                price: b['Цена'],
                externalLinks: b['Връзки'],
                userId: b['Заеман от'],
              },
            })
          );
          bookImportedCount++;
        });
        importLog.push(
          'Създадена е транзакция за всички данни, започва импортиране'
        );
        await prisma.$transaction(transaction);
        importLog.push('Данните са импортирани');

        console.log('Importing ' + userImportedCount + ' users');
        console.log('Importing ' + bookImportedCount + ' books');

        res.status(200).json({
          result: 'Imported dataset',
          logs: importLog,
        });
      } catch (error) {
        console.log(error);
        importLog.push(
          'Грешка при импортиране: ' + (error as string).toString()
        );
        res.status(400).json({ data: 'ERROR: ' + error, logs: importLog });
      }
      break;
    default:
      res.status(405).end(`${req.method} Not Allowed`);
      break;
  }
}
