import { BookType } from '@/entities/BookType';
import { UserType } from '@/entities/UserType';
import { getAllBooks } from '@/entities/book';
import { getAllUsers } from '@/entities/user';
import { dayjs } from '@/lib/dayjs';
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
        const fileName = `export_${dayjs().format('YYYY-MM-DD_HH-mm-ss')}.xlsx`;

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
        const booksheet = workbook.addWorksheet('Книги');
        const usersheet = workbook.addWorksheet('Потребители');

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
      const importLog = ['Стартиране на трансфера в базата данни'];
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
                firstName: u['Име'],
                lastName: u['Фамилия'],
                active: u['Активен'],
                phone: u['Телефон'],
                eMail: u['Имейл'],
                createdAt: convertDayToISOString(u['Създаден на']),
                updatedAt: convertDayToISOString(u['Актуализиран на']),
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
                rentalStatus: b['Статус'],
                rentedDate: convertDayToISOString(b['Взета на']),
                dueDate: convertDayToISOString(b['Взета до']),
                renewalCount: b['Брой подновявания'],
                title: b['Заглавие'],
                subtitle: b['Подзаглавие'],
                author: b['Автор'],
                barcode: b['Баркод'],
                libraryId: b['Каталожен номер'],
                isbn: b['ISBN'],
                editionDescription: b['Издание'],
                publisherLocation: b['Държава на издаване'],
                pages: parseInt(b['Страници']),
                summary: b['Резюме'],
                publisherName: b['Издател'],
                otherPhysicalAttributes: b['Други характеристики'],
                supplierComment: b['Доставчик'],
                publisherDate: b['Дата на публикуване'],
                physicalSize: b['Размери'],
                minAge: b['Мин възраст'],
                maxAge: b['Макс възраст'],
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
