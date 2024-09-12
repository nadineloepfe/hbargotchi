import React from "react";

const Modal = ({ createTextSt, createLinkSt, onClose }) => {
    return (
        <>
            <div className="modal-overlay show"></div>
            <div className="modal show">
                <h2>{createTextSt}</h2>
                {createLinkSt && (
                    <a href={createLinkSt} target="_blank" rel="noopener noreferrer">
                        <button className="modal-button">View NFT</button>
                    </a>
                )}
                <button className="modal-button" onClick={onClose}>Close</button>
            </div>
        </>
    );
};

export default Modal;
