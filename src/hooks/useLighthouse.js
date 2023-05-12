import lighthouse from '@lighthouse-web3/sdk';
import { ethers } from 'ethers';
import { toast } from 'react-toastify';


export async function signAuthMessage  (){
  
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const address = await signer.getAddress();
   
    const messageRequested = (await lighthouse.getAuthMessage(address)).data.message;
    
    const signedMessage = await signer.signMessage(messageRequested);
    
    
    return({
      signedMessage: signedMessage,
      publicKey: address
    });
  }

  
export async function grantSmartAccess(cid, tokenID, minRows) {

    const conditions = [
      {
        id: 1,
        chain: "Optimism",
        method: "getBlockNumber",
        standardContractType: "",
        returnValueTest: {
          comparator: ">=",
          value: "13349",
        }
      }
    
    ]

    const aggregator = "([1])";
    
    const {signedMessage, publicKey} = await signAuthMessage()
    const response = await lighthouse.applyAccessCondition(
        publicKey,
        cid, 
        signedMessage,
        conditions, 
        aggregator 
    )
    
    console.log(response);
    toast.success("Access granted for tokenID", tokenID);
    
    return response;
}