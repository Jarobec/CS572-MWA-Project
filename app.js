require("dotenv").config();
require("./api/data/db");
const express = require("express");
const teamsRoutes = require("./api/routes/teams.router");
const playersRoutes = require("./api/routes/players.router");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", teamsRoutes);
app.use("/api", playersRoutes);

// app.use(function (param, req, res, next) {
//   const response = { status: 0, message: [] };
//   if (param.error) {
//     response.status = 500;
//     response.message = param.error;
//   } else if (!param.document) {
//     response.status = 404;
//     response.message = { message: param.notFoundMsg + " not found" };
//   } else {
//     response.status = 200;
//     response.message = param.document;
//   }

//   if (param.func) {
//     param.func();
//   }

//   res.status(response.status).json(response.message);
// });

const server = app.listen(process.env.PORT, function () {
  console.log("Server is running on port", server.address().port);
});
