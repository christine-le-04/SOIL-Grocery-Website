import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { deleteUser, findUser, updateUser, findUsername } from "../data/repository";

export default function MyProfile(props) {
  const navigate = useNavigate();
  const [fields, setFields] = useState({
    email: props.user.email, username: props.user.username, firstname: props.user.first_name, lastname: props.user.last_name,  password: null, confirmPassword: null
  });
  const [errors, setErrors] = useState({ });
  const [editStatus, setEditStatus] = useState(false);

  const getUserDetails = async () => {
    const user = await findUser(props.user.email); // gets updated user from db
    setFields({ email: user.email, username: user.username, firstname: user.first_name, lastname: user.last_name, password: "", confirmPassword: "" }); // set fields to updated user data
  };

  useEffect(() => {
    getUserDetails();
  }, []);
  
  // Generic change handler.
  const handleInputChange = (event) => {
    setFields({ ...fields, [event.target.name]: event.target.value });
    console.log("handleInputChange test: ");
    console.log(fields);
  };

  const handleDelete = async () => {
    const deleteConfirm = window.confirm("Are you sure you want to delete your account?");

    if (deleteConfirm) {
      // delete user
      await deleteUser(fields);

      alert("You have successfully deleted your account.");

      // ensures that the user isnt still logged in
      props.logoutUser();

      // Navigate to the home page.
      navigate("/");
    }
  }

  const handleCancel = () => {
    setFields({
      email: props.user.email, username: props.user.username, firstname: props.user.first_name, lastname: props.user.last_name, password: null, confirmPassword: null
    });
    setErrors({});
    setEditStatus(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate form and if invalid do not contact API.
    const { trimmedFields, isValid } = await handleValidation();
    console.log("isValid submit:", isValid);
    if(!isValid)
      return;

    // Edit user

    await updateUser(trimmedFields);
    const newUser = await findUser(trimmedFields.email);
    props.editUser(newUser);

    alert("Your details have successfully been updated.");

    setEditStatus(false);
  };

  const handleValidation = async () => {
    console.log("handleValidation test");
    const trimmedFields = trimFields();
    const user = await findUser(trimmedFields.email);
    const currentErrors = { };

    let key = "username";
    let field = trimmedFields[key];
    if (field !== props.user.username) {
      if(field.length === 0) {
        currentErrors[key] = "Username is required.";
      } else if(field.length > 32) {
        currentErrors[key] = "Username length cannot be greater than 32.";
      } else if (field.length !== 0) { // if username input exists
        if (trimmedFields.username !== props.user.username) { // if inputted username is different from current username
          if(await findUsername(trimmedFields.username) !== null) { // checks if username exists in db
            currentErrors[key] = "Username is already taken.";
          }
        }
      }
    }

    key = "firstname";
    field = trimmedFields[key];
    if (field !== props.user.first_name) {
      if (field.length === 0) {
        currentErrors[key] = "First name is required.";
      } else if(field.length > 40) { 
        currentErrors[key] = "First name length cannot be greater than 40.";
      }
    }

    key = "lastname";
    field = trimmedFields[key];
    if (field !== props.user.last_name) {
      if(field.length === 0) {
        currentErrors[key] = "Last name is required.";
      } else if(field.length > 40) {
        currentErrors[key] = "Last name length cannot be greater than 40.";
      }
    }

    // password must be entered everytime edit occurs
    key = "password";
    field = trimmedFields[key];
    if(field.length === 0) {
      currentErrors[key] = "Password is required.";
    } else if(field.length < 8) {
      currentErrors[key] = "Password must contain at least 8 characters.";
    } else if (!/(?=.*[A-Z])/.test(field)) {
      currentErrors[key] = "Password must contain at least one uppercase letter.";
    } else if (!/(?=.*\d)/.test(field)) {
      currentErrors[key] = "Password must contain at least one number.";
    }

    key = "confirmPassword";
    field = trimmedFields[key];
    if(field !== trimmedFields.password) {
      currentErrors[key] = "Passwords do not match."; 
    }
    
    setErrors(currentErrors);

    return { trimmedFields, isValid: Object.keys(currentErrors).length === 0 };
  };

  const trimFields = () => {
    const trimmedFields = { };
    Object.keys(fields).map(key => trimmedFields[key] = fields[key].trim());
    setFields(trimmedFields);

    return trimmedFields;
  };

  return (
    <div>
      <div className="container">
          <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2748&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Groceries fruit aisle" className="cover-smaller"></img>
          <div className="centered">
              <h1><span className="material-icons">person</span> Profile</h1> 
          </div>
      </div> 

      <br></br><br></br><br></br>
      <h2><span class="material-icons">waving_hand</span>  <strong>Hello {props.user.first_name} {props.user.last_name}!</strong></h2>
      <hr/><br></br>
      
      <form onSubmit={handleSubmit}>
        <div className="wrapper">
          <div className="form-group">

            <div className="left-profile">
              <label htmlFor="firstname" className="control-label">First Name</label>
              <input name="firstname" className="form-control" type="text" readOnly={!editStatus} value={fields.firstname} onChange={handleInputChange} />
              {errors.firstname &&
                <div className="text-danger">{errors.firstname}</div>
              }
              <br></br>
            
              <label htmlFor="email" className="control-label">Email</label>
              <input name="email" className="form-control" type="text" readOnly={true} value={fields.email} /> 
              <br></br>

              <label htmlFor="password" className="control-label">Password</label>
              <input name="password" className="form-control" type="password" readOnly={!editStatus} value={fields.password} onChange={handleInputChange} /> 
              {errors.password &&
                <div className="text-danger">{errors.password}</div>
              }
              <br></br>
              
              <label htmlFor="date" className="control-label">Date Joined</label>
              <input name="date" className="form-control" type="text" readOnly={true} defaultValue={new Date(props.user.date_created).toLocaleDateString()} />         
              <br></br>
            </div>

            <div className="right-profile">
              <label htmlFor="lastname" className="control-label">Last Name</label>
              <input name="lastname" className="form-control" type="text" readOnly={!editStatus} value={fields.lastname} onChange={handleInputChange} />
              {errors.lastname &&
                <div className="text-danger">{errors.lastname}</div>
              }
              <br></br>

              <label htmlFor="username" className="control-label">Username</label>
              <input name="username" className="form-control" type="text" readOnly={!editStatus} value={fields.username} onChange={handleInputChange} />  
              {errors.username &&
                <div className="text-danger">{errors.username}</div>
              }
              <br></br>

              {editStatus && 
                <>
                  <label htmlFor="confirmPassword" className="control-label">Confirm Password</label>
                  <input name="confirmPassword" className="form-control" type="password" value={fields.confirmPassword} onChange={handleInputChange} /> 
                  {errors.confirmPassword &&
                    <div className="text-danger">{errors.confirmPassword}</div>
                  }
                  <br></br>
                </>
              }
            </div>

          </div>
        </div>
        <div className="profile-buttons">
          { editStatus ? (
            <>
              <input type="button" className="btn delete-primary mr-5" value="Cancel" onClick={handleCancel} />
              <input type="submit" className="btn btn-primary" value=" Save " />
            </>
          ) : (
            <input type="button" className="btn btn-primary" value="Edit" onClick={() => {
              setEditStatus(true);
              setFields({ ...fields, password: "", confirmPassword: "" }); // clear password fields
            }} />
          )}
        </div>
        
      </form>

      
      <hr />
      <br></br>
      <input type="button" className="btn delete-primary" value="Delete Account" onClick={handleDelete} />
      <br></br>
      <br></br>
      <hr />
      <br></br>
      <br></br>
    </div>
  );
}
