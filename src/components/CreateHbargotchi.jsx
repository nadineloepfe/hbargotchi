import React, { useState } from "react";
import createAndMintHbargotchi from "./hedera/NFT"; 
import catImage from "../assets/cat/hbargotchi-cat.webp";
import foxImage from "../assets/fox/hbargotchi-fox.webp";
import penguinImage from "../assets/penguin/hbargotchi-penguin.webp";
import "./CreateHbargotchi.css";

function CreateHbargotchi({ walletData, accountId }) {
    const [createTextSt, setCreateTextSt] = useState("");
    const [createLinkSt, setCreateLinkSt] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);

    const confirmNFT = async () => {
        if (!selectedImage) {
            setCreateTextSt("🛑 Please select an image first! 🛑");
            return;
        }

        const metadata = getMetadataForImage(selectedImage);
        const [hbargotchiTokenId, supply, txIdRaw] = await createAndMintHbargotchi(walletData, accountId, metadata);
        setCreateTextSt(`Successfully created and minted Hbargotchi NFT with ID: ${hbargotchiTokenId} and total supply: ${supply} ✅`);
        const txId = prettify(txIdRaw);
        setCreateLinkSt(`https://hashscan.io/testnet/transaction/${txId}`);
    };

    const getMetadataForImage = (image) => {
        switch (image) {
            case "cat":
                return "ipfs://bafybeigpkigz7bw5dbllvjactnaqbls3v5hxl66o5ukzj33ar4irmspe5q";
            case "fox":
                return "ipfs://bafybeiapimahbagjaqsxetdhucsqyttm4brtyqp45ntlhsx7miecgx463y";
            case "penguin":
                return "ipfs://bafybeic4wltfkcmeuw2y2owtfni6mu4tvniys5ooyxm7yzbnqxhecjpuau";
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

    return (
        <div className="container">
            <h2>Choose your pet</h2>
            <div className="hbargotchi-images">
            <img
                src={catImage}
                alt="Hbargotchi Cat"
                className={`hbargotchi-image ${selectedImage === "cat" ? "selected" : ""}`}
                onClick={() => selectImage("cat")}
            />
            <img
                src={foxImage}
                alt="Hbargotchi Fox"
                className={`hbargotchi-image ${selectedImage === "fox" ? "selected" : ""}`}
                onClick={() => selectImage("fox")}
            />
            <img
                src={penguinImage}
                alt="Hbargotchi Penguin"
                className={`hbargotchi-image ${selectedImage === "penguin" ? "selected" : ""}`}
                onClick={() => selectImage("penguin")}
            />
            </div>
            {selectedImage && (
                <div className="confirm-button">
                    <button className="gradient-button" onClick={confirmNFT}>Confirm and Mint</button>
                </div>
            )}
            {createTextSt && <p className="success-message">{createTextSt}</p>}
            {createLinkSt && (
                <div className="view-transaction-button">
                    <a href={createLinkSt} target="_blank" rel="noopener noreferrer" className="MuiButton-containedPrimary">
                        View Transaction
                    </a>
                </div>
            )}
        </div>
    );
}

export default CreateHbargotchi;
