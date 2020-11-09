import React from 'react';
import { Link } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

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