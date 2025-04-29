import { BookType } from '@/entities/BookType';
import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { Dispatch } from 'react';

type BookNumberFieldProps = {
  fieldType: string;
  editable: boolean;
  setBookData: Dispatch<BookType>;
  book: BookType;
};

const BookNumberField = ({
  fieldType,
  editable,
  setBookData,
  book,
}: BookNumberFieldProps) => {
  return (
    <Grid item xs={12} sm={6}>
      <FormControl fullWidth>
        <InputLabel id="renewal-count-label">Подновявания</InputLabel>
        <Select
          labelId="renewal-count-label"
          id="renewal-count-input"
          value={(book as any)[fieldType]}
          disabled={!editable}
          defaultValue={(book as any)[fieldType]}
          label="Подновявания"
          onChange={(event: SelectChangeEvent) => {
            setBookData({ ...book, [fieldType]: event.target.value });
          }}
        >
          <MenuItem value={0}>Не е подновено</MenuItem>
          <MenuItem value={1}>1x подновено</MenuItem>
          <MenuItem value={2}>2x подновено</MenuItem>
          <MenuItem value={3}>3x подновено</MenuItem>
          <MenuItem value={4}>4x подновено</MenuItem>
          <MenuItem value={5}>5x подновено</MenuItem>
        </Select>
      </FormControl>
    </Grid>
  );
};

export default BookNumberField;
