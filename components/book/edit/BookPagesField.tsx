import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BookType } from '@/entities/BookType';
import { translations } from '@/entities/fieldTranslations';
import { Dispatch } from 'react';

type BookPagesFieldProps = {
  fieldType: string;
  editable: boolean;
  setBookData: Dispatch<BookType>;
  book: BookType;
};

const BookPagesField = ({
  fieldType,
  editable,
  setBookData,
  book,
}: BookPagesFieldProps) => {
  return (
    <div className="space-y-1">
      <Label htmlFor={fieldType}>
        {(translations['books'] as any)[fieldType]}
      </Label>
      <Input
        id={fieldType}
        name={fieldType}
        value={(book as any)[fieldType]}
        disabled={!editable}
        type="number"
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          const parsedValue = parseInt(event.target.value);
          setBookData({
            ...book,
            [fieldType]: parsedValue,
          });
        }}
      />
    </div>
  );
};

export default BookPagesField;
