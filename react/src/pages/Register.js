import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { findUser, createUser, findUsername } from "../data/repository";

export default function Register(props) {
  const navigate = useNavigate();
  const [fields, setFields] = useState({
    email: "", username: "", firstname: "", lastname: "",  password: "", confirmPassword: ""
  });
  const [errors, setErrors] = useState({ });

  // Generic change handler.
  const handleInputChange = (event) => {
    setFields({ ...fields, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // clears errors
    setErrors({});

    // Validate form and if invalid do not contact API.
    const { trimmedFields, isValid } = await handleValidation();
    if(!isValid)
      return;

    // Create user.
    const user = await createUser(trimmedFields);

    // confirmation of registration
    alert("You have successfully registered an account!");

    // Set user state.
    props.loginUser(user);

   // Navigate to the home page.
    navigate("/");
  };

  const handleValidation = async () => {
    const trimmedFields = trimFields();
    const currentErrors = { };

    // has to be unique
    let key = "email";
    let field = trimmedFields[key];
    if(field.length === 0) {
      currentErrors[key] = "Email is required.";
    } else if(field.length > 254) {
      currentErrors[key] = "Email length cannot be greater than 254.";
    } else if (field.length !== 0) { // if email input exists
      if(await findUser(trimmedFields.email) !== null) { // checks if email exists in db
        currentErrors[key] = "Email is already registered.";
      }
    }
    
    key = "username";
    field = trimmedFields[key];
    if(field.length === 0) {
      currentErrors[key] = "Username is required.";
    } else if(field.length > 32) {
      currentErrors[key] = "Username length cannot be greater than 32.";
    } else if (field.length !== 0) { // if username input exists
      if(await findUsername(trimmedFields.username) !== null) { // checks if username exists in db
        currentErrors[key] = "Username is already taken.";
      }
    }
 
    key = "firstname";
    field = trimmedFields[key];
    if (field.length === 0) {
      currentErrors[key] = "First name is required.";
    } else if(field.length > 40) { 
      currentErrors[key] = "First name length cannot be greater than 40.";
    }

    key = "lastname";
    field = trimmedFields[key];
    if(field.length === 0) {
      currentErrors[key] = "Last name is required.";
    } else if(field.length > 40) {
      currentErrors[key] = "Last name length cannot be greater than 40.";
    }
     
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
    if(field.length === 0) {
      currentErrors[key] = "Confirm password is required.";
    } else if (field !== trimmedFields.password) {
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
      <br></br>
      <h1>Register</h1>
      <hr />
      <br></br>
      <div className="row">
        <div className="col-md-6">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email" className="control-label">Email</label>
              <input type="email" name="email" id="email" className="form-control"
                value={fields.email} onChange={handleInputChange} />
              {errors.email &&
                <div className="text-danger">{errors.email}</div>
              }
            </div>
            <div className="form-group">
              <label htmlFor="username" className="control-label">Username</label>
              <input name="username" id="username" className="form-control"
                value={fields.username} onChange={handleInputChange} />
              {errors.username &&
                <div className="text-danger">{errors.username}</div>
              }
            </div>
            <div className="form-group">
              <label htmlFor="firstname" className="control-label">First Name</label>
              <input name="firstname" id="firstname" className="form-control"
                value={fields.firstname} onChange={handleInputChange} />
              {errors.firstname &&
                <div className="text-danger">{errors.firstname}</div>
              }
            </div>
            <div className="form-group">
              <label htmlFor="lastname" className="control-label">Last Name</label>
              <input name="lastname" id="firstname" className="form-control"
                value={fields.lastname} onChange={handleInputChange} />
              {errors.lastname &&
                <div className="text-danger">{errors.lastname}</div>
              }
            </div>
            <div className="form-group">
              <label htmlFor="password" className="control-label">
                Password <small className="text-muted">must be at least 8 characters</small>
              </label>
              <input type="password" name="password" id="password" className="form-control"
                value={fields.password} onChange={handleInputChange} />
              {errors.password &&
                <div className="text-danger">{errors.password}</div>
              }
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword" className="control-label">Confirm Password</label>
              <input type="password" name="confirmPassword" id="confirmPassword" className="form-control"
                value={fields.confirmPassword} onChange={handleInputChange} />
              {errors.confirmPassword &&
                <div className="text-danger">{errors.confirmPassword}</div>
              }
            </div>
            <br></br>
            <div className="form-group">
              <Link className="btn delete-primary mr-5" to="/">Cancel</Link>
              <input type="submit" className="btn btn-primary" value="Register" />
            </div>
          </form>
          <br></br>
          <br></br>
        </div>
      </div>
    </div>
  );
}
