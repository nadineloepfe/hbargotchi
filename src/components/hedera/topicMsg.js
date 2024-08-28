import { TopicMessageSubmitTransaction } from "@hashgraph/sdk";

async function topicMessageFcn(walletData, accountId) {
	console.log(`\n=======================================`);
	console.log(`- Creating topic Message`);

	const hashconnect = walletData[0];
	const saveData = walletData[1];
	const provider = hashconnect.getProvider("testnet", saveData.topic, accountId);
	const signer = hashconnect.getSigner(provider);

	//Create the transaction
	const topicMessageTx = await new TopicMessageSubmitTransaction()
		.setTopicId("0.0.14330")
		.setMessage("hello, HCS!")
		.freezeWithSigner(signer);

	const topicMessageSubmit = await topicMessageTx.executeWithSigner(signer);
	const topicMessageRx = await provider.getTransactionReceipt(topicMessageSubmit.transactionId);

	const topicMessage = topicMessageRx.getMessage();
	console.log(`- New Topic message: ${topicMessage}`);

	return [topicMessage];
}

export default topicMessageFcn;
