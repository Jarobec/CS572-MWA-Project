const express = require("express");
const router = express.Router();
const playersController = require("../controllers/players.controller");

router
  .route("/teams/:teamId/players")
  .get(playersController.getAll)
  .post(playersController.addOne);
router
  .route("/teams/:teamId/players/:playerId")
  .get(playersController.getOne)
  .put(playersController.fullUpdateOne)
  .patch(playersController.partialUpdateOne)
  .delete(playersController.deleteOne);

module.exports = router;
