import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';

const getCard = (img, title) => {
   return <Card style={{
      border: "none",
      boxShadow: "none"
   }} >
      <CardActionArea style={{
             display: "flex",
             flexDirection: "column",
             justifyContent: "center"}}>
         <CardMedia
            component="img"
            style={{
               height: 100,
               width: 100
            }}
            image={img}
         />
         <CardContent style={{justify: "center"}}>
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
         <Grid container spacing={2}>
            <Grid item xs={12}>
               <Typography variant="h4">תוכנית מעסיקים</Typography>
            </Grid>
            <Grid item xs={12}>
               <Typography variant="h6">
                  גיבוש והנגשת סל פתרונות למעסיקים ולעובדים לשיפור דרכי ההגעה אל העבודה וממנה
            </Typography>
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

