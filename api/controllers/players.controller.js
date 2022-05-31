const mongoose = require("mongoose");
const Team = mongoose.model(process.env.DB_TEAM_MODEL);

let count;
let offset;
const maxCount = parseInt(
  process.env.DEFAULT_FIND_COUNT_MAX,
  process.env.INTEGER_CONVERSION_BASE
);

const response = {
  status: 200,
  message: [],
};

const _checkCountAndOffset = function (req) {
  count = parseInt(
    process.env.DEFAULT_FIND_COUNT,
    process.env.INTEGER_CONVERSION_BASE
  );
  offset = parseInt(
    process.env.DEFAULT_FIND_OFFSET,
    process.env.INTEGER_CONVERSION_BASE
  );

  if (req.query && req.query.count) {
    count = parseInt(req.query.count, process.env.INTEGER_CONVERSION_BASE);
  }
  if (req.query && req.query.offset) {
    offset = parseInt(req.query.offset, process.env.INTEGER_CONVERSION_BASE);
  }
  if (isNaN(count) || isNaN(offset)) {
    response.status = 400;
    response.message = {
      message: "QueryString: Offset and Count should be numbers",
    };
  } else {
    if (count > maxCount) {
      response.status = 400;
      response.message = { message: "Cannot exceed count of " + maxCount };
    } else {
      response.status = 200;
      response.message = [];
    }
  }
};

const _checkObjectID = function (id) {
  if (!mongoose.isValidObjectId(id)) {
    response.status = 400;
    response.message = { message: "Invalid Player ID" };
  } else {
    response.status = 200;
    response.message = [];
  }
};

const _sendResponse = function (res) {
  res.status(response.status).json(response.message);
};

const getAll = function (req, res) {
  _checkCountAndOffset(req);

  if (response.status !== 200) {
    _sendResponse(res);
  } else {
    const teamId = req.params.teamId;

    Team.findById(teamId)
      .select("players")
      .exec(function (err, team) {
        if (err) {
          console.log("Error finding Team");
          response.status = 500;
          response.message = err;
        } else if (!team) {
          console.log("Team ID not found", teamId);
          response.status = 404;
          response.message = { message: "Team ID not found" };
        } else if (team && team.players.length === 0) {
          console.log("Players not found");
          response.status = 404;
          response.message = { message: "Players not found" };
        } else {
          response.message = team.players;
        }

        _sendResponse(res);
      });
  }
};

const getOne = function (req, res) {
  const teamId = req.params.teamId;
  const playerId = req.params.playerId;
  _checkObjectID(playerId);

  if (response.status !== 200) {
    _sendResponse(res);
  } else {
    Team.findById(teamId)
      .select("players")
      .exec(function (err, team) {
        if (err) {
          console.log("Error finding team");
          response.status = 500;
          response.message = err;
        } else if (!team) {
          console.log("Team ID not found", teamId);
          response.status = 404;
          response.message = { message: "Team ID not found" };
        } else if (team && !team.players.id(playerId)) {
          console.log("Player ID not found", playerId);
          response.status = 404;
          response.message = { message: "Player ID not found" };
        } else {
          response.message = team.players.id(playerId);
        }

        _sendResponse(res);
      });
  }
};

const addOne = function (req, res) {
  const teamId = req.params.teamId;

  Team.findById(teamId)
    .select("players")
    .exec(function (err, team) {
      if (err) {
        console.log("Error finding team");
        response.status = 500;
        response.message = err;
      } else if (!team) {
        console.log("Team ID not found", teamId);
        response.status = 404;
        response.message = { message: "Team ID not found" };
      } else {
        response.status = 200;
        response.message = team;
      }

      if (response.status !== 200) {
        _sendResponse(res);
      } else {
        _addPlayer(req, res, team);
      }
    });
};

const _addPlayer = function (req, res, team) {
  const newPlayer = { name: req.body.name, age: req.body.age };
  team.players.push(newPlayer);

  team.save(function (err, updatedTeam) {
    if (err) {
      response.status = 500;
      response.message = err;
    } else {
      response.status = 201;
      response.message = updatedTeam.players;
    }

    _sendResponse(res);
  });
};

const _updateOne = function (req, res, playerUpdateCallback) {
  const teamId = req.params.teamId;
  const playerId = req.params.playerId;
  _checkObjectID(playerId);

  if (response.status !== 200) {
    _sendResponse(res);
  } else {
    Team.findById(teamId)
      .select("players")
      .exec(function (err, team) {
        if (err) {
          console.log("Error finding team");
          response.status = 500;
          response.message = err;
        } else if (!team) {
          console.log("Team ID not found");
          response.status = 404;
          response.message = { message: "Team ID not found" };
        } else if (team && !team.players.id(req.params.playerId)) {
          console.log("Player ID not found", playerId);
          response.status = 404;
          response.message = { message: "Player ID not found" };
        } else {
          response.status = 204;
          response.message = team;
        }

        if (response.status !== 204) {
          _sendResponse(res);
        } else {
          playerUpdateCallback(req, res, team);
        }
      });
  }
};

const _fullPlayerUpdateOne = function (req, res, team) {
  let player = team.players.id(req.params.playerId);
  player.name = req.body.name;
  player.age = req.body.age;

  team.save(function (err, updatedTeam) {
    if (err) {
      response.status = 500;
      response.message = err;
    } else {
      response.status = 204;
      response.message = updatedTeam.players;
    }

    _sendResponse(res);
  });
};

const _partialPlayerUpdateOne = function (req, res, team) {
  let player = team.players.id(req.params.playerId);

  if (req.body.name) {
    player.name = req.body.name;
  }
  if (req.body.age) {
    player.age = req.body.age;
  }

  team.save(function (err, updatedTeam) {
    if (err) {
      response.status = 500;
      response.message = err;
    } else {
      response.status = 204;
      response.message = updatedTeam.players;
    }

    _sendResponse(res);
  });
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
  _checkObjectID(playerId);

  if (response.status !== 200) {
    _sendResponse(res);
  } else {
    Team.findById(teamId)
      .select("players")
      .exec(function (err, team) {
        if (err) {
          console.log("Error finding team");
          response.status = 500;
          response.message = err;
        } else if (!team) {
          console.log("Team ID not found", teamId);
          response.status = 404;
          response.message = { message: "Team ID not found" };
        } else if (team && !team.players.id(req.params.playerId)) {
          console.log("Player ID not found", playerId);
          response.status = 404;
          response.message = { message: "Player ID not found" };
        } else {
          response.status = 200;
          response.message = team;
        }

        if (response.status !== 200) {
          _sendResponse(res);
        } else {
          _deletePlayer(req, res, team);
        }
      });
  }
};

const _deletePlayer = function (req, res, team) {
  team.players.id(req.params.playerId).remove();

  team.save(function (err, updatedTeam) {
    if (err) {
      response.status = 500;
      response.message = err;
    } else {
      response.status = 204;
      response.message = updatedTeam.players;
    }

    _sendResponse(res);
  });
};

module.exports = {
  getAll,
  getOne,
  addOne,
  fullUpdateOne,
  partialUpdateOne,
  deleteOne,
};
