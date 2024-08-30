module.exports = (express, app) => {
    const controller = require("../controllers/post.controller.js");
    const router = express.Router();
  
    // Select all posts.
    router.get("/", controller.all);

    // Select all posts based on product id.
    router.get("/relevant/:product_id", controller.relevant);
  
    // Create a new post.
    router.post("/", controller.create);

    // Edits existing post.
    router.put("/:post_id", controller.update);

    // Deletes existing post.
    router.delete("/:post_id", controller.delete);
  
    // Add routes to server.
    app.use("/api/posts", router);
  };
  