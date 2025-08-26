import React from "react";
import { Link } from "react-router-dom";
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
          // padding: "5%",
          borderRadius: "16px",
          // backgroundColor: "#fff",
          backgroundColor: "#2D2D3F",
          maxWidth: "400px",
          width: "100%",
          boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.1)",
        }}
      >
        <LockTwoToneIcon style={{ fontSize: "120px", color: "#ff4d4f", marginBottom: "20px"}} />
        <h1 style={{ marginBottom: "5px", fontSize: "28px",
          //  color: "#333" 
          //  color: "#7f8c8d" 
           }}>
          Access Denied
        </h1>
        <p style={{ marginBottom: "20px", fontSize: "16px", 
          // color: "#666" 
          color: "#7f8c8d" 
          }}>
          You need to be logged in to access this page
        </p>
        <Link
          to="/"
          style={{
            display: "inline-block",
            padding: "12px 24px",
            borderRadius: "8px",
            // backgroundColor: "#007bff",
            backgroundColor: "#7c4dff",
            color: "#fff",
            textDecoration: "none",
            fontWeight: "600",
            transition: "background 0.3s ease",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#0056b3")}
          // onMouseOut={(e) => (e.target.style.backgroundColor = "#007bff")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#7c4dff")}
        >
          Go to Login
        </Link>
      </div>
    </div>
  );
}

export default NotLoggedIn;
