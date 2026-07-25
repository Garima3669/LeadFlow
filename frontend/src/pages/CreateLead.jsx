import { useState } from "react";
import { useNavigate } from "react-router-dom";

import API from "../services/api";

import "../styles/CreateLead.css";

const CreateLead = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    source: "",
    message: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    source: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Validate all form fields
  const validateForm = () => {
    const newErrors = {
      name: "",
      email: "",
      phone: "",
      company: "",
      source: "",
      message: "",
    };

    const name = formData.name.trim();
    const email = formData.email.trim();
    const phone = formData.phone.trim();
    const company = formData.company.trim();
    const source = formData.source;
    const message = formData.message.trim();

    // Name validation
    if (!name) {
      newErrors.name = "Full name is required.";
    } else if (name.length < 2) {
      newErrors.name =
        "Name must be at least 2 characters.";
    } else if (name.length > 50) {
      newErrors.name =
        "Name must not exceed 50 characters.";
    } else if (
      !/^[A-Za-z]+(?:[\s'-][A-Za-z]+)*$/.test(name)
    ) {
      newErrors.name =
        "Name can contain only letters, spaces, hyphens and apostrophes.";
    }

    // Email validation
    if (!email) {
      newErrors.email =
        "Email address is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)
    ) {
      newErrors.email =
        "Please enter a valid email address.";
    } else if (email.length > 100) {
      newErrors.email =
        "Email must not exceed 100 characters.";
    }

    // Phone validation
    if (!phone) {
      newErrors.phone =
        "Phone number is required.";
    } else if (
      !/^(\+91|91)?[6-9]\d{9}$/.test(
        phone.replace(/[\s-]/g, "")
      )
    ) {
      newErrors.phone =
        "Please enter a valid 10-digit Indian mobile number.";
    }

    // Company validation
    if (company) {
      if (company.length < 2) {
        newErrors.company =
          "Company name must be at least 2 characters.";
      } else if (company.length > 100) {
        newErrors.company =
          "Company name must not exceed 100 characters.";
      }
    }

    // Source validation
    const allowedSources = [
      "WEBSITE",
      "REFERRAL",
      "LINKEDIN",
      "COLD_CALL",
      "OTHER",
    ];

    if (
      source &&
      !allowedSources.includes(source)
    ) {
      newErrors.source =
        "Please select a valid lead source.";
    }

    // Message validation
    if (message.length > 500) {
      newErrors.message =
        "Message must not exceed 500 characters.";
    }

    setErrors(newErrors);

    return !Object.values(newErrors).some(
      (error) => error !== ""
    );
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    // Clear field-specific validation error
    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));

    // Clear general API error
    if (error) {
      setError("");
    }

    // Clear success message
    if (success) {
      setSuccess("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    // Stop submission if validation fails
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      // Send trimmed values to backend
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        company: formData.company.trim(),
        source: formData.source,
        message: formData.message.trim(),
      };

      const response = await API.post(
        "/leads/public",
        payload
      );

      if (response.data.success) {
        setSuccess(
          "Lead created successfully."
        );

        setTimeout(() => {
          navigate("/leads");
        }, 1000);
      }
    } catch (error) {
      console.error(
        "Create lead error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to create lead."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-lead-page">

      <div className="create-lead-header">

        <div>
          <button
            type="button"
            className="back-btn"
            onClick={() =>
              navigate("/leads")
            }
          >
            ← Back to Leads
          </button>

          <h2>
            Create New Lead
          </h2>

          <p>
            Add a new sales opportunity
            to your pipeline.
          </p>
        </div>

      </div>

      <div className="create-lead-card">

        <form
          onSubmit={handleSubmit}
          noValidate
        >

          {/* General API Error */}
          {error && (
            <div className="form-error">
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="form-success">
              {success}
            </div>
          )}

          <div className="form-grid">

            {/* Full Name */}
            <div className="form-group">

              <label htmlFor="name">
                Full Name *
              </label>

              <input
                id="name"
                type="text"
                name="name"
                placeholder="Enter lead name"
                value={formData.name}
                onChange={handleChange}
                maxLength={50}
                autoComplete="name"
                className={
                  errors.name
                    ? "input-error"
                    : ""
                }
              />

              {errors.name && (
                <span className="field-error">
                  {errors.name}
                </span>
              )}

            </div>

            {/* Email */}
            <div className="form-group">

              <label htmlFor="email">
                Email *
              </label>

              <input
                id="email"
                type="email"
                name="email"
                placeholder="Enter email address"
                value={formData.email}
                onChange={handleChange}
                maxLength={100}
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

            {/* Phone */}
            <div className="form-group">

              <label htmlFor="phone">
                Phone *
              </label>

              <input
                id="phone"
                type="tel"
                name="phone"
                placeholder="Enter 10-digit mobile number"
                value={formData.phone}
                onChange={handleChange}
                maxLength={13}
                autoComplete="tel"
                className={
                  errors.phone
                    ? "input-error"
                    : ""
                }
              />

              {errors.phone && (
                <span className="field-error">
                  {errors.phone}
                </span>
              )}

            </div>

            {/* Company */}
            <div className="form-group">

              <label htmlFor="company">
                Company
              </label>

              <input
                id="company"
                type="text"
                name="company"
                placeholder="Enter company name"
                value={formData.company}
                onChange={handleChange}
                maxLength={100}
                autoComplete="organization"
                className={
                  errors.company
                    ? "input-error"
                    : ""
                }
              />

              {errors.company && (
                <span className="field-error">
                  {errors.company}
                </span>
              )}

            </div>

            {/* Lead Source */}
            <div className="form-group">

              <label htmlFor="source">
                Lead Source
              </label>

              <select
                id="source"
                name="source"
                value={formData.source}
                onChange={handleChange}
                className={
                  errors.source
                    ? "input-error"
                    : ""
                }
              >

                <option value="">
                  Select source
                </option>

                <option value="WEBSITE">
                  Website
                </option>

                <option value="REFERRAL">
                  Referral
                </option>

                <option value="LINKEDIN">
                  LinkedIn
                </option>

                <option value="COLD_CALL">
                  Cold Call
                </option>

                <option value="OTHER">
                  Other
                </option>

              </select>

              {errors.source && (
                <span className="field-error">
                  {errors.source}
                </span>
              )}

            </div>

          </div>

          {/* Message */}
          <div className="form-group">

            <label htmlFor="message">
              Requirement / Message
            </label>

            <textarea
              id="message"
              name="message"
              rows="5"
              placeholder="Describe the lead's requirement..."
              value={formData.message}
              onChange={handleChange}
              maxLength={500}
              className={
                errors.message
                  ? "input-error"
                  : ""
              }
            />

            <div className="field-footer">

              {errors.message && (
                <span className="field-error">
                  {errors.message}
                </span>
              )}

              <span className="character-count">
                {formData.message.length}/500
              </span>

            </div>

          </div>

          {/* Form Actions */}
          <div className="form-actions">

            <button
              type="button"
              className="cancel-btn"
              onClick={() =>
                navigate("/leads")
              }
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="submit-lead-btn"
              disabled={loading}
            >
              {loading
                ? "Creating..."
                : "Create Lead"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default CreateLead;
