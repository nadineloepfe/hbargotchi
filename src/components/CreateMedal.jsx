import React, { useState, useEffect, useRef } from "react";
import createAndMintMedal from "./hedera/createMintNft"; 
import { uploadJsonToPinata } from "./ipfsService"; 
import { transferNonFungibleToken } from './hedera/transferNft.js'; // Import the transfer function
import bronzeImage from "../assets/bronze_medal.webp";
import silverImage from "../assets/silver_medal.webp";
import goldImage from "../assets/gold_medal.webp";
import { AccountId, TokenId } from "@hashgraph/sdk"; // Import Hedera SDK
import { useNavigate } from 'react-router-dom';  
import "../App.css"; 

const UNSELECTED_SERIAL_NUMBER = -1;

function CreateMedal({ walletData, accountId }) {
    const [createTextSt, setCreateTextSt] = useState("");
    const [createLinkSt, setCreateLinkSt] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);
    const [note, setNote] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [medalTokenId, setMedalTokenId] = useState("");  
    const [showLoginModal, setShowLoginModal] = useState(false); // Modal for login error
    const [toAccountId, setToAccountId] = useState(""); // State for transfer
    const [serialNumber, setSerialNumber] = useState(UNSELECTED_SERIAL_NUMBER); // State for transfer
    const navigate = useNavigate();

    const modalRef = useRef(null);

    // Wallet data check
    useEffect(() => {
        if (!walletData || !accountId) {
            setShowLoginModal(true); // Show login modal if wallet not connected
        }
    }, [walletData, accountId]);

    // Automatically close modal after 10 seconds
    useEffect(() => {
        if (showModal) {
            const timeout = setTimeout(() => setShowModal(false), 10000);
            return () => clearTimeout(timeout);
        }
    }, [showModal]);

    const handleClickOutside = (event) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
            setShowModal(false);
        }
    };

    useEffect(() => {
        if (showModal) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showModal]);

    const confirmNFT = async () => {
        // Check if the wallet is connected
        if (!walletData || walletData.length === 0) {
            setShowLoginModal(true); // Show modal asking user to log in
            return;
        }

        if (!selectedImage) {
            setCreateTextSt("Please select a medal to mint!");
            return;
        }

        if (!note || note.split(" ").length > 50) {
            setCreateTextSt("Please enter a note with no more than 50 words!");
            return;
        }

        // Check if the user is logged in
        if (!accountId || accountId === "0") {
            setShowLoginModal(true); // Show modal asking user to log in
            return;
        }

        const metadata = {
            name: "Medal",
            description: "For your achievement",
            image: getPreviewForImage(selectedImage),
            type: "image/jpg",
            properties: {
                note: note,
            },
            files: [
                {
                    uri: getImageForMetadata(selectedImage),
                    is_default_file: true,
                    type: "image/jpg",
                },
            ],
        };

        try {
            const ipfsHash = await uploadJsonToPinata(metadata);
            const [MedalTokenId] = await createAndMintMedal(walletData, accountId, ipfsHash);

            setCreateTextSt(`Successfully created and minted Medal NFT with ID: ${MedalTokenId}`);
            setCreateLinkSt(`https://hashscan.io/testnet/token/${MedalTokenId}/1`);  
            setMedalTokenId(MedalTokenId);  
            setShowModal(true);  
        } catch (error) {
            console.error("Error minting NFT or uploading metadata:", error);
            setCreateTextSt("Failed to create and mint Medal NFT.");
        }
    };

    const getPreviewForImage = (image) => {
        switch (image) {
            case "bronze":
                return "QmSJYFMXZMuKhZ1JTSNMpPKQe6cw8akVK6Ypmxdzn4cyCV";
            case "silver":
                return "QmZAuaJJTNgY741539kv5zsbTfymfZ9jMNtXXbaF66Shwx";
            case "gold":
                return "QmWUfsjYE6enKy4QDYbSZ1HbycGtvr1eVrJPWaB9AXK3L2";
            default:
                return "";
        }
    };

    const getImageForMetadata = (image) => {
        switch (image) {
            case "bronze":
                return "QmeyMfJPn3nfJmxvCEwzKZ7PkfahXmBTR7noNLUpf8KvU2";
            case "silver":
                return "QmXaZTJMcBD7YqEU6XiRVJWe97kBf7mcY6me3GWKJzcVP4";
            case "gold":
                return "QmfSho9DAsKmZigJzc4oBZAjuknGB8Hpjv2ZrYpJPjkjMs";
            default:
                return "";
        }
    };

    const selectImage = (image) => {
        setSelectedImage(image);
    };

    const handleTransferNft = async () => {
        try {
            // Log walletData and accountId to verify their presence
            console.log("walletData:", walletData);
            console.log("accountId:", accountId);
            
            // Check if walletData and accountId are available
            if (!walletData || !accountId) {
                alert("Wallet is not connected properly or accountId is missing.");
                return;
            }

            const toAccount = AccountId.fromString(toAccountId);
            const token = TokenId.fromString(medalTokenId);
            
            // Assuming serialNumber is coming from state and valid
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
        <div className="container send-medal-page">
            <h2 className="page-title">Create and Mint Your Medal NFT</h2>

            <div className="medal-images">
                <img
                    src={bronzeImage}
                    alt="Bronze Medal"
                    className={`medal-image ${selectedImage === "bronze" ? "selected" : ""}`}
                    onClick={() => selectImage("bronze")}
                />
                <img
                    src={silverImage}
                    alt="Silver Medal"
                    className={`medal-image ${selectedImage === "silver" ? "selected" : ""}`}
                    onClick={() => selectImage("silver")}
                />
                <img
                    src={goldImage}
                    alt="Gold Medal"
                    className={`medal-image ${selectedImage === "gold" ? "selected" : ""}`}
                    onClick={() => selectImage("gold")}
                />
            </div>
<br></br>
<br></br>
            <br />
            <textarea
                className="note-input"
                placeholder="Enter a note (max 50 words)"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                maxLength={250}
            />

            {selectedImage && (
                <div className="button-container">
                    <button className="gradient-button" onClick={confirmNFT}>
                        Confirm and Mint
                    </button>
                </div>
            )}

            {/* Modal Popup for Minting */}
            {showModal && (
                <>
                    <div className="modal-overlay show"></div>
                    <div className="modal show" ref={modalRef}>
                        <h2>{createTextSt}</h2>
                        {createLinkSt && (
                            <>
                                <a href={createLinkSt} target="_blank" rel="noopener noreferrer">
                                    <button className="modal-button">View NFT</button>
                                </a>
                            </>
                        )}
                    </div>
                </>
            )}

            {/* Modal Popup for Wallet not connected */}
            {showLoginModal && (
                <>
                    <div className="modal-overlay show"></div>
                    <div className="modal show" ref={modalRef}>
                        <h2>Wallet not connected. Please connect first.</h2>
                        <button className="modal-button" onClick={() => setShowLoginModal(false)}>
                            Close
                        </button>
                    </div>
                </>
            )}

            <br></br>
            <br></br>
            <br></br>

            {/* Section for Transfer NFT */}
            {medalTokenId && (
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
                        <button className="gradient-button" onClick={handleTransferNft}>
                            Send NFT
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CreateMedal;
