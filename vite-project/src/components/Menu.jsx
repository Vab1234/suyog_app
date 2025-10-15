import React, { useState, useEffect } from 'react';
import { menuData } from '../data/menuData';

// Ensure each item has a unique ID
const foodItems = menuData.flatMap((category, ci) =>
  category.items.map((item, ii) => ({
    ...item,
    id: item.id || `${ci}-${ii}`,
  }))
);

const Menu = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [cart, setCart] = useState(() =>
    JSON.parse(localStorage.getItem('cart')) || []
  );
  const [notes, setNotes] = useState({});

  // Persist cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Update cart items in DOM for CartPanel
  useEffect(() => {
    const cartItems = document.getElementById('cart-items');
    if (cartItems) {
      cartItems.innerHTML = '';
      cart.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `
          ${item.name} x${item.quantity} - ₹${(item.price * item.quantity).toFixed(2)}
          ${item.notes ? `<br><small>Notes: ${item.notes}</small>` : ''}
        `;
        cartItems.appendChild(li);
      });
    }
  }, [cart]);

  const filteredItems = foodItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || item.type === filter;
    return matchesSearch && matchesFilter;
  });

  const handleAddToCart = (item, e) => {
    const button = e.currentTarget;
    // Flying animation
    const cartToggle = document.querySelector('.cart-toggle');
    if (cartToggle && button) {
      const cartRect = cartToggle.getBoundingClientRect();
      const buttonRect = button.getBoundingClientRect();
      const flyingItem = document.createElement('div');
      flyingItem.className = 'flying-item';
      flyingItem.textContent = item.name;
      flyingItem.style.position = 'fixed';
      flyingItem.style.zIndex = '1000';
      flyingItem.style.pointerEvents = 'none';
      flyingItem.style.left = `${buttonRect.left + buttonRect.width / 2}px`;
      flyingItem.style.top = `${buttonRect.top + buttonRect.height / 2}px`;
      flyingItem.style.transition = 'all 0.6s ease';
      document.body.appendChild(flyingItem);
      setTimeout(() => {
        flyingItem.style.left = `${cartRect.left + cartRect.width / 2}px`;
        flyingItem.style.top = `${cartRect.top + cartRect.height / 2}px`;
        flyingItem.style.opacity = '0';
        flyingItem.style.transform = 'scale(0.5)';
      }, 10);
      setTimeout(() => {
        flyingItem.remove();
      }, 600);
    }

    // Add to cart logic
    setCart(prev => {
      const idx = prev.findIndex(ci => ci.id === item.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = {
          ...updated[idx],
          quantity: updated[idx].quantity + 1,
          notes: notes[item.id] || updated[idx].notes || ''
        };
        return updated;
      }
      return [...prev, { ...item, quantity: 1, notes: notes[item.id] || '' }];
    });
  };

  const handleNoteChange = (itemId, value) => {
    setNotes(prev => ({ ...prev, [itemId]: value }));
  };

  return (
    <main className="page menu-page">
      <section className="menu-header">
        <h1><i className="fas fa-utensils"></i> Menu</h1>
        <p>Explore our delicious offerings</p>
      </section>
      <div className="menu-controls">
        <input
          type="text"
          className="search-bar"
          placeholder="Search menu items..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <div className="filter-bar">
          <button className={`filter-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All</button>
          <button className={`filter-btn ${filter === 'veg' ? 'active' : ''}`} onClick={() => setFilter('veg')}>Veg</button>
          <button className={`filter-btn ${filter === 'non-veg' ? 'active' : ''}`} onClick={() => setFilter('non-veg')}>Non-Veg</button>
        </div>
      </div>
      <div className="items-grid">
        {filteredItems.map(item => (
          <div key={item.id} className="item">
            <h3>
              {item.name}
              <span className={`item-type ${item.type}`}></span>
            </h3>
            <p className="item-description">{item.description}</p>
            <p className="price">₹{item.price}</p>
            <div className="item-actions">
              <input
                type="text"
                className="item-notes"
                placeholder="Add notes..."
                value={notes[item.id] || ''}
                onChange={e => handleNoteChange(item.id, e.target.value)}
              />
              <button className="add-to-cart" onClick={e => handleAddToCart(item, e)}>
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default Menu;
