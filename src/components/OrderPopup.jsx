import React from 'react';

const OrderPopup = ({ onClose }) => (
  <div className="popup" style={{ display: 'flex' }}>
    <div className="popup-content">
      <h2>Order Placed!</h2>
      <p>Your order has been successfully placed. You'll receive it soon!</p>
      <button onClick={onClose} className="btn">Close</button>
    </div>
  </div>
);

export default OrderPopup;