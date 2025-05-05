import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { BookType } from '@/entities/BookType';
import { translations } from '@/entities/fieldTranslations';
import { Dispatch } from 'react';

interface BookMultiTextPropsType {
  fieldType: string;
  editable: boolean;
  setBookData: Dispatch<BookType>;
  book: BookType;
}

const BookMultiText = ({
  fieldType,
  editable,
  setBookData,
  book,
}: BookMultiTextPropsType) => {
  return (
    <div className="md:col-span-2">
      <Label htmlFor={fieldType}>
        {(translations['books'] as any)[fieldType]}
      </Label>
      <Textarea
        id={fieldType}
        name={fieldType}
        value={(book as any)[fieldType]}
        disabled={!editable}
        onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
          setBookData({ ...book, [fieldType]: event.target.value });
        }}
      />
    </div>
  );
};

export default BookMultiText;
