// Decrypt file nodejs




export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    // Assuming we have a function uploadRecord to upload a record to a database
    const { list, accessToken } = req.body;


    if (!list || !Array.isArray(list)) {
        return res.status(400).json({ message: 'No records provided' });
    }

    const contract = process.env.DB_CONTRACT;

    //create accessControl of
    const conditions = [{
        id: 1,
        chain: "Mumbai",
        method: "hasAccess",
        standardContractType: "Custom",
        contractAddress: "0x780077307BE090E24Eb2Ed0d70393711Cc986540",
        returnValueTest: {
            comparator: "==",
            value: "true"
        },
        parameters: [":userAddress", args.tokenId],
        inputArrayType: ['address', 'uint256'],
        outputType: "bool"
    }]


    const aggregator = "([1])";

    await lighthouse.applyAccessCondition(
        args.creator,
        encryption.data.Hash,
        args.jwtToken,
        conditions,
        aggregator
    );


}

