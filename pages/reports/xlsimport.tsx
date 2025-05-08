import { BackButton } from '@/components/layout/back-button';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import * as ExcelJS from 'exceljs';
import { Save } from 'lucide-react';
import React, { useState } from 'react';

export default function XLSImport() {
  const [bookData, setBookData] = useState<any[]>([]);
  const [excelLoaded, setExcelLoaded] = useState(false);

  const [userData, setUserData] = useState<any[]>([]);
  const [importLog, setImportLog] = useState<string[]>([]);

  const DenseTable = ({ data }: any) => {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {data[0].map((d: any, i: number) => {
                return <TableHead key={i}>{d}</TableHead>;
              })}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.slice(1, 11).map((row: any, idx: number) => (
              <TableRow key={idx}>
                {Object.keys(row).map((d: any, i: number) => {
                  return <TableCell key={i}>{row[d]}</TableCell>;
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  const convertSheetToJson = (worksheet: any) => {
    const json: any[] = [];
    worksheet.eachRow(
      { includeEmpty: false },
      (row: any, rowNumber: number) => {
        //console.log("Reading row", row);
        const rowValues = row.values as ExcelJS.CellValue[];
        if (rowNumber === 1) {
          // Assuming the first row contains headers
          json.push(rowValues); // Capturing headers
        } else {
          const rowData: any = {};
          rowValues.forEach((value, index) => {
            if (json[0] && json[0][index]) {
              rowData[json[0][index] as string] = value;
            }
          });
          json.push(rowData);
        }
      }
    );
    return json;
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    try {
      const logs = [] as string[];
      const file = event.target.files ? event.target.files[0] : null;
      console.log('Uploading file', event.target.files);
      logs.push('Файлът се зарежда: ' + file);
      if (!file) return;

      const workbook = new ExcelJS.Workbook();
      const arrayBuffer = await file.arrayBuffer();
      logs.push('Excel файлътр се конвертира');
      await workbook.xlsx.load(arrayBuffer);
      logs.push('Успешно конвертиране');

      const worksheetBooks = workbook.worksheets[0];
      logs.push('Файлът съдържа списък с книги');
      const worksheetUsers = workbook.worksheets[1];
      logs.push('Файлът съдържа списък с потребители');

      logs.push('Конвертиране на списъка с книги към JSON');
      const booksJson: any[] = convertSheetToJson(worksheetBooks);
      logs.push(
        'Списъкът с книги е успеншно конвертиран към JSON: ' +
          booksJson.length +
          ' намерени книги'
      );
      setBookData(booksJson);
      logs.push('Конвертиране на списъка с потребители към JSON');
      const usersJson: any[] = convertSheetToJson(worksheetUsers);
      logs.push(
        'Списъкът с потребители е успеншно конвертиран към JSON: ' +
          usersJson.length +
          ' намерени потребители'
      );
      setUserData(usersJson);

      setExcelLoaded(true);
      setImportLog(logs);
      logs.push(
        'Импортирането на Excel файл е завършено, данните могат да бъдат въведени в базата данни.'
      );
    } catch (e: any) {
      console.error(e);
    }
  };

  const handleImportButton = async () => {
    console.log('Importing data into the db');
    const payload = { bookData: bookData, userData: userData };
    const endpoint = '/api/excel';
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    const result = await response.json();
    console.log('API Call to database done, response is', result);
    try {
      //take the log content of the api call and add it to the log
      const logs = result.logs as string[];
      setImportLog(importLog.concat(logs));
    } catch (e: any) {
      console.log('Kein Ergebnis der API', result);
    }
  };

  return (
    <Layout>
      <div className="md:w-60 space-y-2">
        <Label htmlFor="xls">Зареждане на файл</Label>
        <Input
          type="file"
          id="xls"
          placeholder=".xlsx, .xls"
          accept=".xlsx, .xls"
          onChange={handleFileUpload}
        />
        {excelLoaded && (
          <Button onClick={handleImportButton} className="w-full">
            <Save />
            Въведи в базата данни
          </Button>
        )}
      </div>

      <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
        {importLog.map((i: string, idx: number) => (
          <li key={idx}>{i}</li>
        ))}
      </ul>
      {excelLoaded && (
        <div>
          <p>Книги първи 10 реда</p>
          {bookData.length > 0 ? (
            <DenseTable data={bookData} />
          ) : (
            'Няма налични данни'
          )}

          <p>Потребители първи 10 реда</p>
          {userData.length > 0 ? (
            <DenseTable data={userData} />
          ) : (
            'Няма налични данни'
          )}
        </div>
      )}
      <div className="text-right mt-4">
        <BackButton />
      </div>
    </Layout>
  );
}
