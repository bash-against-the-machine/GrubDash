const router = require("express").Router();
const controller = require("./orders.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

// Routes for /orders
router
  .route("/")
  .get(controller.list)
  .post(
    controller.bodyDataHas("deliverTo"),
    controller.bodyDataHas("mobileNumber"),
    controller.dishesIsValidArray,
    controller.create
  )
  .all(methodNotAllowed);

// Routes for /orders/:orderId
router
  .route("/:orderId")
  .get(controller.orderExists, controller.read)
  .put(
    controller.orderExists,
    controller.bodyDataHas("deliverTo"),
    controller.bodyDataHas("mobileNumber"),
    controller.dishesIsValidArray,
    controller.statusIsValid,
    controller.idMatchesRoute,
    controller.update
  )
  .delete(controller.orderExists, controller.destroy)
  .all(methodNotAllowed);

module.exports = router;
