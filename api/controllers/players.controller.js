const mongoose = require("mongoose");
const Team = mongoose.model(process.env.DB_TEAM_MODEL);
const utils = require("./utils");

const _successCountDocuments = function (req, players) {
  let filteredPlayers = players;

  if (req.query && req.query.search) {
    filteredPlayers = players.filter((el) =>
      el.name.toLowerCase().includes(req.query.search)
    );
  }

  const totalPage = Math.ceil(filteredPlayers.length / utils.count);
  const message = {
    data: filteredPlayers.slice(
      utils.offset,
      utils.count === utils.offset ? utils.count + 1 : utils.count
    ),
    totalPage: totalPage,
  };

  utils.successGetAndAddAndUpdateAndDelete(process.env.STATUS_OK, message);
};

const getAll = function (req, res) {
  const teamId = req.params.teamId;

  if (!utils.checkObjectID(teamId, process.env.TEAM_ID_INVALID_MESSAGE)) {
    utils.sendResponse(res);
  } else {
    if (!utils.checkCountAndOffset(req)) {
      utils.sendResponse(res);
    } else {
      // { players: { $slice: ["$players", offset, count] }, }
      Team.findById(teamId)
        .select("players")
        .exec()
        .then((team) => {
          if (!team) {
            utils.notFoundError({
              message: process.env.TEAM_ID_NOT_FOUND_MESSAGE,
            });
          } else if (team && !team.players.length === 0) {
            utils.notFoundError({
              message: process.env.PLAYER_ID_NOT_FOUND_MESSAGE,
            });
          } else {
            _successCountDocuments(req, team.players);
          }
        })
        .catch((err) => utils.systemError(err))
        .finally(() => utils.sendResponse(res));
    }
  }
};

const getOne = function (req, res) {
  const teamId = req.params.teamId;
  const playerId = req.params.playerId;

  if (
    !utils.checkObjectID(teamId, process.env.TEAM_ID_INVALID_MESSAGE) ||
    !utils.checkObjectID(playerId, process.env.PLAYER_ID_INVALID_MESSAGE)
  ) {
    utils.sendResponse(res);
  } else {
    Team.findById(teamId)
      .select("players")
      .exec()
      .then((team) => {
        if (!team) {
          utils.notFoundError({
            message: process.env.TEAM_ID_NOT_FOUND_MESSAGE,
          });
        } else if (team && !team.players.id(playerId)) {
          utils.notFoundError({
            message: process.env.PLAYER_ID_NOT_FOUND_MESSAGE,
          });
        } else {
          utils.successGetAndAddAndUpdateAndDelete(
            process.env.STATUS_OK,
            team.players.id(playerId)
          );
        }
      })
      .catch((err) => utils.systemError(err))
      .finally(() => utils.sendResponse(res));
  }
};

const addOne = function (req, res) {
  const teamId = req.params.teamId;

  if (!utils.checkObjectID(teamId, process.env.TEAM_ID_INVALID_MESSAGE)) {
    utils.sendResponse(res);
  } else {
    Team.findById(teamId)
      .select("players")
      .exec()
      .then((team) => {
        if (!team) {
          utils.notFoundError({
            message: process.env.TEAM_ID_NOT_FOUND_MESSAGE,
          });
          return;
        } else {
          return _addPlayer(req, team);
        }
      })
      .then((updatedTeam) => {
        if (updatedTeam) {
          utils.successGetAndAddAndUpdateAndDelete(
            process.env.STATUS_CREATED,
            updatedTeam
          );
        }
      })
      .catch((err) => utils.systemError(err))
      .finally(() => utils.sendResponse(res));
  }
};

const _addPlayer = function (req, team) {
  const newPlayer = { name: req.body.name, age: req.body.age };
  team.players.push(newPlayer);
  return team.save();
};

const _updateOne = function (req, res, playerUpdateCallback) {
  const teamId = req.params.teamId;
  const playerId = req.params.playerId;

  if (
    !utils.checkObjectID(teamId, process.env.TEAM_ID_INVALID_MESSAGE) ||
    !utils.checkObjectID(playerId, process.env.PLAYER_ID_INVALID_MESSAGE)
  ) {
    utils.sendResponse(res);
  } else {
    Team.findById(teamId)
      .select("players")
      .exec()
      .then((team) => {
        if (!team) {
          utils.notFoundError({
            message: process.env.TEAM_ID_NOT_FOUND_MESSAGE,
          });
          return;
        } else if (team && !team.players.id(playerId)) {
          utils.notFoundError({
            message: process.env.PLAYER_ID_NOT_FOUND_MESSAGE,
          });
          return;
        } else {
          return playerUpdateCallback(req, team);
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

const _fullPlayerUpdateOne = function (req, team) {
  let player = team.players.id(req.params.playerId);
  player.name = req.body.name;
  player.age = req.body.age;
  return team.save();
};

const _partialPlayerUpdateOne = function (req, team) {
  let player = team.players.id(req.params.playerId);

  if (req.body.name) {
    player.name = req.body.name;
  }
  if (req.body.age) {
    player.age = req.body.age;
  }

  return team.save();
};

const fullUpdateOne = function (req, res) {
  _updateOne(req, res, _fullPlayerUpdateOne);
};
const partialUpdateOne = function (req, res) {
  _updateOne(req, res, _partialPlayerUpdateOne);
};

const deleteOne = function (req, res) {
  const teamId = req.params.teamId;
  const playerId = req.params.playerId;

  if (
    !utils.checkObjectID(teamId, process.env.TEAM_ID_INVALID_MESSAGE) ||
    !utils.checkObjectID(playerId, process.env.PLAYER_ID_INVALID_MESSAGE)
  ) {
    utils.sendResponse(res);
  } else {
    Team.findById(teamId)
      .select("players")
      .exec()
      .then((team) => {
        if (!team) {
          utils.notFoundError({
            message: process.env.TEAM_ID_NOT_FOUND_MESSAGE,
          });
          return;
        } else if (team && !team.players.id(playerId)) {
          utils.notFoundError({
            message: process.env.PLAYER_ID_NOT_FOUND_MESSAGE,
          });
          return;
        } else {
          return _deletePlayer(req, team);
        }
      })
      .then((updatedTeam) => {
        if (updatedTeam) {
          utils.successGetAndAddAndUpdateAndDelete(
            process.env.STATUS_NO_CONTENT,
            updatedTeam
          );
        }
      })
      .catch((err) => utils.systemError(err))
      .finally(() => utils.sendResponse(res));
  }
};

const _deletePlayer = function (req, team) {
  team.players.id(req.params.playerId).remove();
  return team.save();
};

module.exports = {
  getAll,
  getOne,
  addOne,
  fullUpdateOne,
  partialUpdateOne,
  deleteOne,
};
