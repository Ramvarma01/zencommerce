import { useState, useEffect } from "react";

function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('/api/dashboard');
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data');
        }
        const data = await response.json();
        setDashboardData(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, []);
  
  return (
    <div className="form-container">
      <div className="form-header">
        <h1 className="form-title">Admin Dashboard</h1>
        <p className="form-subtitle">
          Welcome to your Zencommerce admin panel
        </p>
      </div>
      
      <div className="form-grid">
        <div className="form-card">
          <div className="card-title">
            <span className="card-title-icon">{/* You can use a DashboardIcon here if you want */}</span>
            Dashboard Overview
          </div>
          <p>Dashboard content will go here...</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
