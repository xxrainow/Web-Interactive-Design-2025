// Navbar.js
import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  const menuItems = [
    { name: 'RECENT', path: '/' }, // 현재 페이지
    { name: 'REQUEST', path: '/request' },
    { name: 'MAP', path: '/map' },
    { name: 'NOTE', path: '/note' },
    { name: 'SETTING', path: '/setting' },
  ];

  return (
    <nav className="navbar">
      <ul className="nav-links">
        {menuItems.map((item) => (
          <li key={item.name} className="nav-item">
            <NavLink
              to={item.path}
              end
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              {item.name}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;
