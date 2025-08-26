import React from "react";
import { Link } from "react-router-dom";
import GppMaybeTwoToneIcon from '@mui/icons-material/GppMaybeTwoTone';
import HttpsIcon from '@mui/icons-material/Https';
import LockTwoToneIcon from '@mui/icons-material/LockTwoTone';

function NotLoggedIn() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          textAlign: "center",
          padding: "40px",
          borderRadius: "16px",
          backgroundColor: "#fff",
          maxWidth: "400px",
          width: "100%",
        }}
      >
        <LockTwoToneIcon style={{ fontSize: "120px", color: "#ff4d4f", marginBottom: "20px"}} />
        <h1 style={{ marginBottom: "10px", fontSize: "28px", color: "#333" }}>
          Access Denied
        </h1>
        <p style={{ marginBottom: "30px", fontSize: "16px", color: "#666" }}>
          You need to be logged in to access this page
        </p>
        <Link
          to="/"
          style={{
            display: "inline-block",
            padding: "12px 24px",
            borderRadius: "8px",
            backgroundColor: "#007bff",
            color: "#fff",
            textDecoration: "none",
            fontWeight: "600",
            transition: "background 0.3s ease",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#0056b3")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#007bff")}
        >
          Go to Login
        </Link>
      </div>
    </div>
  );
}

export default NotLoggedIn;
