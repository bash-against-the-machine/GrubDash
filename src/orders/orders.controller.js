const path = require("path");

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// Middleware: checks a named field is present and non-empty
function bodyDataHas(propertyName) {
  return function (req, res, next) {
    const { data = {} } = req.body;
    if (data[propertyName]) {
      return next();
    }
    next({ status: 400, message: `Order must include a ${propertyName}` });
  };
}

// Middleware: validates dishes is a non-empty array and each dish has a valid quantity
function dishesIsValidArray(req, res, next) {
  const { data: { dishes } = {} } = req.body;
  if (!dishes || !Array.isArray(dishes) || dishes.length === 0) {
    return next({ status: 400, message: "Order must include at least one dish" });
  }
  const invalidIndex = dishes.findIndex(
    (dish) => !dish.quantity || !Number.isInteger(dish.quantity) || dish.quantity <= 0
  );
  if (invalidIndex !== -1) {
    return next({
      status: 400,
      message: `Dish ${invalidIndex} must have a quantity that is an integer greater than 0`,
    });
  }
  next();
}

// Middleware: validates status is present and one of the four allowed values
function statusIsValid(req, res, next) {
  const { data: { status } = {} } = req.body;
  const validStatuses = ["pending", "preparing", "out-for-delivery", "delivered"];
  if (!status || !validStatuses.includes(status)) {
    return next({
      status: 400,
      message: "Order must have a status of pending, preparing, out-for-delivery, delivered",
    });
  }
  next();
}

// Middleware: looks up order by :orderId and attaches it to res.locals.order
function orderExists(req, res, next) {
  const { orderId } = req.params;
  const foundOrder = orders.find((order) => order.id === orderId);
  if (foundOrder) {
    res.locals.order = foundOrder;
    return next();
  }
  next({ status: 404, message: `Order does not exist: ${orderId}` });
}

// Middleware: rejects updates where data.id is present but does not match :orderId
function idMatchesRoute(req, res, next) {
  const { orderId } = req.params;
  const { data: { id } = {} } = req.body;
  if (id && id !== orderId) {
    return next({
      status: 400,
      message: `Order id does not match route id. Order: ${id}, Route: ${orderId}`,
    });
  }
  next();
}

function list(req, res) {
  res.json({ data: orders });
}

function create(req, res) {
  const { data: { deliverTo, mobileNumber, status, dishes } = {} } = req.body;
  const newOrder = { id: nextId(), deliverTo, mobileNumber, status, dishes };
  orders.push(newOrder);
  res.status(201).json({ data: newOrder });
}

function read(req, res) {
  res.json({ data: res.locals.order });
}

// Overwrites all fields except id, which is always taken from the stored order
function update(req, res) {
  const order = res.locals.order;
  const { data: { deliverTo, mobileNumber, status, dishes } = {} } = req.body;
  order.deliverTo = deliverTo;
  order.mobileNumber = mobileNumber;
  order.status = status;
  order.dishes = dishes;
  res.json({ data: order });
}

// Only pending orders may be deleted
function destroy(req, res, next) {
  const order = res.locals.order;
  if (order.status !== "pending") {
    return next({
      status: 400,
      message: "An order cannot be deleted unless it is pending",
    });
  }
  const index = orders.indexOf(order);
  orders.splice(index, 1);
  res.sendStatus(204);
}

module.exports = {
  list,
  create,
  read,
  update,
  destroy,
  orderExists,
  bodyDataHas,
  dishesIsValidArray,
  statusIsValid,
  idMatchesRoute,
};
