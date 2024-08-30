import React, { useState, useEffect } from "react";
import { getOrdersFromUser, deleteUserOrders, orderChangeQty } from "../data/repository";
import { Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

export default function Cart(props) {
  const [cartItems, setCartItems] = useState([]);
  const [isEmpty, setIsEmpty] = useState(true);

  const navigate = useNavigate();

    // Load cart items.
    useEffect(() => {
      async function loadCartItems() {
        const currentCart = await getOrdersFromUser(props.user.email);
        
        if (currentCart == "")
          {
            setIsEmpty(true)
          }
        else
        {
          setCartItems(currentCart);
          setIsEmpty(false)
        }
      }
  
      loadCartItems();
    }, []);

  const deleteCart = () => {
    // clears entire cart
    deleteUserOrders(props.user.email)

    // move to home page
    navigate("/")

}

  const Information = (cartItems) => {

    return (
      cartItems.map((item) =>
        <div className='center'>
                <div className='inner'>
                    <img src={item.product.image_url} width="130px" alt="Preview of item in cart"></img>
                </div>
                <div className='inner'>
                    <p><b>{item.product.product_name}</b></p>
                    <p>Qty {item.quantity}</p> 
                </div>
                <div className='inner'></div>
            </div>
      )
    );
  }


  


  return (
    <div>
      <div className="container">
                <img src="https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Groceries fruit aisle" className="cover-smaller"></img>
                <div className="centered">
                    <h1><span class="material-icons">shopping_cart</span> Purchase success</h1> 
                </div>
                <br></br><br></br>
                <p>Your order has been successful! Thank you for shopping with us at SOIL.</p>
                <Button onClick={deleteCart} >Clear Cart and Return to Home Page</Button>
      </div>

      <br></br>

      <h4>Purchase Summary</h4>
      <div>
        {!isEmpty ? <div className="special-flex">{Information(cartItems)}</div> : 
        <div>
          <h4>ERROR: No items found in the cart</h4>
          <p>Please add some products to the cart and Checkout.</p>
          <button className="btn btn-primary-big" type="button"><Link to="/products">Let's Go!</Link></button>
        </div>
        }
      </div>


        {isEmpty ? null : Subtotal(cartItems)}
            
        <br></br>

            <br></br>
            <br></br>
            <br></br>
            <br></br>

      

    </div>
  );
}

function Subtotal(cartItems) {
  // Get all products under this user's email
  //cartItems

  var orderTotal = 0;

  cartItems.map((item) =>
    <>{orderTotal = orderTotal + (item.product.price * item.quantity)}</>
  )

  orderTotal = orderTotal.toFixed(2)
  

  return (
      <div className="subtotal">
          <div className="box-container">
              <br></br>
              
              <div className="left"><h2>Your total was:</h2></div>

              <div className="right"><h2>${orderTotal}</h2></div>

              <div className="clearfix"></div>

              <br></br>
          </div>
          
      </div>
  )
}

