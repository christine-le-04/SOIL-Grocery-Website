const db = require("../database");

// Selects all users the current user (based on email) is following
exports.following = async (req, res) => {
  const follower_username = req.query.follower_username; // the current user
  const following = await db.follow.findAll({ where: {follower_username: follower_username} });
  const followingUsernames = following.map(x => x.following_username); // solely gets the usernames of the previous line

  res.json(followingUsernames);
}

// Follow a user (add to following)
exports.create = async (req, res) => {
  console.log("req body for following a user: ", req.body.data);
  const { following_username, follower_username } = req.body.data;
  const follow = await db.follow.create({ following_username, follower_username });
  
  res.json(follow);
};

// Unfollow a user (delete from following)
exports.delete = async (req, res) => {
  const { following_username, follower_username } = req.body;

  // ensures already following
  const following = await db.follow.findOne({ where: { following_username, follower_username } });

  if (following) {
    await following.destroy();
    res.status(200).json({ message: "Unfollowed!" });
  } else {
    return res.status(404).json({ message: "Not already following." });
  }
};