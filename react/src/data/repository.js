import axios from "axios";

// --- Constants ----------------------------------------------------------------------------------
const API_HOST = "http://localhost:4000";
const USER_KEY = "user";

// --- User ---------------------------------------------------------------------------------------
async function verifyUser(email, password) {
  const response = await axios.get(API_HOST + "/api/users/verify/login", { params: { email, password } });
  const user = response.data;
  
  // NOTE: In this example the login is also persistent as it is stored in local storage.
  if(user !== null)
    setUser(user);

  return user;
}

async function findUser(email) {
  const response = await axios.get(API_HOST + `/api/users/select/${email}`);

  return response.data;
}

async function findUsername(username) {
  const response = await axios.get(API_HOST + `/api/users/${username}`);
  
  return response.data;
}

async function createUser(user) {
  const response = await axios.post(API_HOST + "/api/users", user);

  return response.data;
}

async function updateUser(user) {
  const response = await axios.put(API_HOST + "/api/users/", user);

  return response.data;
}

async function deleteUser(user) {
  const response = await axios.delete(API_HOST + "/api/users/", { data: user });

  return response.data;
}

// --- Post ---------------------------------------------------------------------------------------
async function getPosts() {
  const response = await axios.get(API_HOST + "/api/posts");

  return response.data;
}

async function createPost(text, rating, username, product_id) {
  const response = await axios.post(API_HOST + "/api/posts/", { text: text, rating: rating, username: username, product_id: product_id });

  return response.data;
}

async function getRelevantPosts(product_id) {
  const response = await axios.get(API_HOST + `/api/posts/relevant/${product_id}`);

  return response.data;
}

async function updatePost(post) {
  const response = await axios.put(API_HOST + `/api/posts/${post.post_id}`, post);

  return response.data;
}

async function deletePost(post_id) {
  const response = await axios.delete(API_HOST + `/api/posts/${post_id}`);

  return response.data;
}

// --- Product ---------------------------------------------------------------------------------------
async function getProducts() {
  const response = await axios.get(API_HOST + "/api/products");

  return response.data;
}

async function getCurrProduct(product_id) {
  const response = await axios.get(API_HOST + `/api/products/${product_id}`, { product_id: product_id });

  return response.data;
}

//router.get("/select/:isspecial", controller.special);
async function getSpecials() {
  const response = await axios.get(API_HOST + "/api/products/select/:is_special");

  return response.data;
}

// --- Order ---------------------------------------------------------------------------------------
async function createOrder(product_id, quantity, userEmail) {
  //alert("Before running createOrder -" + quantity + ", " + product_id)
  const response = await axios.post(API_HOST + "/api/orders/create", { this_product_id: product_id, this_quantity: quantity, this_email: userEmail });
  //alert("Running createOrder from repository.js")

  return response.data;
}

async function getOrdersFromUser(userEmail) {
  //alert("Before running getOrdersFromUser " + userEmail)
  const response = await axios.get(API_HOST + "/api/orders/search", { params: { userEmail } });
  //alert("Successfully running getOrdersFromUser from repository.js")

  return response.data;
}

async function deleteUserOrders(userEmail) {
  //alert("Before running deleteUserOrders " + userEmail)
  const response = await axios.delete(API_HOST + "/api/orders/delete", { params: { userEmail } });
  //alert("Successfully running deleteUserOrders from repository.js")

  return response.data;
}

async function orderChangeQty(order_id, quantity) {
  const response = await axios.put(API_HOST + "/api/orders/edit", { this_order_id: order_id, new_qty: quantity});

  return response.data;
}

async function removeOrder(order) {
  //alert("Before running deleteUserOrders " + userEmail)
  const response = await axios.delete(API_HOST + "/api/orders/deleteone", { data: order });
  //alert("Successfully running deleteUserOrders from repository.js")

  return response.data;
}


// --- Follow ---------------------------------------------------------------------------------------
async function addFollower(following_username, follower_username) {
  const response = await axios.post(API_HOST + "/api/follow/", { data: { following_username: following_username, follower_username: follower_username } });

  return response.data;
}

async function getFollowers(follower_username) {
  const response = await axios.get(API_HOST + "/api/follow/get", { params: { follower_username } });
  
  return response.data;
}

async function removeFollower(following_username, follower_username) {
  const response = await axios.delete(API_HOST + "/api/follow/", { data: { following_username: following_username, follower_username: follower_username  } });
  
  return response.data;
}


// --- Helper functions to interact with local storage --------------------------------------------
function setUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

function getUser() {
  return JSON.parse(localStorage.getItem(USER_KEY));
}

function removeUser() {
  localStorage.removeItem(USER_KEY);
}

export {
  verifyUser, findUser, findUsername, createUser, updateUser, deleteUser, 
  getPosts, createPost, getRelevantPosts, updatePost, deletePost, 
  getUser, removeUser,
  getProducts, getCurrProduct, getSpecials, 
  createOrder, getOrdersFromUser, deleteUserOrders, orderChangeQty, removeOrder,
  addFollower, getFollowers, removeFollower
}
