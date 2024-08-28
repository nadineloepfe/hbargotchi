import { TokenMintTransaction } from "@hashgraph/sdk";

async function treatTokenMintFcn(walletData, accountId, tId) {
	console.log(`\n=======================================`);
	const amount = 100;
	console.log(`- Minting ${amount} TREAT tokens...`);

	const hashconnect = walletData[0];
	const saveData = walletData[1];
	const provider = hashconnect.getProvider("testnet", saveData.topic, accountId);
	const signer = hashconnect.getSigner(provider);

	const tokenMintTx = await new TokenMintTransaction()
		.setTokenId(tId)
		.setAmount(amount)
		.freezeWithSigner(signer);
	const tokenMintSubmit = await tokenMintTx.executeWithSigner(signer);
	const tokenCreateRx = await provider.getTransactionReceipt(tokenMintSubmit.transactionId);
	const supply = tokenCreateRx.totalSupply;
	console.log(`- TREAT Tokens minted. New supply is ${supply}`);

	return [supply, tokenMintSubmit.transactionId];
}

export default treatTokenMintFcn;
