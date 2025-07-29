import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AddBoxIcon from "@mui/icons-material/AddBox";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import WarehouseIcon from "@mui/icons-material/Warehouse";

const menuItems = [
  // { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
  { text: "Products", icon: <WarehouseIcon />, path: "/products" },
  { text: "Add Product", icon: <AddBoxIcon />, path: "/AddProduct" },
  { text: "Orders", icon: <ShoppingCartIcon />, path: "/Orders" },
];

const Sidebar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const handleLogout = async () => {
    localStorage.removeItem("adminToken");
    navigate("/");
  };

  const drawerContent = (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-title">Zencommerce</div>
      </div>
      <div className="sidebar-menu">
        {menuItems.map((item) => (
          <Link
            to={item.path}
            key={item.text}
            className="menu-item"
            onClick={() => setMobileOpen(false)}
          >
            <div className="menu-icon">{item.icon}</div>
            <div className="menu-text">{item.text}</div>
          </Link>
        ))}
      </div>
      <button onClick={handleLogout} className="logout-button" type="button">
        {/* <button onClick={() => navigate('/login')} className="logout-button" type="button" > */}
        <div className="menu-icon">
          <LogoutIcon />
        </div>
        <div className="menu-text">Logout</div>
      </button>
    </div>
  );

  return (
    <>
      {/* Mobile header */}
      <div className="mobile-header">
        <button className="mobile-menu-button" onClick={handleDrawerToggle}>
          <MenuIcon />
        </button>
        <div className="sidebar-title">Zencommerce</div>
      </div>

      {/* Mobile overlay */}
      <div
        className={`mobile-overlay ${mobileOpen ? "open" : ""}`}
        onClick={handleDrawerToggle}
      ></div>

      {/* Mobile drawer */}
      <div className={`mobile-drawer ${mobileOpen ? "open" : ""}`}>
        {drawerContent}
      </div>

      {/* Desktop sidebar */}
      <div className="sidebar">{drawerContent}</div>
    </>
  );
};

export default Sidebar;
