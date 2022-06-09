const mongoose = require("mongoose");
const Team = mongoose.model(process.env.DB_TEAM_MODEL);

let count = parseInt(
  process.env.DEFAULT_FIND_COUNT,
  process.env.INTEGER_CONVERSION_BASE
);
let offset = parseInt(
  process.env.DEFAULT_FIND_OFFSET,
  process.env.INTEGER_CONVERSION_BASE
);
const maxCount = parseInt(
  process.env.DEFAULT_FIND_COUNT_MAX,
  process.env.INTEGER_CONVERSION_BASE
);

const response = {
  status: parseInt(process.env.STATUS_OK, process.env.INTEGER_CONVERSION_BASE),
  message: [],
};

const _checkCountAndOffset = function (req) {
  if (req.query && req.query.count) {
    count = parseInt(req.query.count, process.env.INTEGER_CONVERSION_BASE);
  }
  if (req.query && req.query.offset) {
    offset = parseInt(req.query.offset, process.env.INTEGER_CONVERSION_BASE);
  }
  if (isNaN(count) || isNaN(offset)) {
    _validationError({
      message: "QueryString: Offset and Count should be numbers",
    });
    return false;
  } else {
    if (count > maxCount) {
      _validationError({ message: "Cannot exceed count of " + maxCount });
      return false;
    } else {
      offset = offset * count;
    }
  }

  return true;
};

const _checkTeamIDIsValid = function (teamId) {
  if (!mongoose.isValidObjectId(teamId)) {
    _validationError({ message: "Invalid Team ID" });
    return false;
  }
  return true;
};

const _checkPlayerIDIsValid = function (playerId) {
  if (!mongoose.isValidObjectId(playerId)) {
    _validationError({ message: "Invalid Player ID" });
    return false;
  }
  return true;
};

const _resetResponse = function () {
  response.status = parseInt(
    process.env.STATUS_OK,
    process.env.INTEGER_CONVERSION_BASE
  );
  response.message = [];
};

const _resetCountAndOffset = function () {
  count = parseInt(
    process.env.DEFAULT_FIND_COUNT,
    process.env.INTEGER_CONVERSION_BASE
  );
  offset = parseInt(
    process.env.DEFAULT_FIND_OFFSET,
    process.env.INTEGER_CONVERSION_BASE
  );
};

const _sendResponse = function (res) {
  res.status(response.status).json(response.message);
  _resetResponse();
  _resetCountAndOffset();
};

const _validationError = function (err) {
  response.status = parseInt(
    process.env.STATUS_BAD_REQUEST,
    process.env.INTEGER_CONVERSION_BASE
  );
  response.message = err;
};

const _systemError = function (err) {
  response.status = parseInt(
    process.env.STATUS_INTERNAL_SERVER_ERROR,
    process.env.INTEGER_CONVERSION_BASE
  );
  response.message = err;
};

const _notFoundError = function (err) {
  response.status = parseInt(
    process.env.STATUS_NOT_FOUND,
    process.env.INTEGER_CONVERSION_BASE
  );
  response.message = err;
};

const _successGetAndAddAndUpdateAndDelete = function (status, player) {
  response.status = parseInt(status, process.env.INTEGER_CONVERSION_BASE);
  response.message = player;
};

const _successCountDocuments = function (req, players) {
  let filteredPlayers = players;

  if (req.query && req.query.search) {
    filteredPlayers = players.filter((el) =>
      el.name.toLowerCase().includes(req.query.search)
    );
  }

  const totalPage = Math.ceil(filteredPlayers.length / count);
  const message = {
    players: filteredPlayers.slice(
      offset,
      count === offset ? count + 1 : count
    ),
    totalPage: totalPage,
  };

  _successGetAndAddAndUpdateAndDelete(process.env.STATUS_OK, message);
};

const getAll = function (req, res) {
  const teamId = req.params.teamId;

  if (!_checkTeamIDIsValid(teamId)) {
    _sendResponse(res);
  } else {
    if (!_checkCountAndOffset(req)) {
      _sendResponse(res);
    } else {
      // { players: { $slice: ["$players", offset, count] }, }
      Team.findById(teamId)
        .select("players")
        .exec()
        .then((team) => {
          if (!team) {
            _notFoundError({ message: "Team ID not found" });
          } else if (team && !team.players.length === 0) {
            _notFoundError({ message: "Players not found" });
          } else {
            _successCountDocuments(req, team.players);
          }
        })
        .catch((err) => _systemError(err))
        .finally(() => _sendResponse(res));
    }
  }
};

const getOne = function (req, res) {
  const teamId = req.params.teamId;
  const playerId = req.params.playerId;

  if (!_checkTeamIDIsValid(teamId) || !_checkPlayerIDIsValid(playerId)) {
    _sendResponse(res);
  } else {
    Team.findById(teamId)
      .select("players")
      .exec()
      .then((team) => {
        if (!team) {
          _notFoundError({ message: "Team ID not found" });
        } else if (team && !team.players.id(playerId)) {
          _notFoundError({ message: "Player ID not found" });
        } else {
          _successGetAndAddAndUpdateAndDelete(
            process.env.STATUS_OK,
            team.players.id(playerId)
          );
        }
      })
      .catch((err) => _systemError(err))
      .finally(() => _sendResponse(res));
  }
};

const addOne = function (req, res) {
  const teamId = req.params.teamId;

  if (!_checkTeamIDIsValid(teamId)) {
    _sendResponse(res);
  } else {
    Team.findById(teamId)
      .select("players")
      .exec()
      .then((team) => {
        if (!team) {
          _notFoundError({ message: "Team ID not found" });
          return;
        } else {
          return _addPlayer(req, team);
        }
      })
      .then((updatedTeam) => {
        if (updatedTeam) {
          _successGetAndAddAndUpdateAndDelete(
            process.env.STATUS_CREATED,
            updatedTeam
          );
        }
      })
      .catch((err) => _systemError(err))
      .finally(() => _sendResponse(res));
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

  if (!_checkTeamIDIsValid(teamId) || !_checkPlayerIDIsValid(playerId)) {
    _sendResponse(res);
  } else {
    Team.findById(teamId)
      .select("players")
      .exec()
      .then((team) => {
        if (!team) {
          _notFoundError({ message: "Team ID not found" });
          return;
        } else if (team && !team.players.id(playerId)) {
          _notFoundError({ message: "Player ID not found" });
          return;
        } else {
          return playerUpdateCallback(req, team);
        }
      })
      .then((updatedTeam) => {
        if (updatedTeam) {
          _successGetAndAddAndUpdateAndDelete(
            process.env.STATUS_OK,
            updatedTeam
          );
        }
      })
      .catch((err) => _systemError(err))
      .finally(() => _sendResponse(res));
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

  if (!_checkTeamIDIsValid(teamId) || !_checkPlayerIDIsValid(playerId)) {
    _sendResponse(res);
  } else {
    Team.findById(teamId)
      .select("players")
      .exec()
      .then((team) => {
        if (!team) {
          _notFoundError({ message: "Team ID not found" });
          return;
        } else if (team && !team.players.id(playerId)) {
          _notFoundError({ message: "Player ID not found" });
          return;
        } else {
          return _deletePlayer(req, team);
        }
      })
      .then((updatedTeam) => {
        if (updatedTeam) {
          _successGetAndAddAndUpdateAndDelete(
            process.env.STATUS_NO_CONTENT,
            updatedTeam
          );
        }
      })
      .catch((err) => _systemError(err))
      .finally(() => _sendResponse(res));
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
