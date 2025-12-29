import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav
      style={{
        backgroundColor: "#fff",
        borderBottom: "1px solid #e5e7eb",
        padding: "1rem 0",
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <Link
          to="/"
          style={{
            fontSize: "1.5rem",
            fontWeight: "bold",
            color: "var(--text-color)",
            textDecoration: "none",
          }}
        >
          AI Content <span style={{ color: "var(--primary-color)" }}>Hub</span>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
