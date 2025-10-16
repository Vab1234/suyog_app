import React from 'react';

const ThemeToggle = ({ theme, setTheme }) => {
  const handleChange = (e) => {
    const newTheme = e.target.checked ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <div className="theme-switch-wrapper">
      <label className="theme-switch" htmlFor="theme-checkbox">
        <input type="checkbox" id="theme-checkbox" checked={theme === 'dark'} onChange={handleChange} />
        <div className="slider round">
          <i className="fas fa-sun"></i>
          <i className="fas fa-moon"></i>
        </div>
      </label>
    </div>
  );
};

export default ThemeToggle;