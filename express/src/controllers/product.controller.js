const db = require("../database");

// Select all products from the database.
exports.all = async (req, res) => {
  const products = await db.product.findAll();

  res.json(products);
};

// Select one product based on product_id
exports.one = async (req, res) => {
  const product = await db.product.findOne({ where: { product_id: req.params.product_id }});

  res.json(product);
};

// Select all products that have a "Yes" Special status from the database.
exports.special = async (req, res) => {
  const products = await db.product.findAll({
    where: {
      is_special: "Yes",
    },
  });
  // SELECT * FROM product WHERE is_special: "Yes"
  res.json(products);
};

// Create a product in the database.
exports.create = async (req, res) => {
  
  const product = await db.product.create({
    product_id: req.body.productid,
    product_name: req.body.productname,
    description: req.body.description,
    price: req.body.price,
    image_url: req.body.imageurl,
    is_special: req.body.isspecial
  });

  res.json(product);
};