import { TokenCreateTransaction, TokenMintTransaction, PrivateKey, TokenType } from "@hashgraph/sdk";

async function createAndMintMedal(walletData, accountId, ipfsHash) {
    console.log(`\n=======================================`);
    console.log(`- Creating and minting Medal NFT...`);

    console.log(accountId)
    console.log(ipfsHash)
    const hashconnect = walletData[0];
    const saveData = walletData[1];
    const provider = hashconnect.getProvider("testnet", saveData.topic, accountId);
    const signer = hashconnect.getSigner(provider);

    const supplyKey = PrivateKey.generate();

    console.log("starting create tx")
    const tokenCreateTx = await new TokenCreateTransaction()
        .setTokenName("Medal")
        .setTokenSymbol("MEDAL")
        .setTokenType(TokenType.NonFungibleUnique)  
        .setTreasuryAccountId(accountId)
        .setAutoRenewAccountId(accountId)
        .setAutoRenewPeriod(7776000)  
        .setSupplyKey(supplyKey.publicKey)  
        .freezeWithSigner(signer);

    const tokenCreateSubmit = await tokenCreateTx.executeWithSigner(signer);
    const tokenCreateRx = await provider.getTransactionReceipt(tokenCreateSubmit.transactionId);
    const medalTokenId = tokenCreateRx.tokenId;

    console.log(`- Created Medal NFT with ID: ${medalTokenId}`);
    console.log(`- Supply Key: ${supplyKey}`);

    console.log("starting mint tx")
    const tokenMintTx = await new TokenMintTransaction()
        .setTokenId(medalTokenId)
        .addMetadata(Buffer.from(ipfsHash))
        .freezeWithSigner(signer);

    const signedTokenMintTx = await tokenMintTx.sign(supplyKey);
    const tokenMintSubmit = await signedTokenMintTx.executeWithSigner(signer);
    const tokenMintReceipt = await provider.getTransactionReceipt(tokenMintSubmit.transactionId);
    const supply = tokenMintReceipt.totalSupply;

    console.log(`- Medal NFT minted. New total supply is ${supply}`);
    console.log(`- Transaction ID: ${tokenMintSubmit.transactionId}`);

    return [medalTokenId, supply, tokenMintSubmit.transactionId];
}

export default createAndMintMedal;
