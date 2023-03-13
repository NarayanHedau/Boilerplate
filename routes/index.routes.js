module.exports = (app) => {
  let authRoute = require("./auth.routes");
  let userRoute = require("./user/user.routes");
  let uploadRoute = require("./upload.routes");


  app.use("/api/authentication", authRoute);
  app.use("/api/user", userRoute);
  app.use("/api/upload", uploadRoute);
};