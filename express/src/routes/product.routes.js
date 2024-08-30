module.exports = (express, app) => {
  const controller = require("../controllers/product.controller.js");
  const router = express.Router();

  // Select all products.
  router.get("/", controller.all);

  // Select product based on product_id
  router.get("/:product_id", controller.one);

  // Select all special products.
  router.get("/select/:is_special", controller.special);

  // Add routes to server.
  app.use("/api/products", router);
};
