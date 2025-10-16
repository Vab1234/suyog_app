import React from 'react';
import { Link } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage';

const TeacherDashboard = () => {
  const [orders, setOrders] = useLocalStorage('orders', []);
  const [favorites] = useLocalStorage('favorites', []);

  const generateBillLatex = (order) => {
    const items = order.items.map(item =>
      `${item.name.replace('&', '\\&')} & ₹${item.price} & ${item.notes || 'No notes'} \\\\ \\hline`
    ).join('\n');
    const total = order.items.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0);
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

  const handleClearHistory = () => {
    setOrders(orders.filter(order => order.user !== 'teacher'));
  };

  const filteredOrders = orders.filter(order => order.user === 'teacher');

  return (
    <main>
      <div className="dashboard-header">
        <div className="avatar">T</div>
        <h1>Welcome, Teacher!</h1>
        <Link to="/menu" className="btn quick-order"><i className="fas fa-utensils"></i> Quick Order</Link>
      </div>
      <div className="dashboard-grid">
        <div className="dashboard-section">
          <h2>Your Favorites</h2>
          <div className="card" id="favorites-list">
            {favorites.length === 0 ? (
              <p>No favorites added yet.</p>
            ) : (
              favorites.map((name, index) => (
                <div key={index} className="favorite-card">
                  <i className="fas fa-heart favorite-icon"></i>
                  <h3>{name}</h3>
                  <Link to="/menu" className="btn"><i className="fas fa-utensils"></i> Order Now</Link>
                </div>
              ))
            )}
          </div>
        </div>
        <div className="dashboard-section">
          <h2>
            Order History <button onClick={handleClearHistory} className="btn"><i className="fas fa-trash"></i> Clear History</button>
          </h2>
          <div className="card" id="order-history">
            {filteredOrders.length === 0 ? (
              <p>No orders placed yet.</p>
            ) : (
              filteredOrders.map(order => {
                let statusIcon = '';
                switch (order.status) {
                  case 'Pending': statusIcon = <i className="fas fa-hourglass-start status-icon pending"></i>; break;
                  case 'Preparing': statusIcon = <i className="fas fa-spinner status-icon preparing"></i>; break;
                  case 'On the way': statusIcon = <i className="fas fa-truck status-icon on-the-way"></i>; break;
                  case 'Delivered': statusIcon = <i className="fas fa-check-circle status-icon delivered"></i>; break;
                  case 'Cancelled': statusIcon = <i className="fas fa-times-circle status-icon cancelled"></i>; break;
                  default: statusIcon = null;
                }
                return (
                  <div key={order.id} className="order-card">
                    {statusIcon}
                    <h3><i className="fas fa-receipt"></i> Order #{order.id}</h3>
                    <p><strong>Status:</strong> {order.status}</p>
                    <div className="order-items">
                      {order.items.map((item, index) => (
                        <div key={index} className="order-item">
                          <span className="item-name"><i className="fas fa-utensils"></i> {item.name}</span>
                          <span className="item-price">₹{item.price * item.quantity}</span>
                          <p className="item-notes">Notes: {item.notes || 'No notes'}</p>
                        </div>
                      ))}
                    </div>
                    <button className="btn download-pdf" onClick={() => downloadPDF(order)}><i className="fas fa-file-pdf"></i> Download PDF</button>
                  </div>
                );
              })
            )}
          </div>
        </div>
        <div className="dashboard-section">
          <h2>Recent Activity</h2>
          <div className="card">
            <ul id="recent-activity">
              <li>No recent activity available.</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
};

export default TeacherDashboard;
