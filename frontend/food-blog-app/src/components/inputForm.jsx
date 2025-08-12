import React from "react";
import "./InputForm.css";
import axios from "axios";

function InputForm({ setIsOpen }) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isSignUp, setIsSignUp] = React.useState(false);
  const [error, setError] = React.useState("");

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
        `http://localhost:5000/api/user/${endpoint}`,
        {
          email,
          password,
        }
      );

      // Store token and user data
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }
      if (response.data.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }

      console.log("Success:", response.data);
      alert(isSignUp ? "Account created successfully!" : "Login successful!");
      
      // Clear form fields
      setEmail("");
      setPassword("");
      
      // Call the success callback function passed from parent
      if (setIsOpen && typeof setIsOpen === 'function') {
        setIsOpen(); // This will trigger navigation to add recipe page
      }
    } catch (error) {
      console.error("Error:", error);
      const errorMessage = error.response?.data?.message || "An error occurred";
      setError(errorMessage);
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
