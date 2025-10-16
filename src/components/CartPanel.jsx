import React, { useState, useEffect, useRef } from 'react';

const CartPanel = ({ setShowPopup, setLoading }) => {
  const [isOpen, setIsOpen] = useState(false);
  const cartRef = useRef(null);

  const toggleCart = () => {
    setIsOpen(prev => !prev);
  };

  const handlePlaceOrder = () => {
    const cartItems = document.getElementById('cart-items');
    if (!cartItems || cartItems.children.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    // Get cart data from localStorage or Menu component
    const cartData = JSON.parse(localStorage.getItem('cart') || '[]');
    
    if (cartData.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    setLoading(true);
    
    setTimeout(() => {
      // Create new order
      const newOrder = {
        id: Date.now(),
        items: cartData,
        status: 'Pending',
        placedTime: new Date().toISOString(),
        estimatedTime: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes from now
        user: localStorage.getItem('role')
      };

      // Save to orders
      const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      const updatedOrders = [...existingOrders, newOrder];
      localStorage.setItem('orders', JSON.stringify(updatedOrders));

      // Clear cart
      localStorage.removeItem('cart');
      cartItems.innerHTML = '';
      
      setLoading(false);
      setShowPopup(true);
      setIsOpen(false);
      
      console.log('Order placed:', newOrder);
      console.log('All orders:', updatedOrders);
    }, 1500);
  };

  useEffect(() => {
    const cartPanel = cartRef.current;
    if (cartPanel) {
      cartPanel.classList.toggle('open', isOpen);
    }
  }, [isOpen]);

  return (
    <div className="cart-panel" ref={cartRef}>
      <button className="cart-toggle" onClick={toggleCart}>
        <i className="fas fa-shopping-cart"></i>
      </button>
      <div className="cart-content">
        <h2>Your Cart</h2>
        <ul id="cart-items"></ul>
        <button id="place-order" onClick={handlePlaceOrder}>
          Place Order
        </button>
      </div>
    </div>
  );
};

export default CartPanel;
