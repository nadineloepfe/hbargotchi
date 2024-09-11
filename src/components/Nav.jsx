import React from 'react';
import { Link } from 'react-router-dom';
import ConnectButton from './ConnectButton';
import "../App.css";

const Nav = ({ setWalletData, setAccountId }) => {
  return (
    <nav className="navbar">
      <div className="navContainer">
        <div className="navLinks">
          <Link to="/faq" className="link">FAQ</Link>
        </div>
      </div>
      <div className="button">
        <ConnectButton setWalletData={setWalletData} setAccountId={setAccountId} />
      </div>
    </nav>
  );
};

export default Nav;
