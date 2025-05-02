/* eslint-disable @next/next/no-img-element */
import Box from '@mui/material/Box';
import { Dispatch, useState } from 'react';

import { AlertColor } from '@mui/material';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import SaveAltIcon from '@mui/icons-material/SaveAlt';
import { Divider, Grid, Paper, Tooltip } from '@mui/material';

import { BookType } from '@/entities/BookType';
import HoldButton from '../layout/HoldButton';
import BookBarcode from './edit/BookBarcode';
import BookDateField from './edit/BookDateField';
import BookImageUploadButton from './edit/BookImageUploadButton';
import BookMultiText from './edit/BookMultiText';
import BookNumberField from './edit/BookNumberField';
import BookPagesField from './edit/BookPagesField';
import BookStatusDropdown from './edit/BookStatusDropdown';
import BookTextField from './edit/BookTextField';
import BookTopicsChips from './edit/BookTopicsChips';

const bull = (
  <Box
    component="span"
    sx={{ display: 'inline-block', mx: '1px', transform: 'scale(0.8)' }}
  >
    •
  </Box>
);

type BookEditFormPropType = {
  book: BookType;
  setBookData: Dispatch<BookType>;
  deleteBook: React.MouseEventHandler<HTMLButtonElement>;
  deleteSafetySeconds: number;
  saveBook: React.MouseEventHandler<HTMLButtonElement>;
  topics: string[];
};

