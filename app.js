require("dotenv").config();
require("./api/data/db");
const express = require("express");
const teamsRoutes = require("./api/routes/teams.router");
const playersRoutes = require("./api/routes/players.router");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:4200");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
  next();
});
app.use("/api", teamsRoutes);
app.use("/api", playersRoutes);

const server = app.listen(process.env.PORT, function () {
  console.log("Server is running on port", server.address().port);
});
