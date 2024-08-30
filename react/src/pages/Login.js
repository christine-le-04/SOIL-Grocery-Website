import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { verifyUser } from "../data/repository";
import { findUser } from "../data/repository";

export default function Login(props) {
  const navigate = useNavigate();
  const [fields, setFields] = useState({ email: null, password: null });
  const [errors, setErrors] = useState({ email: null, password: null });

  // Generic change handler.
  const handleInputChange = (event) => {
    setFields({ ...fields, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    // clears errors
    setErrors({ email: null, password: null });

    const hasError = await handleErrors();
    if(hasError)
      return;

    const user = await verifyUser(fields.email, fields.password);

    // Set user state.
    props.loginUser(user);

    // Navigate to the profile page.
    navigate("/profile");
  };

  const handleErrors = async () => {
    const user = await verifyUser(fields.email, fields.password);
    let emailError = null;
    let passError = null;

    // TODO: some weird things happens at times with the combinations of empty email/pw fields

    if (fields.email === null) { // if email is null
      emailError = "Email is required.";
    } else if (await findUser(fields.email) === null) { // if email is not in db
      setFields({ email: "", password: "" });
      emailError = "Email is not registered.";
    } 
    
    if (fields.password === null) { // if pw is null
      passError = "Password is required.";
    } else if (fields.email !== null) { // if email is not null
      if (user === null) { // if email and password do not match
        setFields({ email: "", password: "" });
        passError = "Invalid password.";
      }
      if (user === "blocked") { // if the user is currently blocked
        setFields({ email: "", password: "" });
        passError = "This account is currently blocked. Please contact an Administrator for more details.";
      }
    }

    setErrors({ email: emailError, password: passError });

    // if there are errors = true
    return emailError !== null || passError !== null;
  }

  return (
    <div>
      <br></br>
      <h1>Login</h1>
      <hr />
      <br></br>
      <div className="row">
        <div className="col-md-6">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email" className="control-label">Email</label>
              <input name="email" id="email" className="form-control"
                value={fields.email} onChange={handleInputChange} />
              {errors.email &&
                <div className="text-danger">{errors.email}</div>
              }
            </div>
            <div className="form-group">
              <label htmlFor="password" className="control-label">Password</label>
              <input type="password" name="password" id="password" className="form-control"
                value={fields.password} onChange={handleInputChange} />
              {errors.password &&
                <div className="text-danger">{errors.password}</div>
              }
            </div>
            <br></br>
            <div className="form-group">
              <input type="submit" className="btn btn-primary" value="Login" />
            </div>
          </form>
          <br></br>
          <br></br>
        </div>
      </div>
    </div>
  );
}