export default function BookEditForm({
  book,
  setBookData,
  deleteBook,
  deleteSafetySeconds = 3,
  saveBook,
  topics,
}: BookEditFormPropType) {
  const [editable, setEditable] = useState(true);
  const [loadingImage, setLoadingImage] = useState(1); //key for changing image

  const [editButtonLabel, setEditButtonLabel] = useState('Редактиране');

  useState<AlertColor>('success');
  console.log('DELETE config', deleteSafetySeconds);

  const toggleEditButton = () => {
    editable ? setEditButtonLabel('Редактиране') : setEditButtonLabel('Отказ');
    setEditable(!editable);
  };

  const CoverImage = () => {
    //console.log("Key", loadingImage); //this forces a reload after upload
    return (
      <img
        src={
          process.env.NEXT_PUBLIC_API_URL +
          '/api/images/' +
          book.id +
          '?' +
          loadingImage
        }
        width="200"
        height="200"
        alt="cover image"
        key={loadingImage}
        style={{
          border: '1px solid #fff',
          width: 'auto',
        }}
      />
    );
  };

  return (
    <Paper sx={{ mt: 5, px: 4 }}>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={2}
      >
        <Grid item xs={12} md={4}>
          {editable && (
            <Tooltip title="Запази">
              <Button
                onClick={(e) => {
                  saveBook(e);

                  //toggleEditButton();
                }}
                startIcon={<SaveAltIcon />}
              >
                Запази
              </Button>
            </Tooltip>
          )}
        </Grid>
        <Grid item xs={12} md={4}>
          {editable && (
            <Tooltip title="Изтриване">
              <HoldButton
                duration={deleteSafetySeconds * 1000}
                buttonLabel="Изтриване"
                onClick={deleteBook}
              />
            </Tooltip>
          )}
        </Grid>{' '}
      </Grid>
      <Divider sx={{ mb: 3 }}>
        <Typography variant="body1">Основни данни за книгата</Typography>
      </Divider>
      <Grid container direction="row" justifyContent="center" alignItems="top">
        {' '}
        <Grid item container xs={12} sm={9} direction="row" spacing={2}>
          {' '}
          <Grid item xs={12} sm={6}>
            <BookTextField
              fieldType={'title'}
              editable={editable}
              setBookData={setBookData}
              book={book}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <BookTextField
              fieldType={'author'}
              editable={editable}
              setBookData={setBookData}
              book={book}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <BookTextField
              fieldType={'subtitle'}
              editable={editable}
              setBookData={setBookData}
              book={book}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <BookTextField
              fieldType={'libraryId'}
              editable={editable}
              setBookData={setBookData}
              book={book}
            />
          </Grid>
          <Grid item xs={12}>
            <BookMultiText
              fieldType={'summary'}
              editable={editable}
              setBookData={setBookData}
              book={book}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <BookTextField
              fieldType={'barcode'}
              editable={editable}
              setBookData={setBookData}
              book={book}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <BookTextField
              fieldType={'isbn'}
              editable={editable}
              setBookData={setBookData}
              book={book}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <BookTopicsChips
              fieldType={'topics'}
              editable={editable}
              setBookData={setBookData}
              book={book}
              topics={topics}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <BookTextField
              fieldType={'editionDescription'}
              editable={editable}
              setBookData={setBookData}
              book={book}
            />{' '}
          </Grid>
          <Grid item xs={12} sm={6}>
            <BookTextField
              fieldType={'publisherName'}
              editable={editable}
              setBookData={setBookData}
              book={book}
            />{' '}
          </Grid>
          <Grid item xs={12} sm={6}>
            <BookTextField
              fieldType={'publisherLocation'}
              editable={editable}
              setBookData={setBookData}
              book={book}
            />{' '}
          </Grid>
          <Grid item xs={12} sm={6}>
            <BookTextField
              fieldType={'publisherDate'}
              editable={editable}
              setBookData={setBookData}
              book={book}
            />{' '}
          </Grid>
          <Grid item xs={12} sm={6}>
            <BookPagesField
              fieldType={'pages'}
              editable={editable}
              setBookData={setBookData}
              book={book}
            />{' '}
          </Grid>{' '}
          <Divider sx={{ mb: 3 }}></Divider>
          <Grid item xs={12} sm={6}>
            <BookStatusDropdown
              fieldType={'rentalStatus'}
              editable={editable}
              setBookData={setBookData}
              book={book}
            />{' '}
          </Grid>
          <Grid item xs={12} sm={6}>
            <BookNumberField
              fieldType={'renewalCount'}
              editable={editable}
              setBookData={setBookData}
              book={book}
            />{' '}
          </Grid>
          <Grid item xs={12} sm={6}>
            <BookDateField
              fieldType={'rentedDate'}
              editable={editable}
              setBookData={setBookData}
              book={book}
            />{' '}
          </Grid>
          <Grid item xs={12} sm={6}>
            <BookDateField
              fieldType={'dueDate'}
              editable={editable}
              setBookData={setBookData}
              book={book}
            />{' '}
          </Grid>{' '}
          <Divider sx={{ mb: 3 }}></Divider>
          <Grid item xs={12} sm={6}>
            <BookTextField
              fieldType={'minAge'}
              editable={editable}
              setBookData={setBookData}
              book={book}
            />{' '}
          </Grid>
          <Grid item xs={12} sm={6}>
            <BookTextField
              fieldType={'maxAge'}
              editable={editable}
              setBookData={setBookData}
              book={book}
            />{' '}
          </Grid>
          <Grid item xs={12} sm={6}>
            <BookTextField
              fieldType={'price'}
              editable={editable}
              setBookData={setBookData}
              book={book}
            />{' '}
          </Grid>
          <Grid item xs={12} sm={6}>
            <BookTextField
              fieldType={'externalLinks'}
              editable={editable}
              setBookData={setBookData}
              book={book}
            />{' '}
          </Grid>
          <Grid item xs={12} sm={6}>
            <BookTextField
              fieldType={'additionalMaterial'}
              editable={editable}
              setBookData={setBookData}
              book={book}
            />{' '}
          </Grid>
          <Grid item xs={12} sm={6}>
            <BookTextField
              fieldType={'otherPhysicalAttributes'}
              editable={editable}
              setBookData={setBookData}
              book={book}
            />{' '}
          </Grid>
          <Grid item xs={12} sm={6}>
            <BookTextField
              fieldType={'supplierComment'}
              editable={editable}
              setBookData={setBookData}
              book={book}
            />{' '}
          </Grid>
          <Grid item xs={12} sm={6}>
            <BookTextField
              fieldType={'physicalSize'}
              editable={editable}
              setBookData={setBookData}
              book={book}
            />{' '}
          </Grid>
        </Grid>
        <Grid
          item
          container
          xs={12}
          sm={3}
          direction="column"
          justifyContent="top"
          alignItems="center"
        >
          <Grid item>
            {process.env.NEXT_PUBLIC_API_URL && (
              <>
                <CoverImage />
                <BookImageUploadButton
                  book={book}
                  setLoadingImage={setLoadingImage}
                />
              </>
            )}
          </Grid>{' '}
          <Grid item>
            <BookBarcode book={book} />
          </Grid>
        </Grid>
      </Grid>
      <Divider sx={{ mb: 3 }}></Divider>
    </Paper>
  );
}
