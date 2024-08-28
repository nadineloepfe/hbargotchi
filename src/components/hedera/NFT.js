import { TokenCreateTransaction, TokenMintTransaction, PrivateKey, TokenType } from "@hashgraph/sdk";

async function createAndMintHbargotchi(walletData, accountId, metadata) {
    console.log(`\n=======================================`);
    console.log(`- Creating and minting your personal Hbargotchi NFT...`);

    const hashconnect = walletData[0];
    const saveData = walletData[1];
    const provider = hashconnect.getProvider("testnet", saveData.topic, accountId);
    const signer = hashconnect.getSigner(provider);

    const supplyKey = PrivateKey.generate();

    const tokenCreateTx = await new TokenCreateTransaction()
        .setTokenName("Hbargotchi")
        .setTokenSymbol("HBG")
        .setTokenType(TokenType.NonFungibleUnique)  
        .setTreasuryAccountId(accountId)
        .setAutoRenewAccountId(accountId)
        .setAutoRenewPeriod(7776000)  
        .setSupplyKey(supplyKey.publicKey)  
        .freezeWithSigner(signer);

    const tokenCreateSubmit = await tokenCreateTx.executeWithSigner(signer);
    const tokenCreateRx = await provider.getTransactionReceipt(tokenCreateSubmit.transactionId);
    const hbargotchiTokenId = tokenCreateRx.tokenId;

    console.log(`- Created Hbargotchi NFT with ID: ${hbargotchiTokenId}`);
    console.log(`- Supply Key: ${supplyKey}`);

    const tokenMintTx = await new TokenMintTransaction()
        .setTokenId(hbargotchiTokenId)
        .addMetadata(Buffer.from(metadata))
        .freezeWithSigner(signer);

    const signedTokenMintTx = await tokenMintTx.sign(supplyKey);
    const tokenMintSubmit = await signedTokenMintTx.executeWithSigner(signer);
    const tokenMintReceipt = await provider.getTransactionReceipt(tokenMintSubmit.transactionId);
    const supply = tokenMintReceipt.totalSupply;

    console.log(`- Hbargotchi NFT minted. New total supply is ${supply}`);
    console.log(`- Transaction ID: ${tokenMintSubmit.transactionId}`);

    return [hbargotchiTokenId, supply, tokenMintSubmit.transactionId];
}

export default createAndMintHbargotchi;
