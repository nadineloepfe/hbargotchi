import React, { useState } from "react";
import { AccountId, TokenId } from "@hashgraph/sdk";
import { transferNonFungibleToken } from './hedera/transferNft';

const UNSELECTED_SERIAL_NUMBER = -1;

const TransferMedal = ({ walletData, accountId, medalTokenId }) => {
    const [toAccountId, setToAccountId] = useState("");
    const [serialNumber, setSerialNumber] = useState(UNSELECTED_SERIAL_NUMBER);

    const handleTransferNft = async () => {
        try {
            const toAccount = AccountId.fromString(toAccountId);
            const token = TokenId.fromString(medalTokenId);

            if (serialNumber === UNSELECTED_SERIAL_NUMBER) {
                alert("Please select a valid serial number.");
                return;
            }

            const transactionId = await transferNonFungibleToken(walletData, AccountId.fromString(accountId), toAccount, token, serialNumber);
            if (transactionId) {
                alert(`NFT transferred successfully! Transaction ID: ${transactionId}`);
            }
        } catch (error) {
            alert("Failed to transfer NFT.");
            console.error("Error transferring NFT:", error);
        }
    };

    return (
        <div className="card transfer-card">
            <h2>Send Your Medal NFT</h2>
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
            <div className="button-container">
                <button className="gradient-button" onClick={handleTransferNft}>Send NFT</button>
            </div>
        </div>
    );
};

export default TransferMedal;
