module.exports = (express, app) => {
  const controller = require("../controllers/order.controller.js");
  const router = express.Router();

  // Create a new order.
  router.post("/create", controller.create);

  // Select all orders, searching by email.
  router.get("/search", controller.one);

  // Delete all orders, searching by email.
  router.delete("/delete", controller.delete);

  // Delete one order
  router.delete("/deleteone", controller.deleteone);

  // Edit one order
  router.put("/edit", controller.edit);

  // Add routes to server.
  app.use("/api/orders", router);
};
