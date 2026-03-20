import React from 'react';

const VendorDashboard = () => {
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <div className="app-container" style={{flexDirection: 'column'}}>
      <h1>This is Vendor page</h1>
      <button onClick={handleLogout} className="auth-btn" style={{width: '200px'}}>Logout</button>
    </div>
  );
};

export default VendorDashboard;
