const db = require("../database");

// Select all posts from the database.
exports.all = async (req, res) => {
  const posts = await db.post.findAll();

  // Can use eager loading to join tables if needed, for example:
  // const posts = await db.post.findAll({ include: db.user });

  // Learn more about eager loading here: https://sequelize.org/master/manual/eager-loading.html

  res.json(posts);
};

// Selects all posts related to product id
exports.relevant = async (req, res) => {
  // console.log("req body for relevant posts: ", req.body);
  // console.log("product_id for relevant posts: ", product_id);
  const posts = await db.post.findAll({ where: {product_id: req.params.product_id} });

  res.json(posts);
}

// Create a post in the database.
exports.create = async (req, res) => {
  // console.log("create post req.body: ", req.body);
  // console.log("req.body.rating: ", req.body.rating);
  const post = await db.post.create({
    text: req.body.text,
    rating: req.body.rating,
    username: req.body.username,
    product_id: req.body.product_id
  });

  res.json(post);
};

// Update existing post
exports.update = async (req, res) => {
  const post = await db.post.findByPk(req.body.post_id);
  
  // username and product_id is not included since it shouldn't be updated
  post.text = req.body.text;
  post.rating = req.body.rating;

  await post.save();

  res.json(post);
};

// Delete existing post based on post_id
exports.delete = async (req, res) => {
  const { post_id } = req.params;
  const row = await db.post.findOne({ where: { post_id } });
  
  if (row) {
    await row.destroy();
    res.status(200).send({ message: "Review was deleted successfully!" });
  } else {
    res.status(404).send({ message: `Cannot find review with post id=${post_id}.` });
  }
};