// src/components/NavBar.js

import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import LoginButton from './LoginButton';
import LogoutButton from './LogoutButton';
import RotatingSymbol from './RotatingSymbol';
import './NavBar.css';

const NavBar = () => {
  const { isAuthenticated } = useAuth0();

  return (
    <nav className="bg-gray-800 p-4">
      <div className="nav-container">
        <div className="brand flex items-center">
          <RotatingSymbol />
          <h1>DeCryptify</h1>
        </div>
        <div className="nav-links flex items-center">
          <Link to="/" className="text-white px-4">Home</Link>
          <Link to="/portfolio" className="text-white px-4">Portfolio</Link>
          <Link to="/yield-farming" className="text-white px-4">Yield Farming</Link>
          <Link to="/staking" className="text-white px-4">Staking</Link>
          <Link to="/education" className="text-white px-4">Education</Link>
          <Link to="/risk-assessment" className="text-white px-4">Risk Assessment</Link>
          {isAuthenticated && <Link to="/profile" className="text-white px-4">Profile</Link>}
        </div>
        <div>
          {isAuthenticated ? <LogoutButton /> : <LoginButton />}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
