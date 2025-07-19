function Orders() {
  return (
    <div className="form-container">
      <div className="form-header">
        <h1 className="form-title">Orders Management</h1>
        <p className="form-subtitle">
          View and manage all customer orders
        </p>
      </div>
      
      <div className="form-grid">
        <div className="form-card">
          <div className="card-title">
            <div className="card-title-icon icon-orders"></div>
            Orders Overview
          </div>
          <p>Orders content will go here...</p>
        </div>
      </div>
    </div>
  );
}

export default Orders;