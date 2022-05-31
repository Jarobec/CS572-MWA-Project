const mongoose = require("mongoose");
const playerSchema = require("./players-model");

const teamSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  numOfPartInOlympic: {
    type: Number,
    min: 0,
    default: 0,
  },
  players: [playerSchema],
});

mongoose.model(
  process.env.DB_TEAM_MODEL,
  teamSchema,
  process.env.DB_TEAMS_COLLECTION
);
