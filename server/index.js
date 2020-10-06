require('dotenv').config();

const express = require("express");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/authRoutes");
const employerRoutes = require("./routes/employerRoutes");
const db = require("./db/database");
const {logger, ServerError} = require('./log');
const cors = require("cors");
const formidableMiddleware = require('express-formidable');
var server_app = express();

// synchronize with database
db.sequelize
  .authenticate()
  .then(() => {
    logger.info('Connection has been established successfully.');
  })
  .catch(err => {
    logger.error('Unable to connect to the database: '+err);
    process.exit(1);
  });

// add log for every request
server_app.use( (req, res, done) => {
  logger.info("handle request.", 
    { "uri": req.originalUrl, 
    "method": req.method,
    "ip": req.ip });
  done();
});

server_app.use(bodyParser.json()); 
server_app.use(cors());
server_app.use(formidableMiddleware());
server_app.use("/api", authRoutes);
server_app.use("/api/employer", employerRoutes);


// error handling. must be last call 
server_app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  if (err.message)
    if (err.message instanceof ServerError )
      res.locals.message = err.message.message;
    else
      res.locals.message = err.message;
  else
    res.locals.message = err;

  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // add this line to include winston logging
  if (err.message)
    logger.error(`${err.status || 500} - ${res.locals.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);


  // render the error page
  res.status(err.status || 500);
  res.json({ message: err.message });
});
  
server_app.listen(5000, () => {
  logger.info('Node api server is running 5000!')
});

