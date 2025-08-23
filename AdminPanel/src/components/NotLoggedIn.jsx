import React from "react";
import { Link } from "react-router-dom";
import GppBadIcon from "@mui/icons-material/GppBad";

function NotLoggedIn() {
  return (
    <div className="not-logged-in-container">
      <div className="not-logged-in-card">
        <div className="icon-container">
          <GppBadIcon className="security-icon" />
        </div>
        <div className="content">
          <h1 className="title">Access Denied</h1>
          <p className="subtitle">
            You need to be logged in to access this page
          </p>
          <div className="divider"></div>
          <Link to="/" className="login-button">
            <span>Go to Login</span>
            <svg className="arrow-icon" viewBox="0 0 24 24" fill="none">
              <path 
                d="M5 12h14m-7-7l7 7-7 7" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
        <div className="background-pattern"></div>
      </div>
    </div>
  );
}

export default NotLoggedIn;