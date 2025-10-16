import React from 'react';

const Footer = () => (
  <footer className="site-footer" role="contentinfo">
    <div className="footer-content">
      <div className="footer-info">
        <h3><i className="fas fa-utensils"></i> EduEats</h3>
        <p><i className="fas fa-map-marker-alt"></i> VESIT | Hashu Advani Memorial Complex, Chembur, Mumbai, India</p>
        <p><i className="fas fa-phone"></i> Phone: +91-22-61532532 | <i className="fas fa-envelope"></i> Email: vesit@ves.ac.in</p>
      </div>
      <div className="footer-links" aria-label="Quick Links">
        <h4><i className="fas fa-link"></i> Quick Links</h4>
        <ul>
          <li>
            <a href="/home"><i className="fas fa-home"></i> Home</a>
          </li>
          <li>
            <a href="/menu"><i className="fas fa-utensils"></i> Menu</a>
          </li>
          <li>
            <a href="/order-status"><i className="fas fa-clipboard-list"></i> Order Status</a>
          </li>
        </ul>
      </div>
      <div className="footer-social" aria-label="Social Media Links">
        <h4><i className="fas fa-share-alt"></i> Connect With Us</h4>
        <div className="social-icons">
          <a href="#" aria-label="Facebook" rel="noopener noreferrer">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a href="#" aria-label="Twitter" rel="noopener noreferrer">
            <i className="fab fa-twitter"></i>
          </a>
          <a href="#" aria-label="Instagram" rel="noopener noreferrer">
            <i className="fab fa-instagram"></i>
          </a>
        </div>
      </div>
    </div>
    <div className="footer-bottom">
      <p>&copy; 2025 EduEats. All rights reserved. <i className="fas fa-heart" style={{color: '#ff4d4d'}}></i> Made with love</p>
    </div>
  </footer>
);

export default Footer;
