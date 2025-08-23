import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import loginSideImg from '../assets/login_side.jpg';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    // TODO: Replace with real authentication logic
    if (email === "admin@example.com" && password === "password") {
      setLoading(false);
      // localStorage.setItem("Login", "true");
      sessionStorage.setItem("Login", true);
      navigate("/products");
      setEmail("");
      setPassword("");
    } else {
      setLoading(false);
      setError("Invalid email or password");
    }
  };

  return (
    // <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: '100vh', gap: '20px', width: '100%'}}>
    //  <img src={loginSideImg} alt="Welcome to the Admin Panel" style={{width: '50%', height: '100%', objectFit: 'cover'}} />
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "80vh",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          // padding: "50px",
          padding: "5%",
          borderRadius: "10px",
          boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.1)",
          justifyContent: "center",
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
          gap: "20px  ",
          backgroundColor: "#2D2D3F",
        }}
      >
        <h1 style={{ marginBottom: "20px" }}>Login</h1>
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            minWidth: "300px",
          }}
        >
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ padding: "10px", fontSize: "16px" }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ padding: "10px", fontSize: "16px" }}
          />
          <button
            type="submit"
            className="button-primary"
            disabled={loading}
            style={{ marginTop: "20px" }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
          {error && (
            <div style={{ color: "red", marginTop: "8px" }}>{error}</div>
          )}
        </form>
      </div>
    </div>
    //  </div>
  );
}

export default Login;
