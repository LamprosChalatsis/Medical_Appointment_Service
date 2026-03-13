import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import FailAlert from "../../components/FailAlert";
import { Login } from "../../api/auth";

export default function LogIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();



  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || !role) return;

    if (role === "ROLE_DOCTOR") navigate("/dashboard/doctor");
    else if (role === "ROLE_PATIENT") navigate("/dashboard/patient");
    else if (role === "ROLE_ADMIN") navigate("/dashboard/admin");
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const data = await Login(username, password);
      const role = data.roles?.[0];

      if (role === "ROLE_DOCTOR") {
        navigate("/dashboard/doctor");
      } else if (role === "ROLE_PATIENT") {
        navigate("/dashboard/patient");
      } else if (role === "ROLE_ADMIN") {
        navigate("/dashboard/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      setErrorMessage(err.message || "Login failed");
    }
  };

  return (
    <StyledWrapper>
      <form className="form" onSubmit={handleSubmit}>
        {errorMessage && (
          <FailAlert
            message={errorMessage}
            onClose={() => setErrorMessage("")}
          />
        )}

        <p className="form-title">Sign in to your account</p>

        <div className="input-container">
          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="input-container password-container">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="button"
            className="toggle-password"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>



        <button type="submit" className="submit">
          Sign in
        </button>

        <p className="signup-link">
          No account? <Link to="/register">Sign up</Link>
        </p>
      </form>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f3f4f6;

  .form {
    background-color: #fff;
    display: block;
    padding: 1rem;
    max-width: 350px;
    border-radius: 0.5rem;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
      0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }

  .form-title {
    font-size: 1.25rem;
    font-weight: 600;
    text-align: center;
    color: #000;
  }

  .input-container input {
    background-color: #fff;
    padding: 1rem;
    font-size: 0.875rem;
    width: 300px;
    border-radius: 0.5rem;
    border: 1px solid #e5e7eb;
    margin: 8px 0;
  }

  .submit {
    display: block;
    padding: 0.75rem 1.25rem;
    background-color: #4f46e5;
    color: #ffffff;
    font-size: 0.875rem;
    font-weight: 500;
    width: 100%;
    border-radius: 0.5rem;
    text-transform: uppercase;
    border: none;
    cursor: pointer;
  }

  .submit:hover {
    background-color: #4338ca;
  }

  .signup-link {
    color: #6b7280;
    font-size: 0.875rem;
    text-align: center;
  }

  .signup-link a {
    text-decoration: underline;
  }
    .password-container {
  position: relative;
  }

  .toggle-password {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    font-size: 0.9rem;
    color: #555;
  }

  .toggle-password:hover {
    color: #111;
  }
`;