import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getCurrProduct, createOrder, createPost, getRelevantPosts, deletePost, updatePost, addFollower, removeFollower, getFollowers } from "../data/repository";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function ProductDetail(props) {
  const { id } = useParams(); // refers to product id
  const [errors, setErrors] = useState({});
  const [product, setProduct] = useState(null); 
  const [reviews, setReviews] = useState([]); 
  const [isLoading, setIsLoading] = useState(true); 
  const [followingList, setFollowingList] = useState([]); 
  const [isCreate, setIsCreate] = useState(false); // determines whether submission is for creation or editing of post/review
  const [editReviewId, setEditReviewId] = useState(null); // keeps track of which post_id to edit and update in db
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [writeReview, setWriteReview] = useState(false); // keeps track of whether viewing or writing reviewing
  const [reviewInput, setReviewInput] = useState({ text: null, rating: null }); // deals with review input change

  // loads specified product information
  useEffect(() => {
    async function loadProduct() {
      const currProduct = await getCurrProduct(id);

      // of all the products, it finds the product with the specified product id
      // const currProduct = allProducts.find(allProducts => allProducts.product_id === parseInt(id));

      setProduct(currProduct);
      setIsLoading(false);
    }

    loadProduct();
  }, []);

  // loads reviews for specified product
  useEffect(() => {
    async function loadReviews() {
      const allReviews = await getRelevantPosts(id);

      setReviews(allReviews);
      setReviewsLoading(false);
    }

    loadReviews();
  }, []);

   // loads following list for current user
   useEffect(() => {
    async function loadFollowing() {
      if (props.user?.username) {
        const following = await getFollowers(props.user.username);
        setFollowingList(following);
      }
    }
  
    loadFollowing();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!product) {
    return <div>Product not found.</div>;
  }

  const addItemToCart = () => {
    if (props.user === null) {
      alert("Please login to add items to your cart.");
    } else {
      // Prompt for quantity of item
      let quantity = prompt("How many " + product.product_name + "s would you like to buy?");
      if (quantity == null || quantity == "" || quantity == 0) {
          alert("Transaction cancelled - no items added to cart.")
      } 
      else if (!/^\d+$/.test(quantity))
      {
          alert("Error - Please only enter numbers.")
      }
      else {
        // ADD ITEM TO CART FUNCTION HERE
          createOrder(product.product_id, quantity, props.user.email)
          alert("Added " + quantity + " of " + product.product_name + " to cart!")
      }
    }
  }

  const handleInputChange = (event) => {
    setReviewInput({ ...reviewInput, [event.target.name]: event.target.value });
  };

  const handleWriteReview = () => {
    if (!props.user) {
      alert("You must be logged in to write a review.");
      return;
    }
    setWriteReview(true);
    setIsCreate(true);
  };

  const handleCancel = () => {
    setReviewInput({}); // clears review inputs
    setErrors({}); // clears errors
    setEditReviewId(null);
    setWriteReview(false); 
  };

  const handleEdit = (review) => {
    setReviewInput({ text: review.text, rating: review.rating }); // shows previous input when editing
    setEditReviewId(review.post_id); 
    setIsCreate(false);
  };

  const handleDelete = async (review) => {
    const deleteConfirm = window.confirm("Are you sure you want to delete your review?");

    if (deleteConfirm) {
      // delete review/post
      await deletePost(review.post_id);
      alert("You have successfully deleted your review.");

      // updates reviews display
      const allReviews = await getRelevantPosts(id);
      setReviews(allReviews);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate form and if invalid do not contact API.
    const { validationErrors, isValid } = await handleValidation();
    setErrors(validationErrors);
    
    if(!isValid)
      return;

    if (isCreate) {
      // create post/review
      await createPost(reviewInput.text, reviewInput.rating, props.user.username, id);

      setWriteReview(false);
      alert("You have created a review.");
    } else {
      // update/edit post/review
      await updatePost({ ...reviewInput, post_id: editReviewId });

      setEditReviewId(null);
      alert("You have edited a review.");
    }   

     // update reviews display
    const allReviews = await getRelevantPosts(id);
    setReviews(allReviews);

    setReviewInput({}); // clear review
  };

  const handleValidation = async () => {
    const currentErrors = { };
    
    // ensures text cannot be over 100 words
    // text can be null (just not rating), so did not include a condition for null
    let key = "text";
    let field = reviewInput[key];
    if (field) {
      const wordCount = field.trim().split(/\s+/).length;
      if (wordCount > 100) {
        currentErrors[key] = "Review word count cannot be greater than 100.";
      }
    }
    
    // ensures rating exists
    key = "rating";
    field = reviewInput[key];
    if (!field) {
      currentErrors[key] = "Product rating is required.";
    } 

    return { validationErrors: currentErrors, isValid: Object.keys(currentErrors).length === 0 };
  };

  const followUser = async (user) => {
    if (props.user === null) {
      alert(`You must be logged in to follow ${user}`);
      return;
    }
    
    // followed user (being followed), follower (currUser)
    await addFollower(user, props.user.username);

    // updates following list with username
    setFollowingList([...followingList, user]);

    alert(`You successfully followed ${user}.`);
  };

  const unfollowUser = async (user) => {
    // followed user (being followed), follower (currUser)
    await removeFollower(user, props.user.username);
    
    // updates following list
    setFollowingList(followingList.filter(f => f !== user));

    alert(`You successfully unfollowed ${user}.`);
  };

  return (
    <div>
      <div className="product-details">
        <h1>{product.product_name}</h1>
        <hr />

        <div className="left">
          <br></br>
          <img src={product.image_url} width="300px" alt={product.product_name} />
        </div>

        <div className="right">
          <h3>Price: ${product.price}</h3>
          <p>{product.description}</p>
          <button className="button button-green" onClick={addItemToCart}>Add to Cart</button>
        </div>
      </div>
      <hr />
      
      <div className="product-reviews">
        <div className="reviews-header">
          <h2>Customer Reviews:</h2>
          {!writeReview && (
            <button type='button' className="button button-green" onClick={handleWriteReview}>Write Review</button>
          )}
        </div>

        {writeReview && (
          <div className="reviews-post">
            <form onSubmit={handleSubmit}>
              <br></br><hr/><br></br>
              <div className="rating">
                <p>Select Star Rating: 
                  <select name="rating" value={reviewInput.rating || ''} onChange={handleInputChange}>
                    <option value=""></option>
                    <option value={1}>1 Star</option>
                    <option value={2}>2 Stars</option>
                    <option value={3}>3 Stars</option>
                    <option value={4}>4 Stars</option>
                    <option value={5}>5 Stars</option>
                  </select>
                  {errors.rating &&
                    <div className="text-danger">{errors.rating}</div>
                  }
                </p>
              </div>

              <div className="form-group" style={{ marginBottom: "60px" }}>
                <ReactQuill theme="snow" value={reviewInput.text} onChange={(value) => setReviewInput({ ...reviewInput, text: value })} style={{ height: "180px" }} />
              </div>
              {errors.text &&
                <div className="text-danger">{errors.text}</div>
              }

              <div className="form-group">
                <input type="button" className="btn delete-primary mr-5" value="Cancel" onClick={handleCancel} />
                <input type="submit" className="btn btn-primary" value="  Post  " />
              </div>

              <br></br><hr/><br></br>
            </form>
          </div>
        )}
        
        <div className="reviews-list">
          { reviewsLoading ? (
            <div>Loading reviews...</div>
          ) : reviews.length === 0 ? (
            <>
              <br />
              <span className="text-muted">No reviews have been submitted for this product.</span>
            </>
          ) : (
            reviews.map((x) => (
              <div className="border my-3 p-3" key={x.post_id}>
                { editReviewId === x.post_id ? (
                  <>
                  <form onSubmit={handleSubmit}>
                    <div className="rating">
                      <p>Select Star Rating: 
                        <select name="rating" value={reviewInput.rating || ''} onChange={handleInputChange}>
                          <option value=""></option>
                          <option value={1}>1 Star</option>
                          <option value={2}>2 Stars</option>
                          <option value={3}>3 Stars</option>
                          <option value={4}>4 Stars</option>
                          <option value={5}>5 Stars</option>
                        </select>
                        {errors.rating &&
                          <div className="text-danger">{errors.rating}</div>
                        }
                      </p>
                    </div>

                      <div className="form-group" style={{ marginBottom: "60px" }}>
                        <ReactQuill theme="snow" value={reviewInput.text} onChange={(value) => setReviewInput({ ...reviewInput, text: value })} style={{ height: "180px" }} />
                      </div>
                      {errors.text &&
                        <div className="text-danger">{errors.text}</div>
                      }

                      <div className="form-group">
                        <input type="button" className="btn delete-primary mr-5" value="Cancel" onClick={handleCancel} />
                        <input type="submit" className="btn btn-primary" value="  Post  " />
                      </div>
                  </form>
                  </>
                ) : (
                  <>
                    <div className="review-details">
                      <br></br>
                      <h6 className="text-primary">{x.username}</h6>

                      <div className="star">
                        {Array.from({length: x.rating}).map((_, i) => (
                          <span key={i} className="material-icons">star</span>
                        ))}
                      </div>
                      
                      <div dangerouslySetInnerHTML={{ __html: x.text }} />
                      <br></br>

                      {props.user?.username !== x.username && (
                        <>
                          {followingList.includes(x.username) ? (
                            <input type="button" className="btn delete-primary" value={`Unfollow ${x.username}`} onClick={() => unfollowUser(x.username)} />
                          ) : (
                            <input type="button" className="btn btn-primary" value={`Follow ${x.username}`} onClick={() => followUser(x.username)} />
                          )}
                        </>
                      )}

                      {props.user?.username === x.username && (
                        <>
                          <input type="button" className="btn btn-primary mr-5" value="  Edit  " onClick={() => handleEdit(x)} />
                          <input type="button" className="btn delete-primary" value="Delete" onClick={() => handleDelete(x)} />
                        </>
                      )}
                    </div>
                    <br></br>
                  </>
                )}
              </div>
            ))
          )}
        </div>
        
      </div>
    </div>
  );
}
