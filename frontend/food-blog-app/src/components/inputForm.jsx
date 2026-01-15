import React from "react";
import "./InputForm.css";
import axios from "axios";
import { API_BASE_URL } from "../config";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

function InputForm({ setIsOpen }) {
  const { login } = useAuth();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isSignUp, setIsSignUp] = React.useState(false);
  const [error, setError] = React.useState("");
  const { showToast } = useToast();

  // Debug logging
  console.log("InputForm rendered - email:", email, "password:", password);

  const handleEmailChange = (e) => {
    console.log("Email changing to:", e.target.value);
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    console.log("Password changing to:", e.target.value);
    setPassword(e.target.value);
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    try {
      let endpoint = isSignUp ? "signUp" : "login";
      const response = await axios.post(
        `${API_BASE_URL}/api/user/${endpoint}`,
        {
          email,
          password,
        }
      );

      // Store token and user data
      console.log(
        "Login/Signup response data:",
        JSON.stringify(response.data, null, 2)
      );
      console.log("Response data object:", response.data);
      console.log("Token:", response.data.token);
      console.log("User:", response.data.user);

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        console.log("Token stored in localStorage");
      }
      if (response.data.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
        console.log("User data stored in localStorage:", response.data.user);
      }

      // Use AuthContext login method to update global state
      if (response.data.token && response.data.user) {
        console.log("Calling AuthContext login method");
        login(response.data.token, response.data.user);
        console.log("AuthContext login method called successfully");
      } else {
        console.error("Missing token or user data in response:", {
          token: response.data.token,
          user: response.data.user,
          fullResponse: response.data,
        });
      }

      showToast(
        "success",
        isSignUp ? "Account created successfully!" : "Login successful!"
      );

      // Clear form fields
      setEmail("");
      setPassword("");

      // Close the modal
      if (setIsOpen && typeof setIsOpen === "function") {
        setIsOpen();
      }
    } catch (error) {
      console.error("Error:", error);
      const errorMessage = error.response?.data?.message || "An error occurred";
      setError(errorMessage);
      showToast("error", errorMessage);
    }
  };

  return (
    <>
      <form className="form" onSubmit={handleOnSubmit}>
        <h2>{isSignUp ? "Create New Account" : "Login to Your Account"}</h2>

        {error && <div className="error">{error}</div>}

        <div className="form-control">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            className="input"
            placeholder="Enter your email"
            value={email}
            required
            onChange={handleEmailChange}
            onClick={() => console.log("Email input clicked")}
            onFocus={() => console.log("Email input focused")}
          />
        </div>
        <div className="form-control">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            className="input"
            placeholder="Enter your password"
            value={password}
            required
            onChange={handlePasswordChange}
            onClick={() => console.log("Password input clicked")}
            onFocus={() => console.log("Password input focused")}
          />
        </div>
     
        <div>
          <label>Input</label>
          <input
          type="input"
            id="input"
            className="input"
            placeholder="Enter the input"
            value={input}
            required
            onChange={handlePasswordChange}
            onClick={() => console.log("Password input clicked")}
            onFocus={() => console.log("Password input focused")}
          
          />
        </div>
        <button type="submit">{isSignUp ? "Sign Up" : "Login"}</button>
        <p onClick={() => setIsSignUp((prev) => !prev)}>
          {isSignUp
            ? "Already have an account? Login"
            : "Don't have an account? Create new account"}
        </p>
      </form>
    </>
  );
}

export default InputForm;
