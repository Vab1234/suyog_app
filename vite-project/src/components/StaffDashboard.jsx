import React from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const StaffDashboard = () => {
  const [orders, setOrders] = useLocalStorage('orders', []);

  const handleStatusChange = (orderId, newStatus) => {
    setOrders(orders.map(order => order.id === orderId ? { ...order, status: newStatus } : order));
  };

  return (
    <main>
      <canvas id="background-canvas"></canvas>
      <div className="dashboard-header">
        <div className="avatar">S</div>
        <h1>Canteen Staff Dashboard</h1>
      </div>
      <div className="dashboard-section">
        <h2>New Orders</h2>
        <div className="card" id="staff-order-list">
          {orders.length === 0 ? (
            <p>No orders available.</p>
          ) : (
            <ul>
              {orders.map(order => (
                <li key={order.id}>
                  <i className="fas fa-receipt"></i> Order #{order.id} - Status: {order.status}<br />
                  Items: {order.items.map(item => `<i class="fas fa-utensils"></i> ${item.name} (₹${item.price}, ${item.notes || 'No notes'})`).join(', ')}
                  <select
                    className="status-select"
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                  >
                    {['Pending', 'Preparing', 'On the way', 'Delivered', 'Cancelled'].map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
};

export default StaffDashboard;