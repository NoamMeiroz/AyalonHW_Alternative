import React from 'react';
import { Link } from 'react-router-dom';

import { makeStyles } from '@mui/styles';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const useStyles = makeStyles({
  root: {
    minWidth: 300,
    maxWidth: 300, 
    display: 'flex',
    alignContent: 'space-between',
    flexDirection: 'column'
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});

export default function ReportCard(props) {
  const classes = useStyles();

  return (
    <Card className={classes.root} variant="outlined">
      <CardContent>
        <Typography variant="h5" component="h2">
          {props.header}
        </Typography>
        <Typography variant="body2" component="p">
          {props.details}
          <br />
        </Typography>
      </CardContent>
      <CardActions style={{alignSelf: 'flex-end'}}>
        <Button size="small" variant="contained" color="primary" component={Link} to={"/reports/"+props.report}>בחירה</Button>
      </CardActions>
    </Card>
  );
}