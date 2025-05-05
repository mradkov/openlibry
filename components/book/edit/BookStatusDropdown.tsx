import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BookType } from '@/entities/BookType';
import { translations } from '@/entities/fieldTranslations';
import { Dispatch } from 'react';

type BookTextFieldProps = {
  fieldType: string;
  editable: boolean;
  setBookData: Dispatch<BookType>;
  book: BookType;
};

const BookStatusDropdown = ({
  fieldType,
  editable,
  setBookData,
  book,
}: BookTextFieldProps) => {
  //use these statusses for the book with according translations

  const status = [
    'available',
    'rented',
    'broken',
    'presentation',
    'ordered',
    'lost',
    'remote',
  ];

  return (
    <div className="space-y-1">
      <Label htmlFor={fieldType}>
        {(translations['books'] as any)[fieldType]}
      </Label>
      <Select
        value={(book as any)[fieldType]}
        disabled={!editable}
        onValueChange={(value) => {
          setBookData({ ...book, [fieldType]: value });
        }}
      >
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {status.map((s: string) => {
            return (
              <SelectItem key={s} value={s}>
                {(translations as any)['rentalStatus'][s]}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
};

export default BookStatusDropdown;
