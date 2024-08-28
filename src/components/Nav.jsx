import React from 'react';
import { Link } from 'react-router-dom';
import ConnectButton from './ConnectButton';
import logo from '../assets/logo.gif';
import './Nav.css'; 

const Nav = ({ setWalletData, setAccountId }) => {
  return (
    <nav className="navbar">
      <div className="logoContainer">
        <Link to="/" className="logoLink">
          <img src={logo} alt="Logo" className="logo" />
        </Link>
      </div>
      <div className="navContainer">
        <div className="navLinks">
          <Link to="/create" className="link">Create</Link>
          <Link to="/manage" className="link">Manage</Link>
          <Link to="/faq" className="link">FAQ</Link>
        </div>
      </div>
      <div className="connectButton">
        <ConnectButton setWalletData={setWalletData} setAccountId={setAccountId} />
      </div>
    </nav>
  );
};

export default Nav;
