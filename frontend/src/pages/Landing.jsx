import { useState } from "react";
import { Link } from "react-router-dom";

import { createPublicLead } from "../services/leadService";

import "../styles/Landing.css";


const Landing = () => {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });

  const [loading, setLoading] =
    useState(false);

  const [success, setSuccess] =
    useState("");

  const [error, setError] =
    useState("");

  const [validationErrors, setValidationErrors] =
    useState({});


  /*
  ========================================
  HANDLE INPUT CHANGE
  ========================================
  */

  const handleChange = (e) => {

    const {
      name,
      value,
    } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    // Clear field-specific validation error
    // when user starts correcting the field
    setValidationErrors((previous) => ({
      ...previous,
      [name]: "",
    }));

  };


  /*
  ========================================
  VALIDATE FORM
  ========================================
  */

  const validateForm = () => {

    const errors = {};

    const name =
      formData.name.trim();

    const email =
      formData.email.trim();

    const phone =
      formData.phone.trim();

    const company =
      formData.company.trim();

    const message =
      formData.message.trim();


    /*
    ========================================
    NAME VALIDATION
    ========================================
    */

    if (!name) {

      errors.name =
        "Full name is required.";

    } else if (
      !/^[A-Za-z ]+$/.test(name)
    ) {

      errors.name =
        "Name can contain only letters and spaces.";

    } else if (
      name.length < 2
    ) {

      errors.name =
        "Name must be at least 2 characters.";

    } else if (
      name.length > 50
    ) {

      errors.name =
        "Name cannot exceed 50 characters.";

    }


    /*
    ========================================
    EMAIL VALIDATION
    ========================================
    */

    if (!email) {

      errors.email =
        "Email is required.";

    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)
    ) {

      errors.email =
        "Please enter a valid email address.";

    }


    /*
    ========================================
    PHONE VALIDATION
    ========================================
    */

    if (phone) {

      const cleanPhone =
        phone.replace(/[\s-]/g, "");

      if (
        !/^(?:\+91|91)?[6-9]\d{9}$/.test(
          cleanPhone
        )
      ) {

        errors.phone =
          "Please enter a valid Indian phone number.";

      }

    }


    /*
    ========================================
    COMPANY VALIDATION
    ========================================
    */

    if (
      company.length > 100
    ) {

      errors.company =
        "Company name cannot exceed 100 characters.";

    }


    /*
    ========================================
    MESSAGE VALIDATION
    ========================================
    */

    if (
      message.length > 1000
    ) {

      errors.message =
        "Message cannot exceed 1000 characters.";

    }


    setValidationErrors(errors);

    return (
      Object.keys(errors).length === 0
    );

  };


  /*
  ========================================
  HANDLE SUBMIT
  ========================================
  */

  const handleSubmit = async (e) => {

    e.preventDefault();

    setSuccess("");
    setError("");


    /*
    Validate before API call
    */

    if (!validateForm()) {

      return;

    }


    setLoading(true);


    try {

      await createPublicLead({

        name:
          formData.name.trim(),

        email:
          formData.email.trim(),

        phone:
          formData.phone.trim(),

        company:
          formData.company.trim(),

        message:
          formData.message.trim(),

      });


      setSuccess(
        "Thanks! Your request has been received. Our team will contact you soon."
      );


      setFormData({

        name: "",
        email: "",
        phone: "",
        company: "",
        message: "",

      });


      setValidationErrors({});


    } catch (error) {

      const message =
        error.response?.data
          ?.message ||
        "Unable to submit your request. Please try again.";

      setError(message);


    } finally {

      setLoading(false);

    }

  };


  return (

    <div className="landing-page">


      {/* ================= NAVBAR ================= */}

      <nav className="landing-navbar">

        <Link
          to="/"
          className="brand"
        >

          <span className="brand-icon">
            L
          </span>

          <span>
            LeadFlow
          </span>

        </Link>


        <div className="nav-actions">

          <Link
            to="/login"
            className="nav-login"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="nav-register"
          >
            Get Started
          </Link>

        </div>

      </nav>


      {/* ================= HERO ================= */}

      <section className="hero-section">

        <div className="hero-content">

          <div className="hero-badge">
            Smart Lead Management
          </div>


          <h1>

            Turn Every Lead Into

            <span>
              Opportunity
            </span>

          </h1>


          <p>

            Capture leads, assign ownership,
            track conversations, and move
            opportunities through your sales
            pipeline — all in one place.

          </p>


          <div className="hero-buttons">

            <a
              href="#capture"
              className="primary-button"
            >
              Capture a Lead
            </a>

            <Link
              to="/login"
              className="secondary-button"
            >
              Team Login
            </Link>

          </div>

        </div>


        {/* CRM Preview */}

        <div className="hero-preview">

          <div className="preview-header">

            <div>

              <span>
                Sales Pipeline
              </span>

              <small>
                24 active leads
              </small>

            </div>

            <div className="preview-dot" />

          </div>


          <div className="pipeline-preview">

            <div className="pipeline-column">

              <h4>
                New
              </h4>

              <div className="preview-card">

                <strong>
                  Acme Solutions
                </strong>

                <span>
                  Website inquiry
                </span>

              </div>

              <div className="preview-card">

                <strong>
                  NovaTech
                </strong>

                <span>
                  Product demo
                </span>

              </div>

            </div>


            <div className="pipeline-column">

              <h4>
                Qualified
              </h4>

              <div className="preview-card active">

                <strong>
                  TechVision
                </strong>

                <span>
                  High priority
                </span>

              </div>

            </div>


            <div className="pipeline-column">

              <h4>
                Won
              </h4>

              <div className="preview-card won">

                <strong>
                  Bright Labs
                </strong>

                <span>
                  Converted
                </span>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ================= FEATURES ================= */}

      <section className="features-section">

        <div className="section-heading">

          <span>
            BUILT FOR SALES TEAMS
          </span>

          <h2>
            Everything your team needs
          </h2>

          <p>
            From first contact to conversion,
            keep your entire lead lifecycle
            organized and visible.
          </p>

        </div>


        <div className="feature-grid">


          <div className="feature-card">

            <div className="feature-icon">
              +
            </div>

            <h3>
              Capture Leads
            </h3>

            <p>
              Collect leads through a simple
              public form and automatically
              add them to your pipeline.
            </p>

          </div>


          <div className="feature-card">

            <div className="feature-icon">
              →
            </div>

            <h3>
              Assign Ownership
            </h3>

            <p>
              Admins can assign leads to team
              members so everyone knows exactly
              what they own.
            </p>

          </div>


          <div className="feature-card">

            <div className="feature-icon">
              ✓
            </div>

            <h3>
              Track Progress
            </h3>

            <p>
              Move leads through a clear pipeline
              and maintain a complete history of
              every interaction.
            </p>

          </div>


        </div>

      </section>


      {/* ================= LEAD FORM ================= */}

      <section
        className="capture-section"
        id="capture"
      >

        <div className="capture-intro">

          <div className="hero-badge">
            Let's Talk
          </div>

          <h2>
            Have an opportunity?
          </h2>

          <p>
            Tell us a little about yourself.
            Our team will review your request
            and get back to you shortly.
          </p>


          <div className="capture-points">

            <div>
              <span>✓</span>
              Quick response from our team
            </div>

            <div>
              <span>✓</span>
              Your information stays secure
            </div>

            <div>
              <span>✓</span>
              No commitment required
            </div>

          </div>

        </div>


        <div className="lead-form-wrapper">

          <form
            className="lead-form"
            onSubmit={handleSubmit}
          >

            <h3>
              Submit Your Details
            </h3>

            <p>
              Fields marked with *
              are required.
            </p>


            {/* SUCCESS */}

            {success && (

              <div className="success-message">
                {success}
              </div>

            )}


            {/* API ERROR */}

            {error && (

              <div className="error-message">
                {error}
              </div>

            )}


            {/* NAME + EMAIL */}

            <div className="form-row">


              {/* NAME */}

              <div className="form-group">

                <label>
                  Full Name *
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
                  required
                />

                {validationErrors.name && (

                  <span className="field-error">
                    {validationErrors.name}
                  </span>

                )}

              </div>


              {/* EMAIL */}

              <div className="form-group">

                <label>
                  Email *
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
                  placeholder="john@company.com"
                  required
                />

                {validationErrors.email && (

                  <span className="field-error">
                    {validationErrors.email}
                  </span>

                )}

              </div>

            </div>


            {/* PHONE + COMPANY */}

            <div className="form-row">


              {/* PHONE */}

              <div className="form-group">

                <label>
                  Phone
                </label>

                <input
                  type="tel"
                  name="phone"
                  value={
                    formData.phone
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="+91 98765 43210"
                />

                {validationErrors.phone && (

                  <span className="field-error">
                    {validationErrors.phone}
                  </span>

                )}

              </div>


              {/* COMPANY */}

              <div className="form-group">

                <label>
                  Company
                </label>

                <input
                  type="text"
                  name="company"
                  value={
                    formData.company
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Company name"
                />

                {validationErrors.company && (

                  <span className="field-error">
                    {validationErrors.company}
                  </span>

                )}

              </div>

            </div>


            {/* MESSAGE */}

            <div className="form-group">

              <label>
                How can we help?
              </label>

              <textarea
                name="message"
                value={
                  formData.message
                }
                onChange={
                  handleChange
                }
                placeholder="Tell us about your requirements..."
                rows="5"
              />

              {validationErrors.message && (

                <span className="field-error">
                  {validationErrors.message}
                </span>

              )}

            </div>


            {/* SUBMIT */}

            <button
              type="submit"
              className="submit-button"
              disabled={loading}
            >

              {loading
                ? "Submitting..."
                : "Submit Request →"}

            </button>


          </form>

        </div>

      </section>


      {/* ================= FOOTER ================= */}

      <footer className="landing-footer">

        <div className="footer-brand">

          <span className="brand-icon">
            L
          </span>

          <span>
            LeadFlow
          </span>

        </div>


        <p>
          A modern lead management
          platform for growing teams.
        </p>


        <div className="required-credit">

          Built for Digital Heroes Training Task

        </div>


        <a
          href="https://digitalheroesco.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Digital Heroes
        </a>


        <div className="footer-bottom">

          © {new Date().getFullYear()}
          {" "}
          LeadFlow. All rights reserved.

        </div>

      </footer>


    </div>

  );

};


export default Landing;
