const { Sequelize, DataTypes } = require("sequelize");
const config = require("./config.js");
const { FORCE } = require("sequelize/lib/index-hints");

const db = {
  Op: Sequelize.Op
};

// Create Sequelize.
db.sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  host: config.HOST,
  dialect: config.DIALECT
});

// Include models.
db.user = require("./models/user.js")(db.sequelize, DataTypes);
db.product = require("./models/product.js")(db.sequelize, DataTypes);
db.post = require("./models/post.js")(db.sequelize, DataTypes);
db.order = require("./models/order.js")(db.sequelize, DataTypes);
db.follow = require("./models/follow.js")(db.sequelize, DataTypes);

// Relate post and user.
db.post.belongsTo(db.user, {through: db.post, as: "post", foreignKey: "username"});

// Relate post and product.
db.post.belongsTo(db.product, {through: db.post, as: "posts", foreignKey: "product_id"}); // a post/review belongs to one product

// Relate user to orders 
db.user.hasMany(db.order, { foreignKey: { name: "email_id", allowNull: false }})

// Relate order to product
// db.product.hasMany(db.order, { foreignKey: { name: "product_id", allowNull: false } })
db.order.belongsTo(db.product, { foreignKey: { name: "product_id", allowNull: false } })

// Relate user and follower
db.user.hasMany(db.follow, {as: "following", foreignKey: "follower_username"}); // a user can follow many other users
db.user.hasMany(db.follow, {as: "follower", foreignKey: "following_username"}); // a user can be followed by many other users

// Learn more about associations here: https://sequelize.org/master/manual/assocs.html

// Include a sync option with seed data logic included.
db.sync = async () => {
  // Sync schema.
  await db.sequelize.sync();

  // Can sync with force if the schema has become out of date - note that syncing with force is a destructive operation.
  // await db.sequelize.sync({ force: true });
  
  await seedData();
};

