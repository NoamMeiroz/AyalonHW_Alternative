import React, { Component } from 'react';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';

const getCard = (img, title) => {
   return <Card style={{
      border: "none",
      boxShadow: "none"
   }} >
      <CardActionArea style={{
         display: "flex",
         flexDirection: "column",
         justifyContent: "center"
      }}>
         <CardMedia
            component="img"
            style={{
               height: 100,
               width: 100
            }}
            image={img}
         />
         <CardContent style={{ justify: "center" }}>
            <Typography variant="subtitle1">
               {title}
            </Typography>
         </CardContent>
      </CardActionArea>
   </Card >
}

export default class Welcome extends Component {
   render() {
      return <div>
         <Grid container direction="column" spacing={2} alignItems="center" alignContent="center">
            <Grid item >
               <Typography variant="h4">תוכנית מעסיקים</Typography>
            </Grid>
            <Grid item>
               <Typography variant="h6">
                  גיבוש והנגשת סל פתרונות למעסיקים ולעובדים לשיפור דרכי ההגעה אל העבודה וממנה</Typography>
            </Grid>
            <Grid item xs={12}>
               <Grid container justify="center" spacing={5}>
                  <Grid key={1} item>
                     {getCard("/Maala_icons_clean6.png", <div>שדרוג דרכי ההגעה<br />לעבודה ולבית</div>)}
                  </Grid>
                  <Grid key={2} item>
                     {getCard("/Maala_icons_clean5.png", <div>סל פתרונות<br />למעסיקים ולעובדים</div>)}
                  </Grid>
                  <Grid key={3} item>
                     {getCard("/Maala_icons_clean4.png", <div>הסרת חסמים<br />רגולטורים</div>)}
                  </Grid>
                  <Grid key={4} item>
                     {getCard("/Maala_icons_clean3.png", <div>תמיכה<br />לוגיסטית</div>)}
                  </Grid>
                  <Grid key={5} item>
                     {getCard("/Maala_icons_clean2.png", <div>מודעות</div>)}
                  </Grid>
               </Grid>
            </Grid>
         </Grid>
      </div>
   }
}

