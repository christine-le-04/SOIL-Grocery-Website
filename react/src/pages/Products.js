import React, { useState, useEffect } from "react";
import { getProducts, getSpecials, createOrder } from "../data/repository";
import { useNavigate } from "react-router-dom";

export default function Products(props) {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [specials, setSpecials] = useState([]);
  const [specialsLoading, setSpecialsLoading] = useState(true);
  const [currentSpecial, setcurrentSpecial] = useState(null);

  // Load products.
  useEffect(() => {
    async function loadProducts() {
      const currentProducts = await getProducts();

      setProducts(currentProducts);
      setIsLoading(false);
    }

    loadProducts();
  }, []);

  // Load special products.
  useEffect(() => {
    async function loadSpecials() {
      const currentProducts = await getSpecials();

      setSpecials(currentProducts);
      // console.log("curr Products: ", currentProducts);
      // console.log("specials: ", specials);
      setSpecialsLoading(false);
    }

    loadSpecials();
  }, []);

  const handleObjectClick = (object) => {
    // Change state to current object user has clicked on
    // setcurrentSpecial(object);
    navigate(`/products/${object.product_id}`);
  };

  return (
    <div>
      <div className="container">
                <img src="https://images.unsplash.com/photo-1628102491629-778571d893a3?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Fresh fruit" className="cover-darken"></img>
                <div className="centered">
                    <br></br>
                    <h1 className="display-4">Our Products</h1>
                    <p>We take pride in our wide selection of sustainable, organic produce. <br></br>
                        Check out our Weekly Specials section to discover a rotating selection of products at unbeatable prices.</p>
                    <p>From fantastic deals to new and intruiging foods to try, there's always something exciting for you to discover!</p>
                    <span className="material-icons">favorite</span>
                </div>
            </div>
            <br></br>

      {/* <div className="left">
        {currentSpecial != undefined ? Information(currentSpecial, props) : defaultInformation()}

      </div> */}

      <br></br><br></br><br></br><br></br>
      <h1>Our Weekly Specials</h1>
      <br></br>
      <div className="special-flex">
        {specialsLoading ?
            <div>Loading specials...</div>
            :
            products.length === 0 ?
              <span className="text-muted">No specials were found in the database.</span>
              :
              specials.map((x) =>
                <div className="special-item">
                  <p>
                    <b>{x.product_name}</b>
                    <p>${x.price}</p>
                    <img src={x.image_url} width="100px" alt="Preview of specials item"></img>
                    <br></br>
                    <br></br>
                    <button className="btn btn-primary" onClick={() => handleObjectClick(x)}>More Info</button>
                    <br></br>
                  </p>
                </div>
              )
          }
          </div>

      <br></br>
      <div className="clearfix"></div>
      <hr />
      <br></br><h1>All Products</h1><br></br>
      <div>
        <div className="special-flex">
          {isLoading ?
            <><div>Loading products...</div><br></br></>
            :
            products.length === 0 ?
              <span className="text-muted">No products were found in the database.</span>
              :
              products.map((x) =>
                <div className="special-item">
                  <p>
                    <b>{x.product_name}</b>
                    <p>${x.price}</p>
                    <img src={x.image_url} width="100px" alt="Preview of specials item"></img>
                    <br></br>
                    <br></br>
                    <button className="btn btn-primary" onClick={() => handleObjectClick(x)} >More Info</button>
                    <br></br>
                    <br></br>
                    <br></br>
                  </p>
                </div>
              )
          }
        </div>
      </div>
    </div>
  );
}

// function Information(object, props) {
//   return (
//       <div className="info">
//           <br></br>
//           <h3>{object.product_name}</h3>
//           <div className="middle-text">{object.description}</div>
//           <br></br>
//           <button className="button button-green" onClick={() => addItemToCart(object, props)} >Add to Cart</button>
//           <br></br>
//           <br></br>
//       </div>

//   );
// }

// function defaultInformation() {
//   return (
//     <div className="info">
//         <br></br>
//         <h3>Select a Product</h3>
//         <div className="middle-text">Take a look at our great products! Select a product and see what we - and our awesome customers - have to say about it here!</div>
//         <br></br>
//         <br></br>
//     </div>

// );
// }

// function addItemToCart(object, props) {

//       // Prompt for quantity of item
//       let quantity = prompt("How many " + object.product_name + "s would you like to buy?");
//       if (quantity == null || quantity == "" || quantity == 0) {
//           alert("Transaction cancelled - no items added to cart.")
//       } 
//       else if (!/^\d+$/.test(quantity))
//       {
//           alert("Error - Please only enter numbers.")
//       }
//       else {
        
//         // ADD ITEM TO CART FUNCTION HERE
//           createOrder(object.product_id, quantity, props.user.email)
//           alert("Added " + quantity + " of " + object.product_name + " to cart!")
//       }
//   }


