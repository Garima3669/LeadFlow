import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import "../styles/Auth.css";

const Login = () => {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Validate login form
  const validateForm = () => {
    const newErrors = {
      email: "",
      password: "",
    };

    const email = formData.email.trim();
    const password = formData.password;

    // Email validation
    if (!email) {
      newErrors.email = "Email address is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      newErrors.email = "Please enter a valid email address.";
    }

    // Password validation
    if (!password) {
      newErrors.password = "Password is required.";
    } else if (password.length < 8) {
      newErrors.password =
        "Password must be at least 8 characters.";
    }

    setErrors(newErrors);

    return !newErrors.email && !newErrors.password;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    // Clear field-specific validation error
    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));

    // Clear API error when user starts typing again
    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    // Stop submission if validation fails
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const user = await login(
        formData.email.trim(),
        formData.password
      );

      // Both roles go to dashboard
      if (
        user.role === "ADMIN" ||
        user.role === "MEMBER"
      ) {
        navigate("/dashboard");
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Invalid email or password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        {/* Logo */}
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
            Welcome back
          </h1>

          <p>
            Sign in to manage your
            sales pipeline.
          </p>
        </div>

        {/* API Error */}
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form
          className="auth-form"
          onSubmit={handleSubmit}
          noValidate
        >

          {/* Email */}
          <div className="form-group">
            <label htmlFor="email">
              Email Address
            </label>

            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              autoComplete="email"
              className={
                errors.email
                  ? "input-error"
                  : ""
              }
            />

            {errors.email && (
              <span className="field-error">
                {errors.email}
              </span>
            )}
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              autoComplete="current-password"
              className={
                errors.password
                  ? "input-error"
                  : ""
              }
            />

            {errors.password && (
              <span className="field-error">
                {errors.password}
              </span>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading
              ? "Signing in..."
              : "Sign In"}
          </button>

        </form>

        <div className="auth-footer">
          Don't have an account?{" "}

          <Link to="/register">
            Create one
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

export default Login;
