import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  Paper,
} from '@mui/material';
import React, { useEffect } from 'react';

interface RentSearchParamsType {
  overdue: boolean;
  setUserSearchInput: any;
}

export default function RentSearchParams({
  overdue,
  setUserSearchInput,
}: RentSearchParamsType) {
  console.log('Search params', overdue);
  const [isOverdue, setIsOverdue] = React.useState(overdue);
  const [updatedSearchString, setUpdatedSearchString] =
    React.useState<string>('');

  useEffect(() => {
    setUserSearchInput(isOverdue ? 'просрочено? ' : ' ');
  }, [isOverdue, setUserSearchInput]);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsOverdue(event.target.checked);
  };

  return (
    <Paper>
      {' '}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-start',
          p: 2,
          width: '100%',
        }}
      >
        <FormControlLabel
          control={
            <Checkbox checked={isOverdue} onChange={handleCheckboxChange} />
          }
          label="Просрочено"
        />
        <FormControl sx={{ mt: 2, minWidth: 120 }}>
          <InputLabel id="grade-label">Клас</InputLabel>
        </FormControl>
      </Box>
    </Paper>
  );
}
