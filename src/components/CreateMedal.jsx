import React, { useState } from "react";
import createAndMintMedal from "./hedera/NFT"; 
import bronzeImage from "../assets/bronze_medal.webp";
import silverImage from "../assets/silver_medal.webp";
import goldImage from "../assets/gold_medal.webp";
import "../App.css";

function CreateMedal({ walletData, accountId }) {
    const [createTextSt, setCreateTextSt] = useState("");
    const [createLinkSt, setCreateLinkSt] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);

    const confirmNFT = async () => {
        if (!selectedImage) {
            setCreateTextSt("Please select a medal to mint!");
            return;
        }

        const metadata = getMetadataForImage(selectedImage);
        const [MedalTokenId, supply, txIdRaw] = await createAndMintMedal(walletData, accountId, metadata);
        setCreateTextSt(`Successfully created and minted Medal NFT with ID: ${MedalTokenId} and total supply: ${supply} ✅`);
        const txId = prettify(txIdRaw);
        setCreateLinkSt(`https://hashscan.io/testnet/transaction/${txId}`);
    };

    const getMetadataForImage = (image) => {
        switch (image) {
            case "bronze":
                return "ipfs://bafkreiapag7464vfpft4w2pp67asukhbs7rc7w2hhbuk3vchqu5pku6rkm"; // Bronze medal metadata
            case "silver":
                return "ipfs://bafybeid5bp3qu2si6rlg3jfqspzeeqggj4zofd3a6aozkw2rlbt26upwki"; // Silver medal metadata
            case "gold":
                return "ipfs://bafybeigyucppqrf7be4lswqsyubepkkm535fxmw4bzwoahs2aborcm4p6q"; // Gold medal metadata
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
            <br></br>
            <br></br>
            {selectedImage && (
                <div className="button">
                    <button className="gradient-button" onClick={confirmNFT}>Confirm and Mint</button>
                </div>
            )}
            {createTextSt && <p className="success-message">{createTextSt}</p>}
            {createLinkSt && (
                <div className="button">
                    <a href={createLinkSt} target="_blank" rel="noopener noreferrer" className="MuiButton-containedPrimary">
                        View Transaction
                    </a>
                </div>
            )}
        </div>
    );
}

export default CreateMedal;
