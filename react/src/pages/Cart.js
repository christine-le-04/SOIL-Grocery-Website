import React, { useState, useEffect } from "react";
import { getOrdersFromUser, deleteUserOrders, orderChangeQty, removeOrder } from "../data/repository";
import { Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

export default function Cart(props) {
  const [cartItems, setCartItems] = useState([]);
  const [isEmpty, setIsEmpty] = useState(true);
  const [showDelete, setShowDelete] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false); 
  const [showVisibility, setShowVisibility] = useState(); 
  const [trigger, setTrigger] = useState(true); 
  const [updateError, setUpdateError] = useState({ ccNumber: null, ccDate: null, cvv: null });
  const [currCardDetails, setCurrCardDetails] = useState({ ccNumber: null, ccDate: null, cvv: null });
  const [showCheckout, setShowCheckout] = useState(false);

  const navigate = useNavigate();

    // Load cart items.
    useEffect(() => {
      async function loadCartItems() {
        const currentCart = await getOrdersFromUser(props.user.email);
        
        if (currentCart == "")
          {
            setShowVisibility(false)
            setIsEmpty(true)
          }
        else
        {
          setShowVisibility(true)
          setCartItems(currentCart);
          setIsEmpty(false)
        }
      }
  
      loadCartItems();
    }, [trigger]);

    const toggleDeleteStatus = () => {
      setShowDelete(!showDelete);
  }

  const toggleCheckoutStatus = () => {
    setShowCheckout(!showCheckout);
  }

  const cancelCheckout = () => {
      toggleCheckoutStatus();
      nullifyCurrCard();
  }

  const nullifyCurrCard = () => {
      setCurrCardDetails({ ccNumber: null, ccDate: null, cvv: null });
  }

  const updateTrigger = () => {
    setTrigger(!trigger); 
    alert("Cart product has been successfully edited.")
  }
  
  const deleteCart = () => {
    // clears entire cart
    deleteUserOrders(props.user.email)

    setIsEmpty(true)
    setShowDeletePopup(!showDeletePopup); // refers to confirmation of deletion
    setShowVisibility(!showVisibility); // becomes false, hiding the delete options

}

const handleInputChange = (event) => {
  const name = event.target.name;
  const value = event.target.value;

  // copy of inputs object that holds the input data from the input fields
  const temp = { ccNumber: currCardDetails.ccNumber, ccDate: currCardDetails.ccDate, cvv: currCardDetails.cvv  };

  // updates the input and state
  temp[name] = value;
  setCurrCardDetails(temp);

}

// Credit card handling
const saveData = (event) => {
  event.preventDefault();
  
  // check for errors
  let errors = getValidationError(currCardDetails.ccNumber, currCardDetails.ccDate, currCardDetails.cvv);
  setUpdateError(errors);

  // Check if there are errors in the info
  if (errors.ccNumber === null && errors.ccDate === null && errors.cvv === null) {
      // updates credit card information
      // updateUser(currCardDetails); 

      // TO DO: Show confirmation of purchase 
      alert("Credit card has been validated!")

      navigate("/success")

      // Clear cart after pressing OK button 
      //deleteCart()

      return
  } 
}


  const Information = (cartItems) => {

    return (
      cartItems.map((item) =>
        <div key={item.product.product_id} className='wrapper'>
                <div className='inner'>
                    <img src={item.product.image_url} width="130px" alt="Preview of item in cart"></img>
                </div>
                <div className='inner'>
                    <p><b>{item.product.product_name}</b></p>
                    <p>Qty {item.quantity}</p> 
                    <button onClick={() => {changeQty(item); updateTrigger()}}>Change Qty</button> <button onClick={() => {removeOrder(item); updateTrigger()}}>Remove all {item.product.product_name}</button>
                </div>
                <div className='inner'></div>
                <div className='vertical-line'></div>
                <div className='inner'>
                    <p>${item.product.price}</p>
                </div>
            </div>
      )
    );
  }


  


  return (
    <div>
      <div className="container">
                <img src="https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Groceries fruit aisle" className="cover-smaller"></img>
                <div className="centered">
                    <h1><span className="material-icons">shopping_cart</span> Shopping Cart</h1> 
                </div>
      </div>

      <br></br>

      <div>
        {!isEmpty ? Information(cartItems) : 
        <div>
          <br></br><br></br><br></br>
          <h4>No items found in the cart</h4>
          <p>Would you like to browse our catalogue?</p>
          <button className="btn btn-primary-big" type="button"><Link to="/products">Let's Go!</Link></button>
        </div>
        }
      </div>


      { (showDelete && showVisibility)  ? (
                <>
                    <div className="popup-container">
                        <div className="popup-text">
                            <span className="material-icons">warning_amber</span>
                            <h3>Remove all items</h3>
                            <p>Are you sure you want to remove all items from your cart?</p>
                            <Button name="cancel" onClick={toggleDeleteStatus} >Back to cart</Button>
                            <Button name="delete" onClick={deleteCart} >Clear cart</Button>
                        </div>
                    </div>
                </>
            ) : (
                showVisibility && (
                    <Button name="delete-acc" onClick={toggleDeleteStatus}> Remove all items</Button> 
                ) 
            )}

            { showDeletePopup && (
                <div className="popup-container">
                    <div className="popup-text">
                        <h1>Cart emptied</h1>
                    </div>
                </div>
            )
        }

        {isEmpty ? null : Subtotal(cartItems)}
            
        <br></br>


            { (showCheckout && showVisibility)  ? (
                <>
                    <div className="popup-container">
                        <div className="credit-popup-text">
                            <h1>Checkout</h1>
                            <p>Please enter your payment details to continue.</p>
                            <div className="credit-input-container">
                                <center>
                                    <div className="credit-centered">
                                    <input name="ccNumber" type="text" maxLength={16} onChange={handleInputChange} placeholder="Card number"/>
                                    <div className="cc-error">
                                        {updateError.ccNumber !== null &&
                                            <div className="error-message">
                                                <span className="text-danger">{updateError.ccNumber}</span>
                                            </div>
                                        }
                                    </div>
                                    <br></br>
                                    <input name="ccDate" type="text" maxLength={4} onChange={handleInputChange} placeholder="MMYY"/>
                                    <div className="cc-error">
                                        {updateError.ccDate !== null &&
                                            <div className="error-message">
                                                <span className="text-danger">{updateError.ccDate}</span>
                                            </div>
                                        }
                                    </div>
                                    <br></br>
                                    <input name="cvv" type="text" maxLength={3} onChange={handleInputChange} placeholder="CVV"/>
                                    <div className="cc-error">
                                        {updateError.cvv !== null &&
                                            <div className="error-message">
                                                <span className="text-danger">{updateError.cvv}</span>
                                            </div>
                                        }
                                    </div>
                                    </div>
                                </center>
                            </div>
                            <br></br>
                            
                            <Button className="button button-red" onClick={cancelCheckout} >Cancel</Button> <Button className="button button-green" onClick={saveData} >Save & confirm</Button>
                        </div>
                    </div>
                </>
            ) : (
                showVisibility && (
                    <Button className="button button-green" onClick={toggleCheckoutStatus}> Checkout</Button> 
                ) 
            )}

            <br></br>
            <br></br>
            <br></br>
            <br></br>

      

    </div>
  );
}

