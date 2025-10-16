import React, { useState } from 'react';
import logo from '../assets/vesit-logo.png';

const Login = ({ setRole, setLoading }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('');

  const credentials = {
    admin: { username: 'rohitmakattil94@gmail.com', password: 'makattil' },
    teacher: { username: 'teacher', password: '123' },
    staff: { username: 'staff', password: '123' },
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !password || !selectedRole) {
      alert('Please fill in all fields');
      return;
    }

    const validCredentials = credentials[selectedRole];
    if (!validCredentials) {
      alert('Invalid role selected');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      if (username === validCredentials.username && password === validCredentials.password) {
        localStorage.setItem('role', selectedRole);
        setRole(selectedRole);
        setLoading(false);
        window.location.href = `/home`;
      } else {
        setLoading(false);
        alert('Invalid credentials');
      }
    }, 1000);
  };

  return (
    <main className="login-page">
      <div className="login-card" role="form" aria-label="Login form">
        <img src={logo} alt="VESIT Logo" className="login-logo" />
        <h1>Login to EduEats</h1>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              required
              aria-label="Select Role"
            >
              <option value="" disabled>
                Select Role
              </option>
              <option value="teacher">Teacher</option>
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
            </select>
            <span className="icon">
              <i className="fas fa-user-graduate" aria-hidden="true"></i>
            </span>
          </div>
          <div className="input-group">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              required
              aria-label="Username"
              autoComplete="username"
            />
            <span className="icon">
              <i className="fas fa-user" aria-hidden="true"></i>
            </span>
          </div>
          <div className="input-group">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              aria-label="Password"
              autoComplete="current-password"
            />
            <span className="icon">
              <i className="fas fa-lock" aria-hidden="true"></i>
            </span>
          </div>
          <div className="form-options">
            <label>
              <input type="checkbox" id="remember-me" />
              Remember me
            </label>
            <a href="#" className="forgot-password">
              Forgot password?
            </a>
          </div>
          <button type="submit" className="login-btn" aria-label="Login button">
            Login
          </button>
        </form>
        <p className="register-text">
          Don’t have an account?{' '}
          <a href="#" className="register-link">
            Register
          </a>
        </p>
      </div>
    </main>
  );
};

export default Login;
