import React from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import logo from '../assets/vesit-logo.png';

const Header = ({ role, onLogout, theme, setTheme }) => {
  return (
    <header>
      <img src={logo} alt="VESIT Logo" className="logo" />
      <nav>
        <ul>
          <li><Link to="/home">Home</Link></li>
          <li><Link to="/menu">Menu</Link></li>
          <li><Link to="/order-status">Order Status</Link></li>
          {role && <li><Link to={`/${role}-dashboard`}><i className={`fas fa-${role === 'admin' ? 'tachometer-alt' : role === 'teacher' ? 'chalkboard-teacher' : 'users-cog'}`}></i> Dashboard</Link></li>}
          <li><button onClick={onLogout} className="logout-btn"><i className="fas fa-sign-out-alt"></i> Logout</button></li>
          <li><ThemeToggle theme={theme} setTheme={setTheme} /></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;