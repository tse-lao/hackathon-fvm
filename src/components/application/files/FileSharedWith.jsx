import { PlusIcon } from "@heroicons/react/24/outline";
import lighthouse from "@lighthouse-web3/sdk";
import { ethers } from "ethers";
import { useState } from "react";

export default function FileSharedWith({ cid }) {

    const [publicShareKey, setPublicShareKey] = useState("")

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
        const { publicKey, signedMessage } = await signAuthMessage();

        //neeed to collect public key o a user. 
        const publicKeyUserB = [publicShareKey];

        const res = await lighthouse.shareFile(
            publicKey,
            publicKeyUserB,
            cid,
            signedMessage
        );

        console.log(res)
    }
    return (
        <div>
            <h3 className="font-medium text-gray-900">Shared with</h3>
            <ul role="list" className="mt-2 divide-y divide-gray-200 border-b border-t border-gray-200">
                <li className="flex items-center justify-between py-3">
                    <div className="flex items-center">
                        <img
                            src="https://images.unsplash.com/photo-1502685104226-ee32379fefbe?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=3&w=1024&h=1024&q=80"
                            alt=""
                            className="h-8 w-8 rounded-full"
                        />
                        <p className="ml-4 text-sm font-medium text-gray-900">0xdb1B6961d1F9d1A17C02f23BD186b3bC4f3e7E2A</p>
                    </div>
                    <button
                        type="button"
                        className="ml-6 rounded-md bg-white text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Remove <span className="sr-only">0xdb1B6961d1F9d1A17C02f23BD186b3bC4f3e7E2A</span>
                    </button>
                </li>
                <li className="flex items-center justify-between py-3">
                    <div className="flex items-center">
                        <img
                            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixqx=oilqXxSqey&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                            alt=""
                            className="h-8 w-8 rounded-full"
                        />
                        <p className="ml-4 text-sm font-medium text-gray-900">0xdb1B6961d1F9d1A17C02f23BD186b3bC4f3e7E2A</p>
                    </div>
                    <button
                        type="button"
                        className="ml-6 rounded-md bg-white text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Remove <span className="sr-only"> 0xdb1B6961d1F9d1A17C02f23BD186b3bC4f3e7E2A</span>
                    </button>
                </li>
                <li className="flex items-center justify-between py-2">
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
                        <span className="ml-4 text-sm font-medium text-indigo-600 group-hover:text-indigo-500">
                            Share
                        </span>
                    </button>
                </li>
            </ul>
        </div>
    )
}


