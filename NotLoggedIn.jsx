import React from "react";
import { Link } from "react-router-dom";
import GppBadIcon from "@mui/icons-material/GppBad";

function NotLoggedIn() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "20px",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <div
        style={{
          textAlign: "center",
          padding: "50px 40px",
          borderRadius: "20px",
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1), 0 8px 16px rgba(0, 0, 0, 0.06)",
          maxWidth: "450px",
          width: "100%",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          animation: "fadeInUp 0.6s ease-out",
        }}
      >
        <div
          style={{
            marginBottom: "30px",
            animation: "bounceIn 0.8s ease-out 0.2s both",
          }}
        >
          <GppBadIcon 
            style={{ 
              fontSize: "140px", 
              color: "#ff4757",
              filter: "drop-shadow(0 4px 8px rgba(255, 71, 87, 0.3))",
            }} 
          />
        </div>
        
        <h1 
          style={{ 
            marginBottom: "15px", 
            fontSize: "32px", 
            fontWeight: "700",
            color: "#2d3436",
            letterSpacing: "-0.5px",
            animation: "fadeInUp 0.6s ease-out 0.4s both",
          }}
        >
          Access Denied
        </h1>
        
        <p 
          style={{ 
            marginBottom: "40px", 
            fontSize: "18px", 
            color: "#636e72",
            lineHeight: "1.6",
            fontWeight: "400",
            animation: "fadeInUp 0.6s ease-out 0.6s both",
          }}
        >
          You need to be logged in to access this page. Please sign in to continue.
        </p>
        
        <Link
          to="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px 32px",
            borderRadius: "12px",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "#fff",
            textDecoration: "none",
            fontWeight: "600",
            fontSize: "16px",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            boxShadow: "0 8px 16px rgba(102, 126, 234, 0.3)",
            border: "none",
            cursor: "pointer",
            position: "relative",
            overflow: "hidden",
            animation: "fadeInUp 0.6s ease-out 0.8s both",
          }}
          onMouseOver={(e) => {
            e.target.style.transform = "translateY(-2px)";
            e.target.style.boxShadow = "0 12px 24px rgba(102, 126, 234, 0.4)";
          }}
          onMouseOut={(e) => {
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "0 8px 16px rgba(102, 126, 234, 0.3)";
          }}
        >
          <span style={{ position: "relative", zIndex: 1 }}>
            Sign In Now
          </span>
        </Link>
        
        <style jsx>{`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes bounceIn {
            0% {
              opacity: 0;
              transform: scale(0.3);
            }
            50% {
              opacity: 1;
              transform: scale(1.05);
            }
            70% {
              transform: scale(0.9);
            }
            100% {
              opacity: 1;
              transform: scale(1);
            }
          }
        `}</style>
      </div>
    </div>
  );
}

export default NotLoggedIn;