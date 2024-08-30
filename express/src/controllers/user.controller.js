const db = require("../database");
const argon2 = require("argon2");

// Select all users from the database.
exports.all = async (req, res) => {
  const users = await db.user.findAll();

  res.json(users);
};

// Select one user from the database based on email.
exports.email = async (req, res) => {
  console.log("Running fine email from controller method");
  const user = await db.user.findByPk(req.params.email);

  res.json(user);
};

// Select one user from the database based on username.
exports.username = async (req, res) => {
  const user = await db.user.findOne({ where: { username: req.params.username } });

  res.json(user);
};

// Select one user from the database if email and password are a match.
exports.login = async (req, res) => {
  const user = await db.user.findByPk(req.query.email);

  if(user === null || await argon2.verify(user.password_hash, req.query.password) === false)
    // Login failed.
    res.json(null);
  else if(user.blocked === "Yes")
    {
      // The user is currently blocked, so stop them from logging in
      res.json("blocked");
    }
  else
    res.json(user);
};

// Create a user in the database.
exports.create = async (req, res) => {
  const hash = await argon2.hash(req.body.password, { type: argon2.argon2id });

  const user = await db.user.create({
    email: req.body.email,
    username: req.body.username,
    password_hash: hash,
    first_name: req.body.firstname,
    last_name: req.body.lastname,
    date_created: req.body.date_created,
    blocked: 'No'
  });

  res.json(user);
};

// Update existing user
exports.update = async (req, res) => {
  const user = await db.user.findByPk(req.body.email);
  const hash = await argon2.hash(req.body.password, { type: argon2.argon2id });
  
  // email, blocked and date is not included since it shouldn't be updated
  user.username = req.body.username;
  user.first_name = req.body.firstname;
  user.last_name = req.body.lastname;
  user.password_hash = hash;

  await user.save();

  res.json(user);
};

// Delete existing user based on id (email)
exports.delete = async (req, res) => {
  const row = await db.user.findOne({ where: { email: req.body.email }, });
  
  if (row) {
    await row.destroy();
    res.status(200).send({ message: "User was deleted successfully!" });
  } else {
    res.status(404).send({ message: `Cannot find user with email=${email}.` });
  }

};
