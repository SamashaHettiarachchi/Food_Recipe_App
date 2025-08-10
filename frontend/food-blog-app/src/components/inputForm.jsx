import React from "react";
import "./InputForm.css";

function InputForm() {

    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");

  const handleOnSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic
  };

  return (
    <>
      <form className="form" onSubmit={handleOnSubmit}>
        <h2>Login to Your Account</h2>
        <div className="form-control">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            className="input"
            placeholder="Enter your email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-control">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            className="input"
            placeholder="Enter your password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Login</button>
        <p>Don't have an account? Create new account</p>
      </form>
    </>
  );
}

export default InputForm;
