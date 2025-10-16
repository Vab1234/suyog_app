import React, { useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const OrderStatus = () => {
  const [orders, setOrders] = useLocalStorage('orders', []);
  const role = localStorage.getItem('role');

  const generateBillLatex = (order) => {
    const items = order.items.map(item =>
      `${item.name.replace('&', '\\&')} & ₹${item.price} & ${item.notes || 'No notes'} \\\\ \\hline`
    ).join('\n');
    const total = order.items.reduce((sum, item) => sum + parseFloat(item.price), 0);
    return `
\\documentclass[a4paper,12pt]{article}
\\usepackage{geometry}
\\usepackage{array}
\\usepackage{booktabs}
\\geometry{margin=1in}
\\begin{document}
\\begin{center}
{\\LARGE \\textbf{EduEats Order Bill}} \\\\
\\vspace{0.5cm}
{\\large Order \\#${order.id}} \\\\
{\\normalsize Status: ${order.status}} \\\\
\\vspace{0.5cm}
\\begin{tabular}{|l|r|l|}
\\hline
\\textbf{Item} & \\textbf{Price} & \\textbf{Notes} \\\\
\\hline
${items}
\\multicolumn{1}{|r|}{\\textbf{Total}} & \\multicolumn{1}{r|}{₹${total.toFixed(2)}} & \\\\
\\hline
\\end{tabular}
\\vspace{0.5cm}
\\normalsize
VESIT | Hashu Advani Memorial Complex, Chembur, Mumbai, India \\\\
Phone: +91-22-61532532 | Email: vesit@ves.ac.in
\\end{center}
\\end{document}
    `;
  };

  const downloadPDF = (order) => {
    const latexContent = generateBillLatex(order);
    const blob = new Blob([latexContent], { type: 'text/latex' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `order_${order.id}_bill.tex`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCancel = (orderId) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: 'Cancelled' } : o));
    }
  };

  const filteredOrders = orders.filter(order => order.user === role);

  return (
    <main>
      <div className="dashboard-header">
        <div className="avatar">T</div>
        <h1>Order Status</h1>
      </div>
      <button onClick={() => window.location.reload()} className="btn"><i className="fas fa-sync-alt"></i> Refresh</button>
      <div className="dashboard-section">
        <div className="order-cards" id="order-list">
          {filteredOrders.length === 0 ? (
            <p>No orders placed yet.</p>
          ) : (
            filteredOrders.map(order => {
              let statusClass = '';
              let progress = 0;
              switch (order.status) {
                case 'Pending': statusClass = 'pending'; progress = 25; break;
                case 'Preparing': statusClass = 'preparing'; progress = 50; break;
                case 'On the way': statusClass = 'on-the-way'; progress = 75; break;
                case 'Delivered': statusClass = 'delivered'; progress = 100; break;
                case 'Cancelled': statusClass = 'cancelled'; progress = 0; break;
              }
              const placedTime = new Date(order.placedTime).toLocaleString();
              const estimatedTime = new Date(order.estimatedTime).toLocaleString();
              return (
                <div key={order.id} className="order-card">
                  <h3><i className="fas fa-receipt"></i> Order #{order.id}</h3>
                  <span className={`badge ${statusClass}`}>{order.status}</span>
                  <p><strong><i className="fas fa-clock"></i> Placed:</strong> {placedTime}</p>
                  <p><strong><i className="fas fa-hourglass-end"></i> Estimated Delivery:</strong> {estimatedTime}</p>
                  <div className="tracking-steps">
                    <div className={`step ${progress >= 25 ? 'active' : ''}`}><i className="fas fa-shopping-cart"></i> Ordered</div>
                    <div className={`step ${progress >= 50 ? 'active' : ''}`}><i className="fas fa-spinner"></i> Preparing</div>
                    <div className={`step ${progress >= 75 ? 'active' : ''}`}><i className="fas fa-truck"></i> Out for Delivery</div>
                    <div className={`step ${progress >= 100 ? 'active' : ''}`}><i className="fas fa-check-circle"></i> Delivered</div>
                  </div>
                  <div className="progress-bar">
                    <div className="progress" style={{ width: `${progress}%` }}></div>
                  </div>
                  <div className="order-items">
                    {order.items.map((item, index) => (
                      <div key={index} className="order-item">
                        <span className="item-name"><i className="fas fa-utensils"></i> {item.name}</span>
                        <span className="item-price">₹{item.price}</span>
                        <p className="item-notes">Notes: {item.notes || 'No notes'}</p>
                      </div>
                    ))}
                  </div>
                  <button className="btn download-pdf" onClick={() => downloadPDF(order)}><i className="fas fa-file-pdf"></i> Download PDF</button>
                  {order.status === 'Pending' && (
                    <button className="btn cancel-order" onClick={() => handleCancel(order.id)}><i className="fas fa-times"></i> Cancel Order</button>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </main>
  );
};

export default OrderStatus;