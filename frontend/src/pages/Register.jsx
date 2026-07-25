import { useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  registerUser,
} from "../services/authService";

import "../styles/Auth.css";


const Register = () => {

  const navigate =
    useNavigate();


  const [formData, setFormData] =
    useState({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });


  const [loading, setLoading] =
    useState(false);


  const [error, setError] =
    useState("");


  const [success, setSuccess] =
    useState("");


  const handleChange = (e) => {

    const {
      name,
      value,
    } = e.target;

    setFormData(
      (previous) => ({
        ...previous,
        [name]: value,
      })
    );

    // Clear error while user is correcting the form
    if (error) {
      setError("");
    }

  };


  const validateForm = () => {

    const name =
      formData.name.trim();

    const email =
      formData.email.trim();

    const password =
      formData.password;

    const confirmPassword =
      formData.confirmPassword;


    // Name validation
    if (!name) {

      return "Full name is required";

    }


    if (name.length < 2) {

      return "Full name must be at least 2 characters";

    }


    if (!/^[A-Za-z]+(?:\s+[A-Za-z]+)*$/.test(name)) {

      return "Full name can only contain letters and spaces";

    }


    // Email validation
    if (!email) {

      return "Email address is required";

    }


    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {

      return "Please enter a valid email address";

    }


    // Password validation
    if (!password) {

      return "Password is required";

    }


    if (password.length < 8) {

      return "Password must be at least 8 characters";

    }


    if (!/[A-Z]/.test(password)) {

      return "Password must contain at least one uppercase letter";

    }


    if (!/[a-z]/.test(password)) {

      return "Password must contain at least one lowercase letter";

    }


    if (!/[0-9]/.test(password)) {

      return "Password must contain at least one number";

    }


    if (!/[^A-Za-z0-9]/.test(password)) {

      return "Password must contain at least one special character";

    }


    // Confirm password validation
    if (!confirmPassword) {

      return "Please confirm your password";

    }


    if (
      password !==
      confirmPassword
    ) {

      return "Passwords do not match";

    }


    return null;

  };


  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");
    setSuccess("");


    // Run frontend validation
    const validationError =
      validateForm();


    if (validationError) {

      setError(
        validationError
      );

      return;

    }


    setLoading(true);


    try {

      await registerUser({

        name:
          formData.name.trim(),

        email:
          formData.email.trim().toLowerCase(),

        password:
          formData.password,

      });


      setSuccess(
        "Account created successfully! Redirecting to login..."
      );


      setTimeout(() => {

        navigate("/login");

      }, 1500);


    } catch (error) {

      setError(

        error.response?.data?.message ||

        "Unable to create account"

      );

    } finally {

      setLoading(false);

    }

  };


  return (

    <div className="auth-page">

      <div className="auth-card">


        <Link
          to="/"
          className="auth-brand"
        >

          <span className="brand-icon">
            L
          </span>

          LeadFlow

        </Link>


        <div className="auth-header">

          <h1>
            Create your account
          </h1>

          <p>
            Join your sales team
            and start managing leads.
          </p>

        </div>


        {error && (

          <div className="error-message">
            {error}
          </div>

        )}


        {success && (

          <div className="success-message">
            {success}
          </div>

        )}


        <form
          className="auth-form"
          onSubmit={
            handleSubmit
          }
        >


          {/* FULL NAME */}

          <div className="form-group">

            <label>
              Full Name
            </label>

            <input
              type="text"
              name="name"
              value={
                formData.name
              }
              onChange={
                handleChange
              }
              placeholder="John Doe"
              autoComplete="name"
              required
            />

          </div>


          {/* EMAIL */}

          <div className="form-group">

            <label>
              Email Address
            </label>

            <input
              type="email"
              name="email"
              value={
                formData.email
              }
              onChange={
                handleChange
              }
              placeholder="you@example.com"
              autoComplete="email"
              required
            />

          </div>


          {/* PASSWORD */}

          <div className="form-group">

            <label>
              Password
            </label>

            <input
              type="password"
              name="password"
              value={
                formData.password
              }
              onChange={
                handleChange
              }
              placeholder="Minimum 8 characters"
              autoComplete="new-password"
              required
            />

          </div>


          {/* CONFIRM PASSWORD */}

          <div className="form-group">

            <label>
              Confirm Password
            </label>

            <input
              type="password"
              name="confirmPassword"
              value={
                formData.confirmPassword
              }
              onChange={
                handleChange
              }
              placeholder="Confirm your password"
              autoComplete="new-password"
              required
            />

          </div>


          {/* SUBMIT BUTTON */}

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >

            {loading
              ? "Creating account..."
              : "Create Account"}

          </button>


        </form>


        <div className="auth-footer">

          Already have an account?

          {" "}

          <Link to="/login">
            Sign in
          </Link>

        </div>


        <Link
          to="/"
          className="back-home"
        >
          ← Back to home
        </Link>


      </div>

    </div>

  );

};


export default Register;
