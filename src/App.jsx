import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './components/Nav';
import Home from './components/Home';
import CreateHbargotchi from './components/CreateHbargotchi';
import ManageHbargotchi from './components/ManageHbargotchi';
import "./styles/App.css";

function App() {
  const [walletData, setWalletData] = useState();
  const [accountId, setAccountId] = useState();

  return (
    <Router>
      <NavBar setWalletData={setWalletData} setAccountId={setAccountId} />
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreateHbargotchi walletData={walletData} accountId={accountId} />} />
          <Route path="/manage" element={<ManageHbargotchi walletData={walletData} accountId={accountId} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
