import { TransferTransaction } from "@hashgraph/sdk";

/**
 * Feeds the Hbargotchi by transferring TREAT tokens from the user's account to the treasury.
 * 
 * @param {Array} walletData - The wallet data containing HashConnect and other details.
 * @param {string} accountId - The user's account ID.
 * @param {string} hbargotchiTokenId - The ID of the Hbargotchi NFT.
 * @param {string} treatTokenId - The ID of the TREAT token.
 * @param {number} amount - The amount of TREAT tokens to transfer.
 */
async function feedHbargotchi(walletData, accountId, hbargotchiTokenId, treatTokenId, amount = 1) {
    console.log(`\n=======================================`);
    console.log(`- Feeding Hbargotchi with TREAT tokens...`);

    const hashconnect = walletData[0];
    const saveData = walletData[1];
    const provider = hashconnect.getProvider("testnet", saveData.topic, accountId);
    const signer = hashconnect.getSigner(provider);

    try {
        // Create the transfer transaction
        const transferTx = await new TransferTransaction()
            .addTokenTransfer(treatTokenId, accountId, -amount) 
            .addTokenTransfer(treatTokenId, "0.0.xxxxx", amount) 
            .freezeWithSigner(signer);

        // Execute the transaction
        const transferSubmit = await transferTx.executeWithSigner(signer);
        const transferReceipt = await provider.getTransactionReceipt(transferSubmit.transactionId);

        console.log(`- Hbargotchi has been fed with ${amount} TREAT tokens. ✅`);
        console.log(`- Transaction ID: ${transferSubmit.transactionId}`);

        return transferReceipt.status;
    } catch (error) {
        console.error("Error feeding Hbargotchi:", error);
        throw error;
    }
}

export default feedHbargotchi;
