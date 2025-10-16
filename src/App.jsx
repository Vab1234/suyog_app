import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useLocation,
} from 'react-router-dom';
import './App.css'
import Login from './components/Login';
import Home from './components/Home';
import Menu from './components/Menu';
import OrderStatus from './components/OrderStatus';
import AdminDashboard from './components/AdminDashboard';
import TeacherDashboard from './components/TeacherDashboard';
import StaffDashboard from './components/StaffDashboard';
import Header from './components/Header';
import Footer from './components/Footer';
import LoadingOverlay from './components/LoadingOverlay';
import CartPanel from './components/CartPanel';
import OrderPopup from './components/OrderPopup';

function AppWrapper() {
  // Wrap the Router content with useLocation, since useLocation must be used inside Router
  const location = useLocation();

  // Determine current path
  const isLoginPage = location.pathname === '/' || location.pathname === '';
  const isMenuPage = location.pathname === '/menu';

  // States placed here as well for AppWrapper context
  const [role, setRole] = useState(localStorage.getItem('role'));
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    document.body.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const handleLogout = () => {
    localStorage.removeItem('role');
    setRole(null);
  };

  const ProtectedRoute = ({ children, allowedRole }) => {
    return role && (!allowedRole || role === allowedRole) ? (
      children
    ) : (
      <Navigate to="/" />
    );
  };

  return (
    <>
      {loading && <LoadingOverlay />}
      {showPopup && <OrderPopup onClose={() => setShowPopup(false)} />}
      {/* Render CartPanel only on Menu page */}
      {isMenuPage && <CartPanel setShowPopup={setShowPopup} setLoading={setLoading} />}
      {!isLoginPage && role && (
        <Header role={role} onLogout={handleLogout} theme={theme} setTheme={setTheme} />
      )}
      <Routes>
        <Route
          path="/"
          element={<Login setRole={setRole} setLoading={setLoading} />}
        />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/menu"
          element={
            <ProtectedRoute>
              <Menu />
            </ProtectedRoute>
          }
        />
        <Route
          path="/order-status"
          element={
            <ProtectedRoute>
              <OrderStatus />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher-dashboard"
          element={
            <ProtectedRoute allowedRole="teacher">
              <TeacherDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff-dashboard"
          element={
            <ProtectedRoute allowedRole="staff">
              <StaffDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      {!isLoginPage && role && <Footer />}
    </>
  );
}

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;
