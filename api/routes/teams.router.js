const express = require("express");
const router = express.Router();
const teamsController = require("../controllers/teams.controller");

router.route("/teams").get(teamsController.getAll).post(teamsController.addOne);
router
  .route("/teams/:teamId")
  .get(teamsController.getOne)
  .put(teamsController.fullUpdateOne)
  .patch(teamsController.partialUpdateOne)
  .delete(teamsController.deleteOne);

module.exports = router;
