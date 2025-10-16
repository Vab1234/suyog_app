import React from 'react';
import { Link } from 'react-router-dom';
import foodImage from '../assets/food-image.jpg';

const Home = () => (
  <main>
    <div className="hero-section">
      <div className="hero-content">
        <h1 className="hero-title">Welcome to EduEats</h1>
        <p className="hero-subtitle">Discover delicious meals crafted for your campus lifestyle!</p>
        <div className="hero-buttons">
          <Link to="/menu" className="btn hero-btn" aria-label="Browse Menu"><i className="fas fa-utensils"></i> Browse Menu</Link>
          <Link to="/order-status" className="btn hero-btn" aria-label="Track Orders"><i className="fas fa-truck-loading"></i> Track Orders</Link>
        </div>
      </div>
      <div className="hero-image">
        <img src={foodImage} alt="Delicious Food" className="food-image" />
      </div>
    </div>
  </main>
);

export default Home;