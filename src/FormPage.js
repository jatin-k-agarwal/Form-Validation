import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import countries from "./countries";
import "./FormPage.css";

const initialFormData = {
  firstName: "",
  lastName: "",
  username: "",
  email: "",
  password: "",
  phoneCode: "+91",
  phoneNumber: "",
  country: "",
  city: "",
  pan: "",
  aadhar: "",
};

const FormPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem("formData");
    return saved ? JSON.parse(saved) : initialFormData;
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);

  useEffect(() => {
    localStorage.setItem("formData", JSON.stringify(formData));
  }, [formData]);

  const validateField = useCallback((data) => {
    const errs = {};

    for (const [key, value] of Object.entries(data)) {
      if (!value) errs[key] = "This field is required";
    }

    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
      errs.email = "Invalid email format";

    if (data.phoneNumber && !/^\d{10}$/.test(data.phoneNumber))
      errs.phoneNumber = "Must be a 10-digit number";

    if (data.pan && !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(data.pan))
      errs.pan = "Invalid PAN format (e.g., ABCDE1234F)";

    if (data.aadhar && !/^\d{12}$/.test(data.aadhar))
      errs.aadhar = "Aadhar must be 12 digits";

    return errs;
  }, []);

  const validate = (shouldSetErrors = true) => {
    const validationErrors = validateField(formData);
    if (shouldSetErrors) setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitAttempted(true);

    if (validate(true)) {
      localStorage.removeItem("formData");
      navigate("/success", { state: formData });
    }
  };

  const renderInput = (field, label = null, type = "text") => (
    <div key={field}>
      <label htmlFor={field} className="form-label">
        {label || field.replace(/([A-Z])/g, " $1")}{" "}
        <span className="required">*</span>
      </label>
      <input
        type={type}
        name={field}
        id={field}
        value={formData[field]}
        onChange={handleChange}
        className="form-input"
      />
      {errors[field] && <p className="form-error">{errors[field]}</p>}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h2 className="form-title">User Registration Form</h2>

      {submitAttempted && Object.keys(errors).length > 0 && (
        <div className="form-global-error">
          <p>Please fix the following errors before submitting:</p>
          <ul>
            {Object.entries(errors).map(([field, error]) => (
              <li key={field}>
                <strong>{field.replace(/([A-Z])/g, " $1")}:</strong> {error}
              </li>
            ))}
          </ul>
        </div>
      )}

      {[
        "firstName",
        "lastName",
        "username",
        "email",
        "phoneNumber",
        "pan",
        "aadhar",
      ].map((field) => renderInput(field))}

      <div>
        <label htmlFor="password" className="form-label">
          Password <span className="required">*</span>
        </label>
        <div className="form-password">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            className="form-input"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="toggle-btn"
            aria-label="Toggle password visibility"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        {errors.password && <p className="form-error">{errors.password}</p>}
      </div>

      <div>{renderInput("phoneCode", "Phone Code")}</div>

      <div>
        <label htmlFor="country" className="form-label">
          Country <span className="required">*</span>
        </label>
        <select
          name="country"
          id="country"
          value={formData.country}
          onChange={(e) => {
            const selectedCountry = e.target.value;
            const countryData = countries[selectedCountry] || {};
            setFormData((prev) => ({
              ...prev,
              country: selectedCountry,
              city: "",
              phoneCode: countryData.code || "",
            }));
          }}
          className="form-input"
        >
          <option value="">Select Country</option>
          {Object.keys(countries).map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>

        {errors.country && <p className="form-error">{errors.country}</p>}
      </div>

      <div>
        <label htmlFor="city" className="form-label">
          City <span className="required">*</span>
        </label>
        <select
          name="city"
          id="city"
          value={formData.city}
          onChange={handleChange}
          className="form-input"
          disabled={!formData.country}
        >
          <option value="">Select City</option>
          {formData.country &&
            (countries[formData.country]?.cities || []).map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
        </select>
        {errors.city && <p className="form-error">{errors.city}</p>}
      </div>

      <button type="submit" className="submit-btn">
        Submit
      </button>
    </form>
  );
};

export default FormPage;
