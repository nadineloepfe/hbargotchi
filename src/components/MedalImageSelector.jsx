import React from "react";
import bronzeImage from "../assets/bronze_medal.webp";
import silverImage from "../assets/silver_medal.webp";
import goldImage from "../assets/gold_medal.webp";

const MedalImageSelector = ({ selectedImage, setSelectedImage }) => {
    return (
        <div className="medal-images">
            <img
                src={bronzeImage}
                alt="Bronze Medal"
                className={`medal-image ${selectedImage === bronzeImage ? "selected" : ""}`}
                onClick={() => setSelectedImage(bronzeImage)}
            />
            <img
                src={silverImage}
                alt="Silver Medal"
                className={`medal-image ${selectedImage === silverImage ? "selected" : ""}`}
                onClick={() => setSelectedImage(silverImage)}
            />
            <img
                src={goldImage}
                alt="Gold Medal"
                className={`medal-image ${selectedImage === goldImage ? "selected" : ""}`}
                onClick={() => setSelectedImage(goldImage)}
            />
        </div>
    );
};

export default MedalImageSelector;
