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
          <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
          </Routes>
          </BrowserRouter>
        </div>
      )}

      {!onLoginPage && (
        <>
          <Sidebar />
          <div className="main-content">
            {/* <Sidebar /> */}
            <BrowserRouter>
            <Routes>
              {/* <Route path="/" element={<Dashboard />} /> */}
              <Route path="/Products" element={<Products />} />
              <Route path="/AddProduct" element={<AddProduct />} />
              <Route path="/Orders" element={<Orders />} />
              <Route path="/Products/EditProduct" element={<EditProduct />} />
              {/* <Route path="/login" element={<Login />} /> */}
            </Routes>
            </BrowserRouter>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
