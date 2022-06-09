const mongoose = require("mongoose");
const Team = mongoose.model(process.env.DB_TEAM_MODEL);
const utils = require("./utils");

const getAll = function (req, res) {
  if (!utils.checkCountAndOffset(req)) {
    utils.sendResponse(res);
  } else {
    let query = {};

    if (req.query && req.query.search) {
      query = {
        name: { $regex: req.query.search, $options: "i" },
      };
    }

    Team.find(query)
      .skip(utils.offset)
      .limit(utils.count)
      .exec()
      .then((teams) =>
        utils.successGetAndAddAndUpdateAndDelete(process.env.STATUS_OK, teams)
      )
      .then(() => _getCountDocuments(query))
      .then((countDocuments) => utils.successCountDocuments(countDocuments))
      .catch((err) => utils.systemError(err))
      .finally(() => utils.sendResponse(res));
  }
};

const _getCountDocuments = function (query) {
  return Team.countDocuments(query);
};

const getOne = function (req, res) {
  const teamId = req.params.teamId;

  if (!utils.checkObjectID(teamId, process.env.TEAM_ID_INVALID_MESSAGE)) {
    utils.sendResponse(res);
  } else {
    Team.findById(teamId)
      .select({
        players: 0,
      })
      .exec()
      .then((team) => {
        if (!team) {
          utils.notFoundError({
            message: process.env.TEAM_ID_NOT_FOUND_MESSAGE,
          });
        } else {
          utils.successGetAndAddAndUpdateAndDelete(process.env.STATUS_OK, team);
        }
      })
      .catch((err) => utils.systemError(err))
      .finally(() => utils.sendResponse(res));
  }
};

const addOne = function (req, res) {
  const newTeam = {
    name: req.body.name,
    country: req.body.country,
    numOfPartInOlympic: req.body.numOfPartInOlympic,
    players: [],
  };

  Team.create(newTeam)
    .then((team) =>
      utils.successGetAndAddAndUpdateAndDelete(process.env.STATUS_CREATED, team)
    )
    .catch((err) => utils.systemError(err))
    .finally(() => utils.sendResponse(res));
};

const _updateOne = function (req, res, updateTeamCallBack) {
  const teamId = req.params.teamId;

  if (!utils.checkObjectID(teamId, process.env.TEAM_ID_INVALID_MESSAGE)) {
    utils.sendResponse(res);
  } else {
    Team.findById(teamId)
      .exec()
      .then((team) => {
        if (!team) {
          utils.notFoundError({
            message: process.env.TEAM_ID_NOT_FOUND_MESSAGE,
          });
          return;
        } else {
          return updateTeamCallBack(req, team);
        }
      })
      .then((updatedTeam) => {
        if (updatedTeam) {
          utils.successGetAndAddAndUpdateAndDelete(
            process.env.STATUS_OK,
            updatedTeam
          );
        }
      })
      .catch((err) => utils.systemError(err))
      .finally(() => utils.sendResponse(res));
  }
};

const _teamFullUpdateOne = function (req, team) {
  team.name = req.body.name;
  team.country = req.body.country;
  team.numOfPartInOlympic = req.body.numOfPartInOlympic;

  return team.save();
};

const _teamPartialUpdateOne = function (req, team) {
  if (req.body.name) {
    team.name = req.body.name;
  }
  if (req.body.country) {
    team.country = req.body.country;
  }
  if (req.body.numOfPartInOlympic) {
    team.numOfPartInOlympic = req.body.numOfPartInOlympic;
  }

  return team.save();
};

const fullUpdateOne = function (req, res) {
  _updateOne(req, res, _teamFullUpdateOne);
};

const partialUpdateOne = function (req, res) {
  _updateOne(req, res, _teamPartialUpdateOne);
};

const deleteOne = function (req, res) {
  const teamId = req.params.teamId;

  if (!utils.checkObjectID(teamId, process.env.TEAM_ID_INVALID_MESSAGE)) {
    utils.sendResponse(res);
  } else {
    Team.findByIdAndDelete(teamId)
      .exec()
      .then((team) => {
        if (!team) {
          utils.notFoundError({
            message: process.env.TEAM_ID_NOT_FOUND_MESSAGE,
          });
        } else {
          utils.successGetAndAddAndUpdateAndDelete(
            process.env.STATUS_NO_CONTENT,
            team
          );
        }
      })
      .catch((err) => utils.systemError(err))
      .finally(() => utils.sendResponse(res));
  }
};

module.exports = {
  getAll,
  getOne,
  addOne,
  fullUpdateOne,
  partialUpdateOne,
  deleteOne,
};
