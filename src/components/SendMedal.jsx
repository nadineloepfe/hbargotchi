import React, { useState } from "react";
import { AccountId, TokenId } from "@hashgraph/sdk";

const UNSELECTED_SERIAL_NUMBER = -1;

const SendMedal = ({ walletInterface, accountId }) => {
  const [toAccountId, setToAccountId] = useState("");
  const [serialNumber, setSerialNumber] = useState(UNSELECTED_SERIAL_NUMBER);
  const [tokenId, setTokenId] = useState("");  

  const handleTransferNft = async () => {
    if (!walletInterface || !tokenId || !toAccountId) {
      alert("Missing necessary details for NFT transfer.");
      return;
    }

    try {
      const isAssociated = await walletInterface.checkAssociation(
        AccountId.fromString(toAccountId),
        TokenId.fromString(tokenId)
      );

      if (!isAssociated) {
        alert(`Receiver is not associated with token id: ${tokenId}`);
        return;
      }

      await walletInterface.transferNonFungibleToken(
        AccountId.fromString(toAccountId),
        TokenId.fromString(tokenId),
        serialNumber
      );

      alert("NFT transferred successfully!");
    } catch (error) {
      alert("Failed to transfer NFT.");
      console.error("Error transferring NFT:", error);
    }
  };

  return (
    <div className="container">
      <h2>Send Your Medal NFT</h2>

      <div>
        <label htmlFor="toAccountId">Receiver Account ID</label>
        <input
          type="text"
          id="toAccountId"
          value={toAccountId}
          onChange={(e) => setToAccountId(e.target.value)}
          placeholder="Enter recipient's account ID"
        />
      </div>

      <button onClick={handleTransferNft}>
        Send NFT
      </button>
    </div>
  );
};

export default SendMedal;
