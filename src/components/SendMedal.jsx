import React, { useState } from "react";
import { AccountId, TokenId } from "@hashgraph/sdk";
import { transferNonFungibleToken } from './hedera/transferNft.js'; // Import the transfer function
import "../App.css"; // Assuming this contains some global styles

const UNSELECTED_SERIAL_NUMBER = -1;

const SendMedal = ({ walletInterface, accountId, prefilledTokenId }) => {
  const [toAccountId, setToAccountId] = useState("");
  const [serialNumber, setSerialNumber] = useState(UNSELECTED_SERIAL_NUMBER);
  const [tokenId, setTokenId] = useState(prefilledTokenId || "");  

  const handleTransferNft = async () => {
    try {
      // Log walletInterface and accountId to verify their presence
      console.log("walletInterface:", walletInterface);
      console.log("accountId:", accountId);
      
      // Check if walletInterface and accountId are available
      if (!walletInterface || !accountId) {
        alert("Wallet is not connected properly or accountId is missing.");
        return;
      }

      const toAccount = AccountId.fromString(toAccountId);
      const token = TokenId.fromString(tokenId);
      
      // Assuming serialNumber is coming from state and valid
      if (serialNumber === UNSELECTED_SERIAL_NUMBER) {
        alert("Please select a valid serial number.");
        return;
      }

      const transactionId = await transferNonFungibleToken(walletInterface, AccountId.fromString(accountId), toAccount, token, serialNumber);

      if (transactionId) {
        alert(`NFT transferred successfully! Transaction ID: ${transactionId}`);
      }
    } catch (error) {
      alert("Failed to transfer NFT.");
      console.error("Error transferring NFT:", error);
    }
  };

  return (
    <div className="container send-medal-page">
      <h2 className="page-title">Send Your Medal NFT</h2>

      {/* Input for receiver's account ID */}
      <div className="input-group">
        <label htmlFor="toAccountId" className="input-label">Receiver Account ID</label>
        <input
          type="text"
          id="toAccountId"
          className="styled-input"
          value={toAccountId}
          onChange={(e) => setToAccountId(e.target.value)}
          placeholder="Enter recipient's account ID"
        />
      </div>

      {/* Input for Token ID, prefilled if tokenId is passed */}
      <div className="input-group">
        <label htmlFor="tokenId" className="input-label">Token ID</label>
        <input
          type="text"
          id="tokenId"
          className="styled-input"
          value={tokenId}
          onChange={(e) => setTokenId(e.target.value)}
          placeholder="Enter the Token ID"
        />
      </div>

      {/* Input for serial number */}
      <div className="input-group">
        <label htmlFor="serialNumber" className="input-label">Serial Number</label>
        <input
          type="number"
          id="serialNumber"
          className="styled-input"
          value={serialNumber === UNSELECTED_SERIAL_NUMBER ? "" : serialNumber}
          onChange={(e) => setSerialNumber(Number(e.target.value))}
          placeholder="Enter the NFT serial number"
        />
      </div>

      {/* Button to transfer the NFT */}
      <div className="button-container">
        <button className="gradient-button" onClick={handleTransferNft}>
          Send NFT
        </button>
      </div>
    </div>
  );
};

export default SendMedal;
