import { Routes, Route, useLocation, Router } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import AddProduct from './pages/AddProduct';
import Orders from './pages/Orders';
import Login from './pages/Login';
import Sidebar from './components/Sidebar';
import './styles.css';
import Products from './pages/Products';
import EditProduct from './pages/EditProduct'

function App() {
  const location = useLocation();
  const onLoginPage = location.pathname === '/login';

  return (
    <div className="app-container">
      {/* {!onLoginPage && <Sidebar />} */}
      {!onLoginPage && (
        <>
        <Sidebar />
      <div className="main-content">
        {/* <Sidebar /> */}
        <Routes>
            {/* <Route path="/" element={<Dashboard />} /> */}
            <Route path="/" element={<Products />} />
            <Route path="/AddProduct" element={<AddProduct />} />
            {/* <Route path="/Orders" element={<Orders />} /> */}
            <Route path="/Products/EditProduct" element={<EditProduct />} />
            {/* <Route path="/login" element={<Login />} /> */}
      </Routes>
      </div>
      </>
      )}

      {onLoginPage && (
        <div className="login-container">
          <Routes>
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>
      )}
    </div>
  );
}

export default App;
