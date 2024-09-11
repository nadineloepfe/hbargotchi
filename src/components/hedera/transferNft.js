import { TransferTransaction } from "@hashgraph/sdk";

async function transferNonFungibleToken(walletData, accountId, toAccountId, tokenId, serialNumber) {
  console.log(`\n=======================================`);
  console.log(`- Sending Medal NFT...`);
  
  // Check if walletData is valid
  if (!walletData || walletData.length < 2) {
    console.error("Invalid wallet data");
    throw new Error("Invalid wallet data provided for the transfer");
  }

  const hashconnect = walletData[0];
  const saveData = walletData[1];
  const provider = hashconnect.getProvider("testnet", saveData.topic, accountId);
  const signer = hashconnect.getSigner(provider);

  const transferTokenTransaction = new TransferTransaction()
    .addNftTransfer(tokenId, serialNumber, accountId, toAccountId);

  await transferTokenTransaction.freezeWithSigner(signer);
  const txResult = await transferTokenTransaction.executeWithSigner(signer);
  return txResult ? txResult.transactionId : null;
}

export { transferNonFungibleToken };
