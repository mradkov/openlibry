import {
  Autocomplete,
  Button,
  Card,
  CardActions,
  CardContent,
  TextField,
  Typography,
} from '@mui/material';

type BookLabelCardProps = {
  title: string;
  subtitle: string;
  unit: string;
  link: string;
  startLabel?: number;
  setStartLabel?: any;
  totalNumber: number;
  idFilter: number;
  setIdFilter: any;
  topicsFilter: any;
  setTopicsFilter: any;
  allTopics: any;
};

export default function BookLabelCard({
  title,
  subtitle,
  link,
  startLabel,
  totalNumber,
  setStartLabel,
  idFilter,
  setIdFilter,
  topicsFilter,
  setTopicsFilter,
  allTopics,
}: BookLabelCardProps) {
  const cardHeight = 210;

  return (
    <Card variant="outlined" sx={{ minWidth: 275, minHeight: cardHeight }}>
      <CardContent>
        <Typography variant="h5" component="div">
          {title}
        </Typography>

        <TextField
          id="outlined-number"
          label="Брой етикети"
          key="book_report_number_input"
          type="number"
          value={startLabel}
          error={startLabel! > totalNumber}
          helperText={startLabel! > totalNumber ? 'Толкова няма?' : ''}
          onChange={(e: any) => {
            setStartLabel(parseInt(e.target.value));
          }}
          InputLabelProps={{
            shrink: true,
          }}
          sx={{ mt: 5 }}
        />
        <TextField
          id="outlined-number"
          label="Номер на медията"
          key="book_report_id_input"
          type="number"
          value={idFilter}
          onChange={(e: any) => {
            setIdFilter(parseInt(e.target.value));
          }}
          InputLabelProps={{
            shrink: true,
          }}
          sx={{ mt: 5 }}
        />

        <Autocomplete
          freeSolo
          id="controlled-demo"
          getOptionLabel={(option: any) => `${option.topic} (${option.count})`} // Display topic and count concatenated
          options={allTopics}
          onChange={(event: any, newValue: string | null) => {
            setTopicsFilter(newValue);
          }}
          value={topicsFilter} // Set the selected value based on the topic
          isOptionEqualToValue={(option, value) => option === value} // Compare by topic
          renderInput={(params) => (
            <TextField
              {...params}
              label="Филтър по ключова дума"
              variant="standard"
            />
          )}
        />

        <Typography variant="body2">{subtitle}</Typography>
      </CardContent>
      <CardActions>
        <Button
          size="small"
          onClick={() => {
            //console.log("Rendering API pdf", topicsFilter);
            window.open(
              link +
                '/?start=0' +
                '&end=' +
                Math.floor(startLabel!) +
                (idFilter ? '&id=' + idFilter : '') +
                (topicsFilter ? '&topic=' + topicsFilter.topic : ''),
              '_blank'
            );
          }}
        >
          Създай PDF
        </Button>
      </CardActions>
    </Card>
  );
}