function changeQty(item) {
    console.log("Order id is " + item.order_id)
    let quantity = prompt("How many " + item.product.product_name + "s would you like to buy?");
    if (quantity === null || quantity === "" || quantity === 0) {
        alert("Transaction cancelled - no changes made.")
    } else {
        // Update the quantity
        orderChangeQty(item.order_id, quantity) 
        
        
    }
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
              
              <div className="left"><h2>Subtotal</h2></div>

              <div className="right"><h2>${orderTotal}</h2></div>

              <div className="clearfix"></div>

              <br></br>
          </div>
          
      </div>
  )
}

function getValidationError(ccNumber, ccDate, cvv) {
  var numError = null;
  var dateError = null;
  var cvvError = null;

  // ensures cc date is filled in
  if (!ccDate) {
      dateError = 'Credit card date is required';
  }

  // ensures cvv is filled in
  if (!cvv) {
      cvvError = 'CVV is required';
  }

  // Validate cvv
  if (cvv) {
      // Check if ccDate has non-digit elements
      if (!/^\d+$/.test(cvv))
      {
          cvvError = 'CVV must only contain digits';
      }

      // check cc number is 3 digits long
      if (cvv.length !== 3)
      {
          cvvError = 'CVV must be 3 digits long';
      }
      
  }

  // ensures cc number is filled in
  if (!ccNumber) {
      numError = 'Credit card number is required';
  }

  if (ccNumber)
  {
      // ensures only digits are in the cc number
      if ((!/^\d+$/.test(ccNumber))) {
          numError = 'Credit card number must only contain digits';
      }

      // check cc number is 16 digits long
      if (ccNumber.length !== 16)
      {
          numError = 'Credit card number must be 16 digits long';
      }

  }


  // Valid cc date is month 1-12, year between current year (24) and current year + 15 (see README)
  if (ccDate) {
      
      // Check if ccDate has non-digit elements
      if (!/^\d+$/.test(ccDate))
      {
          dateError = 'Credit card date must only contain digits';
      }
      else
      {
          const month = ccDate.substring(0, 2);
          const year = ccDate.substring(2);

          if ((month < 1) || (month > 12))
          {
              dateError = 'Credit card date is invalid'
          }

          if ((year < 24) || (year > 39))
          {
              dateError = 'Credit card date is invalid'
          }
      }
      
  }

  
  return { ccNumber: numError, ccDate: dateError, cvv: cvvError}
}