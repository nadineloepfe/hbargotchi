import React, { useState, useEffect, useRef } from "react";
import createAndMintMedal from "./hedera/NFT"; 
import { uploadJsonToPinata } from "./ipfsService"; 
import bronzeImage from "../assets/bronze_medal.webp";
import silverImage from "../assets/silver_medal.webp";
import goldImage from "../assets/gold_medal.webp";
import { useNavigate } from 'react-router-dom';  
import "../App.css";

function CreateMedal({ walletData, accountId }) {
    const [createTextSt, setCreateTextSt] = useState("");
    const [createLinkSt, setCreateLinkSt] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);
    const [note, setNote] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [medalTokenId, setMedalTokenId] = useState("");  
    const navigate = useNavigate();

    const modalRef = useRef(null);

    
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
        if (!selectedImage) {
            setCreateTextSt("Please select a medal to mint!");
            return;
        }

        if (!note || note.split(" ").length > 50) {
            setCreateTextSt("Please enter a note with no more than 50 words!");
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
                    type: "image/webp",
                },
            ],
        };

        try {
            const ipfsHash = await uploadJsonToPinata(metadata);
            const [MedalTokenId, supply, txIdRaw] = await createAndMintMedal(walletData, accountId, ipfsHash);

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

    function prettify(txIdRaw) {
        const a = txIdRaw.split("@");
        const b = a[1].split(".");
        return `${a[0]}-${b[0]}-${b[1]}`;
    }

    const navigateToSendMedal = () => {
        // Navigate to sendMedal page with the token ID as a parameter
        navigate(`/send?tokenId=${medalTokenId}`);
    };

    return (
        <div className="container">
            <h3>Tournament? Hackathon? Create, mint and send a medal NFT including a note.</h3>
            <h2>Choose Medal</h2>
            <br />
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
            <br />
            <textarea
                className="note-input"
                placeholder="Enter a note (max 50 words)"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                maxLength={250}
            />
            <br />
            <br />
            {selectedImage && (
                <div className="button">
                    <button className="gradient-button" onClick={confirmNFT}>Confirm and Mint</button>
                </div>
            )}
            {/* Modal Popup */}
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
                                <button className="modal-button" onClick={navigateToSendMedal}>
                                    Send NFT
                                </button>
                            </>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}

export default CreateMedal;
