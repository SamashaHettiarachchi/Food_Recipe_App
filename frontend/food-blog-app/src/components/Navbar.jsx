import React from "react";

const Navbar = () => {
  console.log("Navbar component is rendering!"); // Debug log
  return (
    <>
      <header
        style={{
          backgroundColor: "#ffffff",
          padding: "10px",
          borderBottom: "1px solid #ddd",
        }}
      >
        <h2 style={{ color: "black", margin: 0 }}>Food Blog</h2>
        <ul
          style={{
            display: "flex",
            listStyle: "none",
            gap: "20px",
            margin: 0,
            padding: 0,
          }}
        >
          <li style={{ color: "black", cursor: "pointer" }}>Home</li>
          <li style={{ color: "black", cursor: "pointer" }}>my Recipes</li>
          <li style={{ color: "black", cursor: "pointer" }}>Favourite</li>
          <li style={{ color: "black", cursor: "pointer" }}>Login</li>
        </ul>
      </header>
    </>
  );
};

export default Navbar;
