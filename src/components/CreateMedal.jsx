import React, { useState, useEffect, useRef } from "react";
import MedalImageSelector from "./MedalImageSelector";
import Modal from "./Modal";
import TransferMedal from "./TransferMedal";
import { uploadJsonToPinata } from "./ipfsService";
import createAndMintMedal from "./hedera/createMintNft";
import "../App.css";

function CreateMedal({ walletData, accountId }) {
    const [createTextSt, setCreateTextSt] = useState("");
    const [createLinkSt, setCreateLinkSt] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);
    const [note, setNote] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [medalTokenId, setMedalTokenId] = useState("");
    const [showLoginModal, setShowLoginModal] = useState(false);
    const modalRef = useRef(null);

    // Handle wallet connection state
    // useEffect(() => {
    //     if (!walletData || !accountId) {
    //         setShowLoginModal(true);
    //     }
    // }, [walletData, accountId]);

    // Automatically close modal after 10 seconds
    useEffect(() => {
        if (showModal) {
            const timeout = setTimeout(() => setShowModal(false), 10000);
            return () => clearTimeout(timeout);
        }
    }, [showModal]);

    const confirmNFT = async () => {
        if (!walletData || walletData.length === 0) {
            setShowLoginModal(true);
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

        try {
            const metadata = {
                name: "Medal",
                description: "For your achievement",
                image: selectedImage,
                properties: { note: note },
            };
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

    return (
        <div className="container send-medal-page">
            <h2 className="page-title">Create and Mint Your Medal NFT</h2>

            {/* Medal Image Selector */}
            <MedalImageSelector selectedImage={selectedImage} setSelectedImage={setSelectedImage} />
            <br></br>
            <br></br>
            {/* Note Input */}
            <textarea
                className="note-input"
                placeholder="Enter a note (max 50 words)"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                maxLength={250}
            />

            {/* Confirm and Mint Button */}
            {selectedImage && (
                <div className="button-container">
                    <button className="gradient-button" onClick={confirmNFT}>Confirm and Mint</button>
                </div>
            )}

            {/* Modal Popup */}
            {showModal && (
                <Modal
                    createTextSt={createTextSt}
                    createLinkSt={createLinkSt}
                    onClose={() => setShowModal(false)}
                />
            )}

            {/* Login Modal */}
            {showLoginModal && (
                <Modal
                    createTextSt="Wallet not connected. Please connect first."
                    onClose={() => setShowLoginModal(false)}
                />
            )}

            {/* Transfer Medal Section */}
            {medalTokenId && <TransferMedal walletData={walletData} accountId={accountId} medalTokenId={medalTokenId} />}
        </div>
    );
}

export default CreateMedal;
