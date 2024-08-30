const db = require("../database");

// Create an order in the database.
// You'd run this after going to Products and selecting how much you want of a product
exports.create = async (req, res) => {
  
  const order = await db.order.create({
    product_id: req.body.this_product_id,
    quantity: req.body.this_quantity,
    email_id: req.body.this_email
  });

  res.json(order);
};

// Delete all orders searching by email
exports.delete = async (req, res) => {
  const order = await db.order.destroy({ 
    where: { 
      email_id: req.query.userEmail
     }, 
  });

  res.json(order);
}; 

// Delete one order
exports.deleteone = async (req, res) => {
  const order = await db.order.destroy({ 
    where: { 
      order_id: req.body.order_id
     }, 
  });

  res.json(order);
}; 

// Select all orders from the database searching by email.
exports.one = async (req, res) => {
  const order = await db.order.findAll({ 
    include: [{
      model: db.product,
      required: true,
    }],

    where: { 
      email_id: req.query.userEmail
     }, 
  });

  res.json(order);
}; 

// Update existing order
exports.edit = async (req, res) => {
  const order = await db.order.findByPk(req.body.this_order_id);
  
  // only changing quantity
  order.quantity = req.body.new_qty;

  await order.save();

  res.json(order);
};