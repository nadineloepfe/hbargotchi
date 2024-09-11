import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './components/Nav';
import CreateMedal from './components/CreateMedal';
import SendMedal from './components/SendMedal';
import "./App.css";

function App() {
  const [walletData, setWalletData] = useState();
  const [accountId, setAccountId] = useState();

  return (
    <Router>
      <NavBar setWalletData={setWalletData} setAccountId={setAccountId} />
      <div className="App">
        <Routes>
          <Route path="/" element={<CreateMedal walletData={walletData} accountId={accountId} />} />
          <Route path="/send" element={<SendMedal walletData={walletData} accountId={accountId} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
