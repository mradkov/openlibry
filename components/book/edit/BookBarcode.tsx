import { BookType } from '@/entities/BookType';
import Barcode from 'react-barcode';

interface BookTypeProps {
  book: BookType;
}

export default function BookBarcode({ book }: BookTypeProps) {
  return (
    <Barcode
      value={book.barcode ?? 'N/A'}
      height={90}
      width={2.0}
      fontOptions="400"
      textMargin={4}
      margin={2}
    />
  );
}
