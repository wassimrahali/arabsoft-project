import React, { useState } from "react";
import { signup } from "../../Backend";
import { Alert } from "react-bootstrap"; // Import Bootstrap Alert component
import Navbar from "../Dashboard/Header";

// Signup component for the signup form
function Signup() {
  const [formValues, setFormValues] = useState({
    email: "",
    name: "",
    password: "",
    confirmPassword: "",
    error: "",
    loading: false,
    success: false,
  });

  const { name, email, password, confirmPassword, error, loading, success } = formValues;

  const handleChange = (name) => (event) => {
    setFormValues({ ...formValues, error: false, [name]: event.target.value });
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setFormValues({ ...formValues, success: false, loading: true });

    // Simulating a 3-second loading delay
    setTimeout(() => {
      // Placeholder for the signup function calling the backend
      if (password !== confirmPassword) {
        setFormValues({
          ...formValues,
          error: "Passwords do not match",
          loading: false,
          success: false,
        });
      } else {
        signup({ name, email, password })
          .then((data) => {
            if (data.error) {
              setFormValues({ ...formValues, error: data.error, loading: false, success: false });
            } else {
              setFormValues({ ...formValues, success: true });
            }
          })
          .catch();
      }
    }, 3000); // 3000 milliseconds (3 seconds)
  };

  const errorMessage = () => {
    return (
      <Alert variant="danger" show={error != ""}>
        {error}
      </Alert>
    );
  };

  const loadingMessage = () => {
    return (
      loading && (
        <Alert variant="warning">
          <div className="loading-spinner"></div>
          <p>Loading...</p>
        </Alert>
      )
    );
  };

  const successMessage = () => {
    return (
      success && (
        <Alert variant="success">
          <center>
            <p className="login_redirect mt-2">
              Account created successfully <b><a href="/signin">Login here</a></b>
            </p>
          </center>
        </Alert>
      )
    );
  };

  return (
    <>
      <Navbar />
      <h2 className="text-signin" style={{ color: "black" }}>
        Découvrez nos logiciels Entreprise Management pour chaque secteur d’activité
      </h2>
      <div className="form-container">
        <div className="form-box">
          <h2>Create an account</h2>
          {errorMessage()}
          {loadingMessage()}
          {successMessage()}
          <div className="form-group">
            <label htmlFor="name">Username</label>
            <input type="text" id="name" name="name" onChange={handleChange("name")} required />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="text" id="email" name="email" onChange={handleChange("email")} required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" onChange={handleChange("password")} required />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              onChange={handleChange("confirmPassword")}
              required
            />
          </div>
          <div className="form-group-button">
            <button onClick={onSubmit}>Sign Up</button>
          </div>
          <div className="login-message">
            <center>
              <p className="login_redirect mt-2">
                Do you have an account ?<b><a href="/signin"> Sign In Here</a></b>
              </p>
            </center>
          </div>
        </div>
      </div>
    </>
  );
}

export default Signup;
