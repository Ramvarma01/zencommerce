import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import AddProduct from "./pages/AddProduct";
import Orders from "./pages/Orders";
import Login from "./pages/Login";
import Sidebar from "./components/Sidebar";
import "./styles.css";
import Products from "./pages/Products";
import EditProduct from "./pages/EditProduct";
import NotLoggedIn from "./pages/NotLoggedIn";

function App() {
  const location = useLocation();
  // const onLoginPage = location.pathname === "/";
  // const isLogin = localStorage.getItem("Login");
  const isLogin = sessionStorage.getItem("Login");
  return (
    <div className="app-container">
      {isLogin && (
        <>
          <Sidebar />
          <div className="main-content">
            <Routes>
              {/* <Route path="/" element={<Dashboard />} /> */}
              <Route path="/products" element={<Products />} />
              <Route path="/addproduct" element={<AddProduct />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/products/editproduct" element={<EditProduct />} />

              <Route path="*" element={<Navigate to="/products" replace />} />
            </Routes>
          </div>
        </>
      )}
      <div className="login-container">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="*" element={<NotLoggedIn />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
