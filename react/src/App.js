import './App.css';
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./fragments/Navbar";
import Footer from "./fragments/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyProfile from "./pages/MyProfile";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Success from "./pages/Success";
import ProductDetail from "./pages/ProductDetail";
import { getUser, removeUser, updateUser, findUser } from "./data/repository";
import DietPlan from './pages/DietPlan';

export default function App() {
  const [user, setUser] = useState(getUser());

  const loginUser = (user) => {
    console.log("User is: ", user)
    setUser(user);
  };

  const logoutUser = () => {
    removeUser();
    setUser(null);
  };

  const editUser = async () => {
    const newUser = await findUser(user.email);
    setUser(newUser);
  };

  useEffect(() => {
    const getUser = async () => {
      if (user.email) {
        const fetchedUser = await findUser(user.email);
        setUser(fetchedUser);
      }
    };

    getUser();
  }, []);

  // Set the document title 
  useEffect(() => {
    document.title = 'SOIL | Shop groceries online';
  }, []);

  return (
    <div className="d-flex flex-column min-vh-100">
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons"
      rel="stylesheet"></link>

      <Router>
        <Navbar user={user} logoutUser={logoutUser} />
        <main role="main">
          <div className="container my-3">
            <Routes>
              <Route path="/" element={<Home user={user} />} />
              <Route path="/login" element={<Login loginUser={loginUser} />} />
              <Route path="/register" element={<Register loginUser={loginUser} />} />
              <Route path="/profile" element={<MyProfile user={user} logoutUser={logoutUser} editUser={editUser}/>} />
              <Route path="/products" element={<Products user={user} />} />
              <Route path="/products/:id" element={<ProductDetail user={user} />} />
              <Route path="/cart" element={<Cart user={user} logoutUser={logoutUser}/>} />
              <Route path="/success" element={<Success user={user}/>} />
              <Route path="/dietplan" element={<DietPlan user={user}/>} />
            </Routes>
          </div>
        </main>
        <Footer />
      </Router>
    </div>
  );
}
