import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BookType } from '@/entities/BookType';
import { translations } from '@/entities/fieldTranslations';
import { Dispatch } from 'react';

type BookTextFieldProps = {
  fieldType: string;
  editable: boolean;
  setBookData: Dispatch<BookType>;
  book: BookType;
};

const BookTextField = ({
  fieldType,
  editable,
  setBookData,
  book,
}: BookTextFieldProps) => {
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
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setBookData({ ...book, [fieldType]: event.target.value });
        }}
      />
    </div>
  );
};

export default BookTextField;
