import { Routes, Route, useLocation, Router, BrowserRouter } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import AddProduct from "./pages/AddProduct";
import Orders from "./pages/Orders";
import Login from "./pages/Login";
import Sidebar from "./components/Sidebar";
import "./styles.css";
import Products from "./pages/Products";
import EditProduct from "./pages/EditProduct";

function App() {
  const location = useLocation();
  const onLoginPage = location.pathname === "/";

  return (
    <div className="app-container">
      {/* {!onLoginPage && <Sidebar />} */}

      {onLoginPage && (
        <div className="login-container">
          <Routes>
            <Route path="/" element={<Login />} />
          </Routes>
        </div>
      )}

      {!onLoginPage && (
        <>
          <Sidebar />
          <div className="main-content">
            {/* <Sidebar /> */}
            <Routes>
              {/* <Route path="/" element={<Dashboard />} /> */}
              <Route path="/products" element={<Products />} />
              <Route path="/addproduct" element={<AddProduct />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/products/editproduct" element={<EditProduct />} />
              {/* <Route path="/login" element={<Login />} /> */}
            </Routes>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
