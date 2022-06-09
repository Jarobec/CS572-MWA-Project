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

const _checkObjectID = function (id) {
  if (!mongoose.isValidObjectId(id)) {
    _validationError({ message: "Invalid Team ID" });
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

const _successGetAndAddAndUpdateAndDelete = function (status, team) {
  response.status = parseInt(status, process.env.INTEGER_CONVERSION_BASE);
  response.message = team;
};

const _successCountDocuments = function (countDocuments) {
  const teams = response.message;
  const totalPage = Math.ceil(countDocuments / count);
  response.status = parseInt(
    process.env.STATUS_OK,
    process.env.INTEGER_CONVERSION_BASE
  );
  response.message = { teams: teams, totalPage: totalPage };
};

const getAll = function (req, res) {
  if (!_checkCountAndOffset(req)) {
    _sendResponse(res);
  } else {
    let query = {};

    if (req.query && req.query.search) {
      query = {
        name: { $regex: req.query.search, $options: "i" },
      };
    }

    Team.find(query)
      .skip(offset)
      .limit(count)
      .exec()
      .then((teams) =>
        _successGetAndAddAndUpdateAndDelete(process.env.STATUS_OK, teams)
      )
      .then(() => _getCountDocuments(query))
      .then((countDocuments) => _successCountDocuments(countDocuments))
      .catch((err) => _systemError(err))
      .finally(() => _sendResponse(res));
  }
};

const _getCountDocuments = function (query) {
  return Team.countDocuments(query);
};

const getOne = function (req, res) {
  const teamId = req.params.teamId;

  if (!_checkObjectID(teamId)) {
    _sendResponse(res);
  } else {
    Team.findById(teamId)
      .select({
        players: 0,
      })
      .exec()
      .then((team) => {
        if (!team) {
          _notFoundError({ message: "Team ID not found" });
        } else {
          _successGetAndAddAndUpdateAndDelete(process.env.STATUS_OK, team);
        }
      })
      .catch((err) => _systemError(err))
      .finally(() => _sendResponse(res));
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
      _successGetAndAddAndUpdateAndDelete(process.env.STATUS_CREATED, team)
    )
    .catch((err) => _systemError(err))
    .finally(() => _sendResponse(res));
};

const _updateOne = function (req, res, updateTeamCallBack) {
  const teamId = req.params.teamId;

  if (!_checkObjectID(teamId)) {
    _sendResponse(res);
  } else {
    Team.findById(teamId)
      .exec()
      .then((team) => {
        if (!team) {
          _notFoundError({ message: "Team ID not found" });
          return;
        } else {
          return updateTeamCallBack(req, team);
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

  if (!_checkObjectID(teamId)) {
    _sendResponse(res);
  } else {
    Team.findByIdAndDelete(teamId)
      .exec()
      .then((team) => {
        if (!team) {
          _notFoundError({ message: "Team ID not found" });
        } else {
          _successGetAndAddAndUpdateAndDelete(
            process.env.STATUS_NO_CONTENT,
            team
          );
        }
      })
      .catch((err) => _systemError(err))
      .finally(() => _sendResponse(res));
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
