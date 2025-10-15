import React, { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const AdminDashboard = () => {
  const [orders, setOrders] = useLocalStorage('orders', []);
  const [filterText, setFilterText] = useState('');
  const [sortOption, setSortOption] = useState('id-asc');

  const renderOrders = () => {
    let filtered = orders.filter(order =>
      order.id.toString().includes(filterText) ||
      order.status.toLowerCase().includes(filterText.toLowerCase())
    ).sort((a, b) => {
      if (sortOption === 'id-asc') return a.id - b.id;
      if (sortOption === 'id-desc') return b.id - a.id;
      if (sortOption === 'status') return a.status.localeCompare(b.status);
      if (sortOption === 'time-asc') return new Date(a.placedTime) - new Date(b.placedTime);
      if (sortOption === 'time-desc') return new Date(b.placedTime) - new Date(a.placedTime);
      return 0;
    });

    return filtered.map(order => {
      let statusIcon = '';
      switch (order.status) {
        case 'Pending': statusIcon = '<i class="fas fa-hourglass-start status-icon-table pending"></i>'; break;
        case 'Preparing': statusIcon = '<i class="fas fa-spinner status-icon-table preparing"></i>'; break;
        case 'On the way': statusIcon = '<i class="fas fa-truck status-icon-table on-the-way"></i>'; break;
        case 'Delivered': statusIcon = '<i class="fas fa-check-circle status-icon-table delivered"></i>'; break;
        case 'Cancelled': statusIcon = '<i class="fas fa-times-circle status-icon-table cancelled"></i>'; break;
      }
      return (
        <tr key={order.id}>
          <td>{order.id}</td>
          <td dangerouslySetInnerHTML={{ __html: `${statusIcon} ${order.status}` }}></td>
          <td>{order.items.map(item => `<i class="fas fa-utensils"></i> ${item.name} (₹${item.price})`).join(', ')}</td>
          <td>{new Date(order.placedTime).toLocaleString()}</td>
          <td>{new Date(order.estimatedTime).toLocaleString()}</td>
          <td>
            <select
              className="status-select"
              value={order.status}
              onChange={(e) => {
                setOrders(orders.map(o => o.id === order.id ? { ...o, status: e.target.value } : o));
              }}
            >
              {['Pending', 'Preparing', 'On the way', 'Delivered', 'Cancelled'].map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
            <button
              className="action-btn delete-btn"
              onClick={() => {
                if (window.confirm(`Are you sure you want to delete Order #${order.id}?`)) {
                  setOrders(orders.filter(o => o.id !== order.id));
                }
              }}
            >
              <i className="fas fa-trash"></i>
            </button>
          </td>
        </tr>
      );
    });
  };

  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'Pending').length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.items.reduce((itemSum, item) => itemSum + parseFloat(item.price), 0), 0);
  const itemCounts = {};
  orders.forEach(order => {
    order.items.forEach(item => {
      itemCounts[item.name] = (itemCounts[item.name] || 0) + 1;
    });
  });
  const popularItem = Object.entries(itemCounts).reduce((a, b) => a[1] > b[1] ? a : b, ['None', 0])[0];

  return (
    <main>
      <div className="dashboard-header">
        <div className="avatar"><i className="fas fa-user-cog"></i></div>
        <h1><i className="fas fa-tachometer-alt"></i> Admin Dashboard</h1>
      </div>
      <div className="dashboard-section">
        <h2><i className="fas fa-clipboard-list"></i> Order Management</h2>
        <div className="card">
          <div className="table-controls">
            <input
              type="text"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              placeholder="Search orders by ID or status..."
              className="search-bar"
            />
            <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
              <option value="id-asc">Sort by ID (Ascending)</option>
              <option value="id-desc">Sort by ID (Descending)</option>
              <option value="status">Sort by Status</option>
              <option value="time-asc">Sort by Time (Ascending)</option>
              <option value="time-desc">Sort by Time (Descending)</option>
            </select>
          </div>
          <div className="table-responsive">
            <table id="admin-order-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Status</th>
                  <th>Items</th>
                  <th>Placed Time</th>
                  <th>Estimated Delivery</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>{renderOrders()}</tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="dashboard-section">
        <h2><i className="fas fa-chart-line"></i> Analytics Overview</h2>
        <div className="dashboard-grid">
          <div className="card analytics-card">
            <i className="fas fa-shopping-cart analytics-icon"></i>
            <h3>Total Orders</h3>
            <p>{totalOrders}</p>
          </div>
          <div className="card analytics-card">
            <i className="fas fa-hourglass-half analytics-icon"></i>
            <h3>Pending Orders</h3>
            <p>{pendingOrders}</p>
          </div>
          <div className="card analytics-card">
            <i className="fas fa-rupee-sign analytics-icon"></i>
            <h3>Revenue</h3>
            <p>₹{totalRevenue.toFixed(2)}</p>
          </div>
          <div className="card analytics-card">
            <i className="fas fa-star analytics-icon"></i>
            <h3>Popular Item</h3>
            <p>{popularItem}</p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AdminDashboard;