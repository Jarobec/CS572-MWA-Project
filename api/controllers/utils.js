const mongoose = require("mongoose");

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

const _checkObjectID = function (id, errMessage) {
  if (!mongoose.isValidObjectId(id)) {
    _validationError({ message: errMessage });
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

const _successGetAndAddAndUpdateAndDelete = function (status, data) {
  response.status = parseInt(status, process.env.INTEGER_CONVERSION_BASE);
  response.message = data;
};

const _successCountDocuments = function (countDocuments) {
  const data = response.message;
  const totalPage = Math.ceil(countDocuments / count);
  response.status = parseInt(
    process.env.STATUS_OK,
    process.env.INTEGER_CONVERSION_BASE
  );
  response.message = { data: data, totalPage: totalPage };
};

module.exports = {
  checkCountAndOffset: _checkCountAndOffset,
  checkObjectID: _checkObjectID,
  sendResponse: _sendResponse,
  systemError: _systemError,
  notFoundError: _notFoundError,
  successGetAndAddAndUpdateAndDelete: _successGetAndAddAndUpdateAndDelete,
  successCountDocuments: _successCountDocuments,
  offset,
  count,
};
