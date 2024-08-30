module.exports = (express, app) => {
    const controller = require("../controllers/user.controller.js");
    const router = express.Router();
  
    // Select all users.
    router.get("/", controller.all);
  
    // Select a single user with email.
    router.get("/select/:email", controller.email);

    // Select a single user with username.
    router.get("/:username", controller.username);
  
    // Select one user from the database if username and password are a match.
    router.get("/verify/login", controller.login);
  
    // Create a new user.
    router.post("/", controller.create);

    // Edits existing user.
    router.put("/", controller.update);

    // Deletes existing user.
    router.delete("/", controller.delete);
  
    // Add routes to server.
    app.use("/api/users", router);
  };
  