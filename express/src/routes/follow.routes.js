module.exports = (express, app) => {
  const controller = require("../controllers/follow.controller.js");
  const router = express.Router();

  // Select all following.
  router.get("/get", controller.following);

  // Add to following (Create follow relationship)
  router.post("/", controller.create);

  // Remove from following (Delete follow relationship)
  router.delete("/", controller.delete);

  // Add routes to server.
  app.use("/api/follow", router);
};

