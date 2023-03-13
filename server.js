let express = require("express");
// let bodyParser = require("body-parser");
// let path = require("path");
let database = require("./helper/database");
let config = require("./config.json");
var bodyParser = require("body-parser");
let cors = require("cors");
var fileupload = require("express-fileupload");

database.initModels();
let app = express();
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

enableCORS(app);
app.use(cors());
app.use(fileupload())
// parse application/json
app.use(bodyParser.json());
database.connect();

global.globalString = "This can be accessed anywhere!++++++++++++++";

function enableCORS(expressInstance) {
  expressInstance.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization, timeZone"
    );
    res.header(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS, PATCH"
    );
    next();
  });
}

require("./routes/index.routes")(app);

app.listen(config.server.port, () => {
  console.log("App listening on port : ", config.server.port);
});
