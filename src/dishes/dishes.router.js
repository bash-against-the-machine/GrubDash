const router = require("express").Router();
const controller = require("./dishes.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

// Routes for /dishes
router
  .route("/")
  .get(controller.list)
  .post(
    controller.bodyDataHas("name"),
    controller.bodyDataHas("description"),
    controller.bodyDataHas("image_url"),
    controller.bodyDataHas("price"),
    controller.priceIsValidNumber,
    controller.create
  )
  .all(methodNotAllowed);

// Routes for /dishes/:dishId
router
  .route("/:dishId")
  .get(controller.dishExists, controller.read)
  .put(
    controller.dishExists,
    controller.bodyDataHas("name"),
    controller.bodyDataHas("description"),
    controller.bodyDataHas("image_url"),
    controller.bodyDataHas("price"),
    controller.priceIsValidNumber,
    controller.idMatchesRoute,
    controller.update
  )
  .all(methodNotAllowed);

module.exports = router;
