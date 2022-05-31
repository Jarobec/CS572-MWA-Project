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
    response.message = { message: "Invalid Team ID" };
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
    Team.find()
      .skip(offset)
      .limit(count)
      .exec(function (err, teams) {
        if (err) {
          console.log("Error finding all teams");
          response.status = 500;
          response.message = err;
        } else {
          response.status = 200;
          response.message = teams;
        }
        _sendResponse(res);
      });
  }
};

const getOne = function (req, res) {
  const teamId = req.params.teamId;
  _checkObjectID(teamId);

  if (response.status !== 200) {
    _sendResponse(res);
  } else {
    Team.findById(teamId).exec(function (err, team) {
      if (err) {
        console.log("Error finding team");
        response.status = 500;
        response.message = err;
      } else if (!team) {
        console.log("Team ID not found");
        response.status = 404;
        response.message = { message: "Team ID not found" };
      } else {
        response.status = 200;
        response.message = team;
      }

      _sendResponse(res);
    });
  }
};

const addOne = function (req, res) {
  const newTeam = {
    name: req.body.name,
    country: req.body.country,
    numOfPartInOlympic: req.body.numOfPartInOlympic,
    players: [],
  };

  Team.create(newTeam, function (err, team) {
    if (err) {
      console.log("Error creating team");
      response.status = 500;
      response.message = err;
    } else {
      response.status = 201;
      response.message = team;
    }

    _sendResponse(res);
  });
};

const _updateOne = function (req, res, updateTeamCallBack) {
  const teamId = req.params.teamId;
  _checkObjectID(teamId);

  if (response.status !== 200) {
    _sendResponse(res);
  } else {
    Team.findById(teamId).exec(function (err, team) {
      if (err) {
        console.log("Error finding team");
        response.status = 500;
        response.message = err;
      } else if (!team) {
        console.log("Team ID not found", teamId);
        response.status = 404;
        response.message = { message: "Team ID not found" };
      } else {
        response.status = 204;
        response.message = team;
      }

      if (response.status !== 204) {
        _sendResponse(res);
      } else {
        updateTeamCallBack(req, res, team);
      }
    });
  }
};

const _teamFullUpdateOne = function (req, res, team) {
  team.name = req.body.name;
  team.country = req.body.country;
  team.numOfPartInOlympic = req.body.numOfPartInOlympic;

  team.save(function (err, updatedTeam) {
    if (err) {
      response.status = 500;
      response.message = err;
    } else {
      response.status = 204;
      response.message = updatedTeam;
    }

    _sendResponse(res);
  });
};

const _teamPartialUpdateOne = function (req, res, team) {
  if (req.body.name) {
    team.name = req.body.name;
  }
  if (req.body.country) {
    team.country = req.body.country;
  }
  if (req.body.numOfPartInOlympic) {
    team.numOfPartInOlympic = req.body.numOfPartInOlympic;
  }

  team.save(function (err, updatedTeam) {
    if (err) {
      response.status = 500;
      response.message = err;
    } else {
      response.status = 204;
      response.message = updatedTeam;
    }
    _sendResponse(res);
  });
};

const fullUpdateOne = function (req, res) {
  _updateOne(req, res, _teamFullUpdateOne);
};

const partialUpdateOne = function (req, res) {
  _updateOne(req, res, _teamPartialUpdateOne);
};

const deleteOne = function (req, res) {
  const teamId = req.params.teamId;
  _checkObjectID(teamId);

  if (response.status !== 200) {
    _sendResponse(res);
  } else {
    Team.findByIdAndDelete(teamId).exec(function (err, deletedTeam) {
      if (err) {
        console.log("Error deleting team");
        response.status = 500;
        response.message = err;
      } else if (!deletedTeam) {
        console.log("Team ID not found", teamId);
        response.status = 404;
        response.message = { message: "Team ID not found" };
      } else {
        response.status = 204;
        response.message = deletedTeam;
      }

      _sendResponse(res);
    });
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