async function seedData() {
  const count = await db.user.count();

  // Only seed data if necessary.
  if(count > 0)
    return;

  // User data seeding

  const argon2 = require("argon2");

  let hash = await argon2.hash("Test!123", { type: argon2.argon2id });
  await db.user.create({ email: "test@email.com", username: "testAccount", password_hash: hash, first_name: "Test", last_name : "Account", date_created: '2024-05-25', blocked: 'No' });

  hash = await argon2.hash("Swag!123", { type: argon2.argon2id });
  await db.user.create({ email: "swagmoney@swagity.com", username: "swagmoney", password_hash: hash, first_name: "Swag", last_name : "Money", date_created: '2024-05-25', blocked: 'No' });
  
  // Product data seeding
  await db.product.create({ 
    product_name: "Banana", 
    description: "A conveniently easy-to-pack snack, our bananas are the freshest around! Eat them on the go, or as a flavourful addition to your smoothie, or even slice thinly into your morning bowl of oats. Bright yellow and full of nutrients, these bananas are a great source of fiber, potassium, vitamin B6, vitamin C, and various antioxidants. Pick up some of our delicious bananas today!", 
    price: 0.80, 
    image_url : "https://images.unsplash.com/photo-1587334206596-c0f9f7dccbe6?q=80&w=1781&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", 
    is_special : "Yes" 
  });

  await db.product.create({ 
    product_name: "Kiwi", 
    description: "A succulent green fruit known for it's fuzzy brown skin, our Kiwis are hand-picked to be the freshest out there. Tangy and sweet, these green delights are packed with an exceptional amount of vitamin C and other fantastic antioxidants. Enjoy a burst of tropical flavour in your smoothies and fruit salads, or even eat them their own!", 
    price: 1.50, 
    image_url : "https://images.unsplash.com/photo-1587334106914-b90ecebe9845?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", 
    is_special : "Yes" 
  });
  
  await db.product.create({ 
    product_name: "Tomato", 
    description: "Our Victorian-grown tomatoes are packed with flavour and deliciously sweet! Picked at the peak of their ripeness, we can guarantee that you'll be treated to the freshest tomatoes possible here at SOIL. So stop by and treat your tastebuds by picking up some of our tomatoes!", 
    price: 0.70, 
    image_url : "https://images.unsplash.com/photo-1587486938113-d6d38d424efa?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", 
    is_special : "Yes" 
  });

  await db.product.create({ 
    product_name: "Chili Pepper", 
    description: "Looking to add some spice to your recipes? Packed with potassium, vitamin A, vitamin C, and more: our chili peppers are a vibrant choice. Delivered fresh to the store, you'll be ready to elevate your favourite dishes with this wonderfully spicy twist.", 
    price: 1.05, 
    image_url : "https://images.unsplash.com/photo-1583119022894-919a68a3d0e3?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", 
    is_special : "Yes" 
  });

  await db.product.create({ 
    product_name: "Squash", 
    description: "Known for their smooth texture, our freshly harvested squash will let you experience buttery richness you've never known before. Roasted, grilled, or used in soup, our squash are promised to enhance any and all meals it touches. Rich in minerals and antioxidants, this versatile vegetable will be a gratifying addition to any dish.", 
    price: 0.90, 
    image_url : "https://images.unsplash.com/photo-1583118208563-1654aa5caa31?q=80&w=2680&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", 
    is_special : "No" 
  });

  await db.product.create({ 
    product_name: "Broccoli", 
    description: "Steamed, cooked, or stir-fried, there are a multitude of ways to prepare and enjoy these green goodies! Teeming with vitamins, antioxidants, and fiber, each bite offers a vibrant and unforgettable taste. Nutritious and flavourful, these fresh and crisp broccoli will keep you wanting more!", 
    price: 1.30, 
    image_url : "https://images.unsplash.com/photo-1615485021022-dec8994adeba?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDF8fHxlbnwwfHx8fHw%3D", 
    is_special : "No" 
  });

  await db.product.create({ 
    product_name: "Cucumber", 
    description: "Refreshingly crisp, yet subtly sweet, our cucumbers are the best for adding slight hydration to your dry meals. Eat them by bites or by the slice, these cucumbers are packed with antioxidants and are nutrient-rich. Our cucumbers offer a burst of satisfaction from every bite, so what are you waiting for? Grab these hydrating treats today!", 
    price: 2.30, 
    image_url : "https://images.unsplash.com/photo-1587411768638-ec71f8e33b78?q=80&w=2680&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", 
    is_special : "No" 
  });

  await db.product.create({ 
    product_name: "Onion", 
    description: "An essential ingredient for cooking, these crisp and crunchy onions are the way to go! With the extra texture and flavour added to your dishes, you'll regret missing out on them. Rich in vitamin C, folate, and potassium, these flavourful bulbs are a kitchen staple waiting for you to pick up!", 
    price: 0.60, 
    image_url : "https://images.unsplash.com/photo-1587049633312-d628ae50a8ae?q=80&w=2680&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", 
    is_special : "No" 
  });

  await db.product.create({
      product_name: "Garlic",
      description: "A great addition to all kinds of savoury dishes, garlic brings a distinctive and unique taste to any plate. Here at SOIL, we've selected our garlic bulbs for the best quality possible, ensuring that you'll get the best possible versions of this versatile agent. No matter what you're cooking up in the kitchen, our garlic is sure to elevate your recipes with the added depth it brings.",
      price: "1.75",
      image_url: "https://images.unsplash.com/photo-1587049693270-c7560da11218?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      is_special: "No"
  });

  await db.product.create({
    product_name: "Green Pea",
    description: "Indulge in the delicate sweetness that our freshly harvested green peas have to offer. As a versatile ingredient for both nutritious meals and light snacks, these small peas are brimming with protein and fiber. Small, yet filling, these delights are great for a quick snack, so pick them up today!",
    price: "0.80",
    image_url: "https://images.unsplash.com/photo-1587049585169-c526077ca3cc?q=80&w=2680&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    is_special: "No"
  });

};

module.exports = db;
