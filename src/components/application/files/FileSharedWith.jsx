import { readJWT } from "@/hooks/useLighthouse";
import { PlusIcon } from "@heroicons/react/24/outline";
import lighthouse from "@lighthouse-web3/sdk";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

export default function FileSharedWith({ cid }) {

    const [publicShareKey, setPublicShareKey] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    const { address } = useAccount();
    const [refresh, setRefresh] = useState(false);

    const [accessControl, setAccessControl] = useState({
        conditions: [],
        conditionsSolana: [],
        sharedTo: [],
        owner: '0xae0c1e25dc9dbb782f67757a236e5335d7670407',
        cid: 'QmQ4RtiVh43E1QUKq2aNcSAzLv5WELxwdnncj3Mjp4PCUk'
    })


    useEffect(() => {


        const getAccessConditions = async () => {
            const response = await lighthouse.getAccessConditions(cid);
            setAccessControl(response.data);
        };

        getAccessConditions();
    }, [refresh])

    const signAuthMessage = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const publicKey = (await signer.getAddress()).toLowerCase();
        const messageRequested = (await lighthouse.getAuthMessage(publicKey)).data.message;
        const signedMessage = await signer.signMessage(
            messageRequested
        );
        return ({ publicKey: publicKey, signedMessage: signedMessage });
    }


    const sharePrivateFile = async () => {
        // Then get auth message and sign
        // Note: the owner of the file should sign the message.

        const jwt = await readJWT(address)
        console.log(cid);

        //neeed to collect public key o a user. 
        const publicKeyUserB = [publicShareKey];

        try {
            await lighthouse.shareFile(
                address,
                publicKeyUserB,
                cid,
                jwt
            );

            setRefresh(!refresh);
        } catch (e) {
            setErrorMessage(e)
        }

    }


    const applyAccessConditions = async (e) => {

        const conditions = [
            {
                id: 1,
                chain: "Mumbai",
                method: "hasAccess",
                standardContractType: "Custom",
                contractAddress: "0x780077307BE090E24Eb2Ed0d70393711Cc986540",
                returnValueTest: {
                    comparator: "==",
                    value: "true"
                },
                parameters: [":userAddress", 1],
                inputArrayType: ["address", "uint256"],
                outputType: "bool"
            }
        ];



        // Aggregator is what kind of operation to apply to access conditions
        // Suppose there are two conditions then you can apply ([1] and [2]), ([1] or [2]), !([1] and [2]).
        const aggregator = "([1])";
        const { publicKey, signedMessage } = await signAuthMessage();

        /*
          accessCondition(publicKey, cid, signedMessage, conditions, aggregator)
            Parameters:
              publicKey: owners public key
              CID: CID of the file to decrypt
              signedMessage: message signed by the owner of publicKey
              conditions: should be in a format like above
              aggregator: aggregator to apply conditions
        */
        const response = await lighthouse.applyAccessCondition(
            publicKey,
            cid,
            signedMessage,
            conditions,
            aggregator
        );

        console.log(response);
        /*
          {
            data: {
              cid: "QmZkEMF5y5Pq3n291fG45oyrmX8bwRh319MYvj7V4W4tNh",
              status: "Success"
            }
          }
        */
    }


    return (

        <div className="flex flex-col gap-4">
            <div>
                <h3 className="font-medium text-gray-900">Shared with</h3>
                <ul role="list" className="mt-2 divide-y divide-gray-200 border-b border-t border-gray-200">
                    {accessControl.sharedTo.map((person) => (
                        <li className="flex items-center justify-between py-3" key={person}>
                            <div className="flex items-center">
                                <img
                                    src="https://images.unsplash.com/photo-1502685104226-ee32379fefbe?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=3&w=1024&h=1024&q=80"
                                    alt=""
                                    className="h-8 w-8 rounded-full"
                                />
                                <p className="ml-4 text-sm font-medium text-gray-900 truncate">{person} </p>
                            </div>
                            <button
                                type="button"
                                className="ml-6 rounded-md bg-white text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                Remove <span className="sr-only truncate">{person}</span>
                            </button>
                        </li>
                    ))}

                </ul>

                <div className="flex items-center justify-between py-2">
                    <input type="text"
                        onChange={e => setPublicShareKey(e.target.value)}
                        className="border-1 border-gray-300 bg-white rounded-lg text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-200 focus:ring-opacity-50 px-3 py-2 w-full m-2"
                    />
                    <button
                        type="button"
                        className="group -ml-1 flex items-center rounded-md bg-white p-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        onClick={e => sharePrivateFile()}
                    >
                        <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-dashed border-gray-300 text-gray-400">
                            <PlusIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                    </button>
                </div>
            </div>

            {accessControl.conditions.length > 0 && (
                <div>
                    <h3 className="font-medium text-gray-900">Access Control</h3>
                    <ul role="list" className="mt-2 divide-y divide-gray-200 border-b border-t border-gray-200">
                        {false && accessControl.conditions.map((condition) => (
                            <li className="flex items-center justify-between py-3" key={condition.id}>
                                <div className="flex items-center">
                                    {condition.chain} {condition.method} {condition.value}
                                </div>
                            </li>
                        ))}
                    </ul>
                    <button onClick={e => applyAccessConditions()}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                    >Apply Access Conditions</button>
                </div>

            )}





        </div>

    )
}


