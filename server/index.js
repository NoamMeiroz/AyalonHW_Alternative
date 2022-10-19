require("dotenv").config();

const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/authRoutes");
const employerRoutes = require("./routes/employerRoutes");
const reportsRoutes = require("./routes/reportsRoutes");
const algorithmSettingsRoutes = require("./routes/algorithmSettingsRoutes");
const constRoutes = require("./routes/constRoutes");
const db = require("./db/database");
const { logger, ServerError } = require("./log");
const cors = require("cors");
const { wsServer } = require("./websocket");

var server_app = express();

//
// We need the same instance of the session parser in express and
// WebSocket server.
//
const sessionParser = session({
  saveUninitialized: false,
  secret: process.env.SESSION_SECRET,
  resave: false,
});

// synchronize with database
db.sequelize
  .authenticate()
  .then(() => {
    logger.info("Connection has been established successfully.");
  })
  .catch((err) => {
    logger.error("Unable to connect to the database: " + err);
    process.exit(1);
  });

// add log for every request
server_app.use((req, res, done) => {
  logger.info("handle request.", {
    uri: req.originalUrl,
    method: req.method,
    ip: req.ip,
  });
  done();
});

//server_app.use(sessionParser);
server_app.use(bodyParser.json());
server_app.use(bodyParser.urlencoded({ extended: true }));
server_app.use(cors());
//server_app.use(formidableMiddleware());
// routing
server_app.use("/api", authRoutes);
server_app.use("/api/employer", employerRoutes);
server_app.use("/api/reports", reportsRoutes);
server_app.use("/api/const", constRoutes);
server_app.use("/api/algosetting", algorithmSettingsRoutes);

// error handling. must be last call
server_app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  console.log(err);
  if (err.message)
    if (err.message instanceof ServerError)
      res.locals.message = err.message.message;
    else res.locals.message = err.message;
  else res.locals.message = JSON.stringify(err);

  res.locals.error = req.app.get("env") === "development" ? err : {};

  // add this line to include winston logging
  if (err.message)
    logger.error(
      `${err.status || 500} - ${res.locals.message} - ${req.originalUrl} - ${
        req.method
      } - ${req.ip}`
    );
  else {
    logger.error(JSON.stringify(err));
  }

  // render the error page
  res.status(err.status || 500);
  res.json({ message: err.message });
});

const httpServer = server_app.listen(5000, () => {
  logger.info("Node api server is running 5000!");
});

// handle websocket;
httpServer.on("upgrade", (request, socket, head) => {
  // find if logged in and have a valid userId session
  /*	sessionParser(request, {}, () => {
		if (!request.session.userId) {
			let error = JSON.stringify({type: '401'});
			socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
			socket.destroy();
			return;
		}
*/
  wsServer.handleUpgrade(request, socket, head, (socket) => {
    wsServer.emit("connection", socket, request);
    //	});
  });
});